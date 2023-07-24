import { Component, Inject, HostListener, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomTableModalComponent } from '../modal/customtablemodal/customtablemodal.component';
import { MultiFilterModalComponent } from '../modal/multifiltermodal/multifiltermodal.component';

import { TaxonomyCategoryService } from '../services/taxonomycategory.services';
import { TaxonomyClassService } from '../services/taxonomyclass.services';
import { TaxonomyTypeService } from '../services/taxonomytype.services';
import { AssetTaskGroupStrategyService } from '../services/assettaskgroupstrategy.services';

import { ITaxonomyCategory } from './../interfaces/ITaxonomyCategory';
import { ITaxonomyClass } from './../interfaces/ITaxonomyClass';
import { ITaxonomyType } from './../interfaces/ITaxonomyType';
import { IAssetTaskGroupStrategy, IAssetTaskGroupStrategyDisplay, IAssetTaskGroupStrategyHsm, IAssetTaskGroupStrategyHsmDisplay } from './../interfaces/IAssetTaskGroupStrategy';
import { IAssetTaskGroupStrategyCount } from './../interfaces/IAssetTaskGroupStrategyCount';
import { forkJoin } from 'rxjs';
import { TaskTypeService } from '../services/tasktype.services';
import { FrequencyService } from '../services/frequency.services';
import { TradeTypeService } from '../services/tradetype.services';
import { OperationalModeService } from '../services/operationalmode.services';
import { AssetHierarchyIndustryService } from '../services/assethierarchyindustry.services';
import { AssetHierarchyBusinessTypeService } from '../services/assethierarchybusinesstype.services';
import { AssetHierarchyAssetTypeService } from '../services/assethierarchyassettype.services';
import { AssetHierarchyProcessFunctionService } from '../services/assethierarchyprocessfunction.services';
import { ToastrService } from 'ngx-toastr';
import { AssetHierarchyClassTaxonomyService } from '../services/assethierarchyclasstaxonomy.services';
import { AssetHierarchySpecService } from '../services/assethierarchyspec.services';
import { AssetHierarchyManufacturerService } from '../services/assethierarchymanufacturer.services';
import { CategoryHierarchyService } from '../services/categoryhierarchy.services';
import { SelectTemplateComponentModalComponent } from '../modal/selecttemplatemodal/selecttemplatemodal.component';
import { DataService } from 'src/app/shared/services/data.service';
import { AddFlocToWorkInstructionModalComponent } from '../modal/addfloctoworkinsmodal/addfloctoworkinsmodal.component';
import { AssetTaskGroupStrategyHsmService } from '../services/assettaskgroupstrategyhsm.services';
import { HsmTgsViewModalComponent } from '../modal/hsmtgsviewmodal/hsmtgsviewmodal.component';
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';
import { AssignAssetTaskGroupStrategyMaterialHsmService } from '../services/assignassettaskgroupstrategymaterialhsm.services';
import { routerTransition } from 'src/app/shared/router.animation';
import { IAssignGroupToUser } from '../interfaces/IAssignGroupToUser';
import { AssignGroupToUserService } from '../services/assigngrouptouser.services';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FormControl } from '@angular/forms';

interface RootObject {
  hierarchy: TgsHierarchy[];
}

interface TgsHierarchy {
  Id: number;
  CategoryName: string;  
  Children?: TgsHierarchy[];
}

interface TgsChild{
  AssetSpecManuf: string;
}

interface ExampleFlatNode {
  expandable: boolean;
  id: number;
  name: string;
  level: number;
}

@Component({
  selector: "taskgroup-strategy",
  templateUrl: './assettaskgroupstrategyhsm.component.html',
  styleUrls: [
    './assettaskgroupstrategyhsm.component.scss'
  ],
  // animations: [routerTransition()],
  //   host: {
  //       '(document:click)': 'onClickDocument($event)',
  //   },
})

export class AssetTaskGroupStrategyHsmComponent implements OnInit {
  @ViewChild('statusMenu') public statusMenu: ElementRef;
  @ViewChild('tableColumn') public tableColumn: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  displayedColumns = ['uploadTGS','taskGroupStrategyId', 'industryName', 'businessType', 'className', 'processFunction', 'specification', 'assetManufacturer', 'taskGroupDescription', 'taskTypeName', 'frequencyName', 'tradeTypeName', 'operationalModeName', 'systemStatus', 'deleteTGS'];

