import { Component, Inject, OnInit, ElementRef, ViewChild, Output, EventEmitter, Renderer2, HostListener } from '@angular/core';
import {Router} from '@angular/router';
import { CdkDragDrop, CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { FMEASteps } from '../enum/FMEAStepsEnum';
import { FormControl } from '@angular/forms';
import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from '@angular/material/tree';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CustomTableModalComponent } from '../modal/customtablemodal/customtablemodal.component';
import { CreateNewFMEAModalComponent } from '../modal/createnewfmeamodal/createnewfmeamodal.component';
import { MultiFilterModalComponent } from '../modal/multifiltermodal/multifiltermodal.component';
import { UploadComponentModalComponent } from '../modal/uploadcomponentmodal/uploadcomponentmodal.component';
import { CategoryHierarchyService } from '../services/categoryhierarchy.services';
import { IAllFMEAList, IFMEA, IFMEAList } from '../interfaces/IFMEA';
import { FMEAService } from '../services/fmea.services';
import { fmeaDefault } from 'src/app/shared/helpers/default.helpers';
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

import { ResizeColumnDirective } from '../assettaskgroupstrategy/assettaskgroupform/resize-column.directive';
import { TransferToMaintUnitModalComponent } from '../modal/transfertomaintunitmodal/transfertomaintunitmodal.component';
import { FmeaAssemblyService } from '../services/fmeaassembly.services';

const ELEMENT_DATA: any[] = [
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
    selector: "component-task-list",
    templateUrl: './component-task-list.component.html',
    styleUrls: [
        './component-task-list.component.scss'
    ]
})

export class ComponentTaskListComponent implements OnInit {
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('tableColumn') public tableColumn: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;
    @ViewChild(MatTable, {read: ElementRef} ) private matTableRef: ElementRef;

    displayedColumns: string[] = ['isAdd', 'taskIdentificationNo', 'parentCode', 'familyComponent', 'componentClass', 'subClass', 'buildSpec', 'componentManufacturer', 'failureMode', 'taskDescription', 'failureRiskTotalScore', 'acceptableLimits', 'correctiveActions', 'taskTypeName', 'frequencyName', 'systemStatus', 'deleteFM'];
    displayedColumnsNames: string[] = ['Task ID', 'Parent', 'Maint Unit', 'Maint Item', 'Sub Maint Item', 'BuildSpec', 'Manufacturer', 'Failure Mode', 'Task Description', 'Risk Score', 'Acceptable Limits', 'Corrective Action', 'Task Type', 'Interval', 'Status'];
    // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol' 'deleteFM'];

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
    fmeaAssigntomaintList: any[] = [];
    taxonomyClassList: any[] = [];

    taskIdList: any[] = [];
    failureModeList: any[] = [];

    fmeaObject: IFMEA = fmeaDefault();
    fmeaVariantObject: any;

    loading: boolean = false;
    default: boolean = false;

    isClicked: boolean = false;
    isChecked: boolean = false;
    isDisabled: boolean = false;

    displayTableColumn: boolean = false;
    displayMultiFilter: boolean = false;

    isMax:boolean = true;
    isMin: boolean = false;

    dataSource2;

    // States
    stateBullet: number = 1;
    step = FMEASteps;
    forReview: boolean = false;
    componentName: string = "";

    //NG MODELS
    componentHierarchyCode: string = "";
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

    taxCategoryId: number;
    taxClassId: number;
    taxTypeId: number;

    componentLevel1Id: number;
    componentLevel2Id: number;
    componentLevel3Id: number;

    componentLevel1: string = "";
    componentLevel2: string = "";
    componentLevel3: string = "";
    componentLevel4: string = "";

    assetHierarchyId: number;
    componentHierarchyId: number;
    assetClassType: string ="";

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
    componentId: number = 0;
    componentCode: string = "";
    componentFailureMode: string = "";

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
    tableComponentTaskFunction: boolean = false;
    tableFailureEffect: boolean =false;
    tableFailureCause: boolean = false;
    tableOperationalMode: boolean = false;
    tableDuration: boolean = false;
    tableTradeType: boolean = false;
    systemStatus: any;

    isLoading: boolean = true;

    pressed = false;
    currentResizeIndex: number;
    startX: number;
    startWidth: number;
    isResizingRight: boolean;
    resizableMousemove: () => void;
    resizableMouseup: () => void;
    
    taskNo: number = 0;
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

  statusId: number;
  previousIndex: number;

  isHSMUser: boolean = false;
  isAdmin: boolean = false;
  customerId: number = 0;
  siteId: number = 0;

