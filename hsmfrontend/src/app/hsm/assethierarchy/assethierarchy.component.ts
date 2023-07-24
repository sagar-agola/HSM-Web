import { Component, Inject, OnInit, ElementRef, ViewChild, Directive, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ResizeService } from '@syncfusion/ej2-angular-treegrid';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ResizeEvent } from 'angular-resizable-element';
import { CustomTableModalComponent } from '../modal/customtablemodal/customtablemodal.component';
import { MultiFilterModalComponent } from '../modal/multifiltermodal/multifiltermodal.component';
import { UploadModalComponent } from '../modal/uploadmodal/uploadmodal.component';
import { TempHierarchyService } from '../services/temphierarchy.services';
import { AssetHierarchyService } from '../services/assethierarchy.services';
import { IAssetHierarchy, IAssetHierarchyParam } from '../interfaces/IAssetHierarchy';
import { AssetHierarchyFilterModalComponent } from '../modal/modal/assethierarchyfiltermodal/assethierarchyfiltermodal.component';
import { DataService } from 'src/app/shared/services/data.service';
// import JSONFormatter from 'json-formatter-js';
import { Observable, merge } from 'rxjs';
import * as XLSX from 'xlsx';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

interface RootObject {
  hierarchy: AssetHierarchy[];
}

interface AssetHierarchy {
  Code: string;
  Description: string;
  Children?: AssetHierarchy[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: "asset-hierarchy",
  templateUrl: './assethierarchy.component.html',
  providers: [ResizeService],
  styleUrls: [
    './assethierarchy.component.scss'
  ],
  host: {
    '(document:click)': 'onClickDocument($event)',
  },
})

// @Directive({
//   selector: "[resizeColumn]"
// })

export class AssetHierarchyComponent implements OnInit {
  @ViewChild('tableColumn') public tableColumn: ElementRef;
  @ViewChild('multiFilter') public multiFilter: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('TABLE', { static: true }) table: ElementRef;

  // Whether column need resizing or not
  @Input("resizeColumn") resizable: boolean;

  displayedColumns = ['code', 'assetDescription', 'maintItemText', 'criticality', 'taskPackage'];
  displayedColumnsNames: string[] = ['Floc Name', 'Floc Description', 'PM Description', 'Criticality', 'Task GP Strategy'];

  public data: [];

  hierarchy: RootObject;
  ELEMENT_DATA: IAssetHierarchy[] = [];
  assetHierarchyData: [] = [];

  dataSource2;

  treeControl = new NestedTreeControl<AssetHierarchy>(node => node.Children);
  dataSource = new MatTreeNestedDataSource<AssetHierarchy>();
  assetHierarchyParam: IAssetHierarchyParam;

  TREE_DATA: AssetHierarchy[] = [];

  displayTableColumn: boolean = false;
  displayMultiFilter: boolean = false;
  loading: boolean = false;
  loading2: boolean = false;
  default: boolean = false;
  isFloc: boolean = false;
  isFlocDesc: boolean = false;
  isPmDesc: boolean = false;
  isChecked: boolean = false;
  nodeCode: string = "";

  flocName: boolean = true;
  flocDescription: boolean = true;
  pmDescription: boolean = true;
  criticality: boolean = true;
  taskGpStrategy: boolean = true;
  mainWorkCtr: boolean = false;
  equipment: boolean = false;
  plannerGroup: boolean = false;
  planningPlant: boolean = false;
  systemCondition: boolean = false;
  maintPlanText: boolean = false;
  strategy: boolean = false;
  systemStatus: boolean = false;
  isCheckExtreme: boolean = false;

  floc: string = "";
  flocDesc: string = "";
  pmDesc: string = "";

  extreme: string = "";
  veryHigh: string = "";
  high: string = "";
  medium: string = "";
  low: string = "";
  veryLow: string = "";
  undefinedStatus: string = "";
  crtStatus: string = "";
  crtInacStatus: string = "";
  crtdStatus: string = "";
  crtdInactStatus: string = "";
  blankStatus: boolean = false;
  status: boolean = false;

