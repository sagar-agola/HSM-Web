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
import { IAllFMEAList, IFMEA, IFmeaAssembly, IFMEAList } from '../interfaces/IFMEA';
import { FMEAService } from '../services/fmea.services';
import { fmeaAssemblyDefault, fmeaDefault } from 'src/app/shared/helpers/default.helpers';
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
import { AssignTaskModalComponent } from '../modal/assigntaskmodal/assigntaskmodal.component';
import { FmeaAssemblyService } from '../services/fmeaassembly.services';
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';

interface RootObject {
  hierarchy: ComponentHierarchy[];
}

interface ComponentHierarchy {
  Id: number,
  CategoryName: string;  
  Children?: ComponentHierarchy[];
}

interface ExampleFlatNode {
  expandable: boolean;
  id: number;
  name: string;
  level: number;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA_TEST: PeriodicElement[] = [
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
    selector: "fmea",
    templateUrl: './fmea.component.html',
    styleUrls: [
        './fmea.component.scss'
    ]
})

export class FMEAComponent implements OnInit {
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('tableColumn') public tableColumn: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns: string[] = ['taskIdentificationNo', 'parentCode', 'familyComponent', 'componentClass', 'subClass', 'buildSpec', 'componentManufacturer', 'failureMode', 'taskDescription', 'failureRiskTotalScore', 'acceptableLimits', 'correctiveActions', 'taskTypeName', 'frequencyName', 'deleteFM'];
    //'systemStatus',
    displayedColumnsNames: string[] = ['Task ID', 'Parent', 'Failure Mode', 'Task Description', 'Failure Risk Score', 'Acceptable Limits', 'Corrective Action', 'Task Type', 'Interval'];
    // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    dataSource3 = ELEMENT_DATA_TEST;

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
    systemStatusList: any[] = [];
    failureModeList: any[] = [];
    taskIdList: any[] = [];

    fmeaObject: IFMEA = fmeaDefault();
    fmmtObject: IFmeaAssembly = fmeaAssemblyDefault();

    loading: boolean = false;
    default: boolean = false;
    isLoading: boolean = true;

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
    status: number = 0;

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
    
    taskNo: number = 0;

    public data: [];

    hierarchy: RootObject;

    private _transformer = (node: ComponentHierarchy, level: number) => {
      return {
        expandable: !!node.Children && node.Children.length > 0,
        id: node.Id,
        name: node.CategoryName,
        level: level,
      };
    }

    treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

    treeFlattener = new MatTreeFlattener(
        this._transformer, node => node.level, node => node.expandable, node => node.Children);

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    TREE_DATA: ComponentHierarchy[] = [];


    myControl = new FormControl();

    constructor(
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
        private _fmeaAssemblyService: FmeaAssemblyService,
        private userPermissionService: PermissionManagerService
        ) { 
        }

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

    canAccess(roleKey: string): boolean {
      let access: boolean = false;
      access = this.userPermissionService.isGranted(roleKey);
      return access;
    }
    
