import { Component, Inject, OnInit, ElementRef, ViewChild, Output, EventEmitter, HostListener, Renderer2,} from '@angular/core';
import {Router} from '@angular/router';
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
import { IAddHierarchyToTask, IAssetTaskGroupStrategy, IAssignAssetTaskGroupStrategyHierarchy, IAssignAssetTaskGroupStrategyMaterial, IAssignAssetTaskGroupStrategyMaterialView, IAssignTaskToEquipment, IAssignTaskToEquipmentList } from './../../interfaces/IAssetTaskGroupStrategy';
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
import { CommentModalComponent } from '../../modal/commentmodal/commentmodal.component';

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
    selector: "asset-task-group-form",
    templateUrl: './assettaskgroupform.component.html',
    styleUrls: [
        './assettaskgroupform.component.scss'
    ]
})

export class AssetTaskGroupFormComponent implements OnInit {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssignAssetTaskGroupStrategyMaterials/FileUpload`;
    private serverPath = `https://localhost:44372/`;
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

    todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
    
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

    assignAssetTaskGroupMaterial: IAssignAssetTaskGroupStrategyMaterial = {
      id: 0,
      fmeaId: 0,
      taskId: 0,
      batchId: 0,
      componentFamilyId: 0,
      componentClassId: 0,
      componentSubClassId: 0,
      assetHierarchyId: 0,
      fileName: '',
      sequenceNo: 0,
      isMultiple: false,
      isInclude: true
    }

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
    operationalMode: string = "";
    durationName: string = "";
    tradeTypeName: string = "";
    taskTypeName: string = "";
    taskid: string = "";
    floc: string = "";
    acceptableLimits: string = "";
    correctiveActions: string = "";

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

    isLoading: boolean = false;

    public data: [];

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

    assetId: number = 0;
    famId : number = 0;
    classId: number = 0;
    subClassId: number = 0;
    user: string = "";

    tgsNo: number = 0;
    tempNo: number = 0;

    isMin: boolean = true;
    isMax: boolean = false;

    hierarchy: RootObject2;
    ELEMENT_DATA2: IAssetHierarchy[] = [];
    taskListEquipmentList: [] = [];
    assetHierarchyData: [] = [];
    componentData: [] = [];
    taskTempList: any[] = [];
    assetStrategyWithMaterial: IAssignAssetTaskGroupStrategyMaterialView[] = [];

    treeControl2 = new NestedTreeControl<AssetHierarchy>(node => node.Children);
    dataSource5 = new MatTreeNestedDataSource<AssetHierarchy>();
    assetHierarchyParam: IAssetHierarchyParam;

    TREE_DATA2: AssetHierarchy[] = [];

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

