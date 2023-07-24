import { Component, OnInit, Inject, ViewChild, EventEmitter, Output, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../shared/services/data.service';

//Services

//interface
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AppSettings } from 'src/app/shared/app.settings';
import { FormControl } from '@angular/forms';
import { TempHierarchyService } from '../services/temphierarchy.services';
import { IAssetHierarchy, IAssetHierarchyList, IAssetHierarchyParam } from '../interfaces/IAssetHierarchy';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AssignTaxonomyModalComponent } from '../modal/assigntaxonomymodal/assigntaxonomymodal.component';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { AssetHierarchyService } from '../services/assethierarchy.services';
import { AssignTaxonomyEditModalComponent } from '../modal/assigntaxonomyeditmodal/assigntaxonomyeditmodal.component';
import { ITaxonomyIdList } from '../interfaces/ITempHierarchy';
import { AssignHierarchyModalComponent } from '../modal/assignhierarchymodal/assignhierarchymodal.component';

interface RootObject {
  hierarchy: AssetHierarchy[];
}

interface AssetHierarchy {
  Code: string;
  Description: string;
  Children?: AssetHierarchy[];
}

@Component({
  selector: 'assigntaxonomy',
  templateUrl: './assigntaxonomy.component.html',
  styleUrls: ['./assigntaxonomy.component.scss']
})

export class AssignTaxonomyComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('TABLE', { static: true }) table: ElementRef;

  displayedColumns = ['code', 'description', 'industryName', 'businessType', 'assetType', 'processFunction', 'className', 'specification', 'componentFamilies', 'assetManufacturer', 'assign'];

  ELEMENT_DATA: IAssetHierarchyList[] = [];

  loading: boolean = false;
  default: boolean = false;
  loading2: boolean = false;
  isFloc: boolean = false;
  isFlocDesc: boolean = false;
  isPmDesc: boolean = false;
  isChecked: boolean = false;
  nodeCode: string = "";
  isAdd: boolean = false;

  disabledAssign: boolean = true;
  status: boolean = false;
  isLoading: boolean = false;

  public data: [];

  hierarchy: RootObject;
  assetHierarchyData: [] = [];
  taxonomyIdList: ITaxonomyIdList [] = [];

  dataSource2;

  treeControl = new NestedTreeControl<AssetHierarchy>(node => node.Children);
  dataSource = new MatTreeNestedDataSource<AssetHierarchy>();
  assetHierarchyParam: IAssetHierarchyParam;

  TREE_DATA: AssetHierarchy[] = [];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private http: HttpClient,
    public toastr: ToastrService,
    private _dataService: DataService,
    private _tempHierarchyService: TempHierarchyService,
    private _assetHierarchyService: AssetHierarchyService,
    private el: ElementRef,
    private changeDetectorRefs: ChangeDetectorRef) {
      this.dataSource.data = this.TREE_DATA;
  }

  hasChild = (_: number, node: AssetHierarchy) => !!node.Children && node.Children.length > 0;

  ngOnInit(): void {
    this.default = true;
    this.isLoading = true;

    var hierarchyData = localStorage.getItem("hierarchyData");

    if (hierarchyData !== null) {
      this.dataSource.data = JSON.parse(hierarchyData);
    } else {
      this.getDataSourceTree();
    }

    // this.getDataSource();
  }

  clickEvent() {
    this.status = !this.status;
    //this.statusLink = !this.statusLink;

  }

  clickShow() {
    this.status = true;
  }

  getDataSourceTree() {
    this.loading = true;
    this.loading2 = true;
    this._tempHierarchyService.getAssetHierarchy()
      .subscribe(res => {
        // console.log(res['hierarchy']);

        // this.TREE_DATA.push(res['hierarchy']);
        setTimeout(()=>{                           // <<<---using ()=> syntax
          this.dataSource.data = JSON.parse(res['hierarchy']);
          this.loading = false;
          this.loading2 = false;
          this.isLoading = false;
  
          // console.log(this.dataSource.data);
  
          localStorage.setItem("hierarchyData", JSON.stringify(this.dataSource.data));
  
      }, 6000);

       
      });
  }

  getDataSource(): void {
    this._tempHierarchyService.getHierarchyAssignTaxonomy()
      .subscribe(res => {
        // console.log(res);
        this.default = false;
        this.loading = false;
        this.ELEMENT_DATA = res;
        this.dataSource2 = new MatTableDataSource<IAssetHierarchyList>(this.ELEMENT_DATA);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  getAssetData(queryString: any) {
    this.loading2 = true;

    this._tempHierarchyService.getAssetHierarchyDataTable(queryString)
      .subscribe(res => {
        // console.log(res);
        this.default = false;
        this.ELEMENT_DATA = res;
        this.dataSource2 = new MatTableDataSource<IAssetHierarchyList>(this.ELEMENT_DATA);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.loading2 = false;
      });
  }

  getAssetDataByDesc(queryString: any) {
    this.loading2 = true;

    this._tempHierarchyService.getAssetHierarchyDescDataTable(queryString)
      .subscribe(res => {
        this.default = false;
        this.ELEMENT_DATA = res;
        this.dataSource2 = new MatTableDataSource<IAssetHierarchyList>(this.ELEMENT_DATA);
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

    console.log(node);
    this.nodeCode = node;

    this._tempHierarchyService.getAssetHierarchyDataTable(node)
      .subscribe(res => {
        // console.log(res);
        this.default = false;
        this.ELEMENT_DATA = res;
        this.dataSource2 = new MatTableDataSource<IAssetHierarchyList>(this.ELEMENT_DATA);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.loading2 = false;
        this.changeDetectorRefs.detectChanges();
      });
  }

  nodeDescClick(node: any) {
    this.getAssetDataByDesc(node);
  }

  addtoAssign(event:any, hierarchyId: number): void{

    if(event.target.checked === true){
      // console.log(event.target.checked);
      // console.log(hierarchyId);

      this.taxonomyIdList.push({
        id: hierarchyId
      });
    }else{
      this.taxonomyIdList.pop();
    }

    if(this.taxonomyIdList.length > 0)
    {
      this.disabledAssign = false;
    }else{
      this.disabledAssign = true;
    }

    // console.log(this.taxonomyIdList.length);
  }

  openDialogAssign() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    // dialogConfig.data = {taxonomyIdList };
    this._dataService.setData(this.taxonomyIdList)
    const dialogRef = this.dialog.open(AssignTaxonomyModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      this.nodeClick(this.nodeCode);
    });
  }

  openDialogHierarchy(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    // dialogConfig.data = {taxonomyIdList };
    this._dataService.setData(this.taxonomyIdList)
    const dialogRef = this.dialog.open(AssignHierarchyModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      this.nodeClick(this.nodeCode);
    });
  }

  openDialogAssignEdit(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    dialogConfig.data = {data };
    this._dataService.setData(data)
    const dialogRef = this.dialog.open(AssignTaxonomyEditModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      this.getDataSource();
    });
  }

}