  ELEMENT_DATA: IAssetTaskGroupStrategyHsmDisplay[] = [];

  taskTypeList: any[] = [];
  frequencyList: any[] = [];
  tradeTypeList: any[] = [];
  operationalModeList: any[] = [];
  industryList: any[] = [];
  businessTypeList: any = [];
  assetTypeList: any[] = [];
  processFunctionList: any[] = [];
  assetClassTaxonomyList: any[] = [];
  specTaxonomyList: any[] = [];
  manufacturerTaxonomyList: any[] = [];
  taskIdList: any[] = [];

  taxonomyCategoryObject: ITaxonomyCategory;
  taxonomyClassObject: ITaxonomyClass;
  taxonomyTypeObject: ITaxonomyType;

  classDisabled: boolean = true;
  typeDisabled: boolean = true;
  isClickCategory: boolean = false;
  isClickClass: boolean = false;

  loading: boolean = false;
  default: boolean = false;

  displayTableColumn: boolean = false;
  displayMultiFilter: boolean = false;

  categoryName: string = "";
  className: string = "";
  typeName: string = "";
  totalCount: number;
  activeId: number;
  category: string = "";

  //Filter NGMODEL
  taskGroupId: string = "";
  taskTypeId: number = 0;
  taskGroupDesc: string = "";
  frequencyId: number = 0;
  tradeTypeId: number = 0;
  operationalModeId: number = 0;
  industryId: number = 0;
  businessTypeId: number = 0;
  assetTypeId: number = 0;
  processFunctionId: number = 0;
  assetClassTaxonomyId: number = 0;
  assetSpecId: number = 0;
  manufactureId: number = 0;
  workInstTitle: string = "";
  statusId: number;

  //Table Column NGMODEL
  tabletaskGroupid: boolean = true;
  tabletaskGroupdesc: boolean = true;
  tabletasktype: boolean = true;
  tablefrequency: boolean = true;
  tabletradetype: boolean = true;
  tableoperationalmode: boolean = true;
  tableindustry: boolean = true;
  tablebusinesstype: boolean = true;
  tableprocessfunction: boolean = true;
  tableassetclass: boolean = true;
  tableassetspec: boolean = true;
  tableassetmanufacturer: boolean = true;

  //TGS Model
  assetCategoryId: number;
  assetClassId: number;
  assetFamilyTaxonomyId: number;
  assetHierarchyId: number;
  assetIndustryId: number;
  assetManufacturerTaxonomyId: number;
  assetSpecTaxonomyId: number;
  assettypeId: number;
  businesstypeId: number;
  comment: string = "";
  componentBuildSpecTaxonomyId: number;
  componentClassTaxonomyId: number;
  componentFamilyTaxonomyId: number;
  componentManufacturerId: number;
  componentSubClassTaxonomyId: number;
  createdBy: string = "";
  dtCreated: Date;
  dtUpdated: Date;
  durationId: number;
  frequencyid: number;
  operationalModeid: number;
  processfunctionId: number;
  systemStatus: number;
  taskGroupDescription: string = "";
  taskGroupStrategyId: string = "";
  tasktypeId: number;
  tradetypeId: number;
  updatedBy: string = "";
  categoryid: number = 0;

  displayStatusMenu: boolean = false;
  isLoading: boolean = false;

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

  right_click = 0;
  left_click = 0;
  timer: any;

  right_clickOnly: boolean = true;
  left_clickOnly: boolean = true;

  field: IAssetTaskGroupStrategyCount[];

  dataSource2;

  public data: [];

  hierarchy: RootObject;

