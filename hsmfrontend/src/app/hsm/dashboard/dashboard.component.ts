import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { multi, single } from './../../shared/data/data';
import { IAllFMEAList, IFMEA } from '../interfaces/IFMEA';
import { IAssetTaskGroupStrategyHsm, IAssetTaskGroupStrategyHsmDisplay } from '../interfaces/IAssetTaskGroupStrategy';
import { AssetTaskGroupStrategyHsmService } from '../services/assettaskgroupstrategyhsm.services';
import { FMEAService } from '../services/fmea.services';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewCommentModal } from '../modal/viewcommentmodal/viewcommentmodal.component';
import { DataService } from 'src/app/shared/services/data.service';
import { ActionManagementService } from '../services/actionmanagement.services';
import { IActionManagement } from '../interfaces/IActionManagement';
import { UsersService } from '../services/users.services';
import { RequestModal } from '../modal/requestmodal/requestmodal.component';
import { fmeaDefault } from 'src/app/shared/helpers/default.helpers';
import { IAssignGroupToUser } from '../interfaces/IAssignGroupToUser';
import { AssignGroupToUserService } from '../services/assigngrouptouser.services';
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';
import { ToastrService } from 'ngx-toastr';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];

@Component({
    selector: "dashboard",
    templateUrl: './dashboard.component.html',
    styleUrls: [
        './dashboard.component.scss'
    ]
})

