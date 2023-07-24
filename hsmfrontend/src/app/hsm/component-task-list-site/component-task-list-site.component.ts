import { Component, Inject, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { FMEASteps } from '../enum/FMEAStepsEnum';
import { FormControl } from '@angular/forms';
import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from '@angular/material/tree';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomTableModalComponent } from '../modal/customtablemodal/customtablemodal.component';
import { CreateNewFMEAModalComponent } from '../modal/createnewfmeamodal/createnewfmeamodal.component';
import { MultiFilterModalComponent } from '../modal/multifiltermodal/multifiltermodal.component';
import { UploadComponentModalComponent } from '../modal/uploadcomponentmodal/uploadcomponentmodal.component';
import { CategoryHierarchyService } from '../services/categoryhierarchy.services';
import { IAllFMEAList, IAllFMEASiteList, IFMEA, IFMEAList, IFMUFTSite } from '../interfaces/IFMEA';
import { FMEAService } from '../services/fmea.services';
import { fmeaDefault, fmuftSiteDefault } from 'src/app/shared/helpers/default.helpers';
import { ToastrService } from 'ngx-toastr';
import { CreateFMEAVariantModalComponent } from '../modal/createfmeavariantmodal/createfmeavariantmodal.component';
import { DataService } from 'src/app/shared/services/data.service';
import { ComponentVariantService } from '../services/componentvariant.services';
import { forkJoin } from 'rxjs';
import { TaskTypeService } from '../services/tasktype.services';
import { TradeTypeService } from '../services/tradetype.services';
import { FrequencyService } from '../services/frequency.services';
import { DurationService } from '../services/duration.services';
import { ComponentFamilyService } from '../services/componentfamily.services';
import { ComponentClassService } from '../services/componentclass.services';
import { ComponentSubClassService } from '../services/componentsubclass.services';
import { ComponentBuildSpecService } from '../services/componentbuildspec.services';
import { ComponentManufacturerService } from '../services/componentmanufacturer.services';
import { AssetHierarchyManufacturerService } from '../services/assethierarchymanufacturer.services';
import { ComponentTaskService } from '../services/componenttask.services';
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';
import { FMaintainableUnitService } from '../services/fmaintainableunitsite.services';
import { CustomerService } from '../services/customer.services';
import { SitesService } from '../services/sites.services';

@Component({
    selector: "component-task-list-site",
    templateUrl: './component-task-list-site.component.html',
    styleUrls: [
        './component-task-list-site.component.scss'
    ]
})

export class ComponentTaskListSiteComponent implements OnInit {
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('tableColumn') public tableColumn: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns: string[] = ['isAdd', 'taskIdentificationNo', 'parentCode', 'familyComponent', 'componentClass', 'subClass', 'buildSpec', 'componentManufacturer', 'failureMode', 'taskDescription', 'failureRiskTotalScore', 'acceptableLimits', 'correctiveActions', 'taskTypeName', 'frequencyName', 'systemStatus', 'deleteFM'];

    ELEMENT_DATA: IAllFMEAList[] = [];

    componentVariantList: any[] = [];
    taskTypeList: any[] = [];
    tradeTypeList: any[] = [];
    frequencyList: any[] = [];
    durationList: any[] = [];
    familyTaxonomyList: any[] = [];
    classTaxonomyList: any[] = [];
    subClassTaxonomyList: any[] = [];
    buildSpecTaxonomyList: any[] = [];
    manufacturerTaxonomyList: any[]= [];
    componentTaskList: any[] = [];
    customerList: any[] = [];
    siteList: any[] = [];
    taskIdList: any[] = [];
    
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

    fmeaObject: IFMEA = fmeaDefault();
    fmuftsiteObject: IFMUFTSite = fmuftSiteDefault();
    fmeaVariantObject: any;

    componentId: number = 0;
    componentCode: string = "";
    componentFailureMode: string = "";

    loading: boolean = false;
    isLoading: boolean = true;
    default: boolean = false;

    isClicked: boolean = false;
    isChecked: boolean = false;
    isDisabled: boolean = false;

    displayTableColumn: boolean = false;
    displayMultiFilter: boolean = false;

    isMax:boolean = true;
    isMin: boolean = false;