  private _transformer = (node: TgsHierarchy, level: number) => {
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

  TREE_DATA: TgsHierarchy[] = [];


  myControl = new FormControl();

  constructor(
    private router: Router,
    private _eref: ElementRef,
    public dialog: MatDialog,
    private _taskTypeService: TaskTypeService,
    private _taxonomyClassService: TaxonomyClassService,
    private _taxonomyTypeService: TaxonomyTypeService,
    private _assetTaskGroupStrategyService: AssetTaskGroupStrategyService,
    private _assetTaskGroupStrategyHsmService: AssetTaskGroupStrategyHsmService,
    private _frequenceService: FrequencyService,
    private _tradeTypeService: TradeTypeService,
    private _operationalModeService: OperationalModeService,
    private _industryService: AssetHierarchyIndustryService,
    private _businessTypeService: AssetHierarchyBusinessTypeService,
    private _assetTypeService: AssetHierarchyAssetTypeService,
    private _processFunctionService: AssetHierarchyProcessFunctionService,
    private _assetClassService: AssetHierarchyClassTaxonomyService,
    private _categoryHierarchyService: CategoryHierarchyService,
    private _assetSpecService: AssetHierarchySpecService,
    private _assetManufacturerService: AssetHierarchyManufacturerService,
    private _assignTGSMaterialHsmService: AssignAssetTaskGroupStrategyMaterialHsmService,
    private _dataService: DataService,
    public toastr: ToastrService,
    private userPermissionService: PermissionManagerService,
    private _assignToUserService: AssignGroupToUserService,
  ) { }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  canAccess(roleKey: string): boolean {
    let access: boolean = false;
    access = this.userPermissionService.isGranted(roleKey);
    return access;
  }

  ngOnInit(): void {
    var newdisplaycolumn = JSON.parse(localStorage.getItem('activeColhsmTGS'));
    var tgsId = JSON.parse(localStorage.getItem('tgsNoHsmSite'));
    var taskDesc = JSON.parse(localStorage.getItem('tgsDescHsm'));
    var tasktype = JSON.parse(localStorage.getItem('tgstaskTypeHsm'));
    var freq = JSON.parse(localStorage.getItem('tgsfrequenceHsm'));
    var tradetype = JSON.parse(localStorage.getItem('tgstradetypeHsm'));
    var operationMode = JSON.parse(localStorage.getItem('tgsOperationHsm'));
    var industry = JSON.parse(localStorage.getItem('tgsindustryHsm'));
    var businesstype = JSON.parse(localStorage.getItem('tgsBusinessHsm'));
    var processfunc = JSON.parse(localStorage.getItem('tgsProcessHsm'));
    var assetclass = JSON.parse(localStorage.getItem('tgsAssetClassHsm'));
    var specsite = JSON.parse(localStorage.getItem('tgsSpecHsm'));
    var manufacturer = JSON.parse(localStorage.getItem('tgsManufacturerHsm'));

    localStorage.removeItem("modalcomponentList");
    localStorage.removeItem("modaltaskList");
    localStorage.removeItem("fmeataskfinalsequence");
    localStorage.removeItem("fmeataskadded");
    localStorage.removeItem("containers");
    localStorage.removeItem("addedtasks");
    localStorage.removeItem("containersTask");

    this.isLoading = true;

    if(newdisplaycolumn !== null){
      this.displayedColumns =  JSON.parse(localStorage.getItem('activeColhsmTGS'));
    }

    if(tgsId !== null){
      this.tabletaskGroupid = tgsId;
    }

    if(taskDesc !== null){
      this.tabletaskGroupdesc = taskDesc;
    }

    if(tasktype !== null){
      this.tabletasktype = tasktype;
    }

    if(freq !== null){
      this.tablefrequency = freq;
    }

    if(tradetype !== null){
      this.tabletradetype = tradetype;
    }

    if(operationMode !== null){
      this.tableoperationalmode = operationMode;
    }

    if(industry !== null){
      this.tableindustry = industry;
    }

    if(businesstype !== null){
      this.tablebusinesstype = businesstype;
    }

    if(assetclass !== null){
      this.tableassetclass = assetclass;
    }

    if(processfunc !== null){
      this.tableprocessfunction = processfunc;
    }

    if(specsite !== null){
      this.tableassetspec = specsite;
    }

    if(manufacturer !== null){
      this.tableassetmanufacturer = manufacturer;
    }

    forkJoin(
      this._taskTypeService.getTaskType(),
      this._frequenceService.getFrequency(),
      this._tradeTypeService.getTradeType(),
      this._operationalModeService.getOperationalMode(),
      this._industryService.getAssetIndustry(),
      this._businessTypeService.getAssetBusinessType(),
      this._assetTypeService.getAssetType(),
      this._processFunctionService.getProcessFunction(),
      this._categoryHierarchyService.getComponentCategoryHierarchyLevel1(),
      this._assetSpecService.getSpecTaxonomy(),
      this._assetManufacturerService.getAssetManufacturer(),
      // this._assetTaskGroupStrategyService.getTotalAssetTaskGroupStrategy(),
    ).subscribe(([tt, fr, ty, om, ai, bt, at, pf, ac, as, am]) => {
      this.taskTypeList = tt.sort((a, b) => (a.taskTypeName < b.taskTypeName ? -1 : 1));
      this.frequencyList = fr.sort((a, b) => (a.frequencyName < b.frequencyName ? -1 : 1));
      this.tradeTypeList = ty.sort((a, b) => (a.tradeTypeName < b.tradeTypeName ? -1 : 1));
      this.operationalModeList = om.sort((a, b) => (a.operationalModeName < b.operationalModeName ? -1 : 1));
      this.industryList = ai.sort((a, b) => (a.industryName < b.industryName ? -1 : 1));
      this.businessTypeList = bt.sort((a, b) => (a.businessType < b.businessType ? -1 : 1));
      this.assetTypeList = at;
      this.processFunctionList = pf.sort((a, b) => (a.processFunction < b.processFunction ? -1 : 1));
      this.assetClassTaxonomyList = ac.sort((a, b) => (a.categoryName < b.categoryName ? -1 : 1));
      this.specTaxonomyList = as.sort((a, b) => (a.specification < b.specification ? -1 : 1));
      this.manufacturerTaxonomyList = am.sort((a, b) => (a.assetManufacturer < b.assetManufacturer ? -1 : 1));
      this.isLoading = false;
      // this.totalCount = tt[0]['totalCount'];
    });

    // this.getDataSource();

    this._assetTaskGroupStrategyHsmService.getHsmTaskGroupStrategyHierarchy()
        .subscribe(res => {
          this.dataSource.data = JSON.parse(res['hierarchy']);
          
          console.log(this.dataSource.data)
        });

    this._assetTaskGroupStrategyHsmService.getDropdownTGSAssetBusiness(this.categoryid)
        .subscribe(i => {
            this.businessTypeList = i.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });

    this._assetTaskGroupStrategyHsmService.getDropdownTGSAssetIndustry(this.categoryid)
        .subscribe(i => {
            this.industryList = i.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });
    this._assetTaskGroupStrategyHsmService.getDropdownTGSAssetProcessFunction(this.categoryid)
        .subscribe(s => {
            this.processFunctionList = s.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });
    this._assetTaskGroupStrategyHsmService.getDropdownTGSAssetSpec(this.categoryid)
        .subscribe(b => {
            this.specTaxonomyList = b.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });
    this._assetTaskGroupStrategyHsmService.getDropdownTGSAssetManufacturer(this.categoryid)
        .subscribe(m => {
            this.manufacturerTaxonomyList = m.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });
    this._assetTaskGroupStrategyHsmService.getDropdownTGSTaskType(this.categoryid)
        .subscribe(t => {
            this.taskTypeList = t.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });
    this._assetTaskGroupStrategyHsmService.getDropdownTGSTradeType(this.categoryid)
        .subscribe(ty => {
            this.tradeTypeList = ty.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });
    this._assetTaskGroupStrategyHsmService.getDropdownTGSFrequency(this.categoryid)
        .subscribe(fq => {
            this.frequencyList = fq.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });
    this._assetTaskGroupStrategyHsmService.getDropdownTGSOperationalMode(this.categoryid)
        .subscribe(d => {
            this.operationalModeList = d.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
        });

    this.default = true;
  }

  getDataSource(): void {
    this._assetTaskGroupStrategyHsmService.getAssetTaskGroupStrategy()
      .subscribe(res => {
        // console.log(res);
        this.default = false;
        this.loading = false;
        this.ELEMENT_DATA = res;
        this.dataSource2 = new MatTableDataSource<IAssetTaskGroupStrategyHsmDisplay>(this.ELEMENT_DATA);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      });
  }

  mapStatusData(id: number): string {
    let retData = "";
    retData = this.statusList.find(e => e.id === id);
    return retData;
}

nodeClick(node: any){
  this.assetClassTaxonomyId = node.id;
  this.categoryid = node.id;
  this.isLoading = true;
  console.log(node)
  
  if(node.level === 1)
  {
    this.category = node.name;
  }else{
    this.category = '';
  }
  
  // console.log(this.assetClassTaxonomyId)
  // console.log(this.category, node.level)
  this._assetTaskGroupStrategyHsmService.getDropdownTGSAssetBusiness(this.categoryid)
      .subscribe(i => {
          this.businessTypeList = i.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
      });

  this._assetTaskGroupStrategyHsmService.getDropdownTGSAssetIndustry(this.categoryid)
      .subscribe(i => {
          this.industryList = i.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
      });
  this._assetTaskGroupStrategyHsmService.getDropdownTGSAssetProcessFunction(this.categoryid)
      .subscribe(s => {
          this.processFunctionList = s.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
      });
  this._assetTaskGroupStrategyHsmService.getDropdownTGSAssetSpec(this.categoryid)
      .subscribe(b => {
          this.specTaxonomyList = b.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
      });
  this._assetTaskGroupStrategyHsmService.getDropdownTGSAssetManufacturer(this.categoryid)
      .subscribe(m => {
          this.manufacturerTaxonomyList = m.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
      });
  this._assetTaskGroupStrategyHsmService.getDropdownTGSTaskType(this.categoryid)
      .subscribe(t => {
          this.taskTypeList = t.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
      });
  this._assetTaskGroupStrategyHsmService.getDropdownTGSTradeType(this.categoryid)
      .subscribe(ty => {
          this.tradeTypeList = ty.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
      });
  this._assetTaskGroupStrategyHsmService.getDropdownTGSFrequency(this.categoryid)
      .subscribe(fq => {
          this.frequencyList = fq.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
      });
  this._assetTaskGroupStrategyHsmService.getDropdownTGSOperationalMode(this.categoryid)
      .subscribe(d => {
          this.operationalModeList = d.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
      });

      this._assetTaskGroupStrategyHsmService.getAssetTaskGroupStrategyFilters(this.categoryid, this.category, this.taskGroupId, this.taskGroupDesc, this.taskTypeId, this.frequencyId, this.tradeTypeId, this.operationalModeId, this.industryId, this.businessTypeId, this.assetClassTaxonomyId, this.processFunctionId, this.assetSpecId, this.manufactureId)
      .subscribe(res => {
        // console.log(res)
        this.default = false;
        this.loading = false;
        this.ELEMENT_DATA = res;
        this.dataSource2 = new MatTableDataSource<IAssetTaskGroupStrategyHsmDisplay>(this.ELEMENT_DATA);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.isLoading = false;
      });
}

  routeCreate(){
    if(this.canAccess('CreateTGS')) {
      this.router.navigate(["/main/hsm-task-group-form"]);
    }else{
      this.toastr.warning('You do not have permission to perform this action.', '');
    }
  }

  taskTypeOnSelect(event) {
    this.taskTypeId = parseInt(event.target.value);
    // console.log(this.taskTypeId)
  }

  frequencyOnSelect(event) {
    this.frequencyId = parseInt(event.target.value);
    // console.log(this.frequencyId)
  }

  tradeTypeOnSelect(event) {
    this.tradeTypeId = parseInt(event.target.value);
    // console.log(this.tradeTypeId)
  }

  operationalModeOnSelect(event) {
    this.operationalModeId = parseInt(event.target.value);
    // console.log(this.operationalModeId)
  }

  industryOnSelect(event) {
    this.industryId = parseInt(event.target.value);
    // console.log(this.industryId)
  }

  businessTypeOnSelect(event) {
    this.businessTypeId = parseInt(event.target.value);
    // console.log(this.businessTypeId)
  }

  assetTypeOnSelect(event) {
    this.assetTypeId = parseInt(event.target.value);
    // console.log(this.assetTypeId)
  }

  processFunctionOnSelect(event) {
    this.processFunctionId = parseInt(event.target.value);
    // console.log(this.processFunctionId)
  }

  assetClassOnSelect(event){
    this.assetClassTaxonomyId = parseInt(event.target.value);
  }

  assetSpecOnSelect(event){
    this.assetSpecId = parseInt(event.target.value);
  }

  assetManufacturerOnSelect(event){
    this.manufactureId = parseInt(event.target.value);
  }

  statusOnSelect(event, id: number){
    this.statusId = parseInt(event.value);
    // console.log(event.value, id);

    this._assetTaskGroupStrategyHsmService.getAssetTaskGroupStrategyById(id)
      .subscribe(res => {
          // console.log(res);
          this.assetTaskGroupStrategyObject = res;

          this.assetTaskGroupStrategyObject.systemStatus = this.statusId;

          this._assetTaskGroupStrategyHsmService.updateStrategyGroup(id, this.assetTaskGroupStrategyObject)
            .subscribe(out => {
              // console.log(out);
              this.assignToUserObject.transactionId = out.id;
              this.assignToUserObject.transactionTypeId = 3;
              this.assignToUserObject.userPermissionGroupId = 5;
              this.assignToUserObject.status = 1;
              this.assignToUserObject.isActive = true;

              this._assignToUserService.addAssignGroupToUser(this.assignToUserObject)
                  .subscribe(woo => {
                    this.ngOnInit();
                  });
            });
      });
  }
  onKeyupTask(name: string){
    if(name !== '')
    {
        this._assetTaskGroupStrategyHsmService.getDropdownTGSIdno(this.categoryid, name)
        .subscribe(res => {
            // console.log(res)
            this.taskIdList = res;
            
        })
    }else{
        return false;
    }
  }

  initializeFieldData(data: IAssetTaskGroupStrategyCount[]): void {
    // For Name Mapping
    this.totalCount = data[0]['totalCount'];
  }

  filterAsset(): void {
    this._assetTaskGroupStrategyHsmService.getAssetTaskGroupStrategyFilters(this.categoryid, this.category, this.taskGroupId, this.taskGroupDesc, this.taskTypeId, this.frequencyId, this.tradeTypeId, this.operationalModeId, this.industryId, this.businessTypeId, this.assetClassTaxonomyId, this.processFunctionId, this.assetSpecId, this.manufactureId)
      .subscribe(res => {
        this.default = false;
        this.loading = false;
        this.ELEMENT_DATA = res;
        this.dataSource2 = new MatTableDataSource<IAssetTaskGroupStrategyHsmDisplay>(this.ELEMENT_DATA);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      });

      this.untoggleFilter();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "700px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    const dialogRef = this.dialog.open(CustomTableModalComponent, dialogConfig);
  }

  openDialogFilter() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "700px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    const dialogRef = this.dialog.open(MultiFilterModalComponent, dialogConfig);
  }