export class DashboardComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['taskIdentificationNo', 'failureMode', 'taskDescription', 'failureRiskTotalScore', 'acceptableLimits', 'correctiveActions', 'systemStatus'];

    displayedColumns2 = ['taskGroupStrategyId', 'taskGroupDescription', 'taskTypeName', 'frequencyName', 'tradeTypeName', 'operationalModeName', 'systemStatus'];
    @ViewChild('tableOnePaginator', {static: false}) tableOnePaginator: MatPaginator;
    @ViewChild('tableOneSort', {static: false}) tableOneSort: MatSort;

    displayedColumns3 = ['requestCode', 'requestTypeId', 'requestInfo', 'dueDate', 'assigned', 'requested', 'actionStatus'];
    @ViewChild('tableTwoPaginator', {static: false}) tableTwoPaginator: MatPaginator;
    @ViewChild('tableTwoSort', {static: false}) tableTwoSort: MatSort;

    active = 1;
    activeId: number;
    single: any[];
    multi: any[];

    view: any[] = [500, 300];
    view2: any[] = [300, 200];
    view3: any[] = [500, 300];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Year';

  // options
  gradient2: boolean = true;
  showLegend2: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  // options
  legend: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;

  loading: boolean = false;
  default: boolean = false;

  userId: number;
  assignedName: string = "";
  statusId: number;
  tgsStatusId: number;
  actionStatusId: number;

  dataSource;
  dataSource2;
  dataSource3;
  ELEMENT_DATA: IAllFMEAList[] = [];
  ELEMENT_DATA_2: IAssetTaskGroupStrategyHsmDisplay[] = [];
  ELEMENT_DATA_3: IActionManagement[] = [];
  statusList: any = [
    {
        "name": "Created",
        "id": 1
    },
    {
        "name": "Review",
        "id": 2
    },
    {
        "name": "Approved",
        "id": 3
    },
    {
        "name": "Rejected",
        "id": 4
    }
  ];

  colorScheme2 = {
    domain: ['#0b56a8', '#009dbf', '#888888', '#AAAAAA']
  };

  colorScheme = {
    domain: ['#0b56a8', '#009dbf', '#C7B42C', '#AAAAAA']
  };

  colorScheme3 = {
    domain: ['#0b56a8', '#009dbf', '#888888', '#0097e6', '#34495e', '#3498db']
  };

  actionStatusList: any = [
    {
        "name": "Open",
        "id": 1
    },
    {
        "name": "Completed",
        "id": 2
    },
  ];

  requestType: any = [
    {
        "name": "Master Data Request",
        "value": 1
    },
    {
      "name": "Other Request",
      "value": 2
    },
  ];

  assetTaskGroupStrategyObject: IAssetTaskGroupStrategyHsm = {
    id: 0,
    taskGroupStrategyId: '',
    taskGroupDescription: '',
    frequencyId: 0,
    tradeTypeId: 0,
    operationalModeId: 0,
    durationId: 0,
    taskTypeId: 0,
    assetIndustryId: 0,
    businessTypeId: 0,
    assetTypeId: 0,
    processFunctionId: 0,
    assetCategoryId: 0,
    assetClassTaxonomyId: 0,
    assetSpecTaxonomyId: 0,
    assetFamilyTaxonomyId: 0,
    assetManufacturerTaxonomyId: 0,
    componentClassTaxonomyId: 0,
    componentFamilyTaxonomyId: 0,
    componentSubClassTaxonomyId: 0,
    componentBuildSpecTaxonomyId: 0,
    componentManufacturerId: 0,
    assetHierarchyId: 0,
    comment: '',
    createdBy: '',
    updatedBy: '',
    dtCreated: undefined,
    dtUpdated: undefined,
    systemStatus: 0
  };

  assignToUserObject: IAssignGroupToUser = {
    id: 0,
    transactionId: 0,
    transactionTypeId: 0,
    userPermissionGroupId: 0,
    userId: 0,
    status: 0,
    isActive: true
  };

  actionManagementObject: IActionManagement = {
    id: 0,
    requestCode: '',
    requestTypeId: 0,
    requestInfo: '',
    dueDate: undefined,
    fileName: '',
    assigned: 0,
    requested: 0,
    dtCreated: undefined,
    actionStatus: 0
  };

  fmeaObject: IFMEA = fmeaDefault();

  isLoading: boolean = true;

  userList: any [] = [];

    constructor(
      public dialog: MatDialog,
      private _assetTaskGroupStrategyHsmService: AssetTaskGroupStrategyHsmService,
      private _dataService: DataService,
      private _fmeaService: FMEAService,
      private _userService: UsersService,
      private toastr: ToastrService,
      private _actionManagementService: ActionManagementService,
      private _assignToUserService: AssignGroupToUserService,
      private userPermissionService: PermissionManagerService,
    ) {
      // Object.assign(this, { single })
      Object.assign(this, { multi, single });
    }

    canAccess(roleKey: string): boolean {
      let access: boolean = false;
      access = this.userPermissionService.isGranted(roleKey);
      return access;
  }
    
    ngOnInit(): void {
        var userId = +localStorage.getItem("loggUserId");
        this.userId = userId;

        this.getDataSourceTgsReview(this.userId);
        this.getDataSourceFmeaReview(this.userId);
        this.getDataSourceAction();

        // this._fmeaService.getSystemStatus()
        //   .subscribe(res => {
        //     // console.log(res)
        //     this.statusList = res;
        //   });

        this._userService.getUsersRecordById(this.userId)
          .subscribe(out => {
            // console.log(out)
            // this.userList = out;
            this.assignedName = out.firstName + ' ' + out.lastName;
          });
    }

    onSelect(event) {
      // console.log(event);
    }

    onSelect2(data): void {
      // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }
  
    onActivate(data): void {
      // console.log('Activate', JSON.parse(JSON.stringify(data)));
    }
  
    onDeactivate(data): void {
      // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }

    getDataSourceTgsReview(id: number): void {
      this._assetTaskGroupStrategyHsmService.getAllTGSForDashboardReview(id)
        .subscribe(res => {
          // console.log(res);
          this.default = false;
          this.loading = false;
          this.ELEMENT_DATA_2 = res;
          this.dataSource2 = new MatTableDataSource<IAssetTaskGroupStrategyHsmDisplay>(this.ELEMENT_DATA_2);
          this.dataSource2.paginator = this.tableOnePaginator;
          this.dataSource2.sort = this.tableOneSort;
          this.isLoading = false;
        })
    }

    getDataSourceFmeaReview(id: number): void {
      this._fmeaService.getAllFMEAForDashboardReview(id)
        .subscribe(res => {
          // console.log(res);
          this.default = false;
          this.loading = false;
          this.ELEMENT_DATA = res;
          this.dataSource = new MatTableDataSource<IAllFMEAList>(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        })
    }

    getDataSourceAction(): void{
      this._actionManagementService.getActionManagementByUserId(this.userId)
        .subscribe(res => {
          // console.log(res)
          this.default = false;
          this.loading = false;
          this.ELEMENT_DATA_3 = res;
          this.dataSource3 = new MatTableDataSource<IActionManagement>(this.ELEMENT_DATA_3);
          this.dataSource3.paginator = this.tableTwoPaginator;
          this.dataSource3.sort = this.tableTwoSort;
          this.isLoading = false;
        })
    }

    mapStatusData(id: number): string {
      let retData = "";
      retData = this.statusList.find(x => x.id === id);
      // console.log(retData)
      return retData;
  }

  mapActionStatusData(id: number): string {
    let retData = "";
    retData = this.actionStatusList.find(x => x.id === id);
    // console.log(retData)
    return retData;
  }

  mapRequestStatusData(id: number): string {
    let retData = "";
    retData = this.requestType.find(x => x.value === id);
    // console.log(retData)
    return retData;
  }

  mapusersData(id: number): string {
    let retData = "";
    retData = this.userList.find(x => x.id === id);
    // console.log(retData)
    return retData;
  }

  fmeastatusOnSelect(event, id: number){
    this.statusId = parseInt(event.value);

    this._fmeaService.getFMEAById(id)
      .subscribe(res => {
          this.fmeaObject = res;

          this.fmeaObject.systemStatus = this.statusId;

          if(this.statusId !== 2)
          {
            this._fmeaService.updateFMEARecords(id, this.fmeaObject)
              .subscribe(out => {
                this._assignToUserService.getAssignGroupToUserByTransactionId(id)
                  .subscribe(foo => {
                    // console.log(foo)
                    this.assignToUserObject = foo;

                    this.assignToUserObject.isActive = false;

                    this._assignToUserService.updateAssignGroupToUser(foo.id, this.assignToUserObject)
                      .subscribe(woo => {
                        this.ngOnInit();
                      });
                });
            });
          }
      });
    
  }

  tgsstatusOnSelect(event, id: number){
    this.tgsStatusId = parseInt(event.value);

    this._assetTaskGroupStrategyHsmService.getAssetTaskGroupStrategyById(id)
      .subscribe(res => {
          // console.log(res);
          this.assetTaskGroupStrategyObject = res;

          this.assetTaskGroupStrategyObject.systemStatus = this.tgsStatusId;

          if(this.tgsStatusId !== 2)
          {
            this._assetTaskGroupStrategyHsmService.updateStrategyGroup(id, this.assetTaskGroupStrategyObject)
              .subscribe(out => {
                // console.log(out);
                this._assignToUserService.getAssignGroupToUserByTransactionId(id)
                  .subscribe(foo => {
                    this.assignToUserObject = foo;

                    this.assignToUserObject.isActive = false;

                    this._assignToUserService.updateAssignGroupToUser(foo.id, this.assignToUserObject)
                      .subscribe(woo => {
                        this.ngOnInit();
                      });
                  });
              });
          }
      });
  }

  actionstatusOnSelect(event, id: number){
    this.actionStatusId = parseInt(event.value);

    this._actionManagementService.getActionManagementRecordById(id)
      .subscribe(res => {
        // console.log(res)
        this.actionManagementObject = res;
        this.actionManagementObject.actionStatus = this.actionStatusId;

        this._actionManagementService.updateActionManagement(id, this.actionManagementObject)
          .subscribe(woo => {
              this.ngOnInit();
          })
      });
  }

  openViewComment(mode: any, id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {mode: mode, item: id};
    this._dataService.setData(dialogConfig.data);
    dialogConfig.width = "600px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    const dialogRef = this.dialog.open(ViewCommentModal, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
        console.log(res);
        // this.ngOnInit();
    });
  }

  openViewRequest(mode: any, id: number) {
    if(this.canAccess('ViewRequest')) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {mode: mode, item: id};
      this._dataService.setData(dialogConfig.data);
      dialogConfig.width = "600px";
      dialogConfig.height = "auto";
      dialogConfig.position = { top: '30px' };
      const dialogRef = this.dialog.open(RequestModal, dialogConfig);
      dialogRef.afterClosed().subscribe(res => {
          console.log(res);
          // this.ngOnInit();
      });
    }else{
      this.toastr.warning('You do not have permission to perform this action.', '');
    }
  }

}