    pressed = false;
    currentResizeIndex: number;
    startX: number;
    startWidth: number;
    isResizingRight: boolean;
    resizableMousemove: () => void;
    resizableMouseup: () => void;

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
      private _assignAssetTaskGroupStrategyService: AssignTaskGroupStrategyService,
      private _categoryHierarchyService: CategoryHierarchyService,
      private _fmeaService: FMEAService,
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
      private _assignAssetTaskGroupHierarchyService: AssignAssetTaskGroupStrategyHierarchyService,
      private _assignAssetTaskStrategyMaterialService: AssignAssetTaskGroupStrategyMaterialService,
      private _workInstructionTaskTypeService: WorkInstructionTaskTypeService,
      private toastr: ToastrService,
      private _dataService: DataService,
      ) { 
        this.dataSource5.data = this.TREE_DATA2;
      }

      hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
      hasChild2 = (_: number, node: AssetHierarchy) => !!node.Children && node.Children.length > 0;

    ngOnInit(): void {
      this.user = localStorage.getItem("loggUser");
      this.isLoading = true;
      let fmeadata = localStorage.getItem("fmeaform");
      var hierarchyData = localStorage.getItem("assethierarchyData");

      this._assetTaskGroupStrategyService.getAssetTaskGroupStrategyLastRow()
        .subscribe(foo => {
          // console.log(foo)

          this.tempTaskId = foo.lastId+1;
            // console.log(this.tempTaskId)
        });

      this._assetTaskGroupStrategyService.getAssetTaskGroupStrategyLastNumber()
          .subscribe(out => {
            this.tgsNo = Number(out.lastId);
            this.tempNo = this.tgsNo+1;
            this.isLoading = false;
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

        this._categoryHierarchyService.getComponentCategoryHierarchy()
        .subscribe( res => {    
          this.dataSource.data = JSON.parse(res['hierarchy']);
        });

        this.isTaskId = false;

        this.nodeClick(this.componentName);

        forkJoin(
          this._frequenceService.getFrequency(),
          this._durationService.getDuration(),
          this._tradeTypeService.getTradeType(),
          this._operationModeService.getOperationalMode(),
          this._industryTaxonomyService.getAssetIndustry(),
          this._businessTypeTaxonomyService.getAssetBusinessType(),
          this._assetTypeTaxonomyService.getAssetType(),
          this._processFunctionTaxonomyService.getProcessFunction(),
          this._assetClassTaxonomyService.getAssetClassTaxonomy(),
          this._assetSpecTaxonomyService.getSpecTaxonomy(),
          this._assetFamilyTaxonomyService.getAssetFamilyTaxonomy(),
          this._assetManufacturerTaxonomyService.getAssetManufacturer(),
          this._compFamilyTaxonomyService.getComponentFamily(),
          this._comClassTaxonomyService.getComponentClass(),
          this._comSubClassTaxonomyService.getComponentSubClass(),
          this._comBuildSpecTaxonomyService.getComponentBuildSpec(),
          this._comManufacturerTaxonomyService.getComponentManufacturer(),
          // this._taskTypeService.getTaskType(),
          this._workInstructionTaskTypeService.getWorkInstructionTaskType(),
          this._assetCategoryService.getAssetCategory(),
          this._categoryHierarchyService.getComponentCategoryHierarchyLevel1(),
          // this._categoryHierarchyService.getComponentCategoryHierarchyLevel2(),
          // this._categoryHierarchyService.getComponentCategoryHierarchyLevel3(),
          // this._assetTaskGroupStrategyService.getAssetTaskGroupStrategyById(this.assetTaskGroupStrategyObject.Id),
          ).subscribe(([fr, dr, tt, op, it, bt, at, pf, ct, st, ft, mf, cf, cc, sc, bs, cm, tk, ac, ch]) => {
              this.frequencyList = fr;
              this.durationList = dr;
              this.tradeTypeList = tt;
              this.operationModeList = op;
              this.taskTypeList = tk;
              this.industryTaxonomyList = it;
              this.businessTypeTaxonomyList = bt;
              this.processFunctionTaxonomyList = pf;
              this.assetTypeTaxonomyList = at;
              this.assetClassTaxonomyList = ct;
              this.assetSpecTaxonomyList = st;
              this.assetFamilyTaxonomyList = ft;
              this.assetManufacturerTaxonomyList = mf;
              this.componentFamilyTaxonomyList = cf;
              this.componentClassTaxonomyList = cc;
              this.componentSubClassTaxonomyList = sc;
              this.componentBuildSpecTaxonomyList = bs;
              this.componentManufacturerTaxonomyList = cm;
              this.assetCategoryList = ac;
              this.assetClassList = ch;
              // this.componentLevel2List = chl;
              // this.componentLevel3List = cht;
              // this.initializeFieldData(sd);
          });

          this.default = true;
          this.default2 = true;

          if (hierarchyData !== null) {
            this.dataSource5.data = JSON.parse(hierarchyData);
          } else {
            this.getDataSource();
          }
      }
      else{
        this._categoryHierarchyService.getComponentCategoryHierarchy()
        .subscribe( res => {    
          this.dataSource.data = JSON.parse(res['hierarchy']);
        })

        this.isTaskId = false;

        forkJoin(
          this._frequenceService.getFrequency(),
          this._durationService.getDuration(),
          this._tradeTypeService.getTradeType(),
          this._operationModeService.getOperationalMode(),
          this._industryTaxonomyService.getAssetIndustry(),
          this._businessTypeTaxonomyService.getAssetBusinessType(),
          this._assetTypeTaxonomyService.getAssetType(),
          this._processFunctionTaxonomyService.getProcessFunction(),
          this._assetClassTaxonomyService.getAssetClassTaxonomy(),
          this._assetSpecTaxonomyService.getSpecTaxonomy(),
          this._assetFamilyTaxonomyService.getAssetFamilyTaxonomy(),
          this._assetManufacturerTaxonomyService.getAssetManufacturer(),
          this._compFamilyTaxonomyService.getComponentFamily(),
          this._comClassTaxonomyService.getComponentClass(),
          this._comSubClassTaxonomyService.getComponentSubClass(),
          this._comBuildSpecTaxonomyService.getComponentBuildSpec(),
          this._comManufacturerTaxonomyService.getComponentManufacturer(),
          this._taskTypeService.getTaskType(),
          this._workInstructionTaskTypeService.getWorkInstructionTaskType(),
          this._assetCategoryService.getAssetCategory(),
          this._categoryHierarchyService.getComponentCategoryHierarchyLevel1(),
          // this._categoryHierarchyService.getComponentCategoryHierarchyLevel2(),
          // this._categoryHierarchyService.getComponentCategoryHierarchyLevel3(),
          // this._assetTaskGroupStrategyService.getAssetTaskGroupStrategyById(this.assetTaskGroupStrategyObject.Id),
          ).subscribe(([fr, dr, tt, op, it, bt, at, pf, ct, st, ft, mf, cf, cc, sc, bs, cm, tk, wt, ac, ch,]) => {
              this.frequencyList = fr;
              this.durationList = dr;
              this.tradeTypeList = tt;
              this.operationModeList = op;
              this.taskTypeList = wt;
              this.industryTaxonomyList = it;
              this.businessTypeTaxonomyList = bt;
              this.assetTypeTaxonomyList = at;
              this.processFunctionTaxonomyList = pf;
              this.assetClassTaxonomyList = ct;
              this.assetSpecTaxonomyList = st;
              this.assetFamilyTaxonomyList = ft;
              this.assetManufacturerTaxonomyList = mf;
              this.componentFamilyTaxonomyList = cf;
              this.componentClassTaxonomyList = cc;
              this.componentSubClassTaxonomyList = sc;
              this.componentBuildSpecTaxonomyList = bs;
              this.componentManufacturerTaxonomyList = cm;
              this.assetCategoryList = ac;
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
              this.assetClassList = ch;
              // this.componentLevel2List = chl;
              // this.componentLevel3List = cht;
              // console.log(sc, bs, cm)
              // this.initializeFieldData(sd);
          });

          this.default = true;
          this.default2 = true;
      }

      if (hierarchyData !== null) {
        this.dataSource5.data = JSON.parse(hierarchyData);
      } else {
        this.getDataSource();
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

    getDataSource() {
      this.loading = true;
      this.loading2 = true;
      this._tempHierarchyService.getAssetHierarchy()
        .subscribe(res => {
          // console.log(res['hierarchy']);
  
          // this.TREE_DATA.push(res['hierarchy']);
          setTimeout(()=>{                           // <<<---using ()=> syntax
            this.dataSource5.data = JSON.parse(res['hierarchy']);
            this.loading = false;
            this.loading2 = false;
    
            // console.log(this.dataSource.data);
    
            localStorage.setItem("assethierarchyData", JSON.stringify(this.dataSource5.data));
    
        }, 6000);
  
         
        });
    }

    initializeFieldData(data: IAssetTaskGroupStrategy): void {
        
      let i = 0;

      this.assetTaskGroupStrategyObject = data;
      
      this.taskId = data.id;
      this.taskGroupDescription = data.taskGroupDescription;
      this.frequencyId = data.frequencyId;
      this.tradeTypeId = data.tradeTypeId;
      this.operationalModeId = data.operationalModeId;
      this.durationId = data.durationId;
      this.taskTypeId = data.taskTypeId;
  }

    hide() {
      this.isHide = true;
    }

    unHide() {
      this.isHide = false;
    }

    industryOnSelect(event){
      this.assetIndustryId = parseInt(event.target.value)
    }

    businessTypeOnSelect(event){
      this.assetBusinessTypeId = parseInt(event.target.value)
    }

    assetTypeOnSelect(event){
      this.assetTypeId = parseInt(event.target.value)
    }

    processFunctionOnSelect(event){
      this._processFunctionTaxonomyService.getProcessFunctionById(event.target.value)
        .subscribe(res => {
          this.processfunction = res.processFunction;
          if(this.processfunction === "" || this.processfunction === null || this.processfunction === undefined){
            this.processfunction = '';
          }else{
            this.className = '';
          }
        })

        // if(this.processfunction === undefined){
        //   this.processfunction = '';
        // }

      this.assetProcessFunctionId = parseInt(event.target.value)
    }

    assetCategoryOnSelect(event){

      this.assetCategoryId = parseInt(event.target.value)
    }

    assetClassOnSelect(event){
      this._categoryHierarchyService.getComponentById(event.target.value)
        .subscribe(res => {
            this.className = res.categoryName;
            if(this.className === "" || this.className === null || this.className === undefined){
              this.className = '';
            }
            this.componentLevel = res.level;
            this.componentCode = res.categoryCode;

            // console.log(this.componentCode);

            this._categoryHierarchyService.getComponentCategoryHierarchyLevel2(this.componentCode)
              .subscribe(out => {
                  // console.log(out)
                  this.componentLevel2List = out;
                  this.isDisableLevel2 = false;
              });
        });

      this.assetClassId = parseInt(event.target.value)

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
    }

    assetManufacturerOnSelect(event){
      this.assetManufacturerId = parseInt(event.target.value)
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
    }

    componentClassOnSelect(event){
      this.componentClass = parseInt(event.target.value)
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
    }

    componentBuildSpecOnSelect(event){
      this.componentBuildSpecId = parseInt(event.target.value)
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
  
        if(this.operationalModeId === 0){
          this.isInvalid = true;
        }else{
          this.isInvalid = false;
        }
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

      if(this.frequencyId === 0){
        this.isInvalid = true;
      }else{
        this.isInvalid = false;
      }
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

      if(this.tradeTypeId === 0){
        this.isInvalid = true;
      }else{
        this.isInvalid = false;
      }

      // this.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.taskType
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

      if(this.taskTypeId === 0){
        this.isInvalid = true;
      }else{
        this.isInvalid = false;
      }

      // this.taskGroupDescription = this.frequency + ' ' + this.tradeType + ' ' + this.taskType
    }

    componentLevel2OnSelect(event){
      this.componentLevel2Id = parseInt(event.target.value);

      this._categoryHierarchyService.getComponentById(event.target.value)
        .subscribe(res => {
          this.componentCode = res.categoryCode;
          this.componentLevel2name = res.categoryName;
          if(this.componentLevel2name === "" || this.componentLevel2name === null || this.componentLevel2name === undefined){
            this.componentLevel2name = '';
          }
          
          this._categoryHierarchyService.getComponentCategoryHierarchyLevel3(res.categoryCode)
          .subscribe(out => {
              this.componentLevel3List = out;
              this.isDisableLevel3 = false;
          })
        });

    }

    componentLevel3OnSelect(event){
      this.componentLevel3Id = parseInt(event.target.value)

      this._categoryHierarchyService.getComponentById(event.target.value)
        .subscribe(res => {
            // console.log(res.categoryCode);
            this.componentCode = res.categoryCode;
            this.componentLevel3name = res.categoryName;
            if(this.componentLevel3name === "" || this.componentLevel3name === null || this.componentLevel3name === undefined){
              this.componentLevel3name = '';
            }
        });
    }

    //Multi Filter On Select
    ComponentLevel1FilterOnSelect(event){
      this._categoryHierarchyService.getComponentById(event.target.value)
        .subscribe(res => {
            this.componentLevelFilter = res.level;
            this.componentCodeFilter = res.categoryCode;

            // console.log(this.componentCodeFilter);

            this._categoryHierarchyService.getComponentCategoryHierarchyLevel2(this.componentCodeFilter)
              .subscribe(out => {
                  // console.log(out)
                  this.componentLevel2FilterList = out;
                  this.isDisableLevel2 = false;
              });
        });

      this.componentLevel1filter = parseInt(event.target.value);
    }

    componentLevel2FilterOnSelect(event){
      this.componentLevel2filter = parseInt(event.target.value);

      this._categoryHierarchyService.getComponentById(event.target.value)
        .subscribe(res => {
          this.componentCodeFilter = res.categoryCode;
          
          this._categoryHierarchyService.getComponentCategoryHierarchyLevel3(res.categoryCode)
          .subscribe(out => {
              this.componentLevel3FilterList = out;
              this.isDisableLevel3 = false;
          })
        });

    }

    componentLevel3FilterOnSelect(event){
      this._categoryHierarchyService.getComponentById(event.target.value)
        .subscribe(res => {
          this.componentCodeFilter = res.categoryCode;
        });

      this.componentLevel3filter = parseInt(event.target.value);
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
      this.untoggleFilter();
    }


    openDialogFilter(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "700px";
      dialogConfig.height = "auto";
      dialogConfig.position = { top: '30px' };
      const dialogRef = this.dialog.open(MultiFilterModalComponent, dialogConfig);
  }

  isValidFormData(): boolean {
    return (this.frequencyId !== 0 && this.tradeTypeId !== 0 && this.operationalModeId !== 0 && this.assetClassId !== 0 && this.taskTypeId !== 0) ? true : false;

    // return true;
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
    this.assetTaskGroupStrategyObject.assetClassTaxonomyId = this.assetClassTaxonomyId;
    this.assetTaskGroupStrategyObject.assetSpecTaxonomyId = this.assetSpecTaxonomyId;
    this.assetTaskGroupStrategyObject.assetFamilyTaxonomyId = this.assetFamilyTaxonomyId;
    this.assetTaskGroupStrategyObject.assetManufacturerTaxonomyId = this.assetManufacturerId;
    this.assetTaskGroupStrategyObject.componentFamilyTaxonomyId = this.componentFamilyId;
    this.assetTaskGroupStrategyObject.componentClassTaxonomyId = this.componentClass;
    this.assetTaskGroupStrategyObject.componentSubClassTaxonomyId = this.componentSubClassId;
    this.assetTaskGroupStrategyObject.componentBuildSpecTaxonomyId = this.componentBuildSpecId;
    this.assetTaskGroupStrategyObject.componentManufacturerId = this.componentManufacturerId;
    this.assetTaskGroupStrategyObject.createdBy = this.user;
    this.assetTaskGroupStrategyObject.updatedBy = this.user;
    this.assetTaskGroupStrategyObject.systemStatus = 2;

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

          // this._assetTaskGroupStrategyService.updateStrategyGroup(this.assetTaskGroupStrategyObject.id, this.assetTaskGroupStrategyObject)
          //     .subscribe(out =>{
          //       // console.log(out);
          //       this.taskId = out.id;
          //       // this.taskGpStrategyId = this.assetTaskGroupStrategyObject.taskGroupStrategyId;
          //       // this.toastr.success("Successfully saved!", 'Success');
          //       // this.selectedIndex = 1;
          //       // this.isDisabledTab1 = true;
          //       // this.isDisabledTab2 = false;
          //       // this.getTaskGpStrategyDetails();
          //       // this.searchFilter();
          //     });

          // this._assetTaskGroupStrategyService.updateTGSBatchId(this.taskId, this.tempTaskId)
          //     .subscribe(x=> {
          //       console.log("success")
          //     })
          
      });
    }
    else{
           this.toastr.warning('Please fill out the required fields.', 'Warning');
           this.isInvalid = true;
    }
  }

  saveNext(){
    if (this.isValidFormData()) {
      this._fmeaService.getFMEATaskListFilters(this.componentCode, this.componentFamilyId, this.componentClass, this.componentSubClassId, this.componentBuildSpecId, this.componentManufacturerId, this.tradeTypeId, this.taskTypeId, this.operationalModeId, this.frequencyId, this.durationId, this.failureScoreTotal)
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
        this.isMin = true;
        this.isMax = false;
        this.selectedIndex = 1;
    }
    else{
      this.toastr.warning('Please fill out the required fields.', 'Warning');
      this.isInvalid = true;
    }
  }

  nodeClick(node: any){

    this.componentId = node;
    this.componentName = node;
    // console.log(this.componentId)

    this._categoryHierarchyService.getComponentById(this.componentId)
      .subscribe(out => {
        this.componentCode = out.categoryCode;
        this.componentLevel = out.level;
        // console.log(this.componentCode)

        this._fmeaService.getFMEATaskListFilters(this.componentCode, this.componentFamilyId, this.componentClass, this.componentSubClassId, this.componentBuildSpecId, this.componentManufacturerId, this.tradeTypeId, this.taskTypeId, this.operationalModeId, this.frequencyId, this.durationId, this.failureScoreTotal)
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

  toggleColumn() {
    if (this.displayTableColumn)
      this.displayTableColumn = false;
    else
      this.displayTableColumn = true;
  }

  unToggleColumn(){
    this.displayTableColumn = false;
  }

  onClickDocument(event) {
    if (this.displayTableColumn) {
      if (!this.tableColumn.nativeElement.contains(event.target)) // or some similar check
        this.toggleColumn();
    }
  }

  searchFilter(): void{
    this.componentId = this.assetClassTaxonomyId;
    if(this.componentCode === 'M1' && this.componentLevel === 1){
      this._fmeaService.getFMEATaskListLevel1Filters(this.componentCode, this.componentFamilyId, this.componentClass, this.componentSubClassId, this.componentBuildSpecId, this.componentManufacturerId, this.tradeTypeId, this.taskTypeId, this.operationalModeId, this.frequencyId, this.durationId, this.failureScoreTotal)
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
      this._fmeaService.getFMEATaskListFilters(this.componentCode, this.componentFamilyId, this.componentClass, this.componentSubClassId, this.componentBuildSpecId, this.componentManufacturerId, this.tradeTypeId, this.taskTypeId, this.operationalModeId, this.frequencyId, this.durationId, this.failureScoreTotal)
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

  clearFilter(): void{
    this.componentLevel1filter = 0;
    this.componentLevel2filter = 0;
    this.componentLevel3filter = 0;
    this.familyFilter = 0;
    this.subClassFilter = 0;
    this.manufacturerFilter = 0;
    this.operationalModeFilter = 0;
    this.tradeTypeFilter = 0;
    this.classFilter = 0;
    this.buildSpecFilter = 0;
    this.taskTypeFilter = 0;
    this.frequencyFilter = 0;
    this.durationFilter = 0;
  }

  addColumnTaskId() {
    if (this.tableTaskId === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('taskIdentificationNo');
      }
      if (this.displayedColumns3.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns3.push('taskIdentificationNo');
      }
    } else {
      this.removeColumn('taskIdentificationNo');
    }
  }

  addColumnParent() {
    if (this.tableParent === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('parentCode');
      }
      if (this.displayedColumns3.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns3.push('parentCode');
      }
    } else {
      this.removeColumn('parentCode');
    }
  }

  addColumnFailureMode() {
    if (this.tableFailureMode === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('failureMode');
      }
      if (this.displayedColumns3.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns3.push('failureMode');
      }
    } else {
      this.removeColumn('failureMode');
    }
  }

  addColumnTaskDesc() {
    if (this.tableTaskDesc === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns.push('taskDescription');
      }
      if (this.displayedColumns3.length) {
        // this.displayedColumns.splice(1, 1, "code");
        this.displayedColumns3.push('taskDescription');
      }
    } else {
      this.removeColumn('taskDescription');
    }
  }

  addColumnFailureScore() {
    if (this.tableFailureScore === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('failureRiskTotalScore');
      }
      if (this.displayedColumns3.length) {
        this.displayedColumns3.push('failureRiskTotalScore');
      }
    } else {
      this.removeColumn('failureRiskTotalScore');
    }
  }

  addColumnAcceptableLimits() {
    if (this.tableLimits === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('acceptableLimits');
      }
      if (this.displayedColumns3.length) {
        this.displayedColumns3.push('acceptableLimits');
      }
    } else {
      this.removeColumn('acceptableLimits');
    }
  }

  addColumnCorrectiveActions() {
    if (this.tableCorrective === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('correctiveActions');
      }
      if (this.displayedColumns3.length) {
        this.displayedColumns3.push('correctiveActions');
      }
    } else {
      this.removeColumn('correctiveActions');
    }
  }

  addColumnTaskType() {
    if (this.tableTaskType === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('taskTypeName');
      }
      if (this.displayedColumns3.length) {
        this.displayedColumns3.push('taskTypeName');
      }
    } else {
      this.removeColumn('taskTypeName');
    }
  }

  addColumnFrequency() {
    if (this.tableInterval === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('frequencyName');
      }
      if (this.displayedColumns3.length) {
        this.displayedColumns3.push('frequencyName');
      }
    } else {
      this.removeColumn('frequencyName');
    }
  }

  addColumnFamily() {
    if (this.tableFamily === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('familyComponent');
      }
      if (this.displayedColumns3.length) {
        this.displayedColumns3.push('familyComponent');
      }
    } else {
      this.removeColumn('familyComponent');
    }
  }

  addColumnClass() {
    if (this.tableClass === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('componentClass');
      }
      if (this.displayedColumns3.length) {
        this.displayedColumns3.push('componentClass');
      }
    } else {
      this.removeColumn('componentClass');
    }
  }

  addColumnSubClass() {
    if (this.tableSubClass === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('subClass');
      }
      if (this.displayedColumns.length) {
        this.displayedColumns.push('subClass');
      }
    } else {
      this.removeColumn('subClass');
    }
  }

  addColumnBuildSpec() {
    if (this.tableBuildSpec === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('buildSpec');
      }
      if (this.displayedColumns3.length) {
        this.displayedColumns3.push('buildSpec');
      }
    } else {
      this.removeColumn('buildSpec');
    }
  }

  addColumnManufacturer() {
    if (this.tableManufacturer === true) {
      if (this.displayedColumns.length) {
        this.displayedColumns.push('componentManufacturer');
      }
      
      if (this.displayedColumns3.length) {
        this.displayedColumns3.push('componentManufacturer');
      }
    } 
    else {
      this.removeColumn('componentManufacturer');
    }
  }

  removeColumn(msg: string) {
    const index: number = this.displayedColumns.indexOf(msg);
    const index2: number = this.displayedColumns3.indexOf(msg);
    if (index !== -1) {
      this.displayedColumns.splice(index, 1);
      this.displayedColumns3.splice(index2, 1);
    }
  }

  addThis(event: any, taskId: number, fmeaId: number): void{
    // let data = JSON.parse(localStorage.loggedUser);
    // uPermissionGroupId = this.currentId;
    taskId = this.tempTaskId;
    // fmeaId = this.fmeaId;
    console.log(taskId, fmeaId)

    if(event.target.checked === true)
    {
        this.fmeaTaskAddedObject ={
            id: 0,
            isActive: true,
            isChecked: true,
            taskId: taskId,
            fmeaId: fmeaId,
            sequenceNo: +1
        };

        this.saveTaskAdded();
    }
    else if(event.target.checked === false)
    {
        this.fmeaTaskAddedObject = {
            id: 0,
            isActive: true,
            isChecked: true,
            taskId: 0,
            fmeaId: 0,
            sequenceNo: +1
        };

        this.saveTaskAdded();
    }
  }

  addFMEATask(event: any, fmeaid: number): void{
    var index = this.fmeataskaddedList.map(x => {
      return x.id;
    }).indexOf(fmeaid);

    if (event.target.checked === true) {
      console.log(fmeaid)

      this._fmeaTaskAddedService.getFMEATaskAddedByFmeaId(fmeaid)
        .subscribe(res => {
          // console.log(res);
          res.forEach( x => {
            let acclimits  = x.acceptableLimits;
            let builds  = x.buildSpec;
            let cClass  = x.componentClass;
            let cManufacture  = x.componentManufacturer;
            let cActions  = x.correctiveActions;
            let fmode  = x.failureMode;
            let fScore  = x.failureRiskTotalScore;
            let familyCom  = x.familyComponent;
            let fmId  = x.fmeaId;
            let freq  = x.frequencyName;
            let unId  = x.id;
            let pCode  = x.parentCode;
            let sClass  = x.subClass;
            let taskDesc  = x.taskDescription;
            let tasknUm  = x.taskId;
            let taskIdent  = x.taskIdentificationNo;
            let tType  = x.taskTypeName;
            let famId = x.familyTaxonomyId;
            let classId = x.classTaxonomyId;
            let subClassId = x.subClassTaxonomyId;

            // this.fmeataskaddedList.push(this.fmeaList.filter(foo => foo.id === fmeaid));

            this.fmeataskaddedList.push({
              acceptableLimits: acclimits,
              buildSpec: builds,
              componentClass: cClass,
              componentManufacturer: cManufacture,
              correctiveActions: cActions,
              failureMode: fmode,
              failureRiskTotalScore: fScore,
              familyComponent: familyCom,
              frequencyName: freq,
              id: unId,
              parentCode: pCode,
              subClass: sClass,
              taskDescription: taskDesc,
              taskIdentificationNo: taskIdent,
              taskTypeName: tType,
              familyTaxonomyId: famId,
              classTaxonomyId: classId,
              subClassTaxonomyId: subClassId,
              sequenceNo: this.fmeataskaddedList.length + 1
            });

            this.ELEMENT_DATA_3 = this.fmeataskaddedList;
            this.dataSource3 = new MatTableDataSource<IFMEATaskAddedList>(this.ELEMENT_DATA_3);
          });          
        });
    }else{
      this.fmeataskaddedList.splice(index, fmeaid);
      this.ELEMENT_DATA_3 = this.fmeataskaddedList;
      this.dataSource3 = new MatTableDataSource<IFMEATaskAddedList>(this.ELEMENT_DATA_3);
    }
    
  }

  saveTaskAdded(): void{
    this._fmeaTaskAddedService.addfmeaTaskAdded(this.fmeaTaskAddedObject)
        .subscribe(res => {
            // this.toastr.success('added successfully.', 'Success');
            this.getFmeaTaskAddedListData(this.tempTaskId);
        });
  }

  getFmeaTaskAddedListData(id: number){
    console.log(id);
    this._fmeaTaskAddedService.getFMEATaskAddedById(id)
      .subscribe(res => {
          // console.log(res);
          this.loading2 = false;
          this.default2 = false;
          this.fmeaTaskAddedListData = res;
          this.ELEMENT_DATA_3 = res;
          this.dataSource1 = new MatTableDataSource<IFMEATaskAddedList>(this.ELEMENT_DATA_3);
          this.dataSource1.paginator = this.tableTwoPaginator;
          this.dataSource1.sort = this.sort;
      })
}

  saveNextComponent(){
    localStorage.setItem("fmeataskadded", JSON.stringify(this.fmeataskaddedList));
    this.selectedIndex = 2;

    // this._fmeaTaskAddedService.getFMEATaskAddedSequenceById(this.tempTaskId)
    //   .subscribe(res => {
    //     this.isDisabledTab3 = false;
    //     this.isDisabledTab2 = true;
    //     this.loading2 = false;
    //     this.default2 = false;
    //     this.fmeaTaskAddedSequenceList = res;
    //     // console.log(this.fmeaTaskAddedSequenceList);
    //     this.ELEMENT_DATA_4 = res;
    //     this.dataSource3 = new MatTableDataSource<IFMEATaskAddedSequence>(this.ELEMENT_DATA_4);
    //     this.dataSource3.paginator = this.paginator;
    //     this.dataSource3.sort = this.sort;
    //   });
    this.ELEMENT_DATA_4 = this.fmeataskaddedList;
    this.dataSource3 = new MatTableDataSource<IFMEATaskAddedSequence>(this.ELEMENT_DATA_4);
    this.dataSource3.paginator = this.paginator;
    this.dataSource3.sort = this.sort;
    
  }

  saveAddedTasks() : void {
    var taskaddedlist = JSON.parse(localStorage.getItem("fmeataskadded"));
    // console.log(taskaddedlist)

    taskaddedlist.forEach(x => {
      let fmeaid = x.id;
      let sequence = x.sequenceNo;

        this.fmeaTaskList.push({
          id: 0,
          isActive: true,
          isChecked: true,
          taskId: this.tempTaskId,
          fmeaId: fmeaid,
          sequenceNo: sequence
      });
    });

    // this._fmeaTaskAddedService.addfmeaTaskAdded(this.fmeaTaskAddedObject)
    //     .subscribe(res => {
    //       console.log("success");
    //     });

    this._fmeaTaskAddedService.upsertfmeaTaskAdded(this.fmeaTaskList)
      .subscribe(res => {
        console.log("success");
      })
  }

  dropTable(event: CdkDragDrop<IFMEATaskAddedSequence[]>) {
    const prevIndex = this.dataSource3.data.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource3.data, prevIndex, event.currentIndex);
    this.table.renderRows();

    // console.log(this.dataSource3.data);
    this.fmeataskaddedList = this.dataSource3.data;
    // console.log(this.fmeataskaddedList);

  }

  // saveSequence(): void{
  //   this.fmeaTaskAddedList.forEach(
  //     x =>{
  //       let addedId = x.id;
  //       let fmeaId = x.fmeaId;
  //       let taskId = x.taskId;
  //       let seqNum = x.sequenceNo;

  //       this.addedTaskId = addedId;

  //       // console.log(x);

  //       this.assetTaskGrpSequenceList.push({ 
  //         id: 0,
  //         fmeaId: fmeaId,
  //         taskId: taskId,
  //         addedTaskId: this.addedTaskId,
  //         sequenceNumber: this.assetTaskGrpSequenceList.length+1
  //       });

  //     });
    
  //   if(this.fmeaTaskAddedList.length > 1){
  //     this._assetTaskgroupSequenceService.upsertfmeaTaskSequence(this.assetTaskGrpSequenceList)
  //     .subscribe(out => {
  //       // console.log(out);
  //       this._assetTaskgroupSequenceService.getFMEATaskAddedFinalSequenceById(this.tempTaskId)
  //         .subscribe(res => {
  //           // console.log(res);
  //           this.loading2 = false;
  //           this.default2 = false;
  //           this.ELEMENT_DATA_4 = res;
  //           this.dataSource3 = new MatTableDataSource<IFMEATaskAddedSequence>(this.ELEMENT_DATA_4);
  //           this.dataSource3.paginator = this.paginator;
  //           this.dataSource3.sort = this.sort;
  //           this.assetTaskGrpSequenceList = res;
  //         });

  //       this.toastr.success('Saved successfully.', 'Success');
  //     });
  //   }else{
  //     // console.log(this.fmeaTaskAddedSequenceList);
  //     this.fmeaTaskAddedSequenceList.forEach(
  //       x =>{
  //         let addedId = x.id;
  //         let fmeaId = x.fmeaId;
  //         let taskId = x.taskId;
  //         let seqNum = x.sequenceNo;

  //         this.assetTaskGrpSequenceList.push({ 
  //           id: 0,
  //           fmeaId: fmeaId,
  //           taskId: taskId,
  //           addedTaskId: addedId,
  //           sequenceNumber: this.assetTaskGrpSequenceList.length+1
  //         });
  //       });

  //     this._assetTaskgroupSequenceService.upsertfmeaTaskSequence(this.assetTaskGrpSequenceList)
  //       .subscribe(res => {
  //         this._assetTaskgroupSequenceService.getFMEATaskAddedFinalSequenceById(this.tempTaskId)
  //         .subscribe(res => {
  //           // console.log(res);
  //           this.loading2 = false;
  //           this.default2 = false;
  //           this.ELEMENT_DATA_4 = res;
  //           this.dataSource3 = new MatTableDataSource<IFMEATaskAddedSequence>(this.ELEMENT_DATA_4);
  //           this.dataSource3.paginator = this.paginator;
  //           this.dataSource3.sort = this.sort;
  //           // this.assetTaskGrpSequenceList = res;
  //         });
  //         this.toastr.success('Saved successfully.', 'Success');
  //         this.selectedIndex = 3;
  //         this.isDisabledTab4 = false;
  //         this.isDisabledTab3 = true;
  //       });
  //   }
    
  // }

  saveNextComponent3(){
    this.selectedIndex = 3;
    this.fmeataskaddedList.forEach( x => {
      let acclimits  = x.acceptableLimits;
      let builds  = x.buildSpec;
      let cClass  = x.componentClass;
      let cManufacture  = x.componentManufacturer;
      let cActions  = x.correctiveActions;
      let fmode  = x.failureMode;
      let fScore  = x.failureRiskTotalScore;
      let familyCom  = x.familyComponent;
      let fmId  = x.fmeaId;
      let freq  = x.frequencyName;
      let unId  = x.id;
      let pCode  = x.parentCode;
      let sClass  = x.subClass;
      let taskDesc  = x.taskDescription;
      let tasknUm  = x.taskId;
      let taskIdent  = x.taskIdentificationNo;
      let tType  = x.taskTypeName;
      let famId = x.familyTaxonomyId;
      let classId = x.classTaxonomyId;
      let subClassId = x.subClassTaxonomyId;

      this.fmeataskSequenceList.push({
          acceptableLimits: acclimits,
          buildSpec: builds,
          componentClass: cClass,
          componentManufacturer: cManufacture,
          correctiveActions: cActions,
          failureMode: fmode,
          failureRiskTotalScore: fScore,
          familyComponent: familyCom,
          frequencyName: freq,
          id: unId,
          parentCode: pCode,
          subClass: sClass,
          taskDescription: taskDesc,
          taskIdentificationNo: taskIdent,
          taskTypeName: tType,
          familyTaxonomyId: famId,
          classTaxonomyId: classId,
          subClassTaxonomyId: subClassId,
          sequenceNo: this.fmeataskSequenceList.length + 1
      });
    });

    // console.log(this.fmeataskSequenceList)
    localStorage.setItem("fmeataskfinalsequence", JSON.stringify(this.fmeataskSequenceList));

    this.ELEMENT_DATA_4 = this.fmeataskSequenceList;
    this.dataSource3 = new MatTableDataSource<IFMEATaskAddedSequence>(this.ELEMENT_DATA_4);
    this.dataSource3.paginator = this.paginator;
    this.dataSource3.sort = this.sort;
  }

  // saveFinalSequenceList(): void{
  //   var sequencelist = JSON.parse(localStorage.getItem("fmeataskfinalsequence"));
  //   // console.log(sequencelist)

  //   sequencelist.forEach( x => {
  //     let fmeaid = x.id;
  //     let sequence = x.sequenceNo;

  //     this.assetTaskGrpSequenceList.push({ 
  //       id: 0,
  //       fmeaId: fmeaid,
  //       taskId: this.tempTaskId,
  //       addedTaskId: fmeaid,
  //       sequenceNumber: sequence
  //     });
  //   });

  //   this._assetTaskgroupSequenceService.upsertfmeaTaskSequence(this.assetTaskGrpSequenceList)
  //     .subscribe(res => {
  //       console.log("success");
  //     });
    
  // }

  lastNext(){
    this.activeId = 4
  }

  addCheck(event:any, id: any){
    // console.log(event.target.checked);
    this.hierarchyId = id;
    // console.log(this.hierarchyId);
    if(event.target.checked === true)
    {
        // this.assetTaskGrpSequenceList.forEach(
        //   x =>{
        //     // console.log(x.id);
        //     let addedId = x.id;
        //     let fmeaId = x.fmeaId;
        //     let taskId = x.taskId;

        //     this.addedTaskId = addedId;

        //     this.assignTGSHierarchyList.push({
        //         id: 0,
        //         fmeaId: fmeaId,
        //         taskId: taskId,
        //         addedTaskId: addedId,
        //         assetHierarchyId: this.hierarchyId
        //     });
        //   });
        this.fmeaTaskAddedSequenceList.forEach(
          x=> {
            console.log(x);
              let fmeaid = x.fmeaId;
              let taskid = x.taskId;
              let taskno = x.taskIdentificationNo;
              let taskdesc = x.taskDescription;
              let corrective = x.correctiveActions;
              let limit = x.acceptableLimits;
              let tasktype = x.taskTypeName;
              let frequency = x.frequencyName;

              this.assetAddtoTask.push({
                id: 0,
                fmeaId: fmeaid,
                taskId: taskid,
                taskIdentificationNo: taskno,
                taskDescription: taskdesc,
                acceptableLimits: limit,
                correctiveActions: corrective,
                frequencyName: frequency,
                taskTypeName: tasktype,
                hierarchyId: this.hierarchyId
              });
          });
    }else{
        this.assignTGSHierarchyList.pop();
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

  initializeMaterialdata(data: IAssignAssetTaskGroupStrategyMaterial){
    this.assignAssetTaskGroupMaterial = data;

    // this.materialId = this.assignAssetTaskGroupMaterial.id
    this.fmeaid = this.assignAssetTaskGroupMaterial.fmeaId;
    this.strategytaskid = this.assignAssetTaskGroupMaterial.taskId;
    this.assetflocid = this.assignAssetTaskGroupMaterial.assetHierarchyId;
    // this.fileName = this.assignAssetTaskGroupMaterial.fileName;

    // this._assignAssetTaskStrategyMaterialService.getProcessImageMaterialById(this.materialId)
    //   .subscribe(foo => {
    //     console.log(foo);
    //     this.processImage(foo);
    //   });
  }


  getFlocAddedEquipment(id: number){
    this._assignAssetTaskGroupStrategyService.getFlocAddedEquipment(id) //taskId
    .subscribe(res => {
      // console.log(res)
      this.containers = res;
      res.forEach(x => {
        let hierarchyId = x.flocId
        this.taskTempList = [];
        this._assignAssetTaskGroupStrategyService.getTaskEquipmentAssetHierarchy(hierarchyId, id)
          .subscribe(out => {
            this.assetHierarchyData = JSON.parse(out['hierarchy']);
            // console.log(this.assetHierarchyData);
            this.taskTempList.push(this.assetHierarchyData['AssetHierarchy'][0]);
          });
      });
    });
  }

  getWINAddedEquipment(id:number){

    this._assignAssetTaskGroupStrategyService.getFlocAddedEquipment(id) //taskId
      .subscribe(res => {
      // console.log(res)
      if(res.length > 0){
        this.containers = res;

        res.forEach(x => {
          let hierarchyId = x.flocId
          this.taskTempList = [];
          this._assignAssetTaskGroupStrategyService.getTaskEquipmentAssetHierarchy(hierarchyId, id)
            .subscribe(out => {
              this.assetHierarchyData = JSON.parse(out['hierarchy']);
              // console.log(this.assetHierarchyData);
              this.taskTempList.push(this.assetHierarchyData['AssetHierarchy'][0]);
            });
        });
      }else{
        this.taskTempList = [];
      }
    });
  }

  getWINAddedEquipmentComponent(id: number){
    var tasks = JSON.parse(localStorage.getItem("modaltaskList"));
    // console.log(tasks)

    tasks.forEach(x => {
      let fmeaid = x.id
      this.containerTask2 = [];

      this._assignAssetTaskStrategyMaterialService.getTaskEquipmentComponents(fmeaid, id)
          .subscribe(out => {
            // console.log(out);
            // this.componentData = JSON.parse(out['hierarchy']);
            //   // console.log(this.componentData);
            //   this.containerTask2.push(this.componentData['AssetHierarchy'][0]);
            if(out !== null || out !== undefined){
              this.componentData = JSON.parse(out['hierarchy']);
              // console.log(this.componentData);
              this.containerTask2.push(this.componentData['AssetHierarchy'][0]);
            }else{
              this.containerTask2 = [];
            }
          });
    });
  }

  getFMEATaskAssignData(id: number){
      this._fmeaService.getFMEAById(id) //fmeaId
        .subscribe(res => {
          // console.log(res);
          this.taskid = res.taskIdentificationNo;
          this.acceptableLimits = res.acceptableLimits;
          this.correctiveActions = res.correctiveActions;
          this.taskGroupdescription = res.taskDescription;
        });
  }

  openAddWIN(opt: string, data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = "90vw";
    dialogConfig.minHeight = "90vh";
    dialogConfig.maxWidth = "90vw";
    dialogConfig.maxHeight = "90vh";
    dialogConfig.position = { top: '25px' };
    dialogConfig.data = { mode: opt, item: data };
    this._dataService.setData(dialogConfig.data);
    const dialogRef = this.dialog.open(AddWorkInstructionModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      // console.log( res);
      if(res !== undefined){
        
        var componenttasks = JSON.parse(localStorage.getItem("modalcomponentList"));

        // console.log(componenttasks)        

        if(componenttasks.length > 1)
        {
          this.isContainer2 = true;
          this.getWINAddedEquipmentComponent(this.tempTaskId);
          
        }
        else if(componenttasks.length == 1 && componenttasks.length < 2)
        {
          this.isContainer = true;
          this.getWINAddedEquipment(this.tempTaskId);
          
        }
        else if(componenttasks.length == 1 && componenttasks.length > 1)
        {
          this.isContainer = true;
          this.isContainer2 = true;
          this.getWINAddedEquipment(this.tempTaskId);
          this.getWINAddedEquipmentComponent(this.tempTaskId);
        }
      }
      else{
        return false;
      }
    
    });
  }

  drop(event: CdkDragDrop<IFMEATaskAddedSequence[]>) {
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
    this.assignEquipmentSequenceList = event.container.data;
  }

  saveAssignSequence(): void{

    this.assignEquipmentSequenceList.forEach( x => {
      // console.log(x)
      let fmeaid = x.FmeaId;
      let taskid = x.Id;

      this.assetTaskGrpSequenceList.push({ 
        id: 0,
        tgsId: taskid,
        fmeaId: fmeaid,
        taskId: this.tempTaskId,
        addedTaskId: fmeaid,
        sequenceNumber: this.assetTaskGrpSequenceList.length+1
      });

    });

    this._assetTaskgroupSequenceService.upsertfmeaTaskSequence(this.assetTaskGrpSequenceList)
      .subscribe(res => {
        // console.log("success");
        this.updateSequence();
      });
    
  }

  updateSequence(): void{
    this.assetTaskGrpSequenceList.forEach( y=> {
      let tgsmid = y.tgsId;
      let seqNum = y.sequenceNumber;

      this._assignAssetTaskStrategyMaterialService.updateSequenceMaterial(seqNum, tgsmid)
        .subscribe(res => { 
          console.log("success")
        })
    });
  }

  openAddFloc(opt: string, data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "500px";
    dialogConfig.height = "700px";
    dialogConfig.position = { top: '30px' };
    dialogConfig.data = { mode: opt, item: data };
    this._dataService.setData(dialogConfig.data);
    const dialogRef = this.dialog.open(AddFlocModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      // console.log(res);
      if(res.length > 0)
      {
        this.getFlocAddedEquipment(this.tempTaskId); //taskId
        // console.log(this.assetflocid);
      }else{
        return
      }
      
    });
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
        if(res !== undefined || res !== null || res !== '')
        {
            this.assetTaskGroupStrategyObject.comment = res;
            this.assetTaskGroupStrategyObject.systemStatus = 2;
            this.assetTaskGroupStrategyObject.createdBy = this.user;
            this.assetTaskGroupStrategyObject.updatedBy = this.user;
            this.saveTaskByHierarchy();
        }else{
          this.isSave = false;
        }
    });
  }

  saveTaskByHierarchy(): void{
    this.toastr.success("Successfully saved!", 'Success');
    localStorage.removeItem("modalcomponentList");
    localStorage.removeItem("modaltaskList");
    
    this.saveChanges();
    this.saveAddedTasks();
    this.saveAssignSequence();
    localStorage.removeItem("fmeataskfinalsequence");
    localStorage.removeItem("fmeataskadded");
    this.isSave = true;
  }

  onFileInput(event: any){}

  uploadImageById(id: number){
    console.log(id);
    this.materialId = id;

    this._assignAssetTaskStrategyMaterialService.geAssignAssetTaskGroupStrategyMaterialById(this.materialId)
        .subscribe(res => {
          console.log(res);
          this.initializeMaterialdata(res);
          // this._assignAssetTaskStrategyMaterialService.getProcessImageMaterialById(this.materialId)
            //   .subscribe(foo => {
            //     // console.log(foo);
            //     this.processImage(foo);
            //   });
        });
  }

  deleteTaskByHierarchy(name: string, hierarchyid: number): void{
    if (confirm("Are you sure to delete " + name + "? This cannot be undone.")) {
      this._assignAssetTaskStrategyMaterialService.deleteTaskItemsByHierarchy(this.tempTaskId, hierarchyid)
      .subscribe(res => {
        this.getWINAddedEquipment(this.tempTaskId);
        this.getWINAddedEquipmentComponent(this.tempTaskId);
          // this._assignAssetTaskGroupStrategyService.getAssignTaskToEquipment(hierarchyid) //hierarchyId
          // .subscribe(out => {
          //   // console.log(res);
          //   this.taskTempList = out;
          // });
      });
    }
  }

  deleteComponentByTask(fmeaid: number): void{
    if (confirm("Are you sure to delete this? This cannot be undone.")) {
      this._assignAssetTaskStrategyMaterialService.deleteComponentByTask(this.tempTaskId, fmeaid)
      .subscribe(res => {
        this.getWINAddedEquipment(this.tempTaskId);
        this.getWINAddedEquipmentComponent(this.tempTaskId);
      });
    }
  }

  public uploadFile = (files, id: number) => {
    this.loading = true;
    if (files.length === 0) {
        return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http.post(this.controllerApi, formData, { reportProgress: true, observe: 'events' })
        .subscribe(event => {
            if (event.type === HttpEventType.Response) {
                this.message = 'Upload success.';
                this.onUploadFinished.emit(event.body);
                this.loading = false;
                this.toastr.success('File uploaded successfully', 'Success!');
                // this.saveData();   
                // console.log(event.body)
                this.uploadFinished(event, id);
            }
        });
  }

  public uploadFinished = (event, id: number) => {
    this.response = event.body.dbPath;
    console.log(id);

    this.fileURL = this.response;
    
    // this.locationURL = JSON.parse(this.response.dbPath);

    this.locationURL = JSON.stringify(this.fileURL);
    this.assignAssetTaskGroupMaterial.id = id;
    this.assignAssetTaskGroupMaterial.fmeaId = this.fmeaid;
    this.assignAssetTaskGroupMaterial.taskId = this.strategytaskid;
    this.assignAssetTaskGroupMaterial.assetHierarchyId = this.assetflocid;
    this.assignAssetTaskGroupMaterial.fileName = JSON.parse(this.locationURL);
    this._assignAssetTaskStrategyMaterialService.updateAssignAssetTaskGroupStrategyMaterial(this.assignAssetTaskGroupMaterial.id, this.assignAssetTaskGroupMaterial)
        .subscribe(res => {
          // console.log(res);
          console.log("success");
          this.isImageSaved = true;
          this._assignAssetTaskGroupStrategyService.getFlocAddedEquipment(res.taskId) //taskId
              .subscribe(res => {
                // console.log(res)
                // this.containers = res;
                res.forEach(x => {
                  let hierarchyId = x.flocId
                  this.taskTempList = [];
                  this._assignAssetTaskGroupStrategyService.getTaskEquipmentAssetHierarchy(hierarchyId, this.assignAssetTaskGroupMaterial.taskId)
                    .subscribe(out => {
                      this.assetHierarchyData = JSON.parse(out['hierarchy']);
                      // console.log(this.assetHierarchyData);
                      this.taskTempList.push(this.assetHierarchyData['AssetHierarchy'][0]);
                      // console.log(this.taskTempList)
                      this.taskTempList.forEach(y => {
                        // console.log(y['Material'])
                       
                        this._assignAssetTaskStrategyMaterialService.getProcessImageMaterialById(this.assignAssetTaskGroupMaterial.id)
                          .subscribe(foo => {
                            this.processImage(foo);
                          });
                      })
                    });
                  });
                });
    });

    // console.log(this.fileURL);

    // this.updateMaterialAssign();
  }

  updateMaterialAssign(): void{
      console.log(this.materialId);
      this.locationURL = JSON.stringify(this.fileURL);
      this.assignAssetTaskGroupMaterial.fileName = JSON.parse(this.locationURL);
      this._assignAssetTaskStrategyMaterialService.updateAssignAssetTaskGroupStrategyMaterial(this.materialId, this.assignAssetTaskGroupMaterial)
        .subscribe(res => {
          console.log("success");
          this.getFlocAddedEquipment(this.taskId);
          // this._assignAssetTaskStrategyMaterialService.geAssignAssetTaskGroupStrategyMaterialById(this.taskId)
          //   .subscribe(out => {
          //     // this.initializeMaterialdata(out);
          //     // this.getFlocAddedEquipment(this.taskId);
          //   })

                // this._assignAssetTaskStrategyMaterialService.getProcessImageMaterialById(this.materialId)
                //     .subscribe(foo => {
                //       // console.log(foo);
                //       this.processImage(foo);
                //       this.getFlocAddedEquipment(this.taskId);
                //     });
          //     });
          //   });
        });
  }

  deleteMaterialImage(id: number): void{
    // console.log(id);
    this.materialId = id;
    this.assignAssetTaskGroupMaterial.fileName = '';
    this._assignAssetTaskStrategyMaterialService.deleteImageMaterialById(this.materialId, this.assignAssetTaskGroupMaterial)
        .subscribe(res => {
          console.log("success");
          this.getFlocAddedEquipment(this.taskId);
          // this._assignAssetTaskGroupStrategyService.getAssignTaskToEquipment(this.assetflocid) //hierarchyId
          //   .subscribe(out => {
          //     // console.log(out);
          //     this.taskListEquipmentList = out;
          //   });
        });
  }

  imagePath: String;
  arrayImagePath: string[] = [];

  processImage(data: IAssignAssetTaskGroupStrategyMaterialView[]): void{
      let retImage: string = "data:image/jpeg;base64,";

      this.assetStrategyWithMaterial = data;

      this.assetStrategyWithMaterial.forEach(e => {
        e.convertedMaterial = retImage+e.convertedMaterial;

        this.assignAssetTaskGroupMaterial.fileName = e.convertedMaterial;
    });
  }

  saveAssignHierarchy():void{

      this._assignAssetTaskGroupHierarchyService.upsertAssignAssetHierarchy(this.assignTGSHierarchyList)
      .subscribe(res => {
        // console.log("success");
        this.toastr.success('Saved successfully.', 'Success');
      });
    
  }

  openDialogTaxonomy() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "700px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    const dialogRef = this.dialog.open(TaxonomyModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      let taxcateogyData = JSON.parse(localStorage.getItem("taxcategoryobject"));
      let taxclassData = JSON.parse(localStorage.getItem("taxclassobject"));
      let taxTypeData = JSON.parse(localStorage.getItem("taxctypeobject"));

      this.taxonomyCategory = taxcateogyData.categoryName;
      this.taxonomyClass = taxclassData.className;
      this.taxonomyType = taxTypeData.typeName;
      this.taxCategoryId = taxcateogyData.categoryId;
      this.taxClassId = taxclassData.classId;
      this.taxTypeId = taxTypeData.typeId;
    });
  }

  openDialogHierarchy() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "700px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    const dialogRef = this.dialog.open(AssetHierarchyModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      let taxonomyData = JSON.parse(localStorage.getItem("taxonomyName"));
      let assetData = localStorage.getItem("assetcode");

      this.assetTaxonomyObject = taxonomyData;

      this.taxonomyCategory = taxonomyData.categoryName;
      this.taxonomyClass = taxonomyData.className;
      this.taxonomyType = taxonomyData.typeName;
      this.taxCategoryId = taxonomyData.categoryId;
      this.taxClassId = taxonomyData.classId;
      this.taxTypeId = taxonomyData.typeId;
      this.assetCode = assetData;
      // console.log(this.taxonomyCategory);
  });
  }

  goToFMEAEdit(id: number): void{
    this.router.navigate(["/main/fmea-edit", id]);
  }

  goToFMEACreate(): void{
    localStorage.setItem("TaskGroupStrategy", "TaskGroupStrategyCreate");
    localStorage.setItem("componentName", this.componentName);
    localStorage.setItem("assetcode", this.assetCode);
    localStorage.setItem("taskId", this.taskId.toString());
    localStorage.setItem("taxonomyData", JSON.stringify(this.assetTaxonomyObject));
    this.router.navigate(["/main/fmea-form"]);
  }


  //testing image upload functions
  fileChangeEvent(fileInput: any) {
      this.imageError = null;
      if (fileInput.target.files && fileInput.target.files[0]) {
          // Size Filter Bytes
          const max_size = 20971520;
          const allowed_types = ['image/png', 'image/jpeg'];
          const max_height = 15200;
          const max_width = 25600;

          if (fileInput.target.files[0].size > max_size) {
              this.imageError =
                  'Maximum size allowed is ' + max_size / 1000 + 'Mb';

              return false;
          }

          if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
              this.imageError = 'Only Images are allowed ( JPG | PNG )';
              return false;
          }

          const reader = new FileReader();
          reader.onload = (e: any) => {
              const image = new Image();
              image.src = e.target.result;
              image.onload = rs => {
                  const img_height = rs.currentTarget['height'];
                  const img_width = rs.currentTarget['width'];

                  console.log(img_height, img_width);


                  if (img_height > max_height && img_width > max_width) {
                      this.imageError =
                          'Maximum dimentions allowed ' +
                          max_height +
                          '*' +
                          max_width +
                          'px';
                      return false;
                  } else {
                      const imgBase64Path = e.target.result;
                      this.cardImageBase64 = imgBase64Path;
                      this.isImageSaved = true;
                      // this.previewImagePath = imgBase64Path;
                  }
              };
          };

          reader.readAsDataURL(fileInput.target.files[0]);
      }
  }

  removeImage() {
      // this.cardImageBase64 = null;
      this.isImageSaved = false;
  }
}