    ngOnInit(): void {
      localStorage.removeItem("functionstatementhsm");
      localStorage.removeItem("fEffecthsm");
      localStorage.removeItem("fCausehsm");
      localStorage.removeItem("opModehsm");
      localStorage.removeItem("durationnamehsm");
      localStorage.removeItem("tradetypehsm");

      var newdisplaycolumn = JSON.parse(localStorage.getItem('activeColshsm'));
      var taskval = JSON.parse(localStorage.getItem('taskidNohsm'));
      var parentc = JSON.parse(localStorage.getItem('parenthsm'));
      var failmode = JSON.parse(localStorage.getItem('fmodehsm'));
      var taskdesc = JSON.parse(localStorage.getItem('deschsm'));
      var failscore = JSON.parse(localStorage.getItem('fscorehsm'));
      var acclimits = JSON.parse(localStorage.getItem('limitshsm'));
      var correctives = JSON.parse(localStorage.getItem('correctivehsm'));
      var ttype = JSON.parse(localStorage.getItem('tasktypehsm'));
      var frequency = JSON.parse(localStorage.getItem('intervalhsm'));
      var maintUnit = JSON.parse(localStorage.getItem('mainunithsm'));
      var maintItem = JSON.parse(localStorage.getItem('maintitemhsm'));
      var maintSub = JSON.parse(localStorage.getItem('maintsubitemhsm'));
      var buildspec = JSON.parse(localStorage.getItem('buildspechsm'));
      var manufacturer = JSON.parse(localStorage.getItem('manufacturehsm'));
      var funcstatement = JSON.parse(localStorage.getItem('functionstatementhsm'));
      var faileffect = JSON.parse(localStorage.getItem('fEffecthsm'));
      var failcause = JSON.parse(localStorage.getItem('fCausehsm'));
      var operationmode = JSON.parse(localStorage.getItem('opModehsm'));
      var duration = JSON.parse(localStorage.getItem('durationnamehsm'));
      var tradetype = JSON.parse(localStorage.getItem('tradetypehsm'));

      localStorage.removeItem("assetclass");
      localStorage.removeItem("manufacturer");
      localStorage.removeItem("subclass");
      localStorage.removeItem("buildspec");
      localStorage.removeItem("familyId");
      localStorage.removeItem("classId");
      localStorage.removeItem("subClassId");
      localStorage.removeItem("buildSpecId");
      localStorage.removeItem("manufacturerId");
      localStorage.removeItem("CREATEHSMFMEA");

      if(newdisplaycolumn !== null){
        this.displayedColumns =  JSON.parse(localStorage.getItem('activeColshsm'));
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

      this._categoryHierarchyService.getComponentCategoryHierarchy()
        .subscribe( res => {    
          this.dataSource.data = JSON.parse(res['hierarchy']);
        });

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
              this.statusList = fm;
              this.isLoading = false;
          });