    //NG MODELS
    componentHierarchyCode: string = "";
    componentLevel1Id: number;
    componentLevel2Id: number;
    componentLevel3Id: number;
    assetHierarchyId: number;
    componentHierarchyId: number;
    assetClassType: string ="";
    assetHierarchyCode: string ="";
    taxonomyDescription: string ="";
    componentTypeId: number;
    subComponentTypeId: number;
    taskIdentificationNo: string = "";
    componentTaskFunction: string = "";
    failureMode: string = "";
    failureEffect: string ="";
    failureCause: string = "";
    endEffect: string ="";
    taskDescription: string ="";
    acceptableLimits: string ="";
    correctiveActions: string ="";
    taskTypeId: number;
    operationalModeId: number;
    failureRiskScore1: number;
    failureRiskScore2: number;
    failureRiskScore3: number;
    failureRiskScore4: number;
    failureRiskTotalScore: number = 0;
    intervalId: number;
    durationId: number;
    resourceQuantity: string;
    tradeTypeId: number;
    taxonomyCategoryId: number;
    taxonomyClassId: number;
    taxonomyTypeId: number;
    variantId: number;

    //table NgModel
    tableTaskId: boolean = true;
    tableParent: boolean = true;
    tableFailureMode: boolean = true;
    tableTaskDesc: boolean = true;
    tableFailureRiskScore: boolean = true;
    tableAcceptableLimits: boolean = true;
    tableCorrective: boolean = true;
    tableTaskType: boolean = true;
    tableInterval: boolean = true;
    tableFamily: boolean = true;
    tableClass: boolean = true;
    tableSubClass: boolean = true;
    tableBuildSpec: boolean = true;
    tableManufacturer: boolean = true;
    tableVariant: boolean = false;
    systemStatus: any;

    tasktypeId: number;
    taskId: string = "";
    failuremode: string = "";
    tradetypeId: number;
    frequencyId: number;
    durationid: number;
    variantid: number;
    familyTaxonomyid: number;
    classTaxonomyid: number;
    subClassTaxonomyid: number;
    buildSpecTaxonomyid: number;
    manufacturerTaxonomyid: number;
    customerId: number = 0;
    siteId: number = 0;
    statusId: number;
    groupName: string = "";

    isSysAdmin: boolean = false;
    isCustomerSelect: boolean = false;
    isHSMUser: boolean = false;
    isAdmin: boolean = false;

