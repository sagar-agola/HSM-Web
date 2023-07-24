import { Component, Inject, OnInit, ElementRef, ViewChild, Output, EventEmitter, HostListener, Renderer2,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import {ArrayDataSource, SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle} from '@angular/cdk/drag-drop';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { MultiFilterModalComponent } from '../../modal/multifiltermodal/multifiltermodal.component';

//Services
import { AssetTaskGroupStrategyService } from '../../services/assettaskgroupstrategy.services';
import { FrequencyService } from '../../services/frequency.services';
import { DurationService } from '../../services/duration.services';
import { OperationalModeService } from '../../services/operationalmode.services';
import { TradeTypeService } from '../../services/tradetype.services';
import { TaskTypeService } from '../../services/tasktype.services';
import { TaxonomyCategoryService } from '../../services/taxonomycategory.services';
import { TaxonomyClassService} from '../../services/taxonomyclass.services';
import { TaxonomyTypeService} from '../../services/taxonomytype.services';

//interface
import { IAddHierarchyToTask, IAssetTaskGroupStrategy, IAssetTaskGroupStrategyHsm, IAssignAssetTaskGroupStrategyHierarchy, IAssignAssetTaskGroupStrategyMaterial, IAssignAssetTaskGroupStrategyMaterialSite, IAssignAssetTaskGroupStrategyMaterialView, IAssignTaskToEquipment, IAssignTaskToEquipmentList } from './../../interfaces/IAssetTaskGroupStrategy';
import { IFrequency } from './../../interfaces/IFrequency';
import { IDuration} from './../../interfaces/IDuration';
import { IOperationalMode} from './../../interfaces/IOperationalMode';
import { ITradeType} from './../../interfaces/ITradeType';
import { ITaskType } from './../../interfaces/ITaskType';
import { ITaxonomyCategory } from './../../interfaces/ITaxonomyCategory';
import { ITaxonomyClass } from './../../interfaces/ITaxonomyClass';
import { ITaxonomyType } from './../../interfaces/ITaxonomyType';

import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { CategoryHierarchyService } from '../../services/categoryhierarchy.services';
import { IAllFMEAList, IFMEATaskAdded, IFMEATaskAddedList, IFMEATaskAddedSequence } from '../../interfaces/IFMEA';
import { FMEAService } from '../../services/fmea.services';

import { TaxonomyModalComponent } from '../../modal/taxonomymodal/taxonomymodal.component';
import { AssetHierarchyModalComponent } from '../../modal/assethierarchymodal/assethierarchymodal.component';
import { FMEATaskAddedService } from '../../services/fmeataskadded.services';
import { IAssetTaskGroupStrategySequence } from '../../interfaces/IAssetTaskGroupStrategySequence';
import { AssetTaskGroupStrategySequenceService } from '../../services/assettaskgroupstrategysequence.services';
import { IAssetHierarchy, IAssetHierarchyDataTaxonomy, IAssetHierarchyParam } from '../../interfaces/IAssetHierarchy';
import { AssetHierarchyIndustryService } from '../../services/assethierarchyindustry.services';
import { AssetHierarchyBusinessTypeService } from '../../services/assethierarchybusinesstype.services';
import { AssetHierarchyAssetTypeService } from '../../services/assethierarchyassettype.services';
import { AssetHierarchyProcessFunctionService } from '../../services/assethierarchyprocessfunction.services';
import { AssetHierarchyClassTaxonomyService } from '../../services/assethierarchyclasstaxonomy.services';
import { AssetHierarchySpecService } from '../../services/assethierarchyspec.services';
import { AssetHierarchyFamilyService } from '../../services/assethierarchyfamily.services';
import { AssetHierarchyManufacturerService } from '../../services/assethierarchymanufacturer.services';
import { ComponentFamilyService } from '../../services/componentfamily.services';
import { ComponentClassService } from '../../services/componentclass.services';
import { AssetHierarchyService } from '../../services/assethierarchy.services';
import { TempHierarchyService } from '../../services/temphierarchy.services';
import { AssignAssetTaskGroupStrategyHierarchyService } from '../../services/assignassettaskgroupstrategyhierarchy.services';
import { AddFlocModalComponent } from '../../modal/addflocmodal/addflocmodal.component';
import { AssignTaskGroupStrategyService } from '../../services/assigntaskgroupstrategy.services';
import { DataService } from 'src/app/shared/services/data.service';
import { AppSettings } from 'src/app/shared/app.settings';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AssignAssetTaskGroupStrategyMaterialService } from '../../services/assignassettaskgroupstrategymaterial.services';
import * as _ from 'lodash';
import { ComponentSubClassService } from '../../services/componentsubclass.services';
import { ComponentBuildSpecService } from '../../services/componentbuildspec.services';
import { ComponentManufacturerService } from '../../services/componentmanufacturer.services';
import { AssetCategoryService } from '../../services/assetcategory.services';
import { WorkInstructionTaskTypeService } from '../../services/workinstructiontasktype.services';
import { AddWorkInstructionModalComponent } from '../../modal/addworkinstructionmodal/addworkinstructionmodal.component';
import { AttachTaskModalComponent } from '../../modal/attachtaskmodal/attachtaskmodal.component';
import { AssetTaskGroupStrategyHsmService } from '../../services/assettaskgroupstrategyhsm.services';
import { AssignAssetTaskGroupStrategyMaterialHsmService } from '../../services/assignassettaskgroupstrategymaterialhsm.services';
import { ComponentTaskService } from '../../services/componenttask.services';
import { CommentModalComponent } from '../../modal/commentmodal/commentmodal.component';
import { IAssignGroupToUser } from '../../interfaces/IAssignGroupToUser';
import { AssignGroupToUserService } from '../../services/assigngrouptouser.services';
import { CategoryHierarchySiteService } from '../../services/categoryhierarchysite.services';
import { AssignAssetTaskGroupStrategyMaterialSiteService } from '../../services/assignassettaskgroupstrategymaterialsite.services';
import { AttachTaskSiteModalComponent } from '../../modal/attachtasksitemodal/attachtasksitemodal.component';

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

interface RootObject2 {
  hierarchy: AssetHierarchy[];
}

interface AssetHierarchy {
  Id: number,
  Code: string;
  Description: string;
  Children?: AssetHierarchy[];
}

export interface StaticElement {
  position: number,
  taskId: string;
  taskDescription: string;
  acceptableLimits: string;
  correctiveActions: string;
}

@Component({
  selector: "asset-task-group-site-edit",
  templateUrl: './assettaskgroupstrategysiteedit.component.html',
  styleUrls: [
      './assettaskgroupstrategysiteedit.component.scss'
  ]
})

export class AssetTaskGroupSiteEditComponent implements OnInit {
    public progress: number;
    public message: string;
    @Output() public onUploadFinished = new EventEmitter();
    
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild(MatTable, {read: ElementRef} ) private matTableRef: ElementRef;