  hasAssetClassTask: boolean = false;
  hasVariantClassTask: boolean = false;

    constructor(
        private renderer: Renderer2,
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private _fmeaService: FMEAService,
        private _categoryHierarchyService: CategoryHierarchyService,
        private _dataService: DataService,
        private toastr: ToastrService,
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
        private _fmeaAssemblyService: FmeaAssemblyService,
        ) { 
          const user = JSON.parse(localStorage.currentUser);
          this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
          // console.log(user);
          this.isAdmin = user?.users?.isAdmin;
          this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
          this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
        }

      canAccess(roleKey: string): boolean {
          let access: boolean = false;
          access = this.userPermissionService.isGranted(roleKey);
          return access;
      }
    
    ngOnInit(): void {
        // this.displayedColumns = JSON.parse(localStorage.displaycolumns);
        localStorage.removeItem("assetclass");
        localStorage.removeItem("manufacturer");
        localStorage.removeItem("subclass");
        localStorage.removeItem("buildspec");
        localStorage.removeItem("familyId");
        localStorage.removeItem("classId");
        localStorage.removeItem("subClassId");
        localStorage.removeItem("buildSpecId");
        localStorage.removeItem("manufacturerId");
        localStorage.removeItem("functionstatement");
        localStorage.removeItem("fEffect");
        localStorage.removeItem("fCause");
        localStorage.removeItem("opMode");
        localStorage.removeItem("durationname");
        localStorage.removeItem("tradetype");

        var newdisplaycolumn = JSON.parse(localStorage.getItem('activeCols'));
        var taskval = JSON.parse(localStorage.getItem('taskidNo'));
        var parentc = JSON.parse(localStorage.getItem('parent'));
        var failmode = JSON.parse(localStorage.getItem('fmode'));
        var taskdesc = JSON.parse(localStorage.getItem('desc'));
        var failscore = JSON.parse(localStorage.getItem('fscore'));
        var acclimits = JSON.parse(localStorage.getItem('limits'));
        var correctives = JSON.parse(localStorage.getItem('corrective'));
        var ttype = JSON.parse(localStorage.getItem('tasktype'));
        var frequency = JSON.parse(localStorage.getItem('interval'));
        var maintUnit = JSON.parse(localStorage.getItem('mainunit'));
        var maintItem = JSON.parse(localStorage.getItem('maintitem'));
        var maintSub = JSON.parse(localStorage.getItem('maintsubitem'));
        var buildspec = JSON.parse(localStorage.getItem('buildspec'));
        var manufacturer = JSON.parse(localStorage.getItem('manufacture'));
        var funcstatement = JSON.parse(localStorage.getItem('functionstatement'));
        var faileffect = JSON.parse(localStorage.getItem('fEffect'));
        var failcause = JSON.parse(localStorage.getItem('fCause'));
        var operationmode = JSON.parse(localStorage.getItem('opMode'));
        var duration = JSON.parse(localStorage.getItem('durationname'));
        var tradetype = JSON.parse(localStorage.getItem('tradetype'));
        // console.log(taskval)

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

        if(funcstatement !== null){
          this.tableComponentTaskFunction = funcstatement;
        }

        if(faileffect !== null){
          this.tableFailureEffect = faileffect;
        }

        if(failcause !== null){
          this.tableFailureCause = failcause;
        }

        if(operationmode !== null){
          this.tableOperationalMode = operationmode;
        }

        if(duration !== null){
          this.tableDuration = duration;
        }

        if(tradetype !== null){
          this.tableTradeType = tradetype;
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
          ).subscribe(([cv, tt, ty, fr, dr, cf, cl, sc, bs, mf, fm]) => {
              this.componentVariantList = cv.sort((a, b) => (a.variantName < b.variantName ? -1 : 1));
              // this.taskTypeList = tt;
              // this.tradeTypeList = ty;
              // this.frequencyList = fr;
              // this.durationList = dr;
              // this.familyTaxonomyList = cf;
              // this.classTaxonomyList = cl;
              // this.subClassTaxonomyList = sc;
              // this.buildSpecTaxonomyList = bs;
              // this.manufacturerTaxonomyList = mf;
              // console.log(fm)
              this.statusList = fm;
              this.isLoading = false;
          });
        
        // this.systemStatus = this.mapStatusData(this.systemStatus)['statusName'];

        this.default = true;
        this.getFMTData();
    }

    // onChange() {
    //   localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
    // }

    toggleMin(){
      this.isMin = true;
      this.isMax = false;
    }

    toggleMax(){
      this.isMin = false;
      this.isMax = true;
    }