  isLoading: boolean = true;

  fileName = 'ExcelSheet.xlsx';

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;

  @Input() index: number;
  private startX: number;
  private startWidth: number;
  private column: HTMLElement;
  // private table: HTMLElement;
  private pressed: boolean;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private _tempHierarchyService: TempHierarchyService,
    private _assetHierarchyService: AssetHierarchyService,
    private dataService: DataService,
    private el: ElementRef,
  ) {
    this.column = this.el.nativeElement;
    this.dataSource.data = this.TREE_DATA;
  }

  hasChild = (_: number, node: AssetHierarchy) => !!node.Children && node.Children.length > 0;

  ngOnInit(): void {
    this.getDataSource();

    // this.getAssetData("8032.01.14.10");
    this.default = true;

    this.dropdownList = [
      { item_id: 1, item_text: 'Extreme' },
      { item_id: 2, item_text: 'Very High' },
      { item_id: 3, item_text: 'High' },
      { item_id: 4, item_text: 'Medium' },
      { item_id: 5, item_text: 'Low' },
      { item_id: 6, item_text: 'Very Low' },
      { item_id: 7, item_text: 'Undefined' }
    ];

    this.selectedItems = [];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 7,
      allowSearchFilter: false
    };
  }

  onItemSelect(item: any) {
    // console.log(item);
    if(item.item_id === 1){
      this.extreme = 'A';
      // console.log(this.extreme);
    }

    if(item.item_id === 2){
      this.veryHigh = 'B';
      // console.log(this.veryHigh);
    }

    if(item.item_id === 3){
      this.high = 'C';
      // console.log(this.high);
    }

    if(item.item_id === 4){
      this.medium = 'D';
      console.log(this.medium);
    }

    if(item.item_id === 5){
      this.low = 'E';
      // console.log(this.low);
    }

    if(item.item_id === 6){
      this.veryLow = 'F';
      // console.log(this.veryLow);
    }

    if(item.item_id === 7){
      this.undefinedStatus = 'G';
      // console.log(this.undefinedStatus);
    }
  }
  onSelectAll(items: any) {
    // console.log(items);
    this.extreme = 'A';
    this.veryHigh = 'B';
    this.high = 'C';
    this.medium = 'D';
    this.low = 'E';
    this.veryLow = 'F';
    this.undefinedStatus = 'G';
  }

  onItemDeSelect(items:any){
    // console.log(items);
    this.extreme = '';
    this.veryHigh = '';
    this.high = '';
    this.medium = '';
    this.low = '';
    this.veryLow = '';
    this.undefinedStatus = '';
  }

  clickEvent() {
    this.status = !this.status;
    //this.statusLink = !this.statusLink;

  }

  clickShow() {
    this.status = true;
  }

  clearDeepLevelNodes() {
    this.dataSource.data.forEach(e =>
       e.Children?.forEach(s => 
          s.Children?.forEach(th => 
            th.Children?.forEach(ft => ft.Children = [])
          )
        )
      );
  }

  getDataSource() {
    this.loading = true;
    this.loading2 = true;
    this._tempHierarchyService.getAssetHierarchy()
      .subscribe(res => {

        this.isLoading = false;

        this.dataSource.data = JSON.parse(res['hierarchy']);

        localStorage.setItem("hierarchyData", JSON.stringify(this.dataSource.data));
        this.clearDeepLevelNodes();
       
      });
  }

  getState(outlet) {
    return this.router.url;
  }

  getAssetData(queryString: any) {
    this.loading2 = true;

    this._assetHierarchyService.getAssetHierarchyDataTable(queryString)
      .subscribe(res => {
        // console.log(res);
        this.default = false;
        this.ELEMENT_DATA = res;
        this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.loading2 = false;
      });
  }

  getAssetDataByDesc(queryString: any) {
    this.loading2 = true;

    this._assetHierarchyService.getAssetHierarchyDescDataTable(queryString)
      .subscribe(res => {
        this.default = false;
        this.ELEMENT_DATA = res;
        this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.loading2 = false;
      });
  }

  nodeClick(node: any) {
    // this.nodeCode = "8032.20.06.20";
    // node = node.replace(/\-/g,'.');
    // var replacement = '-';
    // node = node.replace(/.([^.]*)$/, replacement + '$1')

    // console.log(node);
    this.isLoading = true;

    this._assetHierarchyService.getAssetHierarchyDataTable(node)
      .subscribe(res => {
        // console.log(res);
        this.default = false;
        this.ELEMENT_DATA = res;
        this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.loading2 = false;
        this.isLoading = false;
      });
  }

  nodeDescClick(node: any) {
    this.getAssetDataByDesc(node);
  }

  onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "700px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    const dialogRef = this.dialog.open(CustomTableModalComponent, dialogConfig);
  }

  // formatJSON(input: any[]) {
  //   if (input.length == 0) {
  //     return '';
  //   }
  //   else {
  //     var parsedData = JSON.parse(input[]);
  //     return JSON.stringify(parsedData);
  //   }
  // }

  openDialogFilter(data: IAssetHierarchyParam) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { item: data };
    dialogConfig.width = "860px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    this.dataService.setData(this.assetHierarchyParam)
    const dialogRef = this.dialog.open(AssetHierarchyFilterModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  clearFilter(): void {
    localStorage.removeItem("floc");
    localStorage.removeItem("flocDesc");
    localStorage.removeItem("pmDesc");

    this.isFloc = false;
    this.default = true;
    this.ELEMENT_DATA = [];
    this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
    this.dataSource2.paginator = this.paginator;
    this.dataSource2.sort = this.sort;
  }

  openDialogUpload() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "500px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    const dialogRef = this.dialog.open(UploadModalComponent, dialogConfig);
  }

  goToCriticality() {
    this.router.navigate(["/main/asset-criticality"]);
  }

  toggleColumn() {
    if (this.displayTableColumn)
      this.displayTableColumn = false;
    else
      this.displayTableColumn = true;
  }

  untoggleColumn() {
    this.displayTableColumn = false;
  }

  toggleFilter() {
    if (this.displayMultiFilter)
      this.displayMultiFilter = false;
    else
      this.displayMultiFilter = true;
  }

  untoggleFilter() {
    this.displayMultiFilter = false;
  }

  onClickDocument(event) {
    if (this.displayTableColumn) {
      if (!this.tableColumn.nativeElement.contains(event.target)) // or some similar check
        this.toggleColumn();
    }
  }

  addColumnFloc() {
    if (this.flocName === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(0, 0, "code");
        this.displayedColumns.push('code');
      }
    } else {
      this.removeColumn('code');
    }
  }

  addColumnFlocName() {
    if (this.flocDescription === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('assetDescription');
      }
    } else {
      this.removeColumn('assetDescription');
    }
  }

  addColumnPMDesc() {
    if (this.pmDescription === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('maintItemText');
      }
    } else {
      this.removeColumn('maintItemText');
    }
  }

  addColumnCriticality() {
    if (this.criticality === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('criticality');
      }
    } else {
      this.removeColumn('criticality');
    }
  }

  addColumnTaskPackage() {
    if (this.taskGpStrategy === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('taskPackage');
      }
    } else {
      this.removeColumn('taskPackage');
    }
  }

  addColumnMaintWork() {
    if (this.mainWorkCtr === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(5, 0, "mainWorkCtr");
        this.displayedColumns.push('mainWorkCtr');
        // localStorage.setItem("mainWorkCtr", this.mainWorkCtr)
      }
    } else {
      this.removeColumn('mainWorkCtr');
    }
  }

  addColumnEquipment() {
    if (this.equipment === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('equipment');
      }
    } else {
      this.removeColumn('equipment');
    }
  }

  addColumnPlannerGroup() {
    if (this.plannerGroup === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('plannerGroup');
      }
    } else {
      this.removeColumn('plannerGroup');
    }
  }

  addColumnPlanningPlant() {
    if (this.planningPlant === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('planningPlant');
      }
    } else {
      this.removeColumn('planningPlant');
    }
  }

  addColumnSystemCondition() {
    if (this.systemCondition === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('systemCondition');
      }
    } else {
      this.removeColumn('systemCondition');
    }
  }

  addColumnMaintPlanText() {
    if (this.maintPlanText === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('maintPlanText');
      }
    } else {
      this.removeColumn('maintPlanText');
    }
  }

  addColumnStrategy() {
    if (this.strategy === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('strategy');
      }
    } else {
      this.removeColumn('strategy');
    }
  }

  addColumnSystemStatus() {
    if (this.systemStatus === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('systemStatus');
      }
    } else {
      this.removeColumn("systemStatus");
    }
  }

  removeColumn(msg: string) {
    const index: number = this.displayedColumns.indexOf(msg);
    if (index !== -1) {
      this.displayedColumns.splice(index, 1);
    }
  }

  checkValue1(event: any) {
    console.log(event);
    this.extreme = event;
  }

  checkValue2(event: any) {
    this.veryHigh = event;
  }

  checkValue3(event: any) {
    this.high = event;
  }

  checkValue4(event: any) {
    this.medium = event;
  }

  checkValue5(event: any) {
    this.low = event;
  }

  checkValue6(event: any) {
    this.veryLow = event;
  }

  checkValue7(event: any) {
    this.undefinedStatus = event;
  }

  checkValue8(event: any) {
    // console.log(event);
    this.crtdStatus = event;
  }

  checkValue9(event: any) {
    // console.log(event);
    this.crtdInactStatus = event;
  }

  checkValue10(event: any){
    this.blankStatus = event.target.checked;
  }

  filter(): void {

    this.isLoading = true;

    if ((this.extreme !== '' || this.veryHigh !== '' || this.high !== '' || this.medium !== '' || this.low !== '' || this.veryLow !== '' || this.undefinedStatus !== '') && (this.crtdStatus !== '' && this.crtdInactStatus !== '' && this.blankStatus !== false)) {
      this._assetHierarchyService.getAssetHierarchyMultiFilterIndic(this.floc, this.flocDesc, this.pmDesc, this.extreme, this.veryHigh, this.high, this.medium, this.low, this.veryLow, this.undefinedStatus, this.crtdStatus, this.crtdInactStatus)
        .subscribe(res => {
          this.default = false;
          this.ELEMENT_DATA = res;
          this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
          this.loading2 = false;
          this.isLoading = false;
        });
      console.log(1);
    }

    if ((this.extreme !== '' || this.veryHigh !== '' || this.high !== '' || this.medium !== '' || this.low !== '' || this.veryLow !== '' || this.undefinedStatus !== '') && (this.crtdStatus === '' && this.crtdInactStatus === '' && this.blankStatus === false)) {
      this._assetHierarchyService.getAssetHierarchyMultiFilterIndicUndefined(this.floc, this.flocDesc, this.pmDesc, this.extreme, this.veryHigh, this.high, this.medium, this.low, this.veryLow, this.undefinedStatus)
        .subscribe(res => {
          this.default = false;
          this.ELEMENT_DATA = res;
          this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
          this.loading2 = false;
          this.isLoading = false;
        });
      console.log(2);
    }

    if((this.extreme === '' || this.veryHigh === '' || this.high === '' || this.medium === '' || this.low === '' || this.veryLow === '' || this.undefinedStatus === '') && (this.crtdStatus === '' && this.crtdInactStatus === '') && this.blankStatus === true){
      this._assetHierarchyService.GetAssetHierarchyBlankStatus(this.floc, this.flocDesc, this.pmDesc,  this.crtdStatus, this.crtdInactStatus)
        .subscribe(res => {
          this.default = false;
          this.ELEMENT_DATA = res;
          this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
          this.loading2 = false;
          this.isLoading = false;
        });
      console.log(3);
    }

    if((this.extreme !== '' || this.veryHigh !== '' || this.high !== '' || this.medium !== '' || this.low !== '' || this.veryLow !== '' || this.undefinedStatus !== '') && (this.crtdStatus  !== '' || this.crtdInactStatus !== '') && this.blankStatus === false)
    {
      this._assetHierarchyService.getAssetHierarchyMultifilterIndicStatus(this.floc, this.flocDesc, this.pmDesc, this.extreme, this.veryHigh, this.high, this.medium, this.low, this.veryLow, this.undefinedStatus, this.crtdStatus, this.crtdInactStatus)
        .subscribe(res => {
          this.default = false;
          this.ELEMENT_DATA = res;
          this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
          this.loading2 = false;
          this.isLoading = false;
        });
      console.log(4);
    }

    if((this.extreme !== '' || this.veryHigh !== '' || this.high !== '' || this.medium !== '' || this.low !== '' || this.veryLow !== '' || this.undefinedStatus !== '') && (this.crtdStatus  ! == '' || this.crtdInactStatus !== '') && this.blankStatus === true)
    {
      this._assetHierarchyService.getAssetHierarchyMultiFilterIndic(this.floc, this.flocDesc, this.pmDesc, this.extreme, this.veryHigh, this.high, this.medium, this.low, this.veryLow, this.undefinedStatus, this.crtdStatus, this.crtdInactStatus)
        .subscribe(res => {
          this.default = false;
          this.ELEMENT_DATA = res;
          this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
          this.loading2 = false;
          this.isLoading = false;
        });
      console.log(5);
    }
    
    if((this.extreme === '' && this.veryHigh === '' && this.high === '' && this.medium === '' && this.low === '' && this.veryLow === '' && this.undefinedStatus === '') && (this.crtdStatus !== '' || this.crtdInactStatus !== '') && (this.blankStatus !== true)){
      this._assetHierarchyService.GetAssetHierarchySystemStatus(this.floc, this.flocDesc, this.pmDesc, this.crtdStatus, this.crtdInactStatus)
          .subscribe(res => {
            this.default = false;
            this.ELEMENT_DATA = res;
            this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
            this.dataSource2.paginator = this.paginator;
            this.dataSource2.sort = this.sort;
            this.loading2 = false;
            this.isLoading = false;
          });
      console.log(6);
    }

    if((this.extreme === '' && this.veryHigh === '' && this.high === '' && this.medium === '' && this.low === '' && this.veryLow === '' && this.undefinedStatus === '') && (this.crtdStatus !== '' || this.crtdInactStatus !== '') && (this.blankStatus === true)){
      this._assetHierarchyService.GetAssetHierarchyBlankStatus(this.floc, this.flocDesc, this.pmDesc, this.crtdStatus, this.crtdInactStatus)
          .subscribe(res => {
            this.default = false;
            this.ELEMENT_DATA = res;
            this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
            this.dataSource2.paginator = this.paginator;
            this.dataSource2.sort = this.sort;
            this.loading2 = false;
            this.isLoading = false;
          });
      console.log(7);
    }

    if((this.extreme === '' && this.veryHigh === '' && this.high === '' && this.medium === '' && this.low === '' && this.veryLow === '' && this.undefinedStatus === '') && (this.crtdStatus === '' && this.crtdInactStatus === '') && (this.blankStatus === false)){
      this._assetHierarchyService.getAssetHierarchyMultiFilter(this.floc, this.flocDesc, this.pmDesc)
      .subscribe(res => {
        this.default = false;
        this.ELEMENT_DATA = res;
        this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.loading2 = false;
        this.isLoading = false;
      });
      console.log(8);
    }
    //else{
    //   this._assetHierarchyService.getAssetHierarchyMultiFilter(this.floc, this.flocDesc, this.pmDesc)
    //   .subscribe(res => {
    //     this.default = false;
    //     this.ELEMENT_DATA = res;
    //     this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
    //     this.dataSource2.paginator = this.paginator;
    //     this.dataSource2.sort = this.sort;
    //     this.loading2 = false;
    //   });
    // }

    // if ((this.extreme !== '' || this.veryHigh !== '' || this.high !== '' || this.medium !== '' || this.low !== '' || this.veryLow !== '') && (this.crtdStatus !== '' || this.crtdInactStatus !== '')) {
    //   this._assetHierarchyService.getAssetHierarchyIndicSystemStatus(this.floc, this.flocDesc, this.pmDesc, this.extreme, this.veryHigh, this.high, this.medium, this.low, this.veryLow, this.crtdStatus, this.crtdInactStatus)
    //     .subscribe(res => {
    //       this.default = false;
    //       this.ELEMENT_DATA = res;
    //       this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //       this.loading2 = false;
    //     });
    // }

    // if(this.crtdStatus !== '' || this.crtdInactStatus !== ''){
    //   this._assetHierarchyService.GetAssetHierarchySystemStatus(this.floc, this.flocDesc, this.pmDesc, this.crtdStatus, this.crtdInactStatus)
    //     .subscribe(res => {
    //       this.default = false;
    //       this.ELEMENT_DATA = res;
    //       this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //       this.loading2 = false;
    //     });
    // }

    // if(this.crtdStatus === '' && this.crtdInactStatus === '' && this.undefinedStatus === '' && this.extreme === '' && this.veryHigh === '' && this.high === '' && this.medium === '' && this.low === '' && this.veryLow === ''){
    //   this._assetHierarchyService.getAssetHierarchyMultiFilter(this.floc, this.flocDesc, this.pmDesc)
    //   .subscribe(res => {
    //     this.default = false;
    //     this.ELEMENT_DATA = res;
    //     this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
    //     this.dataSource2.paginator = this.paginator;
    //     this.dataSource2.sort = this.sort;
    //     this.loading2 = false;
    //   });
    // }

    // if (this.undefinedStatus !== '') {
    //   this._assetHierarchyService.getAssetHierarchyMultiFilterIndicUndefined(this.floc, this.flocDesc, this.pmDesc, this.extreme, this.veryHigh, this.high, this.medium, this.low, this.veryLow, this.undefinedStatus)
    //     .subscribe(res => {
    //       this.default = false;
    //       this.ELEMENT_DATA = res;
    //       this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //       this.loading2 = false;
    //     });
    // }
    // }else{
    //   this._assetHierarchyService.getAssetHierarchyMultiFilter(this.floc, this.flocDesc, this.pmDesc)
    //   .subscribe(res => {
    //     this.default = false;
    //     this.ELEMENT_DATA = res;
    //     this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
    //     this.dataSource2.paginator = this.paginator;
    //     this.dataSource2.sort = this.sort;
    //     this.loading2 = false;
    //   });
    // }
    // else {
    //   this._assetHierarchyService.getAssetHierarchyMultiFilter(this.floc, this.flocDesc, this.pmDesc)
    //     .subscribe(res => {
    //       this.default = false;
    //       this.ELEMENT_DATA = res;
    //       this.dataSource2 = new MatTableDataSource<IAssetHierarchy>(this.ELEMENT_DATA);
    //       this.dataSource2.paginator = this.paginator;
    //       this.dataSource2.sort = this.sort;
    //       this.loading2 = false;
    //     });
    // }
    this.untoggleFilter();

    if (this.floc !== '') {
      this.isFloc = true;
    } else if (this.flocDesc !== '') {
      this.isFlocDesc = true;
    }
    else if (this.pmDesc !== '') {
      this.isPmDesc = true;
    } else {
      this.isFloc = false;
      this.isFlocDesc = false;
      this.isPmDesc = false;
    }
  }

  exportExcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}