  openSelectTemplate(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "500px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    dialogConfig.data = { item: data};
    this._dataService.setData(dialogConfig.data);
    const dialogRef = this.dialog.open(SelectTemplateComponentModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  openSelectFloc(data: any, field: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "600px";
    dialogConfig.height = "700px";
    dialogConfig.position = { top: '30px' };
    dialogConfig.data = { item: data, name: field };
    this._dataService.setData(dialogConfig.data);
    const dialogRef = this.dialog.open(AddFlocToWorkInstructionModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  goToATGEdit(id: number): void {
    if(this.canAccess('ReviewTGS')) {
      this.router.navigate(["/main/hsm-task-group-edit", id]);
    }
    else{
      this.toastr.warning('You do not have permission to perform this action.', '');
    }
    // localStorage.setItem("taskId", id.toString());
  }

  downloadWorkIns(id: number, hierarchy: number, title: string): void{
    if(this.canAccess('GenerateWorkInstruction')) {
      this.loading = true;
      this.isLoading = true;
      this.workInstTitle = title;
      this._assignTGSMaterialHsmService.downloadHSM(id, hierarchy)
          .subscribe(res => {
              this.isLoading = false;
              const byteCharacters = atob(res);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);
                  const blob = new Blob([byteArray], {type: 'application/docx'});
  
                  // this.blob = new Blob([data], {type: 'docx'});
                  
                  const a = document.createElement('a');
                  a.setAttribute('style', 'display:none;');
                  document.body.appendChild(a);
                  a.download = this.workInstTitle + ".docx";
                  a.href = URL.createObjectURL(blob);
                  a.target = '_blank';
                  a.click();
                  document.body.removeChild(a);
                  this.loading = false;
                  this.toastr.success("Template Generated Successfully!", 'Success');
          });
    }
    else{
      this.toastr.warning('You do not have permission to perform this action.', '');
    }
  }

  addColumnTaskGroupId() {
    if (this.tabletaskGroupid === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.push('taskGroupStrategyId');
        this.displayedColumns.splice(1, 0, "taskGroupStrategyId");
        localStorage.removeItem('activeColhsmTGS');
        localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tgsNoHsmSite');
        localStorage.setItem('tgsNoHsmSite', JSON.stringify(true))
      }
    } else {
      this.removeColumn('taskGroupStrategyId');
      localStorage.removeItem('activeColhsmTGS');
      localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
      localStorage.removeItem('tgsNoHsmSite');
      localStorage.setItem('tgsNoHsmSite', JSON.stringify(false))
    }
  }

  addColumnTaskGroupDesc() {
    if (this.tabletaskGroupdesc === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.push('taskGroupDescription');
        this.displayedColumns.splice(8, 0, "taskGroupDescription");
        localStorage.removeItem('activeColhsmTGS');
        localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tgsDescHsm');
        localStorage.setItem('tgsDescHsm', JSON.stringify(true))
      }
    } else {
      this.removeColumn('taskGroupDescription');
      localStorage.removeItem('activeColhsmTGS');
        localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tgsDescHsm');
        localStorage.setItem('tgsDescHsm', JSON.stringify(false))
    }
  }

  addColumnTaskType() {
    if (this.tabletasktype === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.push('taskTypeName', );
        this.displayedColumns.splice(9, 0, "taskTypeName");
        localStorage.removeItem('activeColhsmTGS');
        localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tgstaskTypeHsm');
        localStorage.setItem('tgstaskTypeHsm', JSON.stringify(true))
      }
    } else {
      this.removeColumn('taskTypeName');
      localStorage.removeItem('activeColhsmTGS');
      localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
      localStorage.removeItem('tgstaskTypeHsm');
      localStorage.setItem('tgstaskTypeHsm', JSON.stringify(false))
    }
  }