    getFMTData(){
        this._componentTaskService.getAllFMMTByCustomerSiteId(this.customerId, this.siteId)
            .subscribe(res => {
              // console.log(res)
                this.componentTaskList = res.filter(e=> e.siteId === 0 && e.customerId === 0);
            })
    }

    fmDataClick(item: number, name: string){
        // console.log(item)
        this.componentId = item;
        this.isClicked = true;
        this.componentFailureMode = name;
        this.isLoading = true;

        this._fmeaService.getFailureModeTaskList(item)
            .subscribe(res => {
                // console.log(res);
                this.loading = false;
                this.default = false;
                this.ELEMENT_DATA = res;
                this.dataSource2 = new MatTableDataSource<IAllFMEAList>(this.ELEMENT_DATA);
                this.dataSource2.paginator = this.paginator;
                this.dataSource2.sort = this.sort;
                this.isLoading = false;
            });

        this._fmeaService.getClassMaintUnitList(this.componentId)
            .subscribe(f => {
               this.familyTaxonomyList = f.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
               this.isLoading = false;
            });
        this._fmeaService.getDropdownMaintItemList(this.componentId)
            .subscribe(i => {
               this.classTaxonomyList = i.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
               this.isLoading = false;
            });
        this._fmeaService.getDropdownSubMaintItemList(this.componentId)
            .subscribe(s => {
               this.subClassTaxonomyList = s.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
               this.isLoading = false;
            });
        this._fmeaService.getDropdownBuildSpecList(this.componentId)
            .subscribe(b => {
               this.buildSpecTaxonomyList = b.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
               this.isLoading = false;
            });
        this._fmeaService.getDropdownManufacturerList(this.componentId)
            .subscribe(m => {
               this.manufacturerTaxonomyList = m.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
               this.isLoading = false;
            });
        this._fmeaService.getDropdownTaskTypeList(this.componentId)
            .subscribe(t => {
               this.taskTypeList = t.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
               this.isLoading = false;
            });
        this._fmeaService.getDropdownTradeTypeList(this.componentId)
            .subscribe(ty => {
               this.tradeTypeList = ty.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
               this.isLoading = false;
            });
        this._fmeaService.getDropdownFrequencyList(this.componentId)
            .subscribe(fq => {
               this.frequencyList = fq.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
               this.isLoading = false;
            });
        this._fmeaService.getDropdownDurationList(this.componentId)
            .subscribe(d => {
               this.durationList = d.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
               this.isLoading = false;
            });
    }

    nodeClick(node: any){
      this.componentId = node.id;
      // console.log(this.componentId)
      this.componentName = node.name;
      // localStorage.setItem("component", this.componentName);

      this.isClicked = true;
      // console.log(this.componentId)

    this._categoryHierarchyService.getComponentById(this.componentId)
      .subscribe(out => {
        this.componentCode = out.categoryCode;

        this._fmeaService.getAllFMEAListByCategoryName(this.componentCode)
        .subscribe(res => {
          // console.log(res)
          this.loading = false;
          this.default = false;
          this.ELEMENT_DATA = res;
          this.dataSource2 = new MatTableDataSource<IAllFMEAList>(this.ELEMENT_DATA);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        });

        this._fmeaService.getFMEAByComponentId(this.componentId)
          .subscribe(out => {
              this.componentLevel1= out[0]['categoryName'];
              this.componentLevel2= (out[1] != null || out[1] != undefined) ? out[1]['categoryName']: "";
              this.componentLevel3= (out[2] != null || out[2] != undefined) ? out[2]['categoryName']: "";
              this.componentLevel4 = (out[3] != null || out[3] != undefined) ? out[3]['categoryName']: "";

              if(this.componentLevel4 !== null || this.componentLevel4 !== '')
              {
                  this.componentHierarchyCode = this.componentName + '- ' + this.componentLevel3 + ' - ' + this.componentLevel2 + ' - ' + this.componentLevel1;
              }
              
              if((this.componentLevel4 === null || this.componentLevel4 === '') && (this.componentLevel3 !== null || this.componentLevel3 !== ''))
              {
                  this.componentHierarchyCode = this.componentName + '- ' + this.componentLevel2 + ' - ' + this.componentLevel1;
              }

              if((this.componentLevel2 !== null || this.componentLevel2 !== '') && (this.componentLevel4 === null || this.componentLevel4 === '') && (this.componentLevel3 === null || this.componentLevel3 === ''))
              {
                  this.componentHierarchyCode = this.componentName + '- ' +  this.componentLevel1;
              }

              if((this.componentLevel1 !== null || this.componentLevel1 !== '') && (this.componentLevel2 === null || this.componentLevel2 === '') && (this.componentLevel4 === null || this.componentLevel4 === '') && (this.componentLevel3 === null || this.componentLevel3 === ''))
              {
                  this.componentHierarchyCode = this.componentName;
              }
          });
      });
    }