    dataSource2;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private _fmmtSiteService: FMaintainableUnitService,
        private _categoryHierarchyService: CategoryHierarchyService,
        private _dataService: DataService,
        private toastr: ToastrService,
        private _fmeaService: FMEAService,
        private _componentVariantService: ComponentVariantService,
        private _taskTypeService: TaskTypeService,
        private _tradeTypeService: TradeTypeService,
        private _frequencyService: FrequencyService,
        private _durationService: DurationService,
        private _familyTaxonomyService: ComponentFamilyService,
        private _classTaxonomyService: ComponentClassService,
        private _subClassTaxonomyService: ComponentSubClassService,
        private _buildSpecTaxonomyService: ComponentBuildSpecService,
        private _manufacturerTaxonomyService: AssetHierarchyManufacturerService,
        private _componentTaskService: ComponentTaskService,
        private userPermissionService: PermissionManagerService,
        private _customerService: CustomerService,
        private _siteService: SitesService,
    ){}

    canAccess(roleKey: string): boolean {
        let access: boolean = false;
        access = this.userPermissionService.isGranted(roleKey);
        return access;
    }

    ngOnInit(): void {
      const user = JSON.parse(localStorage.currentUser);
      this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
      // console.log(user);
      this.isAdmin = user?.users?.isAdmin;
      this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
      this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;

      if(this.isAdmin) this.isSysAdmin = true;
      else this.isSysAdmin = false;

      // console.log(this.siteId, this.customerId)
      localStorage.removeItem("assetclass");
      localStorage.removeItem("manufacturer");
      localStorage.removeItem("subclass");
      localStorage.removeItem("buildspec");
      localStorage.removeItem("familyId");
      localStorage.removeItem("classId");
      localStorage.removeItem("subClassId");
      localStorage.removeItem("buildSpecId");
      localStorage.removeItem("manufacturerId");
      
      var newdisplaycolumn = JSON.parse(localStorage.getItem('activeColsfsite'));
      var taskval = JSON.parse(localStorage.getItem('taskidNofsite'));
      var parentc = JSON.parse(localStorage.getItem('parentfsite'));
      var failmode = JSON.parse(localStorage.getItem('fmodefsite'));
      var taskdesc = JSON.parse(localStorage.getItem('descfsite'));
      var failscore = JSON.parse(localStorage.getItem('fscorefsite'));
      var acclimits = JSON.parse(localStorage.getItem('limitsfsite'));
      var correctives = JSON.parse(localStorage.getItem('correctivefsite'));
      var ttype = JSON.parse(localStorage.getItem('tasktypefsite'));
      var frequency = JSON.parse(localStorage.getItem('intervalfsite'));
      var maintUnit = JSON.parse(localStorage.getItem('mainunitfsite'));
      var maintItem = JSON.parse(localStorage.getItem('maintitemfsite'));
      var maintSub = JSON.parse(localStorage.getItem('maintsubitemfsite'));
      var buildspec = JSON.parse(localStorage.getItem('buildspecfsite'));
      var manufacturer = JSON.parse(localStorage.getItem('manufacturefsite'));
      // // console.log(taskval)

      if(newdisplaycolumn !== null){
        this.displayedColumns =  JSON.parse(localStorage.getItem('activeCols'));
      }

      if(taskval !== null){
        this.tableTaskId = taskval;
      }

      if(parentc !== null){
        this.tableParent = parentc;
      }

      if(failmode !== null){
        this.tableFailureMode = failmode;
      }

      if(taskdesc !== null){
        this.tableTaskDesc = taskdesc;
      }

      if(failscore !== null){
        this.tableFailureRiskScore = failscore;
      }

      if(acclimits !== null){
        this.tableAcceptableLimits = acclimits;
      }

      if(correctives !== null){
        this.tableCorrective = correctives;
      }

      if(ttype !== null){
        this.tableTaskType = ttype;
      }

      if(frequency !== null){
        this.tableInterval = frequency;
      }

      if(maintUnit !== null){
        this.tableFamily = maintUnit;
      }

      if(maintItem !== null){
        this.tableClass = maintItem;
      }

      if(maintSub !== null){
        this.tableSubClass = maintSub;
      }

      if(buildspec !== null){
        this.tableBuildSpec = buildspec;
      }

      if(manufacturer !== null){
        this.tableManufacturer = manufacturer;
      }

      forkJoin(
        this._componentVariantService.getComponentVariants(),
        this._taskTypeService.getTaskType(),
        this._tradeTypeService.getTradeType(),
        this._frequencyService.getFrequency(),
        this._durationService.getDuration(),
        this._familyTaxonomyService.getComponentFamily(),
        this._classTaxonomyService.getComponentClass(),
        this._subClassTaxonomyService.getComponentSubClass(),
        this._buildSpecTaxonomyService.getComponentBuildSpec(),
        this._manufacturerTaxonomyService.getAssetManufacturer(),
        this._fmeaService.getSystemStatus(),
        this._customerService.getCustomer(),
        this._customerService.getCustomerById(this.customerId),
        this._siteService.getSitesByCustomerId(this.customerId),
        ).subscribe(([cv, tt, ty, fr, dr, cf, cl, sc, bs, mf, fm, cm, cb, sl]) => {
            this.componentVariantList = cv;
            this.taskTypeList = tt;
            this.tradeTypeList = ty;
            this.frequencyList = fr;
            this.durationList = dr;
            this.familyTaxonomyList = cf;
            this.classTaxonomyList = cl;
            this.subClassTaxonomyList = sc;
            this.buildSpecTaxonomyList = bs;
            this.manufacturerTaxonomyList = mf;
            // console.log(sl)
            this.statusList = fm;
            this.customerList = cm;
            this.siteList = sl;
            this.isLoading = false;
      });
      
      // this.systemStatus = this.mapStatusData(this.systemStatus)['statusName'];

      this.default = true;

      this.getFMTData();
    }

    fmDataClick(item: number, name: string){
        // console.log(item)
        this.componentId = item;
        this.isClicked = true;
        this.componentFailureMode = name;

        this._fmmtSiteService.getFMUFTSiteTaskCustomerSiteList(item, this.customerId, this.siteId)
            .subscribe(res => {
                // console.log(res);
                this.loading = false;
                this.default = false;
                this.ELEMENT_DATA = res;
                this.dataSource2 = new MatTableDataSource<IAllFMEASiteList>(this.ELEMENT_DATA);
                this.dataSource2.paginator = this.paginator;
                this.dataSource2.sort = this.sort;
            });

        this._fmmtSiteService.getDropdowMaintUnitList(this.componentId)
            .subscribe(i => {
               this.familyTaxonomyList = i.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });

        this._fmmtSiteService.getDropdownMaintItemList(this.componentId)
            .subscribe(i => {
               this.classTaxonomyList = i.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmmtSiteService.getDropdownSubMaintItemList(this.componentId)
            .subscribe(s => {
               this.subClassTaxonomyList = s.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmmtSiteService.getDropdownBuildSpecList(this.componentId)
            .subscribe(b => {
               this.buildSpecTaxonomyList = b.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmmtSiteService.getDropdownManufacturerList(this.componentId)
            .subscribe(m => {
               this.manufacturerTaxonomyList = m.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmmtSiteService.getDropdownTaskTypeList(this.componentId)
            .subscribe(t => {
               this.taskTypeList = t.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmmtSiteService.getDropdownTradeTypeList(this.componentId)
            .subscribe(ty => {
               this.tradeTypeList = ty.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmmtSiteService.getDropdownFrequencyList(this.componentId)
            .subscribe(fq => {
               this.frequencyList = fq.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmmtSiteService.getDropdownDurationList(this.componentId)
            .subscribe(d => {
               this.durationList = d.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
    }

    onKeyupTask(name: string){
      if(name !== '')
      {
          this._fmmtSiteService.getDropdownTaskIdList(name, this.componentId)
          .subscribe(res => {
              // console.log(res)
              this.taskIdList = res;
              
          })
      }else{
          return false;
      }
    }

    getFMTData(){
        this._componentTaskService.getAllFMMTByCustomerSiteId(this.customerId, this.siteId)
            .subscribe(res => {
                this.componentTaskList = res;
            })
    }

    mapStatusData(id: number): string {
      let retData = "";
      retData = this.statusList.find(x => x.id === id);
      // console.log(retData)
      return retData;
    }

    toggleMin(){
        this.isMin = true;
        this.isMax = false;
    }

    toggleMax(){
        this.isMin = false;
        this.isMax = true;
    }

    statusOnSelect(event, id: number){
      this.statusId = parseInt(event.value);

      this._fmmtSiteService.getFMUFTSiteById(id)
        .subscribe(res => {
          this.fmuftsiteObject = res;
          
          this.fmuftsiteObject.systemStatus = this.statusId;

          this._fmmtSiteService.updateFMUFTSite(id, this.fmuftsiteObject)
            .subscribe(out => {
              // console.log(out);
                this.fmDataClick(this.componentId, this.componentFailureMode);
            });
        })
    }

    customerOnSelect(event){
      this.customerId = parseInt(event.target.value)
      
      if(this.isHSMUser){
        this.isCustomerSelect = true;

        this._siteService.getSitesByCustomerId(this.customerId)
        .subscribe(res => {
          this.siteList = res;
        });
      }
      else if(!this.isHSMUser && this.isAdmin){
        this.isCustomerSelect = true;

        this._siteService.getSitesByCustomerId(this.customerId)
        .subscribe(res => {
          this.siteList = res;
        });
      }else{
        this.isCustomerSelect = false;
        this._siteService.getSitesByCustomerId(this.customerId)
          .subscribe(res => {
            this.siteList = res;
          });
      }

      this.searchFilter();
    }

    siteOnSelect(event){
      this.siteId = parseInt(event.target.value);
      this.searchFilter();
    }

    variantOnSelect(event){
    this.variantid = parseInt(event.target.value);
    // console.log(this.variantid)
    }

    tradeTypeOnSelect(event){
    this.tradetypeId = parseInt(event.target.value);
    }

    taskTypeOnSelect(event){
    this.tasktypeId = parseInt(event.target.value);

    // console.log(this.tasktypeId)
    }

    durationOnSelect(event){
    this.durationid = parseInt(event.target.value);
    }

    frequencyOnSelect(event){
    this.frequencyId = parseInt(event.target.value);
    }

    familyOnSelect(event){
    this.familyTaxonomyid = parseInt(event.target.value);
    }

    classOnSelect(event){
    this.classTaxonomyid = parseInt(event.target.value);
    }

    subClassOnSelect(event){
    this.subClassTaxonomyid = parseInt(event.target.value);
    }

    buildSpecOnSelect(event){
    this.buildSpecTaxonomyid = parseInt(event.target.value);
    }

    manufacturerOnSelect(event){
    this.manufacturerTaxonomyid = parseInt(event.target.value);
    }

    checkThis(event:any, fmeaId: number): void{
        if(event.target.checked === true){
            this.isChecked = true;
            this._fmmtSiteService.getFMUFTSiteById(fmeaId)
              .subscribe(res => {
                // console.log(res);
                this.fmeaObject = res;
                this.componentHierarchyId = res.componentHierarchyId;
                this.assetHierarchyId = res.assetHierarchyId;
                this.assetClassType = res.systemDescription;
                this.componentLevel1Id = res.componentLevel1Id;
                this.componentLevel2Id = res.componentLevel2Id;
                this.componentLevel3Id = res.componentLevel3Id;
                this.taskIdentificationNo = res.taskIdentificationNo;
                this.componentTaskFunction = res.componentTaskFunction;
                this.failureMode = res.failureMode;
                this.failureEffect = res.failureEffect;
                this.failureCause = res.failureCause;
                this.endEffect = res.endEffect;
                this.taskDescription = res.taskDescription;
                this.acceptableLimits = res.acceptableLimits;
                this.correctiveActions = res.correctiveActions;
                this.taskTypeId = res.taskTypeId;
                this.operationalModeId = res.operationalModeId;
                this.failureRiskTotalScore = res.failureRiskTotalScore;
                this.intervalId = res.intervalId;
                this.durationId = res.durationId;
                this.resourceQuantity = res.resourceQuantity;
                this.tradeTypeId = res.tradeTypeId;
                this.variantId = res.variantId;
                // console.log(this.fmeaObject)
              });
        }else{
          this.isChecked = false;
        }
  
        this.fmeaVariantObject = this.fmeaObject;
    }

    openDialogCreateFMEA(mode: string) {
        if(this.canAccess('CreateSiteFMEA')) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = {mode: mode ,item: this.componentId };
          dialogConfig.width = "600px";
          dialogConfig.height = "auto";
          dialogConfig.position = { top: '30px' };
          const dialogRef = this.dialog.open(CreateNewFMEAModalComponent, dialogConfig);
        }else{
          this.toastr.warning('You do not have permission to perform this action.', '');
        }
        
    }
  
    openDialogCreateFMEAVariant() {
        if(this.canAccess('CreateSiteVariant')) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = {item: this.fmeaObject };
          this._dataService.setData(dialogConfig.data);
          dialogConfig.width = "600px";
          dialogConfig.height = "auto";
          dialogConfig.position = { top: '30px' };
          const dialogRef = this.dialog.open(CreateFMEAVariantModalComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(res => {
            this.fmDataClick(this.componentId, this.componentFailureMode);
          });
        }else{
          this.toastr.warning('You do not have permission to perform this action.', '');
        }
      }

      openDialogFilter(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "700px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        const dialogRef = this.dialog.open(MultiFilterModalComponent, dialogConfig);
      }

      searchFilter(): void{
        this._fmmtSiteService.getFMUFTSiteListFilters(this.componentId, this.taskId, this.failuremode, this.tasktypeId, this.tradetypeId, this.frequencyId, this.durationid, this.variantid, this.familyTaxonomyid, this.classTaxonomyid, this.subClassTaxonomyid, this.buildSpecTaxonomyid, this.manufacturerTaxonomyid, this.customerId, this.siteId)
          .subscribe(res => {
            // console.log(res)
            this.isLoading = false;
            this.default = false;
            this.ELEMENT_DATA = res;
            this.dataSource2 = new MatTableDataSource<IAllFMEASiteList>(this.ELEMENT_DATA);
            this.dataSource2.paginator = this.paginator;
            this.dataSource2.sort = this.sort;
          });
  
          this.untoggleFilter();
  
      }
  
      clearFilter(): void{
  
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

      untoggleColumn() {
        this.displayTableColumn = false;
      }
  
      toggleColumn() {
        if (this.displayTableColumn)
          this.displayTableColumn = false;
        else
          this.displayTableColumn = true;
      }
  
      onClickDocument(event) {
        if (this.displayTableColumn) {
          if (!this.tableColumn.nativeElement.contains(event.target)) // or some similar check
            this.toggleColumn();
        }
      }

      goToFMEAEdit(id: number): void{
      
        if(this.canAccess('EditSiteFMEA')) {
          this.router.navigate(["/main/fmea-site-edit", id]);
          // const url = this.router.serializeUrl(
          //   this.router.createUrlTree(["/main/fmea-site-edit", id])
          // );
    
          // window.open(url, '_blank');
        }
        else {
          this.toastr.warning('You do not have permission to perform this action.', '');
        }
        
      }

      goToFMEAReview(id: number): void{
        if(this.canAccess('ReviewSiteFMEA')) {
          this.router.navigate(["/main/fmea-site-edit", id]);
        }
        else{
          this.toastr.warning('You do not have permission to perform this action.', '');
        }
      }

      addColumnTaskId() {
        if (this.tableTaskId === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(1, 0, "taskIdentificationNo");
            // this.displayedColumns.push('taskIdentificationNo');
            localStorage.removeItem('activeColsfsite');
            localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('taskidNofsite');
            localStorage.setItem('taskidNofsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('taskIdentificationNo');
          localStorage.removeItem('activeColsfsite');
          localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('taskidNofsite');
          localStorage.setItem('taskidNofsite', JSON.stringify(false))
        }
      }
  
      addColumnParent() {
        if (this.tableParent === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(2, 0, "parentCode");
            // this.displayedColumns.push('parentCode');
            localStorage.removeItem('activeColsfsite');
            localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('parentfsite');
            localStorage.setItem('parentfsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('parentCode');
          localStorage.removeItem('activeColsfsite');
          localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('parentfsite');
          localStorage.setItem('parentfsite', JSON.stringify(false))
        }
      }
  
      addColumnFailureMode() {
        if (this.tableFailureMode === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(8, 0, "failureMode");
            // this.displayedColumns.push('failureMode');
            localStorage.removeItem('activeColsfsite');
            localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('fmodefsite');
            localStorage.setItem('fmodefsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('failureMode');
          localStorage.removeItem('activeColsfsite');
          localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('fmodefsite');
          localStorage.setItem('fmodefsite', JSON.stringify(false))
        }
      }
  
      addColumnTaskDesc() {
        if (this.tableTaskDesc === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(9, 0, "taskDescription");
            // this.displayedColumns.push('taskDescription');
            localStorage.removeItem('activeColsfsite');
            localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('descfsite');
            localStorage.setItem('descfsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('taskDescription');
          localStorage.removeItem('activeColsfsite');
          localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('descfsite');
          localStorage.setItem('descfsite', JSON.stringify(false))
        }
      }
  
      addColumnFailureRiskScore() {
        if (this.tableFailureRiskScore === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(10, 0, "failureRiskTotalScore");
            // this.displayedColumns.push('failureRiskTotalScore');
            localStorage.removeItem('activeColsfsite');
            localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('fscorefsite');
            localStorage.setItem('fscorefsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('failureRiskTotalScore');
          localStorage.removeItem('activeColsfsite');
          localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('fscorefsite');
          localStorage.setItem('fscorefsite', JSON.stringify(false))
        }
      }
  
      addColumnAcceptableLimits() {
        if (this.tableAcceptableLimits === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(11, 0, "acceptableLimits");
            // this.displayedColumns.push('acceptableLimits');
            localStorage.removeItem('activeColsfsite');
            localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('limitsfsite');
            localStorage.setItem('limitsfsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('acceptableLimits');
          localStorage.removeItem('activeColsfsite');
          localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('limitsfsite');
          localStorage.setItem('limitsfsite', JSON.stringify(false))
        }
      }
  
      addColumnCorrectiveActions() {
        if (this.tableCorrective === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(12, 0, "correctiveActions");
            // this.displayedColumns.push('correctiveActions');
            localStorage.removeItem('activeColsfsite');
            localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('correctivefsite');
            localStorage.setItem('correctivefsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('correctiveActions');
          localStorage.removeItem('activeColsfsite');
          localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('correctivefsite');
          localStorage.setItem('correctivefsite', JSON.stringify(false))
        }
      }
  
      addColumnTaskType() {
        if (this.tableTaskType === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(13, 0, "taskTypeName");
            // this.displayedColumns.push('taskTypeName');
            localStorage.removeItem('activeColsfsite');
            localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('tasktypefsite');
            localStorage.setItem('tasktypefsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('taskTypeName');
          localStorage.removeItem('activeColsfsite');
          localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('tasktypefsite');
          localStorage.setItem('tasktypefsite', JSON.stringify(false))
        }
      }
  
      addColumnFrequency() {
        if (this.tableInterval === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(14, 0, "frequencyName");
            // this.displayedColumns.push('frequencyName');
            localStorage.removeItem('activeColsfsite');
            localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('intervalfsite');
            localStorage.setItem('intervalfsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('frequencyName');
          localStorage.removeItem('activeColsfsite');
          localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('intervalfsite');
          localStorage.setItem('intervalfsite', JSON.stringify(false))
        }
      }
  
      addColumnFamily() {
        if (this.tableFamily === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(3, 0, "familyComponent");
            // this.displayedColumns.push('familyComponent');
            localStorage.removeItem('activeColsfsite');
            localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('mainunitfsite');
            localStorage.setItem('mainunitfsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('familyComponent');
          localStorage.removeItem('activeColsfsite');
          localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('mainunitfsite');
          localStorage.setItem('mainunitfsite', JSON.stringify(false))
        }
      }
  
      addColumnClass() {
        if (this.tableClass === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(4, 0, "componentClass");
            // this.displayedColumns.push('componentClass');
            localStorage.removeItem('activeColsfsite');
            localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('maintitemfsite');
            localStorage.setItem('maintitemfsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('componentClass');
          localStorage.removeItem('activeColsfsite');
          localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('maintitemfsite');
          localStorage.setItem('maintitemfsite', JSON.stringify(false))
        }
      }
  
      addColumnSubClass() {
        if (this.tableSubClass === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(5, 0, "subClass");
            // this.displayedColumns.push('subClass');
            localStorage.removeItem('activeColsfsite');
            localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('maintsubitemfsite');
            localStorage.setItem('maintsubitemfsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('subClass');
          localStorage.removeItem('activeColsfsite');
          localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('maintsubitemfsite');
          localStorage.setItem('maintsubitemfsite', JSON.stringify(false))
        }
      }
  
      addColumnBuildSpec() {
        if (this.tableBuildSpec === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(6, 0, "buildSpec");
            // this.displayedColumns.push('buildSpec');
            localStorage.removeItem('activeColsfsite');
            localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('buildspecfsite');
            localStorage.setItem('buildspecfsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('buildSpec');
          localStorage.removeItem('activeColsfsite');
          localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('buildspecfsite');
          localStorage.setItem('buildspecfsite', JSON.stringify(false))
        }
      }
  
      addColumnManufacturer() {
        if (this.tableManufacturer === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(7, 0, "componentManufacturer");
            // this.displayedColumns.push('componentManufacturer');
            localStorage.removeItem('activeColsfsite');
            localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('manufacturefsite');
            localStorage.setItem('manufacturefsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('componentManufacturer');
          localStorage.removeItem('activeColsfsite');
          localStorage.setItem('activeColsfsite', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('manufacturefsite');
          localStorage.setItem('manufacturefsite', JSON.stringify(false))
        }
      }
  
      addColumnVariant() {
        if (this.tableVariant === true) {
          if (this.displayedColumns.length) {
            // this.displayedColumns.splice(1, 1, "code");
            this.displayedColumns.push('variantName');
          }
        } else {
          this.removeColumn('variantName');
        }
      }
  
      removeColumn(msg: string) {
        const index: number = this.displayedColumns.indexOf(msg);
        if (index !== -1) {
          this.displayedColumns.splice(index, 1);
        }
      }
  
      deleteFMEA(id: number, name: string): void {
          // console.log(id);
          if(this.canAccess('DeleteSiteFMEA')) {
            if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
              this._fmmtSiteService.deleteFMUFTSite(id)
              .subscribe(out => {
                this.toastr.success('Deleted successfully', 'Success!');
                this.fmDataClick(this.componentId, this.componentFailureMode);
              });
            }
          }else{
            this.toastr.warning('You do not have permission to perform this action.', '');
          }
          
      }
}