    @ViewChild('tableColumn') public tableColumn: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatTable, {static: false}) table: MatTable<IFMEATaskAddedSequence>;
    // @ViewChild(MatTable) table: MatTable<IFMEATaskAddedSequence>;
    displayedColumns2 = ['sequenceNo', 'taskIdentificationNo', 'taskDescription', 'acceptableLimits', 'correctiveActions','taskTypeName', 'frequencyName'];

    displayedColumns = ['isAdd', 'taskIdentificationNo', 'parentCode', 'familyComponent', 'componentClass', 'subClass', 'buildSpec', 'componentManufacturer', 'failureMode', 'taskDescription', 'failureRiskTotalScore', 'acceptableLimits', 'correctiveActions', 'taskTypeName', 'frequencyName'];
    @ViewChild('tableOnePaginator', {static: false}) tableOnePaginator: MatPaginator;
    @ViewChild('tableOneSort', {static: false}) tableOneSort: MatSort;

    displayedColumns3 = ['taskIdentificationNo', 'parentCode', 'familyComponent', 'componentClass', 'subClass', 'buildSpec', 'componentManufacturer', 'failureMode', 'taskDescription', 'failureRiskTotalScore', 'acceptableLimits', 'correctiveActions','taskTypeName', 'frequencyName'];
    @ViewChild('tableTwoPaginator', {static: false}) tableTwoPaginator: MatPaginator;
    @ViewChild('tableTwoSort', {static: false}) tableTwoSort: MatSort;
    selection = new SelectionModel<IFMEATaskAddedList>(true, []);
    
    ELEMENT_DATA: IAllFMEAList[] = [];
    ELEMENT_DATA_2: IAllFMEAList [] = [];
    ELEMENT_DATA_3: IFMEATaskAddedList [] = [];
    ELEMENT_DATA_4: IFMEATaskAddedSequence [] = [];
    
    fmeaTaskAddedList: IFMEATaskAdded [] = [];
    fmeaTaskList: IFMEATaskAdded [] = [];
    fmeaTaskAddedListData: IFMEATaskAddedList [] = [];
    fmeaTaskAddedSequenceList: IFMEATaskAddedSequence [] = [];
    assetTaskGrpSequenceList: IAssetTaskGroupStrategySequence [] = [];
    assignTGSHierarchyList: IAssignAssetTaskGroupStrategyHierarchy [] = [];
    fmeaList: IAllFMEAList[] = [];

    fmeaComponentList: any[] = [];
    fmeataskaddedList: any[] = [];
    fmeataskSequenceList:any[] = [];
    assignEquipmentSequenceList: any[] = [];

    assetAddtoTask: IAddHierarchyToTask[] = [];

    dataSource2;
    dataSource3;
    dataSource4;
    dataSource1;
    
    durationList: any[] = [];
    frequencyList: any[] = [];
    operationModeList: any[] = [];
    tradeTypeList: any[] = [];
    taskTypeList: any[] = [];
    taxonomyCategoryList: any[] = [];
    taxonomyClassList: any[] = [];
    taxonomyTypeList: any[] = [];

    industryTaxonomyList: any[] = [];
    businessTypeTaxonomyList: any[] = [];
    assetTypeTaxonomyList: any[] = [];
    processFunctionTaxonomyList: any[] = [];
    assetCategoryList:any[] = [];
    assetClassTaxonomyList: any[]=[];
    assetSpecTaxonomyList: any[] = [];
    assetFamilyTaxonomyList: any[] = [];
    assetManufacturerTaxonomyList: any[] = [];
    componentFamilyTaxonomyList: any[] = [];
    componentClassTaxonomyList: any[]=[];
    componentSubClassTaxonomyList: any[] = [];
    componentBuildSpecTaxonomyList: any[] = [];
    componentManufacturerTaxonomyList: any[] = [];
    componentLevel2List: any[] = [];
    componentLevel3List: any[] = [];
    containers = [];
    containerTask = [];
    containerTask2 = [];
    materialHsmList: any[] = [];
    maintUnitList: any[] = [];

    frequencyObject: IFrequency;
    durationObject: IDuration;
    operationModeObject: IOperationalMode;
    tradeTypeObject: ITradeType;
    taskTypeObject: ITaskType;

    assetTaskGroupStrategyObject: IAssetTaskGroupStrategy = {
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
        systemStatus: 0,
        siteId: 0,
        customerId: 0
    };

    fmeaTaskAddedObject: IFMEATaskAdded = {
      id: 0,
      taskId: 0,
      fmeaId: 0,
      isChecked: false,
      isActive: true,
      sequenceNo: 0
    };

    fmeaTaskSequenceObject: IAssetTaskGroupStrategySequence = {
      id: 0,
      tgsId: 0,
      fmeaId: 0,
      taskId: 0,
      addedTaskId: 0,
      sequenceNumber: 0
    }

    assignAssetTaskGroupHierarchy: IAssignAssetTaskGroupStrategyHierarchy = {
      id: 0,
      fmeaId: 0,
      taskId: 0,
      addedTaskId: 0,
      assetHierarchyId: 0
    }

    assignAssetTaskGroupMaterial: IAssignAssetTaskGroupStrategyMaterialSite = {
      id: 0,
      fmeaId: 0,
      taskId: 0,
      batchId: 0,
      categoryName: "",
      assemblyHierarchyId: 0,
      maintUnitId: 0,
      maintItemId: 0,
      maintSubItemId: 0,
      fileName: "",
      sequenceNo: 0,
      isMultiple: false,
      isInclude: false,
      comment: "",
      createdBy: "",
      updatedBy: "",
      dtCreated: undefined,
      dtUpdated: undefined,
      systemStatus: 0,
      siteId: 0,
      customerId: 0

    }

    assignToUserObject: IAssignGroupToUser = {
      id: 0,
      transactionId: 0,
      transactionTypeId: 0,
      userPermissionGroupId: 0,
      userId: 0,
      status: 0,
      isActive: true
    };

    taxonomyCategoryObject: ITaxonomyCategory;
    taxonomyClassObject: ITaxonomyClass;
    taxonomyTypeObject: ITaxonomyType;
    assetTaxonomyObject: IAssetHierarchyDataTaxonomy;

    frequency: string = "";
    tradeType: string ="";
    className: string = "";
    taskType: string = "";
    processfunction: string = "";
    componentfamily: string = "";
    componentsubclass: string = "";
    operationalmode: string = "";
    familyText: string = "";
    classText: string = "";
    componentLevel2name: string = "";
    componentLevel3name: string = "";

    //build work instruction title: 1. Frequency, 2. trade type, 3. asset class (or process function), 
    //4. component family (optional), 5. component sub class (optional), 6. work instruction task type, 
    //7. operational mode e.g., 4W MECH Sag Mill Heat exchanger inspection Online

    taskId: number;
    taskGpStrategyId: string = "";
    taxCategoryId: number;
    taxClassId: number;
    taxTypeId: number;
    taskGroupDescription: string = "";
    frequencyId: number = 0;
    tradeTypeId: number = 0;
    operationalModeId: number = 0;
    durationId: number = 0;
    taskTypeId: number = 0;
    componentName: string = "";
    assetCode: string = ""

    assetIndustryId: number = 0;
    assetBusinessTypeId: number = 0;
    assetTypeId: number = 0;
    assetProcessFunctionId: number = 0;
    assetCategoryId: number = 0;
    assetClassTaxonomyId: number = 0;
    assetClassId: number = 0;
    assetSpecTaxonomyId: number = 0;
    assetFamilyTaxonomyId: number = 0;
    assetManufacturerId: number = 0;
    componentFamilyId: number = 0;
    componentClass: number = 0;
    componentSubClassId: number = 0;
    componentBuildSpecId: number = 0;
    componentManufacturerId: number = 0;
    componentLevel2Id: number = 0;
    componentLevel3Id: number = 0;
    componentId: number = 0;
    siteId: number = 0;
    customerId: number = 0;

    taxonomyCategory: string = "";
    taxonomyClass: string = "";
    taxonomyType: string = "";

    fileName: string = "";
    locationURL: string = "";
    file: any;
    fileURL: {dbPath: ''};
    public response: {dbPath: ''};

    taskGroupdescription: string = "";
    interval: number;
    tradetype: number;
    duration: number;
    tasktypeId: number;
    componentname: string = "";
    failureScore: number;
    failureScoreTotal: number = 0;
    taxonomyText: string = "";
    componentClassName: string = "";
    assetClassName: string = "";
    industryName: string = "";
    businessTypeName: string = "";
    processFunctionName: string = "";
    assetSpecName: string = "";
    assetManufactureName: string = "";
    operationalMode: string = "";
    durationName: string = "";
    tradeTypeName: string = "";
    taskTypeName: string = "";
    taskid: string = "";
    floc: string = "";
    acceptableLimits: string = "";
    correctiveActions: string = "";
    contLen: number;

    isHide: boolean = false;

    classDisabled: boolean = true;
    typeDisabled: boolean = true;
    isTaskId: boolean = false;
    taxCategoryDisabled: boolean = false;
    frequencyDisabled: boolean = false;
    taskTypeDisabled: boolean = false;
    operationalModeDisabled: boolean = false;
    tradeTypeDisabled: boolean = false;
    durationDisabled:boolean = false;
    taskIdDisabled: boolean = false;
    hasTaskList: boolean = false

    loading: boolean = false;
    loading2: boolean = false;
    default: boolean = false;
    default2: boolean = false;

    isAdd: boolean = false;
    isChecked: boolean = false;
    isRoute: boolean = false;
    isDisableRoute: boolean = false;
    isDisableLevel2: boolean = true;
    isDisableLevel3: boolean = true;
    componentCode: string = "";
    componentLevel: number;

    public data: [];

    isLoading: boolean = false;

    tabIndex = 1;
    activeId: number = 1;
    fmeaId: number;
    hierarchyId: number;
    addedTaskId: number;
    materialId: number;

    fmeaid: number;
    strategytaskid: number;
    assetflocid: number;

    tempTaskId: number;

    displayMultiFilter: boolean = false;
    displayTableColumn: boolean = false;

    //table NgModel
    tableTaskId: boolean = true;
    tableParent: boolean = true;
    tableFailureMode: boolean = true;
    tableFailureScore: boolean = true;
    tableTaskDesc: boolean = true;
    tableLimits: boolean = true;
    tableCorrective: boolean = true;
    tableTaskType: boolean = true;
    tableInterval: boolean = true;
    tableFamily: boolean = true;
    tableClass: boolean = true;
    tableSubClass: boolean = true;
    tableBuildSpec: boolean = true;
    tableManufacturer: boolean = true;
    tableVariant: boolean = false;

    selectedTabIndex: number = 0;
    selectedIndex: number = 0;
    isInvalid: boolean = false;

    isDisabledTab1: boolean = false;
    isDisabledTab2: boolean = true;
    isDisabledTab3: boolean = true;
    isDisabledTab4: boolean = true;
    isContainer: boolean = false;
    isContainer2: boolean = false;
    isSave: boolean = false;

    //multifilter model
    componentLevel1filter: number = 0;
    componentLevel2filter: number = 0;
    componentLevel3filter: number = 0;
    familyFilter: number = 0;
    classFilter: number = 0;
    subClassFilter: number = 0;
    buildSpecFilter: number = 0;
    manufacturerFilter: number = 0;
    taskTypeFilter: number = 0;
    operationalModeFilter: number = 0;
    frequencyFilter: number = 0;
    tradeTypeFilter: number = 0;
    durationFilter: number = 0;
    componentCodeFilter: string = "";
    componentLevelFilter: number;

    componentLevel1FilterList: any[]= [];
    componentLevel2FilterList: any[]=[];
    componentLevel3FilterList: any[]=[];
    familyFilterList: any[]=[];
    classFilterList: any[]=[];
    subClassFilterList: any[]=[];
    buildSpecFilterList: any[]=[];
    manufacturerFilterList: any[]=[];
    taskTypeFilterList: any[]=[];
    operationalModeFilterList: any[]=[];
    frequencyFilterList: any[]=[];
    tradeTypeFilterList: any[]=[];
    durationFilterList: any[]=[];
    assetClassList: any[] = [];
    assetClassHierarchy: any[] = [];
    systemStatusList: any[] = [];
    result: any[] = [];
    hierarchyData: [] = [];
    taskTempList : any[] = [];
    taskList: any[]=[];
    taskList2: any[] = [];

    assetId: number = 0;
    famId : number = 0;
    classId: number = 0;
    subClassId: number = 0;
    maintUnitName: string = "";
    maintUnitId: number = 0;
    processFunctionId: number = 0;
    systemStatus: number = 0;

    user: string = "";

    tgsNo: number = 0;
    tempNo: number = 0;

    isMin: boolean = false;
    isMax: boolean = true;
    isHSMUser: boolean = false;
    isAdmin: boolean = false;
    isMaintUnitSelect: boolean = false;

    statusList = [
      {
          "name": "Created",
          "value": 1
      },
      {
          "name": "Active",
          "value": 2
      },
      {
          "name": "Inactive",
          "value": 3
      },
      {
          "name": "Rejected",
          "value": 4
      }
  ]

  transactionTypeList: any = [
    {
        "name": "Fmea",
        "id": 1
    },
    {
        "name": "SiteFmea",
        "id": 2
    },
    {
        "name": "HsmTGS",
        "id": 3
    },
    {
        "name": "SiteTGS",
        "id": 4
    }
  ];

    hierarchy: RootObject2;
    ELEMENT_DATA2: IAssetHierarchy[] = [];
    taskListEquipmentList: [] = [];
    assetHierarchyData: [] = [];
    componentData: [] = [];
    assetStrategyWithMaterial: IAssignAssetTaskGroupStrategyMaterialView[] = [];
    assetHierarchyParam: IAssetHierarchyParam;

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

    imageError: string;
    isImageSaved: boolean;
    cardImageBase64: string;
    currentId: number;

    isApproved: boolean = false;
    pressed = false;
    currentResizeIndex: number;
    startX: number;
    startWidth: number;
    isResizingRight: boolean;
    resizableMousemove: () => void;
    resizableMouseup: () => void;

    userCustomerId: number = 0;
    userSiteId: number = 0; 

    constructor(
      private router: Router,
      private _eref: ElementRef,
      private renderer: Renderer2,
      public dialog: MatDialog,
      private http: HttpClient,
      private _frequenceService: FrequencyService,
      private _durationService: DurationService,
      private _operationModeService: OperationalModeService,
      private _tradeTypeService: TradeTypeService,
      private _taskTypeService: TaskTypeService,
      private _taxonomyCategoryService: TaxonomyCategoryService,
      private _taxonomyClassService: TaxonomyClassService,
      private _taxonomyTypeService: TaxonomyTypeService,
      private _assetTaskGroupStrategyService: AssetTaskGroupStrategyService,
      private _categoryHierarchyService: CategoryHierarchySiteService,
      private _fmeaTaskAddedService: FMEATaskAddedService,
      private _assetTaskgroupSequenceService: AssetTaskGroupStrategySequenceService,
      private _industryTaxonomyService: AssetHierarchyIndustryService,
      private _businessTypeTaxonomyService: AssetHierarchyBusinessTypeService,
      private _assetTypeTaxonomyService: AssetHierarchyAssetTypeService,
      private _processFunctionTaxonomyService: AssetHierarchyProcessFunctionService,
      private _assetCategoryService: AssetCategoryService,
      private _assetClassTaxonomyService: AssetHierarchyClassTaxonomyService,
      private _assetSpecTaxonomyService: AssetHierarchySpecService,
      private _assetFamilyTaxonomyService: AssetHierarchyFamilyService,
      private _assetManufacturerTaxonomyService: AssetHierarchyManufacturerService,
      private _compFamilyTaxonomyService: ComponentFamilyService,
      private _comClassTaxonomyService: ComponentClassService,
      private _comSubClassTaxonomyService: ComponentSubClassService,
      private _comBuildSpecTaxonomyService: ComponentBuildSpecService,
      private _comManufacturerTaxonomyService: ComponentManufacturerService,
      private _assetHierarchyService: AssetHierarchyService,
      private _tempHierarchyService: TempHierarchyService,
      private _assignAssetTGSMaterialSiteService: AssignAssetTaskGroupStrategyMaterialSiteService,
      private _workInstructionTaskTypeService: WorkInstructionTaskTypeService,
      private _componentTaskService: ComponentTaskService,
      private _assignToUserService: AssignGroupToUserService,
      private _fmeaService: FMEAService,
      private toastr: ToastrService,
      private _dataService: DataService,
      private _route: ActivatedRoute,
      ) { 
        this.dataSource.data = this.TREE_DATA;

        const user = JSON.parse(localStorage.currentUser);
        this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
        this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
        this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
        // console.log(user);
        this.isAdmin = user?.users?.isAdmin;
        this.user = user?.users?.firstName + ' ' + user?.users?.lastName;
      }

      hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
      hasChild2 = (_: number, node: AssetHierarchy) => !!node.Children && node.Children.length > 0;

    ngOnInit(): void {
      let fmeadata = localStorage.getItem("fmeaform");
      var hierarchyData = localStorage.getItem("assethierarchyData");

      this.isLoading = true;
      this._route.params.subscribe(params => {
        this.currentId = params['id'];
      });

      console.log(this.currentId)

      this._assetTaskGroupStrategyService.getAssetTaskGroupStrategyLastRow()
        .subscribe(foo => {
          // console.log(foo)

          this.tempTaskId = foo.lastId+1;
            // console.log(this.tempTaskId)
        });

      this._assetTaskGroupStrategyService.getAssetTaskGroupStrategyLastNumber()
          .subscribe(out => {
            this.tgsNo = Number(out.lastId);
            this.tempNo = this.tgsNo+1
            // console.log(this.tempNo)
            
            if(this.tgsNo === 9){
                this.taskGpStrategyId = "TGS.0000000" + this.tempNo;
            }

            if(this.tgsNo > 9 && this.tgsNo < 99){
                this.taskGpStrategyId = "TGS.0000000" + this.tempNo;
            }

            if(this.tgsNo === 99){
                this.taskGpStrategyId = "TGS.000000" + this.tempNo;
            }

            if(this.tgsNo > 99 && this.tgsNo < 999){
              this.taskGpStrategyId = "TGS.000000" + this.tempNo;
            }

            if(this.tgsNo === 999){
                this.taskGpStrategyId = "TGS.00000" + this.tempNo;
            }

            if(this.tgsNo > 999 && this.tgsNo < 9999){
              this.taskGpStrategyId = "TGS.00000" + this.tempNo;
            }

            if(this.tgsNo === 9999){
                this.taskGpStrategyId = "TGS.0000" + this.tempNo;
            }

            if(this.tgsNo > 9999 && this.tgsNo < 99999){
              this.taskGpStrategyId = "TGS.0000" + this.tempNo;
            }

            if(this.tgsNo === 99999){
                this.taskGpStrategyId = "TGS.000" + this.tempNo; 
            }

            if(this.tgsNo > 99999 && this.tgsNo < 999999){
              this.taskGpStrategyId = "TGS.000" + this.tempNo; 
            }

            if(this.tgsNo === 999999){
                this.taskGpStrategyId = "TGS.00"  + this.tempNo;
            }

            if(this.tgsNo > 999999 && this.tgsNo < 9999999){
              this.taskGpStrategyId = "TGS.00"  + this.tempNo;
            }

            if(this.tgsNo === 9999999){
                this.taskGpStrategyId = "TGS.0"  + this.tempNo;
            }

            if(this.tgsNo > 9999999 && this.tgsNo < 99999999){
              this.taskGpStrategyId = "TGS.0"  + this.tempNo;
            }

            if(this.tgsNo >= 99999999){
                this.taskGpStrategyId = "TGS."  + this.tempNo;
            }

            if(this.tgsNo <= 9){
                this.taskGpStrategyId = "TGS.00000000"   + this.tempNo;
            }

            // console.log(this.taskGpStrategyId)
            this.assetTaskGroupStrategyObject.assetHierarchyId = this.tempTaskId;
            this.assetTaskGroupStrategyObject.taskGroupStrategyId = this.taskGpStrategyId;
        })

      if(fmeadata){
        let sourceActiveId = localStorage.getItem("source");
        this.activeId = (sourceActiveId !== null) ? parseInt(sourceActiveId) : 1;
        this.taskId = +localStorage.getItem("taskid");
        this.taxCategoryId = +localStorage.getItem("taxcategoryid");
        this.taxClassId = +localStorage.getItem("taxclassid");
        this.taxTypeId = +localStorage.getItem("taxtypeid");
        this.assetCode = localStorage.getItem("assetcode");
        this.componentName = localStorage.getItem("componentname");


  
        this.isTaskId = false;

        forkJoin(
          this._frequenceService.getAllFrequencyByCustomerSites(this.customerId, this.siteId),
          this._durationService.getAllDurationByCustomerSites(this.customerId, this.siteId),
          this._tradeTypeService.GetAllTradeTypeByCustomerSites(this.customerId, this.siteId),
          this._operationModeService.getOperationalMode(),
          this._industryTaxonomyService.getAllIndustryByCustomerSites(this.customerId, this.siteId),
          this._businessTypeTaxonomyService.getAllBusinessTypeByCustomerSites(this.customerId, this.siteId),
          this._assetTypeTaxonomyService.getAssetType(),
          this._processFunctionTaxonomyService.getAllProcessByCustomerSites(this.customerId, this.siteId),
          this._assetClassTaxonomyService.getAssetClassTaxonomy(),
          this._assetSpecTaxonomyService.getAllSpecByCustomerSites(this.customerId, this.siteId),
          this._assetFamilyTaxonomyService.getAssetFamilyTaxonomy(),
          this._assetManufacturerTaxonomyService.getAllManufacturerByCustomerSites(this.customerId, this.siteId),
          this._compFamilyTaxonomyService.getComponentFamily(),
          this._comClassTaxonomyService.getAllClassesByCustomerSites(this.customerId, this.siteId),
          this._comSubClassTaxonomyService.getAllSubClassByCustomerSites(this.customerId, this.siteId),
          this._comBuildSpecTaxonomyService.getAllBuildSpecByCustomerSites(this.customerId, this.siteId),
          this._comManufacturerTaxonomyService.getAllManufacturerByCustomerSites(this.customerId, this.siteId),
          // this._taskTypeService.getTaskType(),
          this._workInstructionTaskTypeService.getWorkInstructionTaskType(),
          this._assetCategoryService.getAssetCategory(),
          this._categoryHierarchyService.getComponentCategoryHierarchyLevel1(this.customerId, this.siteId),
          this._componentTaskService.getAllFMMTByCustomerSiteId(this.customerId, this.siteId),
          // this._categoryHierarchyService.getComponentCategoryHierarchyLevel2(),
          // this._categoryHierarchyService.getComponentCategoryHierarchyLevel3(),
          // this._assetTaskGroupStrategyService.getAssetTaskGroupStrategyById(this.assetTaskGroupStrategyObject.Id),
          ).subscribe(([fr, dr, tt, op, it, bt, at, pf, ct, st, ft, mf, cf, cc, sc, bs, cm, tk, ac, ch, mu]) => {
              this.frequencyList = fr.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.durationList = dr.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.tradeTypeList = tt.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.operationModeList = op;
              this.taskTypeList = tk;
              this.industryTaxonomyList = it.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.businessTypeTaxonomyList = bt.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.processFunctionTaxonomyList = pf.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.assetTypeTaxonomyList = at;
              this.assetClassTaxonomyList = ct;
              this.assetSpecTaxonomyList = st.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.assetFamilyTaxonomyList = ft;
              this.assetManufacturerTaxonomyList = mf.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.componentFamilyTaxonomyList = cf;
              this.componentClassTaxonomyList = cc.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.componentSubClassTaxonomyList = sc.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.componentBuildSpecTaxonomyList = bs.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.componentManufacturerTaxonomyList = cm;
              this.assetCategoryList = ac;
              this.assetClassList = ch.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.maintUnitList = mu.filter(e=> e.siteId !== 0 && e.customerId !== 0);
              this.isLoading = false;
              // console.log(this.componentClassTaxonomyList)
              // this.componentLevel2List = chl;
              // this.componentLevel3List = cht;
              // this.initializeFieldData(sd);
          });

          this.default = true;
          this.default2 = true;
      }
      else{

        this.isTaskId = false;

        forkJoin(
          this._frequenceService.getAllFrequencyByCustomerSites(this.customerId, this.siteId),
          this._durationService.getAllDurationByCustomerSites(this.customerId, this.siteId),
          this._tradeTypeService.GetAllTradeTypeByCustomerSites(this.customerId, this.siteId),
          this._operationModeService.getOperationalMode(),
          this._industryTaxonomyService.getAllIndustryByCustomerSites(this.customerId, this.siteId),
          this._businessTypeTaxonomyService.getAllBusinessTypeByCustomerSites(this.customerId, this.siteId),
          this._assetTypeTaxonomyService.getAssetType(),
          this._processFunctionTaxonomyService.getAllProcessByCustomerSites(this.customerId, this.siteId),
          this._assetClassTaxonomyService.getAssetClassTaxonomy(),
          this._assetSpecTaxonomyService.getAllSpecByCustomerSites(this.customerId, this.siteId),
          this._assetFamilyTaxonomyService.getAssetFamilyTaxonomy(),
          this._assetManufacturerTaxonomyService.getAllManufacturerByCustomerSites(this.customerId, this.siteId),
          this._compFamilyTaxonomyService.getComponentFamily(),
          this._comClassTaxonomyService.getAllClassesByCustomerSites(this.customerId, this.siteId),
          this._comSubClassTaxonomyService.getAllSubClassByCustomerSites(this.customerId, this.siteId),
          this._comBuildSpecTaxonomyService.getAllBuildSpecByCustomerSites(this.customerId, this.siteId),
          this._comManufacturerTaxonomyService.getAllManufacturerByCustomerSites(this.customerId, this.siteId),
          this._taskTypeService.getAllTaskTypeByCustomerSites(this.customerId, this.siteId),
          this._workInstructionTaskTypeService.getWorkInstructionTaskType(),
          this._assetCategoryService.getAssetCategory(),
          this._categoryHierarchyService.getComponentCategoryHierarchyLevel1(this.customerId, this.siteId),
          this._componentTaskService.getAllFMMTByCustomerSiteId(this.customerId, this.siteId),
          this._assetTaskGroupStrategyService.getAssetTaskGroupStrategyById(this.currentId),
          this._fmeaService.getSystemStatus(),
          ).subscribe(([fr, dr, tt, op, it, bt, at, pf, ct, st, ft, mf, cf, cc, sc, bs, cm, tk, wt, ac, ch, mu, tg, ss]) => {
              this.frequencyList = fr.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.durationList = dr.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.tradeTypeList = tt.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.operationModeList = op;
              this.taskTypeList = wt;
              this.industryTaxonomyList = it.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.businessTypeTaxonomyList = bt.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.assetTypeTaxonomyList = at;
              this.processFunctionTaxonomyList = pf.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.assetClassTaxonomyList = ct;
              this.assetSpecTaxonomyList = st.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.assetFamilyTaxonomyList = ft;
              this.assetManufacturerTaxonomyList = mf.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.componentFamilyTaxonomyList = cf;
              this.componentClassTaxonomyList = cc.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.componentSubClassTaxonomyList = sc.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.componentBuildSpecTaxonomyList = bs.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.componentManufacturerTaxonomyList = cm.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.assetCategoryList = ac;
              // console.log(cc,sc)
              //Multi Filter List
              this.componentLevel1FilterList = ch;
              this.familyFilterList = cf;
              this.classFilterList = cc;
              this.subClassFilterList = sc;
              this.buildSpecFilterList = bs;
              this.manufacturerFilterList = cm;
              this.frequencyFilterList = fr;
              this.durationFilterList = dr;
              this.operationalModeFilterList = op;
              this.tradeTypeFilterList = tt;
              this.taskTypeFilterList = tk;
              this.assetClassList = ch.filter(e=> e.customerId !== 0 && e.siteId !== 0);
              this.maintUnitList = mu.filter(e=> e.siteId !== 0 && e.customerId !== 0);
              this.systemStatusList = ss;
              this.isLoading = false;
              // console.log(tg, this.systemStatusList);
              this.initializeFieldData(tg);
          });

          this.default = true;
          this.default2 = true;
      }

      // this.getFMEATaskAssignData(1); // taskId
      
      // this.getTaskGpStrategyDetails(1); //taskId
    }

    toggleMin(){
      this.isMin = true;
      this.isMax = false;
    }

    toggleMax(){
      this.isMin = false;
      this.isMax = true;
    }

    initializeFieldData(data: IAssetTaskGroupStrategy): void {
        
      let i = 0;

      this.assetTaskGroupStrategyObject = data;
      
      this.taskId = data.id;
      this.taskGpStrategyId = data.taskGroupStrategyId
      this.assetClassId = data.assetClassTaxonomyId;
      this.taskGroupDescription = data.taskGroupDescription;
      this.frequencyId = data.frequencyId;
      this.tradeTypeId = data.tradeTypeId;
      this.operationalModeId = data.operationalModeId;
      this.durationId = data.durationId;
      this.taskTypeId = data.taskTypeId;
      this.assetSpecTaxonomyId = data.assetSpecTaxonomyId;
      this.assetManufacturerId = data.assetManufacturerTaxonomyId;
      this.assetIndustryId = data.assetIndustryId;
      this.assetBusinessTypeId = data.businessTypeId;
      this.assetProcessFunctionId = data.processFunctionId;
      this.maintUnitId = data.componentFamilyTaxonomyId;
      this.componentClass = data.componentClassTaxonomyId;
      this.systemStatus = data.systemStatus;
      this.siteId = data.siteId;
      this.customerId = data.customerId;
      
      if(this.systemStatus === 3){
        this.isApproved = true;
      }

      this.getAssetClassId(this.assetClassId);
      this.getTGSTasks();

      forkJoin(
        this._frequenceService.getFrequencyById(this.frequencyId),
        this._tradeTypeService.getTradeTypeById(this.tradeTypeId),
        this._categoryHierarchyService.getCategoryHierarchySiteRecordById(this.assetClassId),
        this._operationModeService.getOperationalModeById(this.operationalModeId),
        this._workInstructionTaskTypeService.getWorkInstructionTaskTypeById(this.taskTypeId)
        ).subscribe(([fr, tr, cl, op, tt ]) => {
            this.tradeType = tr.tradeTypeName;
            if(this.tradeType === "" || this.tradeType === null || this.tradeType === undefined){
              this.tradeType = '';
            }

            this.frequency = fr.frequencyName;
            if(this.frequency === "" || this.frequency === null || this.frequency === undefined){
              this.frequency = '';
            }

            this.assetClassName = cl.categoryName;
            this.className = cl.categoryName;
            if(this.className === "" || this.className === null || this.className === undefined){
              this.className = '';
            }
            
            this.operationalmode = op.operationalModeName;
            if(this.operationalmode === "" || this.operationalmode === null || this.operationalmode === undefined){
              this.operationalmode = '';
            }

            this.taskType = tt.taskTypeName;
            if(this.taskType === "" || this.taskType === null || this.taskType === undefined){
              this.taskType = '';
            }

            this.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.taskType + ' ' + this.operationalmode;
      });
  }

  getAssetClassId(id: number){
    this._categoryHierarchyService.getCategoryHierarchySiteRecordById(id)
        .subscribe(res => {
            this.assetClassName = res.categoryName;
            this.className = res.categoryName;
            if(this.className === "" || this.className === null || this.className === undefined){
              this.className = '';
            }
            this.componentLevel = res.level;
            this.componentCode = res.categoryCode;

            this._assetTaskGroupStrategyService.getAssetClassHierarchy(this.componentCode)
              .subscribe(foo => {
                  // console.log(foo)
                  // this.dataSource.data = foo.trim();
                  this.assetClassHierarchy = JSON.parse(foo['hierarchy']);
              })
        });

      this.assetClassId = id;
      this.assetTaskGroupStrategyObject.assetClassTaxonomyId = this.assetClassId;

      this.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;
      this.assetTaskGroupStrategyObject.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;

      if(this.assetClassId === 0){
        this.isInvalid = true;
      }else{
        this.isInvalid = false;
      }
  }

  getTGSTasks(){
    this._assetTaskGroupStrategyService.getTaskGroupStrategyDetails(this.currentId)
      .subscribe(res => {
        this.hierarchyData = JSON.parse(res['hierarchy']);
        // console.log(this.hierarchyData);
        this.taskTempList = this.hierarchyData['PRTData'];
        this.taskList = this.taskTempList[0]['MultipleTask'];
        // console.log(this.taskList)
      });
  }

    hide() {
      this.isHide = true;
    }

    unHide() {
      this.isHide = false;
    }

    statusOnSelect(event){
      this.systemStatus = parseInt(event.target.value);
    }

    industryOnSelect(event){
      this.assetIndustryId = parseInt(event.target.value)
      this.assetTaskGroupStrategyObject.assetIndustryId = this.assetIndustryId;

      this._industryTaxonomyService.getAssetIndustryById(this.assetIndustryId)
        .subscribe(res => {
          this.industryName = res.industryName;
        })
    }

    businessTypeOnSelect(event){
      this.assetBusinessTypeId = parseInt(event.target.value)
      this.assetTaskGroupStrategyObject.businessTypeId = this.assetBusinessTypeId;

      this._businessTypeTaxonomyService.getAssetBusinessTypeyById(this.assetBusinessTypeId)
        .subscribe(res => {
          this.businessTypeName = res.businessType;
        })
    }

    assetTypeOnSelect(event){
      this.assetTypeId = parseInt(event.target.value)
    }

    processFunctionOnSelect(event){

      this._processFunctionTaxonomyService.getProcessFunctionById(event.target.value)
        .subscribe(res => {
          this.processfunction = res.processFunction;
        })

        // if(this.processfunction === undefined){
        //   this.processfunction = '';
        // }

      this.assetProcessFunctionId = parseInt(event.target.value)
      this.assetTaskGroupStrategyObject.processFunctionId = this.assetProcessFunctionId;
    }

    maintUnitOnSelect(event){
      this.maintUnitId = parseInt(event.target.value);

      this._componentTaskService.getComponentTaskById(this.maintUnitId)
        .subscribe(res => {
          this.maintUnitName = res.componentTaskName;
        });

        this.assetTaskGroupStrategyObject.componentClassTaxonomyId = this.maintUnitId;

        this._comClassTaxonomyService.getComponentTaxonomyClassesByIds(this.maintUnitId, this.customerId, this.siteId)
            .subscribe(out => {
                this.isMaintUnitSelect = true;
                this.componentClassTaxonomyList = out;
            });
    }

    assetCategoryOnSelect(event){

      this.assetCategoryId = parseInt(event.target.value)
    }

    assetClassOnSelect(event){
      this._categoryHierarchyService.getCategoryHierarchySiteRecordById(event.target.value)
        .subscribe(res => {
            this.assetClassName = res.categoryName;
            this.className = res.categoryName;
            if(this.className === "" || this.className === null || this.className === undefined){
              this.className = '';
            }
            this.componentLevel = res.level;
            this.componentCode = res.categoryCode;

            // console.log(this.componentCode);
        });

      this.assetClassId = parseInt(event.target.value)
      this.assetTaskGroupStrategyObject.assetClassTaxonomyId = this.assetClassId;

      this.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;
      this.assetTaskGroupStrategyObject.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;

      if(this.assetClassId === 0){
        this.isInvalid = true;
      }else{
        this.isInvalid = false;
      }
    }

    assetClassTaxonomyOnSelect(event){
      this.assetClassTaxonomyId = parseInt(event.target.value)
    }

    assetSpecOnSelect(event){
      this.assetSpecTaxonomyId = parseInt(event.target.value)
      this.assetTaskGroupStrategyObject.assetSpecTaxonomyId = this.assetSpecTaxonomyId;

      this._assetSpecTaxonomyService.getSpecTaxonomyById(this.assetSpecTaxonomyId)
        .subscribe(res => {
          this.assetSpecName = res.specification;
        })
    }

    assetManufacturerOnSelect(event){
      this.assetManufacturerId = parseInt(event.target.value);
      this.assetTaskGroupStrategyObject.assetManufacturerTaxonomyId = this.assetManufacturerId;

      this._assetManufacturerTaxonomyService.getAssetManufacturerById(this.assetManufacturerId)
        .subscribe(res => {
          this.assetManufactureName = res.assetManufacturer;
        })
    }

    assetFamilyOnSelect(event){
      this.assetFamilyTaxonomyId = parseInt(event.target.value)
    }

    componentFamilyOnSelect(event){
      this._compFamilyTaxonomyService.getComponentFamilyById(event.target.value)
        .subscribe(res => {
          this.componentfamily = res.familyComponent;
          if(this.componentfamily === "" || this.componentfamily === null || this.componentfamily === undefined){
            this.componentfamily = '';
          }
        });

      this.componentFamilyId = parseInt(event.target.value)
      this.assetTaskGroupStrategyObject.componentFamilyTaxonomyId = this.componentFamilyId;
    }

    componentClassOnSelect(event){
      this.componentClass = parseInt(event.target.value);

      this._comClassTaxonomyService.getComponentClassById(event.target.value)
        .subscribe(res => {
          this.componentClassName = res.componentClass;
          if(this.componentsubclass === "" || this.componentsubclass === null || this.componentsubclass === undefined){
            this.componentsubclass = '';
          }
        });
    }

    componentSubClassOnSelect(event){
      this._comSubClassTaxonomyService.getComponentSubClassById(event.target.value)
        .subscribe(res => {
          this.componentsubclass = res.subClass;
          if(this.componentsubclass === "" || this.componentsubclass === null || this.componentsubclass === undefined){
            this.componentsubclass = '';
          }
        });

      this.componentSubClassId = parseInt(event.target.value)
      this.assetTaskGroupStrategyObject.componentSubClassTaxonomyId = this.componentSubClassId;

      this.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;
      this.assetTaskGroupStrategyObject.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;
    }

    componentBuildSpecOnSelect(event){
      this.componentBuildSpecId = parseInt(event.target.value)
      this.assetTaskGroupStrategyObject.componentBuildSpecTaxonomyId = this.componentBuildSpecId;
    }

    componentManufacturerOnSelect(event){
      this.componentManufacturerId = parseInt(event.target.value)
    }

    operationalModeOnSelect(event){
      this._operationModeService.getOperationalModeById(event.target.value)
        .subscribe(res => { 
          this.operationalmode = res.operationalModeName;
          if(this.operationalmode === "" || this.operationalmode === null || this.operationalmode === undefined){
            this.operationalmode = '';
          }
        });

        this.operationalModeId = parseInt(event.target.value);
        this.assetTaskGroupStrategyObject.operationalModeId = this.operationalModeId;
  
        if(this.operationalModeId === 0){
          this.isInvalid = true;
        }else{
          this.isInvalid = false;
        }

        this.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;
        this.assetTaskGroupStrategyObject.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;
    }

    durationOnSelect(event){
      this.durationId = parseInt(event.target.value);

      this._durationService.getDurationById(this.durationId)
        .subscribe(res => {
          this.durationName = res.durationName;
        })
    }

    frequencyOnSelect(event){
      this._frequenceService.getFrequencyById(event.target.value)
        .subscribe(res => {
            // console.log(this.frequency)
            this.frequency = res.frequencyName;
            if(this.frequency === "" || this.frequency === null || this.frequency === undefined){
              this.frequency = '';
            }
        });

        

      this.frequencyId = parseInt(event.target.value);
      this.assetTaskGroupStrategyObject.frequencyId = this.frequencyId;

      this.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;
      this.assetTaskGroupStrategyObject.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;

      if(this.frequencyId === 0){
        this.isInvalid = true;
      }else{
        this.isInvalid = false;
      }
    }

    taskTypeOnSelect(event){
      this._workInstructionTaskTypeService.getWorkInstructionTaskTypeById(event.target.value)
        .subscribe(res => {
            this.taskType = res.taskTypeName;
            if(this.taskType === "" || this.taskType === null || this.taskType === undefined){
              this.taskType = '';
            }
        });

      this.taskTypeId = parseInt(event.target.value);
      this.assetTaskGroupStrategyObject.taskTypeId = this.taskTypeId;

      this.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;
      this.assetTaskGroupStrategyObject.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;

      if(this.taskTypeId === 0){
        this.isInvalid = true;
      }else{
        this.isInvalid = false;
      }

      // this.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.taskType
    }

    tradeTypeOnSelect(event){
      this._tradeTypeService.getTradeTypeById(event.target.value)
        .subscribe(res => {
            this.tradeType = res.tradeTypeName;
            if(this.tradeType === "" || this.tradeType === null || this.tradeType === undefined){
              this.tradeType = '';
            }
        });

      this.tradeTypeId = parseInt(event.target.value);
      this.assetTaskGroupStrategyObject.tradeTypeId = this.tradeTypeId;

      this.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;
      this.assetTaskGroupStrategyObject.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;

      if(this.tradeTypeId === 0){
        this.isInvalid = true;
      }else{
        this.isInvalid = false;
      }

      // this.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.taskType
    }

    componentFamilyFilterOnSelect(event){
      this.familyFilter = parseInt(event.target.value);
    }

    componentClassFilterOnSelect(event){
      this.classFilter = parseInt(event.target.value);
    }

    componentSubClassFilterOnSelect(event){
      this.subClassFilter = parseInt(event.target.value);
    }

    componentBuildSpecFilterOnSelect(event){
      this.buildSpecFilter = parseInt(event.target.value);
    }

    componentManufacturerFilterOnSelect(event){
      this.manufacturerFilter = parseInt(event.target.value);
    }

    operationalModeFilterOnSelect(event){
        this.operationalModeFilter = parseInt(event.target.value);
    }

    durationFilterOnSelect(event){
      this.durationFilter = parseInt(event.target.value);
    }

    frequencyFilterOnSelect(event){
      this.frequencyFilter = parseInt(event.target.value);
    }

    tradeTypeFilterOnSelect(event){
      this.tradeTypeFilter = parseInt(event.target.value);
    }

    taskTypeFilterOnSelect(event){
      this.taskTypeFilter = parseInt(event.target.value);
    }

    isCheckRoute(event: any) {
        if(event.target.checked === true){
            this.isRoute = true;
            this.isDisableRoute = true;
        }else{
          this.isRoute = false;
          this.isDisableRoute = false;
        }
    }

    multisearchFilter(): void{
      this.componentId = this.assetClassTaxonomyId;
      if(this.componentCodeFilter === 'M1' && this.componentLevelFilter === 1){
        this._fmeaService.getFMEATaskListLevel1Filters(this.componentCodeFilter, this.familyFilter, this.classFilter, this.subClassFilter, this.buildSpecFilter, this.manufacturerFilter, this.tradeTypeFilter, this.taskTypeFilter, this.operationalModeFilter, this.frequencyFilter, this.durationFilter, this.failureScoreTotal)
            .subscribe(res => {
                      // console.log(res)
                      // this.fmeaId = res["id"];
                      this.default = false;
                      this.loading = false;
                      this.ELEMENT_DATA = res;
                      this.dataSource2 = new MatTableDataSource<IAllFMEAList>(this.ELEMENT_DATA);
                      this.dataSource2.paginator = this.tableOnePaginator;
                      this.dataSource2.sort = this.sort;
                      this.fmeaList = res;
                });
      }
      else{
        this._fmeaService.getFMEATaskListFilters(this.componentCodeFilter, this.familyFilter, this.classFilter, this.subClassFilter, this.buildSpecFilter, this.manufacturerFilter, this.tradeTypeFilter, this.taskTypeFilter, this.operationalModeFilter, this.frequencyFilter, this.durationFilter, this.failureScoreTotal)
        .subscribe(res => {
                  // console.log(res)
                  // this.fmeaId = res["id"];
                  this.default = false;
                  this.loading = false;
                  this.ELEMENT_DATA = res;
                  this.dataSource2 = new MatTableDataSource<IAllFMEAList>(this.ELEMENT_DATA);
                  this.dataSource2.paginator = this.tableOnePaginator;
                  this.dataSource2.sort = this.sort;
                  this.fmeaList = res;
            });
      }
    }

    mapStatusData(id: number): string {
      let retData = "";
      retData = this.systemStatusList.find(e => e.id === id);
      return retData;
    }

    mapAssetClassData(id: number): string {
      let retData = "";
      retData = this.assetClassList.find(e => e.id === id);
      // this.className = retData;
      return retData;
    }

    mapMaintUnitData(id: number): string {
      let retData = "";
      retData = this.maintUnitList.find(e => e.id === id);
      return retData;
    }

    mapMaintItemData(id: number): string {
      let retData = "";
      retData = this.componentClassTaxonomyList.find(e => e.id === id);
      return retData;
    }

    mapTaskTypeData(id: number): string {
      let retData = "";
      retData = this.taskTypeList.find(e => e.id === id);
      // this.taskType = retData;
      return retData;
    }

    mapOperationModeData(id: number): string {
      let retData = "";
      retData = this.operationModeList.find(e => e.id === id);
      // this.operationalmode = retData;
      return retData;
    }

    mapFreqData(id: number): string {
      let retData = "";
      retData = this.frequencyList.find(e => e.id === id);
      // console.log(retData)
      // this.frequency = retData;
      return retData;
    }

    mapTradeTypeData(id: number): string {
      let retData = "";
      retData = this.tradeTypeList.find(e => e.id === id);
      // this.tradeType = retData;
      return retData;
    }

    mapIndustryData(id: number): string {
      let retData = "";
      retData = this.industryTaxonomyList.find(e => e.id === id);
      return retData;
    }

    mapBusinessTypeData(id: number): string {
      let retData = "";
      retData = this.businessTypeTaxonomyList.find(e => e.id === id);
      return retData;
    }

    mapSpecData(id: number): string {
      let retData = "";
      retData = this.assetSpecTaxonomyList.find(e => e.id === id);
      return retData;
    }

    mapProcessFuncData(id: number): string {
      let retData = "";
      retData = this.processFunctionTaxonomyList.find(e => e.id === id);
      return retData;
    }

    mapManufacturerData(id: number): string {
      let retData = "";
      retData = this.assetManufacturerTaxonomyList.find(e => e.id === id);
      return retData;
    }

  isValidFormData(): boolean {
    return (this.frequencyId !== 0 && this.tradeTypeId !== 0 && this.operationalModeId !== 0 && this.assetClassId !== 0 && this.taskTypeId !== 0 ) ? true : false;

    // return true;
  }

  updateChanges(): void{
    this.assetTaskGroupStrategyObject.frequencyId = this.frequencyId;
    this.assetTaskGroupStrategyObject.taskTypeId = this.taskTypeId;
    this.assetTaskGroupStrategyObject.operationalModeId = this.operationalModeId;
    this.assetTaskGroupStrategyObject.tradeTypeId = this.tradeTypeId;
    this.assetTaskGroupStrategyObject.durationId = this.durationId;
    this.assetTaskGroupStrategyObject.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className + ' ' + this.taskType + ' ' + this.operationalmode;;
    this.assetTaskGroupStrategyObject.taskGroupStrategyId = this.taskGpStrategyId;
    this.assetTaskGroupStrategyObject.assetIndustryId = this.assetIndustryId;
    this.assetTaskGroupStrategyObject.businessTypeId = this.assetBusinessTypeId;
    this.assetTaskGroupStrategyObject.assetTypeId = this.assetTypeId;
    this.assetTaskGroupStrategyObject.processFunctionId = this.assetProcessFunctionId;
    this.assetTaskGroupStrategyObject.assetCategoryId = this.assetCategoryId;
    this.assetTaskGroupStrategyObject.assetClassTaxonomyId = this.assetClassId;
    this.assetTaskGroupStrategyObject.assetSpecTaxonomyId = this.assetSpecTaxonomyId;
    this.assetTaskGroupStrategyObject.assetFamilyTaxonomyId = this.assetFamilyTaxonomyId;
    this.assetTaskGroupStrategyObject.assetManufacturerTaxonomyId = this.assetManufacturerId;
    this.assetTaskGroupStrategyObject.componentFamilyTaxonomyId = this.maintUnitId;
    this.assetTaskGroupStrategyObject.componentClassTaxonomyId = this.componentClass;
    this.assetTaskGroupStrategyObject.componentSubClassTaxonomyId = this.componentSubClassId;
    this.assetTaskGroupStrategyObject.componentBuildSpecTaxonomyId = this.componentBuildSpecId;
    this.assetTaskGroupStrategyObject.componentManufacturerId = this.componentManufacturerId;
    this.assetTaskGroupStrategyObject.assetHierarchyId = this.tempTaskId;
    this.assetTaskGroupStrategyObject.systemStatus = this.systemStatus;
    this.assetTaskGroupStrategyObject.siteId = this.siteId;
    this.assetTaskGroupStrategyObject.customerId = this.customerId;

    this._assetTaskGroupStrategyService.updateStrategyGroup(this.currentId, this.assetTaskGroupStrategyObject)
      .subscribe(res => {
        this.isSave = true;
        this.toastr.success("Successfully saved!", 'Success');
        localStorage.removeItem("modalcomponentList");
        localStorage.removeItem("modaltaskList");
        localStorage.removeItem("fmeataskfinalsequence");
        localStorage.removeItem("fmeataskadded");
        localStorage.removeItem("containers");
        localStorage.removeItem("addedtasks");
        localStorage.removeItem("containersTask");
      });
    
  }

  saveChanges(): void{
    this.assetTaskGroupStrategyObject.frequencyId = this.frequencyId;
    this.assetTaskGroupStrategyObject.taskTypeId = this.taskTypeId;
    this.assetTaskGroupStrategyObject.operationalModeId = this.operationalModeId;
    this.assetTaskGroupStrategyObject.tradeTypeId = this.tradeTypeId;
    this.assetTaskGroupStrategyObject.durationId = this.durationId;
    this.assetTaskGroupStrategyObject.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className + ' ' + this.taskType + ' ' + this.operationalmode;
    // this.taskGpStrategyId = "";
    this.assetTaskGroupStrategyObject.taskGroupStrategyId = this.taskGpStrategyId;
    this.assetTaskGroupStrategyObject.assetIndustryId = this.assetIndustryId;
    this.assetTaskGroupStrategyObject.businessTypeId = this.assetBusinessTypeId;
    this.assetTaskGroupStrategyObject.assetTypeId = this.assetTypeId;
    this.assetTaskGroupStrategyObject.processFunctionId = this.assetProcessFunctionId;
    this.assetTaskGroupStrategyObject.assetCategoryId = this.assetCategoryId;
    this.assetTaskGroupStrategyObject.assetClassTaxonomyId = this.assetClassId;
    this.assetTaskGroupStrategyObject.assetSpecTaxonomyId = this.assetSpecTaxonomyId;
    this.assetTaskGroupStrategyObject.assetFamilyTaxonomyId = this.assetFamilyTaxonomyId;
    this.assetTaskGroupStrategyObject.assetManufacturerTaxonomyId = this.assetManufacturerId;
    this.assetTaskGroupStrategyObject.componentFamilyTaxonomyId = this.maintUnitId;
    this.assetTaskGroupStrategyObject.componentClassTaxonomyId = this.componentClass;
    this.assetTaskGroupStrategyObject.componentSubClassTaxonomyId = this.componentSubClassId;
    this.assetTaskGroupStrategyObject.componentBuildSpecTaxonomyId = this.componentBuildSpecId;
    this.assetTaskGroupStrategyObject.componentManufacturerId = this.componentManufacturerId;
    this.assetTaskGroupStrategyObject.assetHierarchyId = this.tempTaskId;

    if (this.isValidFormData()) {
      this._assetTaskGroupStrategyService.addStrategyGroup(this.assetTaskGroupStrategyObject)
        .subscribe(res => {
          this.taskId = res.id;
          // this.assetTaskGroupStrategyObject.taskGroupStrategyId = "TGS.000.00" + res.id;
          this.assetTaskGroupStrategyObject.id = res.id;
          this.isTaskId = true;
          this.frequencyDisabled = true;
          this.taskTypeDisabled = true;
          this.operationalModeDisabled = true;
          this.tradeTypeDisabled = true;
          this.durationDisabled = true;

          this.assignToUserObject.transactionId = res.id;
          this.assignToUserObject.transactionTypeId = 3;
          this.assignToUserObject.userPermissionGroupId = 5;
          this.assignToUserObject.status = 1;
          this.assignToUserObject.isActive = true;

          this._assignToUserService.addAssignGroupToUser(this.assignToUserObject)
              .subscribe(out => {
              });
          
      });
    }
    else{
           this.toastr.warning('Please fill out the required fields.', 'Warning');
           this.isInvalid = true;
    }
  }

  saveNext(){
    if (this.isValidFormData()) {
      if(this.assetManufacturerId !== 0 || this.assetSpecTaxonomyId !== 0)
      {
        this.selectedIndex = 1;
        this.assetTaskGroupStrategyObject.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.className +  ' '  + this.componentsubclass + ' ' + this.taskType + ' ' + this.operationalmode;
      }else{
        this.toastr.warning('Asset Manufacturer or Model Specification one must be filled in', 'Warning');
      }
    }
    else{
      this.toastr.warning('Please fill out the required fields.', 'Warning');
      this.isInvalid = true;
    }
  }

  getTaskGpStrategyDetails(){
    this._assetTaskGroupStrategyService.getTaskGroupStrategyById(this.tempTaskId) //taskId
        .subscribe(res => {
          // console.log(res);

          if(res.familyComponent === null){
            this.familyText = '';
          }

          if(res.componentClass === null){
            this.classText = '';
          }

          this.taxonomyText = this.familyText + ' - ' + this.familyText;
          this.taskGroupDescription = res.taskGroupDescription;
          this.taskid = res.taskGroupStrategyId;
          this.operationalMode = res.operationalModeName;
          this.tradeTypeName = res.tradeTypeName;
          this.frequency = res.frequencyName;
          this.durationName = res.durationName;
          this.taskTypeName = res.taskTypeName;
          this.taskid = res.taskGroupStrategyId;
          this.taskId = res.id;
        });

    this._assetTaskGroupStrategyService.getTaskGroupStrategyMaxFailureScore(this.tempTaskId) //taskId
        .subscribe(out => {
          // console.log(out)
            this.failureScore = out.failureScore;
        });
  }

  initializeMaterialdata(data: IAssignAssetTaskGroupStrategyMaterialSite){
    this.assignAssetTaskGroupMaterial = data;

    // this.materialId = this.assignAssetTaskGroupMaterial.id
    this.fmeaid = this.assignAssetTaskGroupMaterial.fmeaId;
    this.strategytaskid = this.assignAssetTaskGroupMaterial.taskId;
    // this.fileName = this.assignAssetTaskGroupMaterial.fileName;
  }

  openAttachTask(opt: string, data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = "90vw";
    dialogConfig.minHeight = "90vh";
    dialogConfig.maxWidth = "90vw";
    dialogConfig.maxHeight = "90vh";
    dialogConfig.position = { top: '30px' };
    dialogConfig.data = { mode: opt, item: data };
    this._dataService.setData(dialogConfig.data);
    const dialogRef = this.dialog.open(AttachTaskSiteModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
        // console.log(res)
        if(res === true)
        {
          var conttasks = JSON.parse(localStorage.getItem("containersTask"));
          var tasks = JSON.parse(localStorage.getItem("containers"));
          // console.log(conttasks)
          // console.log(tasks)

          // this.containerTask = _.map(_.groupBy(tasks, 'categoryName'));
          this.containerTask = tasks;
          var groups = new Set(this.containerTask.map(item => item.categoryName))
          this.result = [];
          groups.forEach(g => 
            this.result.push({
              categoryName: g, 
              values: this.containerTask.filter(i => i.categoryName === g)
            }
          ))

          // console.log(this.containerTask)

          if(this.containerTask !== null){
            this.isContainer = true;
          }

          localStorage.setItem("addedtasks", JSON.stringify(conttasks))
        }
        else{
          return true;
        }
    })
  }

  mapMaintItemIdData(id: number): string {
    let retData = "";
    retData = this.componentClassTaxonomyList.find(e => e.id === id);
    return retData;
  }

  mapMaintSubItemData(id: number): string {
    let retData = "";
    retData = this.componentSubClassTaxonomyList.find(e => e.id === id);
    return retData;
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    // console.log(event.container.data)
    this.result = event.container.data;
  }

  openDialogComment(mode: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {mode: mode, item: this.assetTaskGroupStrategyObject };
    this._dataService.setData(dialogConfig.data);
    dialogConfig.width = "600px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    const dialogRef = this.dialog.open(CommentModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
        console.log(res);
        if(res !== "cancel")
        {
          if(this.isHSMUser){
            this.assetTaskGroupStrategyObject.comment = res.comment;
            this.assetTaskGroupStrategyObject.customerId = res.customerId;
            this.assetTaskGroupStrategyObject.siteId = res.siteId;
            this.assetTaskGroupStrategyObject.systemStatus = 2;
            this.assetTaskGroupStrategyObject.createdBy = this.user;
            this.assetTaskGroupStrategyObject.updatedBy = this.user;
            this.SaveAll();
          }
          else{
            this.assetTaskGroupStrategyObject.comment = res;
            this.assetTaskGroupStrategyObject.systemStatus = 2;
            this.assetTaskGroupStrategyObject.createdBy = this.user;
            this.assetTaskGroupStrategyObject.updatedBy = this.user;
            this.SaveAll();
          }
        }else{
          this.isSave = false;
        }
    });
  }

  SaveAll(): void{
    this.containerTask.forEach( x => {
      // console.log(x.values)
      let fmeaid = x.fmeaid;
      let assemId = x.categoryId;
      let category = x.categoryName;
      let mainunit = x.maintUnitId;
      let mainitem = x.maintItemId;
      let maintsubitem = x.maintSubItem;

      this.materialHsmList.push({ 
        id: 0,
        fmeaId: fmeaid,
        taskId: this.taskId,
        batchId: this.taskId,
        categoryName: category,
        assemblyHierarchyId: assemId,
        maintUnitId: mainunit,
        maintItemId: mainitem,
        maintSubItemId: maintsubitem,
        fileName: '',
        isMultiple: false,
        isInclude: true,
        sequenceNo: this.materialHsmList.length+1,
        systemStatus: 1,
        siteId: this.siteId,
        customerId: this.customerId
      });

    });

    // console.log(this.materialHsmList)

    this._assignAssetTGSMaterialSiteService.upsertAssignAssetMaterialSite(this.materialHsmList)
      .subscribe(res => {
        // console.log("success");
        // this.toastr.success("Successfully saved!", 'Success');
        localStorage.removeItem("modalcomponentList");
        localStorage.removeItem("modaltaskList");
        localStorage.removeItem("fmeataskfinalsequence");
        localStorage.removeItem("fmeataskadded");
        localStorage.removeItem("containers");
        localStorage.removeItem("addedtasks");
        localStorage.removeItem("containersTask");
        this.isSave = true;
      });

      this.updateChanges();
    
  }

  deleteTask(fmeaId: any): void{
    if (confirm("Are you sure to delete this ? This cannot be undone.")) {
      
      var findIndex = this.containerTask.findIndex(e => { return e.fmeaid ===  fmeaId});
      
      this.containerTask.splice(findIndex,1);
  
      var groups = new Set(this.containerTask.map(item => item.categoryName))
      this.result = [];
      groups.forEach(g => 
        this.result.push({
          categoryName: g, 
          values: this.containerTask.filter(i => i.categoryName === g)
        }
      ));
      // console.log(this.result)
      localStorage.setItem("containers", JSON.stringify(this.containerTask));
    }
  }

  deleteTaskSaved(id: number): void{
    if (confirm("Are you sure to delete this ? This cannot be undone.")) {
      this._assignAssetTGSMaterialSiteService.deleteAssignAssetTaskGroupStrategyMaterial(id)
      .subscribe(res => {
          this.getTGSTasks();
      });
    }
  }
}