    onKeyupTask(name: string){
      if(name !== '')
      {
          this._fmeaService.getDropdownTaskIdList(name, this.componentId)
          .subscribe(res => {
              // console.log(res)
              this.taskIdList = res;
              
          })
      }else{
          return false;
      }
    }

    onKeyupFmode(name: string){
      if(name !== '')
      {
          this._fmeaService.getDropdownFailureModeList(name)
          .subscribe(res => {
              // console.log(res)
              this.failureModeList = res;
              
          })
      }else{
          return false;
      }
    }

    tableDrop(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    }

    mapStatusData(id: number): string {
      let retData = "";
      retData = this.statusList.find(e => e.id === id);
      return retData;
    }

    statusOnSelect(event, id: number){
      this.statusId = parseInt(event.value);

      this._fmeaService.getFMEAById(id)
        .subscribe(res => {
          this.fmeaObject = res;
          
          this.fmeaObject.systemStatus = this.statusId;

          this._fmeaService.updateFMEARecords(id, this.fmeaObject)
            .subscribe(out => {
              // console.log(out);
                this.fmDataClick(this.componentId, this.componentFailureMode);
            });
        })
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

      this._fmeaService.getDropdownSubMaintItemByItemIdList(this.componentId, this.classTaxonomyid)
        .subscribe(res => {
            this.subClassTaxonomyList = res;
        })
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
      var index = this.fmeaAssigntomaintList.map(x => {
        return x.id;
      }).indexOf(fmeaId);

      if(event.target.checked === true){
          this.isChecked = true;
          this._fmeaService.getFMEAById(fmeaId)
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

            this._fmeaService.getFMEATaskById(fmeaId)
              .subscribe(out => {

                out.forEach(x => {
                  let acclimits  = x.acceptableLimits;
                  let builds  = x.buildSpecTaxonomyId;
                  let cClass  = x.classTaxonomyId;
                  let comHierarchy = x.componentHierarchyId;
                  let comLevl1 = x.componentLevel1Id;
                  let comTaskFunc = x.componentTaskFunction;
                  let cActions  = x.correctiveActions;
                  let duration = x.durationId;
                  let endEffect = x.endEffect;
                  let failureCause = x.failureCause;
                  let failureEffect = x.failureEffect;
                  let fmode  = x.failureMode;
                  let fScore  = x.failureRiskTotalScore;
                  let familyCom  = x.familyTaxonomyId;
                  let freq  = x.intervalId;
                  let unId  = x.id;
                  let cManufacture  = x.manufacturerTaxonomyId;
                  let operaMode = x.operationalModeId;
                  let origIn = x.origIndic;
                  let pCode  = x.parentCode;
                  let resourceQ = x.resourceQuantity;
                  let sClass  = x.subClassTaxonomyId;
                  let sysDesc  = x.systemDescription;
                  let taskDesc = x.taskDescription;
                  let taskIdent  = x.taskIdentificationNo;
                  let tType  = x.taskTypeId;
                  let tradeType = x.tradeTypeId;
                  let variant = x.variantId;
                  let comment = x.comment;
                  let created = x.createdBy;
                  let updated = x.updatedBy;
                  let dtcreated = x.dtCreated;
                  let dtupdated = x.dtUpdated;
                  let sysStatus = x.systemStatus;
      
                  this.fmeaAssigntomaintList.push({
                      acceptableLimits: acclimits,
                      buildSpecTaxonomyId: builds,
                      classTaxonomyId: cClass,
                      componentHierarchyId: comHierarchy,
                      componentLevel1Id: comLevl1,
                      componentTaskFunction: comTaskFunc,
                      correctiveActions: cActions,
                      durationId: duration,
                      endEffect: endEffect,
                      failureCause: failureCause,
                      failureEffect: failureEffect,
                      failureMode: fmode,
                      failureRiskTotalScore: fScore,
                      familyTaxonomyId: familyCom,
                      intervalId: freq,
                      manufacturerTaxonomyId: cManufacture,
                      operationalModeId: operaMode,
                      origIndic: origIn,
                      parentCode: pCode,
                      resourceQuantity: resourceQ,
                      subClassTaxonomyId: sClass,
                      systemDescription: sysDesc,
                      taskDescription: taskDesc,
                      taskIdentificationNo: taskIdent,
                      taskTypeId: tType,
                      tradeTypeId: tradeType,
                      variantId: variant,
                      comment: comment,
                      createdBy: created,
                      updatedBy: updated,
                      dtcreated: dtcreated,
                      dtUpdated: dtupdated,
                      systemStatus: sysStatus,
                      id: unId
                  });
                  // console.log(this.fmeaAssigntomaintList)

                });
              });
      }else{
        this.isChecked = false;
        this.fmeaAssigntomaintList.splice(index, fmeaId);
      }

      this.fmeaVariantObject = this.fmeaObject;
          
  }

