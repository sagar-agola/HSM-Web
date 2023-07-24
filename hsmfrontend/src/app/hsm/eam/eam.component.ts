import { Component, Inject, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { CustomTableModalComponent } from '../modal/customtablemodal/customtablemodal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MultiFilterModalComponent } from '../modal/multifiltermodal/multifiltermodal.component';

//Services
import { FrequencyService } from '../services/frequency.services';
import { OperationalModeService } from '../services/operationalmode.services';
import { TradeTypeService } from '../services/tradetype.services';
import { EAMPlanService } from '../services/eamplan.services';

//interface
import { IFrequency } from './../interfaces/IFrequency';
import { IOperationalMode} from './../interfaces/IOperationalMode';
import { ITradeType} from './../interfaces/ITradeType';
import { IAllEAMPLanList, IEAMDropdownList, IEAMPlan, IEAMPLanList, IFLOCEAMPLanList, IEAMPlanAttachURL } from '../interfaces/IEAMPlan';
import { forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import { UploadModalComponent } from '../modal/uploadmodal/uploadmodal.component';
import { UploadModalDetailsComponent } from '../modal/uploadmodaldetails/uploadmodaldetails.component';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';

@Component({
    selector: "eam-maintenance",
    templateUrl: './eam.component.html',
    styleUrls: [
        './eam.component.scss'
    ],
    host: {
      '(document:click)': 'onClickDocument($event)',
    },
})

export class EAMComponent implements OnInit {
  myControl = new FormControl();
  @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('tableColumn') public tableColumn: ElementRef;
  @ViewChild('multiFilter') public multiFilter: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('TABLE', {static: true}) table: ElementRef;

  displayedColumns = ['taskPackage', 'code', 'flocDesc', 'maintItemText', 'maintItem', 'maintenancePlanName', 'taskId', 'mainWorkCtr', 'planningPlant', 'attachUrl', 'systemStatus'];

  ELEMENT_DATA: IAllEAMPLanList[] = [];
  eamPlanAttachObject: IEAMPlanAttachURL;
  
  dataSource;

  functionList: any[] = [];
  descriptionList: any[] = [];
  plantList: any[] = [];

  frequencyObject: IFrequency;
  operationModeObject: IOperationalMode;
  tradeTypeObject: ITradeType;
  eamObject: IEAMPlan;
  eamPlanListObject: IAllEAMPLanList;

  displayTableColumn: boolean = false;
  displayMultiFilter: boolean = false;
  isSelectFloc: boolean = false;
  isSelectDesc: boolean = false;

  loading: boolean = false;
  default: boolean = false;
  isLoading: boolean = true;

  flocName: string = "";
  description2: string = "";
  plant: string = "";
  totalCount: number;
  eamId: number;

  floc: string = "";
  flocDesc: string = "";
  plantName: string = "";
  planningPlants: string = "";
  maintItemDesc: string = ""
  maintPlanDescription: string = "";
  tasklistStrategy: string = "";
  workCenterFilter: string = "";
  plannerGp: string = "";
  crtd: boolean = false;
  crtdInac: boolean = false;
  blankStatus: boolean = false;
  systemStatusCRTD: string = "";
  systemStatusCRTDINAC: string = "";
  systemStatusBlank: string = "";

  fileName = 'EAMPlan.xlsx';

  eamObjectList: IEAMDropdownList;

  tgsAttached: boolean = true;
  fLOC: boolean = true;
  flocDescription: boolean = true;
  pmDescription: boolean = true;
  maintItem: boolean = true;
  maintPlan: boolean = true;
  maintTask: boolean = true;
  mainWorkCtr: boolean = true;
  planningPlant: boolean = true;
  maintPlanDesc: boolean = false;
  maintPlanStrategy: boolean = false;
  systemStatus: boolean = true;
  schedPeriod: boolean = false;
  schedIntUnit: boolean = false;
  taskList: boolean = false;
  taskListDesc: boolean = false;
  strategy: boolean = false;
  plannergroup: boolean = false;
  plantCol: boolean = false;
  workCenter: boolean = false;
  assembly: boolean = false;
  deletionFlag: boolean = false;
  groupCounter: boolean = false;

  constructor(
    private router: Router,
    private _eref: ElementRef,
    public dialog: MatDialog,
    private _frequenceService: FrequencyService,
    private _operationModeService: OperationalModeService,
    private _tradeTypeService: TradeTypeService,
    private _eamPlanService: EAMPlanService,
    private _dataService: DataService,
    public toastr: ToastrService,
    private userPermissionService: PermissionManagerService,
    ) { }

    canAccess(roleKey: string): boolean {
      let access: boolean = false;
      access = this.userPermissionService.isGranted(roleKey);
      return access;
    }
    
    ngOnInit(): void {
      forkJoin(
        this._eamPlanService.getEAMDropdown(),
        this._eamPlanService.getTotalEAMPlanList()
        ).subscribe(([fl, tt]) => {
          this.functionList = fl;
          this.descriptionList = fl;
          this.plantList = fl;
          this.totalCount = tt[0]['totalCount'];
          this.isLoading = false;
        });

        // this.getDataSource(0);
        this.getDataSourceEAM();

        this.default = true;
    }

    getDataSource(id: number): void{
      this._eamPlanService.getFLOCEAMPlanList()
        .subscribe(res => {
          this.default = false;
          this.loading = false;
          this.ELEMENT_DATA = res;
          this.dataSource = new MatTableDataSource<IAllEAMPLanList>(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
    }
    getDataSourceEAM(): void{
      this._eamPlanService.getAllEAMPlanList()
        .subscribe(res => {
          this.default = false;
          this.loading = false;
          this.ELEMENT_DATA = res;
          this.dataSource = new MatTableDataSource<IAllEAMPLanList>(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        });
    }

    eamOnSelectMapper(object: IAllEAMPLanList): void {
      let eamPlanObject = this.functionList.find(data => data.id == object.id);

      this.eamId = eamPlanObject.id;
    }

    eamDescOnSelectMapper(object: IAllEAMPLanList): void {
      let eamPlanObject = this.descriptionList.find(data => data.id == object.id);

      this.eamId = eamPlanObject.id;
    }

    eamPlantOnSelectMapper(object: IAllEAMPLanList): void {
      let eamPlanObject = this.plantList.find(data => data.id == object.id);

      this.eamId = eamPlanObject.id;
    }

    clearFlocData(): void{
        this.functionList = [];
    }

    openDialog() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "700px";
      dialogConfig.height = "auto";
      dialogConfig.position = { top: '30px' };
      const dialogRef = this.dialog.open(CustomTableModalComponent, dialogConfig);
  }
  
  openDialogFilter(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "700px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    const dialogRef = this.dialog.open(MultiFilterModalComponent, dialogConfig);
  }


  // onKeydown(event) {
  //   this.filterDesc(this.flocDesc);
  // }

  // onFlocKeyDown(event){
  //   this.filterFloc(this.floc);
  // }

  // onPlantKeyDown(event){
  //   this.filterPlant(this.plantName);
  // }

  toggleFilter() {
    if (this.displayMultiFilter)
      this.displayMultiFilter = false;
    else
      this.displayMultiFilter = true;
  }

  untoggleFilter() {
    this.displayMultiFilter = false;
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

  onClickDocument(event) {
    if (this.displayTableColumn) {
      if (!this.tableColumn.nativeElement.contains(event.target)) // or some similar check
        this.toggleColumn();
    }

    // if (this.displayMultiFilter) {
    //   if (!this.multiFilter.nativeElement.contains(event.target)) // or some similar check
    //     this.toggleFilter();
    // }
  }

  crtdCheck(event: any){
    // console.log(event.checked);
    if(event.target.checked === true){
      this.systemStatusCRTD = 'CRTD';
      console.log(this.systemStatusCRTD);
    }else{
      this.systemStatusCRTD = '';
    }
  }

  crtdInacCheck(event){
    // console.log(event.checked);
    if(event.target.checked === true){
      this.systemStatusCRTDINAC = 'CRTD INAC';
      console.log(this.systemStatusCRTDINAC);
    }else{
      this.systemStatusCRTDINAC = '';
    }
  }

  blankCheck(event){
    // console.log(event.checked);
    if(event.target.checked === true){
      this.systemStatusBlank = 'blank';
      console.log(this.systemStatusBlank);
    }
  }

  filter(): void{
    if(this.floc !== '' || this.flocDesc !== '' || this.plant !== '' || this.planningPlants !== '' || this.maintItemDesc !== '' || this.maintPlanDescription !== '' || this.tasklistStrategy !== '' || this.plannerGp !== '' || this.workCenterFilter !== ''){
      this._eamPlanService.getEAMPlanLookUp(this.floc, this.flocDesc, this.plant, this.planningPlants, this.maintItemDesc, this.maintPlanDescription, this.tasklistStrategy, this.plannerGp, this.workCenterFilter)
        .subscribe(out => {
          // console.log(out);
          this.default = false;
          this.loading = false;
          this.ELEMENT_DATA = out;
          this.dataSource = new MatTableDataSource<IAllEAMPLanList>(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // this.flocName = this.floc;
          if(this.description2 === ''){
            this.isSelectFloc = false;
          }
          else if(this.description2 !== '' && this.flocName !== ''){
            this.isSelectFloc = true;
          }

          if(this.description2 !== '' && this.flocName !== ''){
            this.isSelectFloc = true;
          }
          else if(this.description2 !== '' && this.plant !== ''){
            this.isSelectDesc = true;
          }

          if(this.plant === ''){
            this.isSelectDesc = false;
          }
          else if(this.description2 !== '' && this.plant !== ''){
            this.isSelectDesc = true;
          }
      });
    }
    
    if(this.systemStatusCRTD !== '' || this.systemStatusCRTDINAC !== ''){
      this._eamPlanService.getEAMPlanWithStatus(this.floc, this.flocDesc, this.plant, this.planningPlants, this.maintItemDesc, this.maintPlanDescription, this.tasklistStrategy, this.plannerGp, this.workCenterFilter, this.systemStatusCRTD, this.systemStatusCRTDINAC)
        .subscribe(out => {
          // console.log(out);
          this.default = false;
          this.loading = false;
          this.ELEMENT_DATA = out;
          this.dataSource = new MatTableDataSource<IAllEAMPLanList>(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    }
    else{
      this._eamPlanService.getEAMPlanBlankStatus(this.floc, this.flocDesc, this.plant, this.planningPlants, this.maintItemDesc, this.maintPlanDescription, this.tasklistStrategy, this.plannerGp, this.workCenterFilter)
      .subscribe(out => {
        // console.log(out);
        this.default = false;
        this.loading = false;
        this.ELEMENT_DATA = out;
        this.dataSource = new MatTableDataSource<IAllEAMPLanList>(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }

    this.untoggleFilter();

  }

  addColumnTgs() {
    if (this.tgsAttached === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.splice(0, 0, "taskPackage");
        // this.displayedColumns.push('taskPackage');
      }
    } else {
      this.removeColumn('taskPackage');
    }
  }

  addColumnCode() {
    if (this.fLOC === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('code');
      }
    } else {
      this.removeColumn('code');
    }
  }

  addColumnFlocDesc() {
    if (this.flocDescription === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('flocDesc');
      }
    } else {
      this.removeColumn('flocDesc');
    }
  }

  addColumnPMDesc() {
    if (this.pmDescription === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('maintItemText');
      }
    } else {
      this.removeColumn('maintItemText');
    }
  }

  addColumnMaintItem() {
    if (this.maintItem === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('maintItem');
      }
    } else {
      this.removeColumn('maintItem');
    }
  }

  addColumnMaintPlanName() {
    if (this.maintPlan === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('maintenancePlanName');
      }
    } else {
      this.removeColumn('maintenancePlanName');
    }
  }

  addColumntaskId() {
    if (this.maintTask === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('taskId');
      }
    } else {
      this.removeColumn('taskId');
    }
  }

  addColumnMainWorkCtr() {
    if (this.mainWorkCtr === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('mainWorkCtr');
      }
    } else {
      this.removeColumn('mainWorkCtr');
    }
  }

  addColumnPlanningPlant() {
    if (this.planningPlant === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('planningPlant');
      }
    } else {
      this.removeColumn('planningPlant');
    }
  }

  addColumnMaintPlanDesc() {
    if (this.maintPlanDesc === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('maintPlanText');
      }
    } else {
      this.removeColumn('maintPlanText');
    }
  }

  addColumnMaintPlanStrategy() {
    if (this.maintPlanStrategy === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('maintPlanStrategy');
      }
    } else {
      this.removeColumn('maintPlanStrategy');
    }
  }

  addColumnSystemStatus() {
    if (this.systemStatus === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('systemStatus');
      }
    } else {
      this.removeColumn('systemStatus');
    }
  }

  addColumnSchedPeriod() {
    if (this.schedPeriod === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('schedPeriod');
      }
    } else {
      this.removeColumn('schedPeriod');
    }
  }

  addColumnSchedIntUnit() {
    if (this.schedIntUnit === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('schedIntUnit');
      }
    } else {
      this.removeColumn('schedIntUnit');
    }
  }

  addColumnTaskListDesc() {
    if (this.taskListDesc === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('taskListDescription');
      }
    } else {
      this.removeColumn('taskListDescription');
    }
  }

  addColumnMaintenanceStrategy() {
    if (this.strategy === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('maintenanceStrategy');
      }
    } else {
      this.removeColumn('maintenanceStrategy');
    }
  }

  addColumnPlannerGroup() {
    if (this.plannergroup === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('plannerGroup');
      }
    } else {
      this.removeColumn('plannerGroup');
    }
  }

  addColumnPlant() {
    if (this.plantCol === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('plant');
      }
    } else {
      this.removeColumn('plant');
    }
  }

  addColumnWorkCenter() {
    if (this.workCenter === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('workCenter');
      }
    } else {
      this.removeColumn('workCenter');
    }
  }

  addColumnAssembly() {
    if (this.assembly === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('assemblyNo');
      }
    } else {
      this.removeColumn('assemblyNo');
    }
  }

  addColumnDeletionFlag() {
    if (this.deletionFlag === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('deletionFlag');
      }
    } else {
      this.removeColumn('deletionFlag');
    }
  }

  removeColumn(msg: string) {
    const index: number = this.displayedColumns.indexOf(msg);
    if (index !== -1) {
      this.displayedColumns.splice(index, 1);
    }
  }

  goToEAMDetails(id: number): void{
    this.router.navigate(["/main/eam-maintenance-details", id]);
  }

  routeCreate(): void{
    if(this.canAccess('AssignTGStoEAM')) {
      this.router.navigate(["/main/assign-asset-strategygroup"]);
    }else {
      this.toastr.warning('You do not have permission to perform this action.', '');
    }
  }

  exportExcel(): void {
    if(this.canAccess('ExportEAM')) {
      /* table id is passed over here */
      let element = document.getElementById('excel-table');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, this.fileName);
    }else {
      this.toastr.warning('You do not have permission to perform this action.', '');
    }
  }

  openDialogUpload(data: any) {
    if(this.canAccess('AttachWorkInstruction')) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "600px";
      dialogConfig.height = "auto";
      dialogConfig.position = { top: '30px' };
      dialogConfig.data = {data };
      this._dataService.setData(data)
      const dialogRef = this.dialog.open(UploadModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(res => {
        this.ngOnInit();
      });
    }else {
      this.toastr.warning('You do not have permission to perform this action.', '');
    }
  }

  openDialogUploadDetails(data: any) {
    if(this.canAccess('AttachWorkInstruction')) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "600px";
      dialogConfig.height = "auto";
      dialogConfig.position = { top: '30px' };
      dialogConfig.data = {data };
      // console.log(data);
      this._dataService.setData(data)
      const dialogRef = this.dialog.open(UploadModalDetailsComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(res => {
        this.ngOnInit();
      });
    }else {
      this.toastr.warning('You do not have permission to perform this action.', '');
    }
  }
}