  addColumnFrequency() {
    if (this.tablefrequency === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.push('frequencyName', );
        this.displayedColumns.splice(10, 0, "frequencyName");
        localStorage.removeItem('activeColhsmTGS');
        localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tgsfrequenceHsm');
        localStorage.setItem('tgsfrequenceHsm', JSON.stringify(true))
      }
    } else {
      this.removeColumn('frequencyName');
      localStorage.removeItem('activeColhsmTGS');
      localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
      localStorage.removeItem('tgsfrequenceHsm');
      localStorage.setItem('tgsfrequenceHsm', JSON.stringify(false))
    }
  }

  addColumnTradeType() {
    if (this.tabletradetype === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.push('tradeTypeName', );
        this.displayedColumns.splice(11, 0, "tradeTypeName");
        localStorage.removeItem('activeColhsmTGS');
        localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tgstradetypeHsm');
        localStorage.setItem('tgstradetypeHsm', JSON.stringify(true))
      }
    } else {
      this.removeColumn('tradeTypeName');
      localStorage.removeItem('activeColhsmTGS');
      localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
      localStorage.removeItem('tgstradetypeHsm');
      localStorage.setItem('tgstradetypeHsm', JSON.stringify(false))
    }
  }

  addColumnOperationalMode() {
    if (this.tableoperationalmode === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.push('operationalModeName', );
        this.displayedColumns.splice(12, 0, "operationalModeName");
        localStorage.removeItem('activeColhsmTGS');
        localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tgsOperationHsm');
        localStorage.setItem('tgsOperationHsm', JSON.stringify(true))
      }
    } else {
      this.removeColumn('operationalModeName');
      localStorage.removeItem('activeColhsmTGS');
      localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
      localStorage.removeItem('tgsOperationHsm');
      localStorage.setItem('tgsOperationHsm', JSON.stringify(false))
    }
  }

  addColumnIndustry() {
    if (this.tableindustry === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.push('industryName', );
        this.displayedColumns.splice(2, 0, "industryName");
        localStorage.removeItem('activeColhsmTGS');
        localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tgsindustryHsm');
        localStorage.setItem('tgsindustryHsm', JSON.stringify(true))
      }
    } else {
      this.removeColumn('industryName');
      localStorage.removeItem('activeColhsmTGS');
      localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
      localStorage.removeItem('tgsindustryHsm');
      localStorage.setItem('tgsindustryHsm', JSON.stringify(false))
    }
  }

  addColumnBusinessType() {
    if (this.tablebusinesstype === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.push('businessType', );
        this.displayedColumns.splice(3, 0, "businessType");
        localStorage.removeItem('activeColhsmTGS');
        localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tgsBusinessHsm');
        localStorage.setItem('tgsBusinessHsm', JSON.stringify(true))
      }
    } else {
      this.removeColumn('businessType');
      localStorage.removeItem('activeColhsmTGS');
      localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
      localStorage.removeItem('tgsBusinessHsm');
      localStorage.setItem('tgsBusinessHsm', JSON.stringify(false))
    }
  }

  addColumnProcessFunction() {
    if (this.tableprocessfunction === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.push('processFunction', );
        this.displayedColumns.splice(5, 0, "processFunction");
        localStorage.removeItem('activeColhsmTGS');
        localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tgsProcessHsm');
        localStorage.setItem('tgsProcessHsm', JSON.stringify(true))
      }
    } else {
      this.removeColumn('processFunction');
      localStorage.removeItem('activeColhsmTGS');
      localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
      localStorage.removeItem('tgsProcessHsm');
      localStorage.setItem('tgsProcessHsm', JSON.stringify(false))
    }
  }

  addColumnAssetClass() {
    if (this.tableassetclass === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.push('className', );
        this.displayedColumns.splice(4, 0, "className");
        localStorage.removeItem('activeColhsmTGS');
        localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tgsAssetClassHsm');
        localStorage.setItem('tgsAssetClassHsm', JSON.stringify(true))
      }
    } else {
      this.removeColumn('className');
      localStorage.removeItem('activeColhsmTGS');
      localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
      localStorage.removeItem('tgsAssetClassHsm');
      localStorage.setItem('tgsAssetClassHsm', JSON.stringify(false))
    }
  }

  addColumnAssetSpec() {
    if (this.tableassetspec === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.push('specification', );
        this.displayedColumns.splice(6, 0, "specification");
        localStorage.removeItem('activeColhsmTGS');
        localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tgsSpecHsm');
        localStorage.setItem('tgsSpecHsm', JSON.stringify(true))
      }
    } else {
      this.removeColumn('specification');
      localStorage.removeItem('activeColhsmTGS');
      localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
      localStorage.removeItem('tgsSpecHsm');
      localStorage.setItem('tgsSpecHsm', JSON.stringify(false))
    }
  }

  addColumnAssetManufacturer() {
    if (this.tableassetmanufacturer === true) {
      if (this.displayedColumns.length) {
        // this.displayedColumns.push('assetManufacturer', );
        this.displayedColumns.splice(7, 0, "assetManufacturer");
        localStorage.removeItem('activeColhsmTGS');
        localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
        localStorage.removeItem('tgsManufacturerHsm');
        localStorage.setItem('tgsManufacturerHsm', JSON.stringify(true))
      }
    } else {
      this.removeColumn('assetManufacturer');
      localStorage.removeItem('activeColhsmTGS');
      localStorage.setItem('activeColhsmTGS', JSON.stringify(this.displayedColumns));
      localStorage.removeItem('tgsManufacturerHsm');
      localStorage.setItem('tgsManufacturerHsm', JSON.stringify(false))
    }
  }

  removeColumn(msg: string) {
    const index: number = this.displayedColumns.indexOf(msg);
    if (index !== -1) {
      this.displayedColumns.splice(index, 1);
    }
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

  toggleStatusMenu() {
    if (this.displayStatusMenu)
      this.displayStatusMenu = false;
    else
      this.displayStatusMenu = true;
  }

  onClickDocument(event) {
    if (this.displayTableColumn) {
      if (!this.tableColumn.nativeElement.contains(event.target)) // or some similar check
        this.toggleColumn();
    }

    if (this.displayMultiFilter) {
      if (!this.tableColumn.nativeElement.contains(event.target)) // or some similar check
        this.toggleFilter();
    }

    if (this.displayStatusMenu) {
      if (!this.statusMenu.nativeElement.contains(event.target)) // or some similar check
        this.toggleStatusMenu();
    }
  }

  changeStatus(event: any, id: number){
    console.log(id)
  }

  openDialogTgs(val: any, data: any) {
    if(this.canAccess('ViewTGSDetails')) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "900px";
      dialogConfig.height = "auto";
      dialogConfig.position = { top: '30px' };
      dialogConfig.data = { value: val, item: data };
      this._dataService.setData(dialogConfig.data);
      const dialogRef = this.dialog.open(HsmTgsViewModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(res => {
          this.ngOnInit();
      });
    }else {
      this.toastr.warning('You do not have permission to perform this action.', '');
    }
    
}

  deleteAction(id: number, name: string, tgsid: number): void {
    if(this.canAccess('DeleteTGS')) {
      if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
        this._assetTaskGroupStrategyHsmService.deleteAssetTaskGroupStrategy(id)
        .subscribe(res => {
            this._assetTaskGroupStrategyHsmService.deleteTGSId(tgsid)
              .subscribe(out => {
                this.toastr.success("Deleted Successfully!", 'Success'); 
                this.ngOnInit();
              })
                       
        });
      }
    }
    else {
      this.toastr.warning('You do not have permission to perform this action.', '');
    }
    
  }
}