    onViewdetails(): void{
        this.router.navigate(["/main/fmea-form"]);
    }

    goToFMEAEdit(id: number): void{
      if(this.canAccess('EditFMEA')) {
        this.router.navigate(["/main/fmea-edit", id]);
      }
      else{
        this.toastr.warning('You do not have permission to perform this action.', '');
      }
      
      // if(this.canAccess('ModifyFMEATask')) {
      //   const url = this.router.serializeUrl(
      //     this.router.createUrlTree(["/main/fmea-edit", id])
      //   );
  
      //   window.open(url, '_blank');
      // }
      // else {
      //   this.toastr.warning('You do not have permission to perform this action.', '');
      // }
      
    }

    goToFMEAReview(id: number): void{
      if(this.canAccess('ReviewFMEA')) {
        this.router.navigate(["/main/fmea-edit", id]);
      }
      else{
        this.toastr.warning('You do not have permission to perform this action.', '');
      }
    }

    onRightClick() {
      return true;
    }

    openDialogCreateFMEA(mode: string) {
      if(this.canAccess('CreateFMEA')) {
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

    openDialogTransferMaintUnit() {
      if(this.canAccess('TransferMaintUnit')) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {item: this.fmeaAssigntomaintList };
        dialogConfig.width = "600px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        this._dataService.setData(dialogConfig.data);
        const dialogRef = this.dialog.open(TransferToMaintUnitModalComponent, dialogConfig);
      }else{
        this.toastr.warning('You do not have permission to perform this action.', '');
      }
      
    }

    openDialogCreateFMEAVariant() {
      if(this.canAccess('CreateVariant')) {
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

    openDialogUpload(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "500px";
      dialogConfig.height = "auto";
      dialogConfig.position = { top: '30px' };
      const dialogRef = this.dialog.open(UploadComponentModalComponent, dialogConfig);
    }

    searchFilter(): void{
      this._fmeaService.getFMEAListFilters(this.taskId, this.failuremode, this.tasktypeId, this.tradetypeId, this.frequencyId, this.durationid, this.variantid, this.familyTaxonomyid, this.classTaxonomyid, this.subClassTaxonomyid, this.buildSpecTaxonomyid, this.manufacturerTaxonomyid)
        .subscribe(res => {
          this.loading = false;
          this.default = false;
          this.ELEMENT_DATA = res;
          this.dataSource2 = new MatTableDataSource<IAllFMEAList>(this.ELEMENT_DATA);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        });

        this.untoggleFilter();

    }

    clearFilter(): void{
      this.taskId = "";
      this.tasktypeId = 0;
      this.frequencyId = 0;
      this.variantid = 0;
      this.classTaxonomyid = 0;
      this.buildSpecTaxonomyid = 0;
      this.failuremode = "";
      this.tradetypeId = 0;
      this.durationid = 0;
      this.familyTaxonomyid = 0;
      this.subClassTaxonomyid = 0;
      this.manufacturerTaxonomyid = 0;

      // this.fmDataClick(this.componentId, this.componentFailureMode);
    }

    saveChanges(){
      this.fmeaObject.componentHierarchyId = this.componentHierarchyId;
      this.fmeaObject.systemDescription = this.assetClassType;
      this.fmeaObject.componentLevel1Id = this.componentLevel1Id;
      // this.fmeaObject.componentLevel2Id = this.componentLevel2Id;
      // this.fmeaObject.componentLevel3Id = this.componentLevel3Id;
      this.fmeaObject.componentTaskFunction = this.componentTaskFunction;
      this.fmeaObject.failureMode = this.failureMode;
      this.fmeaObject.failureEffect = this.failureEffect;
      this.fmeaObject.failureCause = this.failureCause;
      this.fmeaObject.endEffect = this.endEffect;
      this.fmeaObject.taskDescription = this.taskDescription;
      this.fmeaObject.acceptableLimits = this.acceptableLimits;
      this.fmeaObject.correctiveActions = this.correctiveActions;
      this.fmeaObject.taskTypeId = this.taskTypeId;
      this.fmeaObject.operationalModeId = this.operationalModeId;
      this.fmeaObject.failureRiskTotalScore = this.failureRiskTotalScore;
      this.fmeaObject.intervalId = this.intervalId;
      this.fmeaObject.durationId = this.durationId;
      this.fmeaObject.resourceQuantity = this.resourceQuantity;
      this.fmeaObject.tradeTypeId = this.tradeTypeId;
      this.fmeaObject.origIndic = 2;
      this.fmeaObject.parentCode = this.taskIdentificationNo;
      this.fmeaObject.taskIdentificationNo = "";

      this._fmeaService.addFMEA(this.fmeaObject)
          .subscribe(res =>{
              console.log(res);
              this.fmeaObject.taskIdentificationNo = "FFTV.000.00" + res.id;
              this.fmeaObject.id = res.id;
              this._fmeaService.updateFMEARecords(this.fmeaObject.id, this.fmeaObject)
                  .subscribe(out => {
                      this.toastr.success("Variant successfully created!", 'Success');
                      this.nodeClick(this.componentId);
                      this.fmDataClick(this.componentId, this.componentFailureMode)

                  });
          });
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

    addColumn(){
      if (this.tableTaskId === true) {
        if (this.displayedColumns.length) {
          // this.displayedColumns.splice(1, 1, "code");
          this.displayedColumns.push('taskIdentificationNo');
        }
      } else {
        this.removeColumn('taskIdentificationNo');
      }

      if (this.tableParent === true) {
        if (this.displayedColumns.length) {
          // this.displayedColumns.splice(1, 1, "code");
          this.displayedColumns.push('parentCode');
        }
      } else {
        this.removeColumn('parentCode');
      }

      if (this.tableFailureMode === true) {
        if (this.displayedColumns.length) {
          // this.displayedColumns.splice(1, 1, "code");
          this.displayedColumns.push('failureMode');
        }
      } else {
        this.removeColumn('failureMode');
      }

      if (this.tableTaskDesc === true) {
        if (this.displayedColumns.length) {
          // this.displayedColumns.splice(1, 1, "code");
          this.displayedColumns.push('taskDescription');
        }
      } else {
        this.removeColumn('taskDescription');
      }

      if (this.tableFailureRiskScore === true) {
        if (this.displayedColumns.length) {
          // this.displayedColumns.splice(1, 1, "code");
          this.displayedColumns.push('failureRiskTotalScore');
        }
      } else {
        this.removeColumn('failureRiskTotalScore');
      }

      if (this.tableAcceptableLimits === true) {
        if (this.displayedColumns.length) {
          // this.displayedColumns.splice(1, 1, "code");
          this.displayedColumns.push('acceptableLimits');
        }
      } else {
        this.removeColumn('acceptableLimits');
      }

      if (this.tableCorrective === true) {
        if (this.displayedColumns.length) {
          // this.displayedColumns.splice(1, 1, "code");
          this.displayedColumns.push('correctiveActions');
        }
      } else {
        this.removeColumn('correctiveActions');
      }

      if (this.tableTaskType === true) {
        if (this.displayedColumns.length) {
          // this.displayedColumns.splice(1, 1, "code");
          this.displayedColumns.push('taskTypeName');
        }
      } else {
        this.removeColumn('taskTypeName');
      }

      if (this.tableInterval === true) {
        if (this.displayedColumns.length) {
          // this.displayedColumns.splice(1, 1, "code");
          this.displayedColumns.push('frequencyName');
        }
      } else {
        this.removeColumn('frequencyName');
      }

      if (this.tableFamily === true) {
        if (this.displayedColumns.length) {
          // this.displayedColumns.splice(1, 1, "code");
          this.displayedColumns.push('familyComponent');
        }
      } else {
        this.removeColumn('familyComponent');
      }

      if (this.tableClass === true) {
        if (this.displayedColumns.length) {
          // this.displayedColumns.splice(1, 1, "code");
          this.displayedColumns.push('componentClass');
        }
      } else {
        this.removeColumn('componentClass');
      }

      if (this.tableSubClass === true) {
        if (this.displayedColumns.length) {
          // this.displayedColumns.splice(1, 1, "code");
          this.displayedColumns.push('subClass');
        }
      } else {
        this.removeColumn('subClass');
      }

      if (this.tableBuildSpec === true) {
        if (this.displayedColumns.length) {
          // this.displayedColumns.splice(1, 1, "code");
          this.displayedColumns.push('buildSpec');
        }
      } else {
        this.removeColumn('buildSpec');
      }

      if (this.tableManufacturer === true) {
        if (this.displayedColumns.length) {
          // this.displayedColumns.splice(1, 1, "code");
          this.displayedColumns.push('componentManufacturer');
        }
      } else {
        this.removeColumn('componentManufacturer');
      }

      // localStorage.setItem("displaycolumns", JSON.stringify(this.displayedColumns))
    }

    addColumnTaskId() {
      if (this.tableTaskId === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(1, 0, "taskIdentificationNo");
          // this.displayedColumns.push('taskIdentificationNo');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('taskidNo');
          localStorage.setItem('taskidNo', JSON.stringify(true))
        }
      } else {
        this.removeColumn('taskIdentificationNo');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('taskidNo');
        localStorage.setItem('taskidNo', JSON.stringify(false))
      }
    }

    addColumnParent() {
      if (this.tableParent === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(2, 0, "parentCode");
          // this.displayedColumns.push('parentCode');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('parent');
          localStorage.setItem('parent', JSON.stringify(true))
        }
      } else {
        this.removeColumn('parentCode');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('parent');
        localStorage.setItem('parent', JSON.stringify(false))
      }
    }

    addColumnFailureMode() {
      if (this.tableFailureMode === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(8, 0, "failureMode");
          // this.displayedColumns.push('failureMode');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('fmode');
          localStorage.setItem('fmode', JSON.stringify(true))
        }
      } else {
        this.removeColumn('failureMode');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('fmode');
        localStorage.setItem('fmode', JSON.stringify(false))
      }
    }

    addColumnTaskDesc() {
      if (this.tableTaskDesc === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(9, 0, "taskDescription");
          // this.displayedColumns.push('taskDescription');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('desc');
          localStorage.setItem('desc', JSON.stringify(true))
        }
      } else {
        this.removeColumn('taskDescription');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('desc');
        localStorage.setItem('desc', JSON.stringify(false))
      }
    }