        this.default = true;
    }

    toggleMin(){
      this.isMin = true;
      this.isMax = false;
    }

    toggleMax(){
      this.isMin = false;
      this.isMax = true;
    }

    clickAllAsset(){
      this._fmeaAssemblyService.getAllFmeaAssemblyTaskList()
        .subscribe(res =>{
          this.loading = false;
          this.default = false;
          this.ELEMENT_DATA = res;
          this.dataSource2 = new MatTableDataSource<IAllFMEAList>(this.ELEMENT_DATA);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        });
    }

    nodeClick(node: any){
      this.componentId = node.id;
      // console.log(this.componentId)
      this.componentName = node.name;
      // localStorage.setItem("component", this.componentName);

      this.isClicked = true;
      this.isLoading = true;
    // console.log(this.componentId)

    this._categoryHierarchyService.getComponentById(this.componentId)
      .subscribe(out => {
        this.componentCode = out.categoryCode;

        this._fmeaAssemblyService.getFmeaAssemblyTaskList(this.componentId)
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
              this.isLoading = false;

              if(this.componentLevel4 !== null || this.componentLevel4 !== '')
              {
                  this.componentHierarchyCode = this.componentLevel1 + '- ' + this.componentLevel2 + '- ' + this.componentLevel3;
              }
              
              if((this.componentLevel4 === null || this.componentLevel4 === '') && (this.componentLevel3 !== null || this.componentLevel3 !== ''))
              {
                  this.componentHierarchyCode = this.componentLevel1 + '- '  + this.componentLevel2 + '- ' + this.componentLevel3;
              }

              if((this.componentLevel2 !== null || this.componentLevel2 !== '') && (this.componentLevel4 === null || this.componentLevel4 === '') && (this.componentLevel3 === null || this.componentLevel3 === ''))
              {
                  this.componentHierarchyCode = this.componentLevel1 + '- '  + this.componentLevel2;
              }

              if((this.componentLevel1 !== null || this.componentLevel1 !== '') && (this.componentLevel2 === null || this.componentLevel2 === '') && (this.componentLevel4 === null || this.componentLevel4 === '') && (this.componentLevel3 === null || this.componentLevel3 === ''))
              {
                  this.componentHierarchyCode = this.componentLevel1;
              }
          });
      });

      this._fmeaAssemblyService.getDropdownMaintUnitList(this.componentId)
        .subscribe(f => {
          this.familyTaxonomyList = f.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });

      this._fmeaAssemblyService.getDropdownMaintItemList(this.componentId)
        .subscribe(cl => {
          this.classTaxonomyList = cl.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });

      this._fmeaAssemblyService.getDropdownSubItemList(this.componentId)
        .subscribe(sc => {
          this.subClassTaxonomyList = sc.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });

      this._fmeaAssemblyService.getDropdownBuildSpecList(this.componentId)
        .subscribe(bs => {
          this.buildSpecTaxonomyList = bs.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });

      this._fmeaAssemblyService.getDropdownManufacturerList(this.componentId)
        .subscribe(mf => {
          this.manufacturerTaxonomyList = mf.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });

      this._fmeaAssemblyService.getDropdownTaskTypeList(this.componentId)
        .subscribe(tt => {
          this.taskTypeList = tt.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });

      this._fmeaAssemblyService.getDropdownTradeTypeList(this.componentId)
        .subscribe(ty => {
          this.tradeTypeList = ty.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });

      this._fmeaAssemblyService.getDropdownFrequencyList(this.componentId)
        .subscribe(fr => {
          this.frequencyList = fr.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });

      this._fmeaAssemblyService.getDropdownDurationList(this.componentId)
        .subscribe(dr => {
          this.durationList = dr.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });

      this._fmeaAssemblyService.getDropdownStatusList(this.componentId)
        .subscribe(ss => {
          this.systemStatusList = ss.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });
    }

    onKeyupTask(name: string){
      if(name !== '')
      {
          this._fmeaAssemblyService.getDropdownTaskIdList(name, this.componentId)
          .subscribe(res => {
              // console.log(res)
              this.taskIdList = res;
              
          })
      }else{
          return false;
      }
    }

    onKeyupFailurmode(name: string){
      if(name !== '')
      {
          this._fmeaAssemblyService.getDropdownFailureList(name, this.componentId)
          .subscribe(res => {
              // console.log(res)
              this.failureModeList = res;
              
          })
      }else{
          return false;
      }
    }

    mapStatusData(id: number): string {
      let retData = "";
      retData = this.statusList.find(e => e.id === id);
      return retData;
    }

    statusOnSelect(event, id: number){
      this.statusId = parseInt(event.value);

      this._fmeaAssemblyService.getFmeaAsseblyTaskById(id)
        .subscribe(res => {
          // console.log(res[0])
          this.fmmtObject = res[0];
          this.fmmtObject.systemStatus = res[0].systemStatus;
          console.log(this.fmmtObject)

          // this._fmeaAssemblyService.updateFmeaAssemblyRecords(id, this.fmmtObject)
          //   .subscribe( out => {
          //       this.nodeClick(this.componentName);
          //   })
        })

    }

    systemStatusOnSelect(event){
      this.status = parseInt(event.target.value);

      // console.log(this.tasktypeId)
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

      this._fmeaAssemblyService.getDropdownSubMaintItemByItemIdList(this.componentId, this.classTaxonomyid)
        .subscribe(res => {
            this.subClassTaxonomyList = res;
        });
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
            });
      }else{
        this.isChecked = false;
      }
          
  }

    onViewdetails(): void{
        this.router.navigate(["/main/fmea-form"]);
    }

    goToFMEAEdit(id: number): void{
      if(this.canAccess('ReviewAssetClass')) {
        this.router.navigate(["/main/fmea-view", id]);
      }else {
        this.toastr.warning('You do not have permission to perform this action.', '');
      }
      
    }

    onRightClick() {
      return true;
    }

    openDialog(mode: any) {
      if(this.canAccess('AssignFMEA')) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.minWidth = "90vw";
        dialogConfig.minHeight = "90vh";
        dialogConfig.width = "90vw";
        dialogConfig.height = "90vh";
        dialogConfig.data = { mode: mode, item: this.componentId};
        this._dataService.setData(dialogConfig.data);
        dialogConfig.position = { top: '30px' };
        const dialogRef = this.dialog.open(AssignTaskModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
          this._fmeaAssemblyService.getFmeaAssemblyTaskList(this.componentId)
            .subscribe(res => {
              // console.log(res)
              this.loading = false;
              this.default = false;
              this.ELEMENT_DATA = res;
              this.dataSource2 = new MatTableDataSource<IAllFMEAList>(this.ELEMENT_DATA);
              this.dataSource2.paginator = this.paginator;
              this.dataSource2.sort = this.sort;
            });
        });
      }
      else {
        this.toastr.warning('You do not have permission to perform this action.', '');
      }
    }

    openDialogCreateFMEA(node: any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {item: node };
      dialogConfig.width = "600px";
      dialogConfig.height = "auto";
      dialogConfig.position = { top: '30px' };
      const dialogRef = this.dialog.open(CreateNewFMEAModalComponent, dialogConfig);
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
      this._fmeaAssemblyService.getFmeaAssemblyListFilters(this.taskId, this.failuremode, this.tasktypeId, this.tradetypeId, this.frequencyId, this.durationid, this.variantid, this.familyTaxonomyid, this.classTaxonomyid, this.subClassTaxonomyid, this.buildSpecTaxonomyid, this.manufacturerTaxonomyid)
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
              this.fmeaObject.taskIdentificationNo = "FFTV.00000" + res.id;
              this.fmeaObject.id = res.id;
              this._fmeaService.updateFMEARecords(this.fmeaObject.id, this.fmeaObject)
                  .subscribe(out => {
                      this.toastr.success("Variant successfully created!", 'Success');
                      this.nodeClick(this.componentId);

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

    addColumnTaskId() {
      if (this.tableTaskId === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(0, 0, "taskIdentificationNo");
          // this.displayedColumns.push('taskIdentificationNo');
          localStorage.removeItem('activeColshsm');
          localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('taskidNohsm');
          localStorage.setItem('taskidNohsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('taskIdentificationNo');
        localStorage.removeItem('activeColshsm');
        localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('taskidNohsm');
        localStorage.setItem('taskidNohsm', JSON.stringify(false))
      }
    }

    addColumnParent() {
      if (this.tableParent === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(1, 0, "parentCode");
          // this.displayedColumns.push('parentCode');
          localStorage.removeItem('activeColshsm');
          localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('parenthsm');
          localStorage.setItem('parenthsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('parentCode');
        localStorage.removeItem('activeColshsm');
        localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('parenthsm');
        localStorage.setItem('parenthsm', JSON.stringify(false))
      }
    }

    addColumnFailureMode() {
      if (this.tableFailureMode === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(7, 0, "failureMode");
          // this.displayedColumns.push('failureMode');
          localStorage.removeItem('activeColshsm');
          localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('fmodehsm');
          localStorage.setItem('fmodehsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('failureMode');
        localStorage.removeItem('activeColshsm');
        localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('fmodehsm');
        localStorage.setItem('fmodehsm', JSON.stringify(false))
      }
    }

    addColumnTaskDesc() {
      if (this.tableTaskDesc === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(8, 0, "taskDescription");
          // this.displayedColumns.push('taskDescription');
          localStorage.removeItem('activeColshsm');
          localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('deschsm');
          localStorage.setItem('deschsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('taskDescription');
        localStorage.removeItem('activeColshsm');
        localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('deschsm');
        localStorage.setItem('deschsm', JSON.stringify(false))
      }
    }

    addColumnFailureRiskScore() {
      if (this.tableFailureRiskScore === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(9, 0, "failureRiskTotalScore");
          // this.displayedColumns.push('failureRiskTotalScore');
          localStorage.removeItem('activeColshsm');
          localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('fscorehsm');
          localStorage.setItem('fscorehsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('failureRiskTotalScore');
        localStorage.removeItem('activeColshsm');
        localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('fscorehsm');
        localStorage.setItem('fscorehsm', JSON.stringify(false))
      }
    }

    addColumnAcceptableLimits() {
      if (this.tableAcceptableLimits === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(10, 0, "acceptableLimits");
          // this.displayedColumns.push('acceptableLimits');
          localStorage.removeItem('activeColshsm');
          localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('limitshsm');
          localStorage.setItem('limitshsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('acceptableLimits');
        localStorage.removeItem('activeColshsm');
        localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('limitshsm');
        localStorage.setItem('limitshsm', JSON.stringify(false))
      }
    }

    addColumnCorrectiveActions() {
      if (this.tableCorrective === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(11, 0, "correctiveActions");
          // this.displayedColumns.push('correctiveActions');
          localStorage.removeItem('activeColshsm');
          localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('correctivehsm');
          localStorage.setItem('correctivehsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('correctiveActions');
        localStorage.removeItem('activeColshsm');
        localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('correctivehsm');
        localStorage.setItem('correctivehsm', JSON.stringify(false))
      }
    }

    addColumnTaskType() {
      if (this.tableTaskType === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(12, 0, "taskTypeName");
          // this.displayedColumns.push('taskTypeName');
          localStorage.removeItem('activeColshsm');
          localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('tasktypehsm');
          localStorage.setItem('tasktypehsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('taskTypeName');
        localStorage.removeItem('activeColshsm');
        localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tasktypehsm');
        localStorage.setItem('tasktypehsm', JSON.stringify(false))
      }
    }

    addColumnFrequency() {
      if (this.tableInterval === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(13, 0, "frequencyName");
          // this.displayedColumns.push('frequencyName');
          localStorage.removeItem('activeColshsm');
          localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('intervalhsm');
          localStorage.setItem('intervalhsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('frequencyName');
        localStorage.removeItem('activeColshsm');
        localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('intervalhsm');
        localStorage.setItem('intervalhsm', JSON.stringify(false))
      }
    }

    addColumnFamily() {
      if (this.tableFamily === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(2, 0, "familyComponent");
          // this.displayedColumns.push('familyComponent');
          localStorage.removeItem('activeColshsm');
          localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('mainunithsm');
          localStorage.setItem('mainunithsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('familyComponent');
        localStorage.removeItem('activeColshsm');
        localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('mainunithsm');
        localStorage.setItem('mainunithsm', JSON.stringify(false))
      }
    }

    addColumnClass() {
      if (this.tableClass === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(3, 0, "componentClass");
          // this.displayedColumns.push('componentClass');
          localStorage.removeItem('activeColshsm');
          localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('maintitemhsm');
          localStorage.setItem('maintitemhsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('componentClass');
        localStorage.removeItem('activeColshsm');
        localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('maintitemhsm');
        localStorage.setItem('maintitemhsm', JSON.stringify(false))
      }
    }

    addColumnSubClass() {
      if (this.tableSubClass === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(4, 0, "subClass");
          // this.displayedColumns.push('subClass');
          localStorage.removeItem('activeColshsm');
          localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('maintsubitemhsm');
          localStorage.setItem('maintsubitemhsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('subClass');
        localStorage.removeItem('activeColshsm');
        localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('maintsubitemhsm');
        localStorage.setItem('maintsubitemhsm', JSON.stringify(false))
      }
    }

    addColumnBuildSpec() {
      if (this.tableBuildSpec === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(5, 0, "buildSpec");
          // this.displayedColumns.push('buildSpec');
          localStorage.removeItem('activeColshsm');
          localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('buildspechsm');
          localStorage.setItem('buildspechsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('buildSpec');
        localStorage.removeItem('activeColshsm');
        localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('buildspechsm');
        localStorage.setItem('buildspechsm', JSON.stringify(false))
      }
    }

    addColumnManufacturer() {
      if (this.tableManufacturer === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(6, 0, "componentManufacturer");
          // this.displayedColumns.push('componentManufacturer');
          localStorage.removeItem('activeColshsm');
          localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('manufacturehsm');
          localStorage.setItem('manufacturehsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('componentManufacturer');
        localStorage.removeItem('activeColshsm');
        localStorage.setItem('activeColshsm', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('manufacturehsm');
        localStorage.setItem('manufacturehsm', JSON.stringify(false))
      }
    }
    
    addColumnFunctionStatement() {
      if (this.tableComponentTaskFunction === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(15, 0, "componentTaskFunction");
          // this.displayedColumns.push('componentManufacturer');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('functionstatementhsm');
          localStorage.setItem('functionstatementhsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('componentTaskFunction');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('functionstatementhsm');
        localStorage.setItem('functionstatementhsm', JSON.stringify(false))
      }
    }

    addColumnFailureEffect() {
      if (this.tableFailureEffect === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(16, 0, "failureEffect");
          // this.displayedColumns.push('componentManufacturer');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('fEffecthsm');
          localStorage.setItem('fEffecthsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('failureEffect');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('fEffecthsm');
        localStorage.setItem('fEffecthsm', JSON.stringify(false))
      }
    }

    addColumnFailureCause() {
      if (this.tableFailureCause === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(17, 0, "failureCause");
          // this.displayedColumns.push('componentManufacturer');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('fCausehsm');
          localStorage.setItem('fCausehsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('failureCause');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('fCausehsm');
        localStorage.setItem('fCausehsm', JSON.stringify(false))
      }
    }

    addColumnOperationalMode() {
      if (this.tableOperationalMode === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(18, 0, "operationalModeName");
          // this.displayedColumns.push('componentManufacturer');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('opModehsm');
          localStorage.setItem('opModehsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('operationalModeName');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('opModehsm');
        localStorage.setItem('opModehsm', JSON.stringify(false))
      }
    }

    addColumnDuration() {
      if (this.tableDuration === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(19, 0, "durationName");
          // this.displayedColumns.push('componentManufacturer');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('durationnamehsm');
          localStorage.setItem('durationnamehsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('durationName');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('durationnamehsm');
        localStorage.setItem('durationnamehsm', JSON.stringify(false))
      }
    }

    addColumnTradeType() {
      if (this.tableTradeType === true) {
        if (this.displayedColumns.length) {
          this.displayedColumns.splice(20, 0, "tradeTypeName");
          // this.displayedColumns.push('componentManufacturer');
          localStorage.removeItem('activeCols');
          localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('tradetypehsm');
          localStorage.setItem('tradetypehsm', JSON.stringify(true))
        }
      } else {
        this.removeColumn('tradeTypeName');
        localStorage.removeItem('activeCols');
        localStorage.setItem('activeCols', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tradetypehsm');
        localStorage.setItem('tradetypehsm', JSON.stringify(false))
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
        if(this.canAccess('DeleteAssetClass')) {
          this._fmeaAssemblyService.getAllAssetClassAttachByTaskId(id)
            .subscribe(out => {
              console.log(out)
              if(out.length > 0)
              {
                this.toastr.warning('Unable to delete this tasks because it is attached or assigned in the task group strategy', '');
              }else{
                if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
                  this._fmeaAssemblyService.deleteFMEA(id)
                  .subscribe(out => {
                    this.toastr.success('Deleted successfully', 'Success!');
                    this._categoryHierarchyService.getComponentById(this.componentId)
                        .subscribe(out => {
                          this.componentCode = out.categoryCode;
        
                          this._fmeaAssemblyService.getFmeaAssemblyTaskList(this.componentId)
                          .subscribe(res => {
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
                  });
                }
              }
            });
          
        }else {
          this.toastr.warning('You do not have permission to perform this action.', '');
        }
        
    }
}