    addColumnFailureRiskScore() {
      if (this.tableFailureRiskScore === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(10, 0, "failureRiskTotalScore");
          // this.displayedColumns.push('failureRiskTotalScore');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('fscore');
          localStorage.setItem('fscore', JSON.stringify(true))
        }
      } else {
        this.removeColumn('failureRiskTotalScore');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('fscore');
        localStorage.setItem('fscore', JSON.stringify(false))
      }
    }

    addColumnAcceptableLimits() {
      if (this.tableAcceptableLimits === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(11, 0, "acceptableLimits");
          // this.displayedColumns.push('acceptableLimits');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('limits');
          localStorage.setItem('limits', JSON.stringify(true))
        }
      } else {
        this.removeColumn('acceptableLimits');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('limits');
        localStorage.setItem('limits', JSON.stringify(false))
      }
    }

    addColumnCorrectiveActions() {
      if (this.tableCorrective === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(12, 0, "correctiveActions");
          // this.displayedColumns.push('correctiveActions');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('corrective');
          localStorage.setItem('corrective', JSON.stringify(true))
        }
      } else {
        this.removeColumn('correctiveActions');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('corrective');
        localStorage.setItem('corrective', JSON.stringify(false))
      }
    }

    addColumnTaskType() {
      if (this.tableTaskType === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(13, 0, "taskTypeName");
          // this.displayedColumns.push('taskTypeName');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('tasktype');
          localStorage.setItem('tasktype', JSON.stringify(true))
        }
      } else {
        this.removeColumn('taskTypeName');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tasktype');
        localStorage.setItem('tasktype', JSON.stringify(false))
      }
    }

    addColumnFrequency() {
      if (this.tableInterval === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(14, 0, "frequencyName");
          // this.displayedColumns.push('frequencyName');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('interval');
          localStorage.setItem('interval', JSON.stringify(true))
        }
      } else {
        this.removeColumn('frequencyName');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('interval');
        localStorage.setItem('interval', JSON.stringify(false))
      }
    }

    addColumnFamily() {
      if (this.tableFamily === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(3, 0, "familyComponent");
          // this.displayedColumns.push('familyComponent');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('mainunit');
          localStorage.setItem('mainunit', JSON.stringify(true))
        }
      } else {
        this.removeColumn('familyComponent');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('mainunit');
        localStorage.setItem('mainunit', JSON.stringify(false))
      }
    }

    addColumnClass() {
      if (this.tableClass === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(4, 0, "componentClass");
          // this.displayedColumns.push('componentClass');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('maintitem');
          localStorage.setItem('maintitem', JSON.stringify(true))
        }
      } else {
        this.removeColumn('componentClass');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('maintitem');
        localStorage.setItem('maintitem', JSON.stringify(false))
      }
    }

    addColumnSubClass() {
      if (this.tableSubClass === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(5, 0, "subClass");
          // this.displayedColumns.push('subClass');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('maintsubitem');
          localStorage.setItem('maintsubitem', JSON.stringify(true))
        }
      } else {
        this.removeColumn('subClass');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('maintsubitem');
        localStorage.setItem('maintsubitem', JSON.stringify(false))
      }
    }

    addColumnBuildSpec() {
      if (this.tableBuildSpec === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(6, 0, "buildSpec");
          // this.displayedColumns.push('buildSpec');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('buildspec');
          localStorage.setItem('buildspec', JSON.stringify(true))
        }
      } else {
        this.removeColumn('buildSpec');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('buildspec');
        localStorage.setItem('buildspec', JSON.stringify(false))
      }
    }

    addColumnManufacturer() {
      if (this.tableManufacturer === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(7, 0, "componentManufacturer");
          // this.displayedColumns.push('componentManufacturer');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('manufacture');
          localStorage.setItem('manufacture', JSON.stringify(true))
        }
      } else {
        this.removeColumn('componentManufacturer');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('manufacture');
        localStorage.setItem('manufacture', JSON.stringify(false))
      }
    }

    addColumnFunctionStatement() {
      if (this.tableComponentTaskFunction === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(15, 0, "componentTaskFunction");
          // this.displayedColumns.push('componentManufacturer');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('functionstatement');
          localStorage.setItem('functionstatement', JSON.stringify(true))
        }
      } else {
        this.removeColumn('componentTaskFunction');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('functionstatement');
        localStorage.setItem('functionstatement', JSON.stringify(false))
      }
    }

    addColumnFailureEffect() {
      if (this.tableFailureEffect === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(16, 0, "failureEffect");
          // this.displayedColumns.push('componentManufacturer');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('fEffect');
          localStorage.setItem('fEffect', JSON.stringify(true))
        }
      } else {
        this.removeColumn('failureEffect');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('fEffect');
        localStorage.setItem('fEffect', JSON.stringify(false))
      }
    }

    addColumnFailureCause() {
      if (this.tableFailureCause === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(17, 0, "failureCause");
          // this.displayedColumns.push('componentManufacturer');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('fCause');
          localStorage.setItem('fCause', JSON.stringify(true))
        }
      } else {
        this.removeColumn('failureCause');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('fCause');
        localStorage.setItem('fCause', JSON.stringify(false))
      }
    }

    addColumnOperationalMode() {
      if (this.tableOperationalMode === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(18, 0, "operationalModeName");
          // this.displayedColumns.push('componentManufacturer');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('opMode');
          localStorage.setItem('opMode', JSON.stringify(true))
        }
      } else {
        this.removeColumn('operationalModeName');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('opMode');
        localStorage.setItem('opMode', JSON.stringify(false))
      }
    }

    addColumnDuration() {
      if (this.tableDuration === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(19, 0, "durationName");
          // this.displayedColumns.push('componentManufacturer');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('durationname');
          localStorage.setItem('durationname', JSON.stringify(true))
        }
      } else {
        this.removeColumn('durationName');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('durationname');
        localStorage.setItem('durationname', JSON.stringify(false))
      }
    }

    addColumnTradeType() {
      if (this.tableTradeType === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(20, 0, "tradeTypeName");
          // this.displayedColumns.push('componentManufacturer');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('tradetype');
          localStorage.setItem('tradetype', JSON.stringify(true))
        }
      } else {
        this.removeColumn('tradeTypeName');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tradetype');
        localStorage.setItem('tradetype', JSON.stringify(false))
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
        if(this.canAccess('DeleteFMEA')) {
          this._fmeaAssemblyService.getAllFmeaAssemblyByFMMTId(id)
            .subscribe(out => {
              console.log(out)
              if(out.length > 0)
              {
                this.toastr.warning('Unable to delete because there are tasks associated with this task', '');
              }else{
                if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
                  this._fmeaService.deleteFMEA(id)
                  .subscribe(out => {
                    this.toastr.success('Deleted successfully', 'Success!');
                    this.fmDataClick(this.componentId, this.componentFailureMode);
                  });
                }
              }
            })
        }else{
          this.toastr.warning('You do not have permission to perform this action.', '');
        }
        
    }
}



