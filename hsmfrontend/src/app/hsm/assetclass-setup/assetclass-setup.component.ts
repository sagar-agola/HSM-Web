import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule, Output, EventEmitter } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';
import { CdkDragDrop, CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { PlantService } from '../services/plant.services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';
import { FormControl } from '@angular/forms';
import { IComponentHierarchy } from '../interfaces/IComponentHierarchy';
import { FlatTreeControl } from '@angular/cdk/tree';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { HttpClientExt } from 'src/app/shared/services/httpclient.services';
import { DataService } from 'src/app/shared/services/data.service';
import { ImportComponentHierarchyService } from '../services/importcomponenthierarchy.services';
import { CategoryHierarchyService } from '../services/categoryhierarchy.services';
import { ToastrService } from 'ngx-toastr';
import { CreateComponentModalComponent } from '../modal/createcomponentmodal/createcomponentmodal.component';
import { CategoryHierarchySiteService } from '../services/categoryhierarchysite.services';
import { IAllFMEAList, IFMEA } from '../interfaces/IFMEA';
import { fmeaDefault } from 'src/app/shared/helpers/default.helpers';
import { ComponentTaskService } from '../services/componenttask.services';
import { FMEAService } from '../services/fmea.services';
import { forkJoin } from 'rxjs';
import { ComponentVariantService } from '../services/componentvariant.services';
import { CloneTaskModalComponent } from '../modal/clonetaskmodal/clonetaskmodal.component';
import { AssetTaskGroupStrategyHsmService } from '../services/assettaskgroupstrategyhsm.services';
import { SitesService } from '../services/sites.services';
import { CustomerService } from '../services/customer.services';
import { IAssetEntities, ICloneTaskSite } from '../interfaces/ICustomer';
import { ICategoryHierarchySite } from '../interfaces/ICategoryHierarchySite';
import { CreateComponentSiteModalComponent } from '../modal/createcomponentsitemodal/createcomponentsitemodal.component';

interface TgsRootObject {
  hierarchy: TgsHierarchy[];
}

interface TgsHierarchy {
  Id: number;
  CategoryName: string;
  ClassId?:number,
  SpecId?:number,
  ManuId?:number, 
  Children?: TgsHierarchy[];
}

interface TgsChild{
  ClassId:number,
  SpecId:number,
  ManuId:number,
}

interface RootObject {
    hierarchy: ComponentHierarchy[];
  }

interface RootSiteObject {
    hierarchy: ComponentHierarchySite[];
  }

interface ComponentHierarchySite {
    Id: number,
    CategoryName: string;  
    SiteId: number,
    CustomerId: number,
    Children?: ComponentHierarchySite[];
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

@Component({
    selector: "asset-class-setup",
    templateUrl: './assetclass-setup.component.html',
    styleUrls: [
        './assetclass-setup.component.scss'
    ]
})

export class AssetClassSetupComponent implements OnInit {
    @Output() public onUploadFinished = new EventEmitter();

    myControl = new FormControl();
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('tableColumn') public tableColumn: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;
    @ViewChild(MatTable, {read: ElementRef} ) private matTableRef: ElementRef;

    displayedColumns: string[] = ['isAdd', 'taskIdentificationNo', 'parentCode', 'familyComponent', 'componentClass', 'subClass', 'buildSpec', 'componentManufacturer', 'failureMode', 'taskDescription', 'failureRiskTotalScore', 'acceptableLimits', 'correctiveActions', 'taskTypeName', 'frequencyName', 'systemStatus'];
    displayedColumnsNames: string[] = ['Task ID', 'Parent', 'Maint Unit', 'Maint Item', 'Sub Maint Item', 'BuildSpec', 'Manufacturer', 'Failure Mode', 'Task Description', 'Risk Score', 'Acceptable Limits', 'Corrective Action', 'Task Type', 'Interval', 'Status'];

    activeId: number;

    ELEMENT_DATA: IAllFMEAList[] = [];

    loading: boolean = false;
    isLoading: boolean = false;
    default: boolean = false;

    isClicked: boolean = false;
    isChecked: boolean = false;

    cloneTaskData: ICloneTaskSite = 
    {
      customerId: 0,
      AssetEntities : [],
      siteId: 0      
    };

    public data: [];
    content: any[]=[];
    categoryHierarchyList: any[] = [];
    categoryHierarchySiteList: any[] = [];

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
    customerList: any[] = [];
    siteList: any[] = [];

    taskIdList: any[] = [];
    failureModeList: any[] = [];

    fmeaObject: IFMEA = fmeaDefault();

    categoryHierarchyObject: IComponentHierarchy = {
        id: 0,
        parentId: 0,
        categoryCode: '',
        level: 0,
        categoryName: '',
        familyTaxonomyId: 0,
        classTaxonomyId: 0,
        subClassTaxonomyId: 0,
        buildSpecTaxonomyId: 0,
        manufacturerIdTaxonomyId: 0
    }

    categoryHierarchySiteObject: ICategoryHierarchySite = {
      id: 0,
      parentId: 0,
      categoryCode: '',
      level: 0,
      categoryName: '',
      siteId: 0,
      customerId: 0
  }
  
    currentId: number;
    hierarchyName: string = "";
    categoryCode: string = "";
    parentId: number;
    categoryHierarchyId: number;
    componentId: number = 0;
    siteId: number;
    componentFailureMode: string = "";
    AssetManufacName: string = "";

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
    componentLevel1Id: number;
    componentLevel2Id: number;
    componentLevel3Id: number;

    componentLevel1: string = "";
    componentLevel2: string = "";
    componentLevel3: string = "";
    componentLevel4: string = "";

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
    componentCode: string = "";


    assetHierarchyId: number;
    componentHierarchyId: number;
    customerId: number;
    assetClassType: string ="";

    isAdd: boolean = true;
    isDelete: boolean = false;
    isEdit: boolean = false;
    displayMultiFilter: boolean = false;
    isSelect: boolean = false;
    isHSMUser: boolean = false;
    isAdmin: boolean = false;

    taskid : number;
    fmeaid: number;

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
    
    tgshierarchy: TgsRootObject;
    hierarchy: RootObject;
    hierarchySite: RootSiteObject;

    private _transformerTgs = (node: TgsHierarchy, level: number) => {
      // console.log("NODE NI")
      // console.log(node);
      return {
        expandable: !!node.Children && node.Children.length > 0,
        id: node.Id,
        name: node.CategoryName,
        level: level,
        children: node
      };
    }

    private _transformer = (node: ComponentHierarchy, level: number) => {
        return {
          expandable: !!node.Children && node.Children.length > 0,
          id: node.Id,
          name: node.CategoryName,
          level: level,
        };
    }

    private _transformerSite = (node: ComponentHierarchySite, level: number) => {
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

    treeFlattenerSite = new MatTreeFlattener(
          this._transformerSite, node => node.level, node => node.expandable, node => node.Children);

    treeFlattenerTgs = new MatTreeFlattener(
          this._transformerTgs, node => node.level, node => node.expandable, node => node.Children);

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    dataSource2 = new MatTreeFlatDataSource(this.treeControl, this.treeFlattenerSite);
    dataSource3 = new MatTreeFlatDataSource(this.treeControl, this.treeFlattenerTgs);

    TREE_DATA: ComponentHierarchy[] = [];
    TREE_DATA2: TgsHierarchy[] = [];
    TREE_DATA3: ComponentHierarchySite[] = [];

    tgsTaskTree: any[] = [];

    /** The selection for checklist */
    checklistSelection = new SelectionModel<ExampleFlatNode>(true /* multiple */);

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private http: HttpClientExt,
        private _dataService: DataService,
        private _importComponentHierarchyService: ImportComponentHierarchyService,
        private _categoryHierarchyService: CategoryHierarchyService,
        private _componentVariantService: ComponentVariantService,
        private toastr: ToastrService,
        private el: ElementRef,
        private permissionService: PermissionManagerService,
        private _categoryHierarchySiteService: CategoryHierarchySiteService,
        private _componentTaskService: ComponentTaskService,
        private _assetTaskGroupStrategyHsmService: AssetTaskGroupStrategyHsmService,
        private _fmeaService: FMEAService,
        private _siteService: SitesService,
        private _customerService: CustomerService,
    ) {
      this._assetTaskGroupStrategyHsmService.getHsmTaskGroupStrategyHierarchyClone()
        .subscribe(res => {
          let json = JSON.parse(res['hierarchy']);
          this.tgsTaskTree = json;
        })
    }

    getLevel = (node: ExampleFlatNode) => node.level;

    isExpandable = (node: ExampleFlatNode) => node.expandable;

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: ExampleFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected =
        descendants.length > 0 &&
        descendants.every(child => {
            return this.checklistSelection.isSelected(child);
        });
        return descAllSelected;
    }

    /* Get the parent node of a node */
    getParentNode(node: ExampleFlatNode): ExampleFlatNode | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
        return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
        const currentNode = this.treeControl.dataNodes[i];

        if (this.getLevel(currentNode) < currentLevel) {
            return currentNode;
        }
        }
        return null;
    }

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: ExampleFlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
    }

    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: ExampleFlatNode): void {
        let parent: ExampleFlatNode | null = this.getParentNode(node);
        while (parent) {
        this.checkRootNodeSelection(parent);
        parent = this.getParentNode(parent);
        }
    }

    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: ExampleFlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected =
        descendants.length > 0 &&
        descendants.every(child => {
            return this.checklistSelection.isSelected(child);
        });
        if (nodeSelected && !descAllSelected) {
        this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
        this.checklistSelection.select(node);
        }
    }

    canAccess(roleKey: string): boolean {
        let access: boolean = false;
        access = this.permissionService.isGranted(roleKey);
        return access;
    }
    
    ngOnInit(): void {
        const user = JSON.parse(localStorage.currentUser);
        this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
        // console.log(user);
        this.isAdmin = user?.users?.isAdmin;
        this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
        this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
        this.isLoading = true;

        forkJoin(
            this._fmeaService.getSystemStatus(),
            this._categoryHierarchyService.getComponentCategoryHierarchy(),
            this._categoryHierarchySiteService.getCategoryHierarchySiteAssetClassTree(this.siteId),
            this._componentVariantService.getComponentVariants(),
            this._customerService.getCustomer(),
            ).subscribe(([ss, hr, cs, cv, cc]) => {
                this.isLoading  = false;
                this.statusList = ss;
                this.dataSource.data = JSON.parse(hr['hierarchy']);
                this.dataSource2.data = JSON.parse(cs['hierarchy']);
                this.componentVariantList = cv.sort((a, b) => (a.variantName < b.variantName ? -1 : 1));
                this.customerList = cc;
        });

        this.getFMTData();

       
    }

    getFMTData(){
        this._componentTaskService.getComponentTask()
            .subscribe(res => {
                this.componentTaskList = res;
            })
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

    nodeClick(node: any): void{
        this.hierarchyName = node;
        console.log(node);
    }

    customerOnselect(event){
      this.customerId = parseInt(event.target.value);
      if(this.customerId !== 0){
        this.isSelect = true;
      }else{
        this.isSelect = false;
      }

      this._siteService.getSitesByCustomerId(this.customerId)
        .subscribe(res => {
          this.siteList = res;
        })
    }

    siteOnSelect(event){
      this.siteId = parseInt(event.target.value);
    }

    checkThis(event: any, node: any){
        console.log(node.id)
        var index = this.categoryHierarchySiteList.map(x => {
            return x.id;
          }).indexOf(node.id);

        this._categoryHierarchyService.getComponentByCategoryId(node.id)
            .subscribe(res => {
                // console.log(res);
                if(event.target.checked === true){
                    this._categoryHierarchySiteService.getCategoryHierarchyChildSite(res.categoryCode)
                    .subscribe(out => {
                        // console.log(out)
                        out.forEach(x => {
                            let cid = x.id;
                            let categorycode = x.categoryCode;
                            let parent = x.parentId;
                            let level = x.level;
                            let categoryname = x.categoryName;

                            this.categoryHierarchySiteList.push({
                                id: cid,
                                parentId: parent,
                                categoryCode: categorycode,
                                categoryName: categoryname,
                                level: level,
                                siteId: this.siteId
                            });
                        })
                    });                        
                }else{
                    this._categoryHierarchySiteService.getCategoryHierarchyChildSite(res.categoryCode)
                    .subscribe(foo => {
                        // console.log(out)
                        this.categoryHierarchySiteList.splice(index, node.id);
                    });
                }
            });
    }

    checkThisTGS(data: any){

      this.cloneTaskData.AssetEntities = [];

      console.log(data);
      this.AssetManufacName = data.CategoryName;

      this.cloneTaskData.customerId = this.customerId;
      this.cloneTaskData.siteId = this.siteId;

      let entity: IAssetEntities = { specId:data.SpecId, manufactureId: data.ManuId, classId: data.ClassId};

      this.cloneTaskData.AssetEntities.push(entity);
    }

    cloneTask(): void{
      if(this.canAccess('CloneTasksSite')) {
        this.isLoading = true;
        this.cloneTaskData.customerId = this.customerId;
        this.cloneTaskData.siteId = this.siteId;

        if(this.siteId !== null && this.siteId !== 0 && this.siteId !== undefined) {
          this._customerService.cloneTasksByTaskId(this.cloneTaskData)
          .subscribe(res => {
            this.isLoading = false;
            this.toastr.success("Successfully clone tasks!", 'Success');
          })
        }
        else {
          this.toastr.error("Please select a Customer & Site");
          this.isLoading = false;
        }
      }else{
        this.toastr.warning('You do not have permission to perform this action.', '');
      }
    }

    saveSiteAssetClass(): void{
        this._categoryHierarchySiteService.upsertAssetClass(this.categoryHierarchySiteList)
            .subscribe(res => {
                // console.log(res);
                this.toastr.success("Successfully saved!", 'Success');
            })
    }

    tableDrop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
      }
  
      mapStatusData(id: number): string {
        let retData = "";
        retData = this.statusList.find(e => e.id === id);
        return retData;
      }

    initializeComponentData(data: IComponentHierarchy): void{
        this.categoryHierarchyObject = data;
    }

    clickEvent() {
        this.isDelete = true;
        this.isAdd = false;
        this.isEdit = false;    
    }
    
    clickAdd(){
        this.isDelete = false;
        this.isAdd = true;
        this.isEdit = false;
    }

    clickEdit(){
        this.isEdit = true;
        this.isDelete = false;
        this.isAdd = false;
    }
    
    addNewItem(node:any){
      if(this.canAccess('AddHSMAssetClassHierarchy')) {
        this.componentId = node.id;
        // console.log(this.componentId)
    
        this._categoryHierarchyService.getComponentByCategoryId(this.componentId)
          .subscribe(res => {
            // console.log(res)
              this.categoryHierarchyObject = res;
    
              const dialogConfig = new MatDialogConfig();
              dialogConfig.width = "450px";
              dialogConfig.height = "auto";
              dialogConfig.position = { top: '30px' };
              dialogConfig.data = { mode: 'add2', item: this.categoryHierarchyObject };
              this._dataService.setData(dialogConfig.data);
              const dialogRef = this.dialog.open(CreateComponentModalComponent, dialogConfig);
              dialogRef.afterClosed().subscribe(res => {
                this._categoryHierarchyService.getComponentCategoryHierarchy()
                .subscribe( res => {    
                    this.dataSource.data = JSON.parse(res['hierarchy']);
                    
                });
                this.treeControl.expand(node);
              });
          });
      }else{
        this.toastr.warning('You do not have permission to perform this action.', '');
      }
    }

    editItem(node:any){
      if(this.canAccess('AddHSMAssetClassHierarchy')) {
        this.componentId = node.id;
        // console.log(this.componentId)
    
        this._categoryHierarchyService.getComponentByCategoryId(this.componentId)
          .subscribe(res => {
            // console.log(res)
              this.categoryHierarchyObject = res;
    
              const dialogConfig = new MatDialogConfig();
              dialogConfig.width = "450px";
              dialogConfig.height = "auto";
              dialogConfig.position = { top: '30px' };
              dialogConfig.data = { mode: 'edit', item: this.categoryHierarchyObject, data: this.componentId };
              this._dataService.setData(dialogConfig.data);
              const dialogRef = this.dialog.open(CreateComponentModalComponent, dialogConfig);
              dialogRef.afterClosed().subscribe(res => {
                this._categoryHierarchyService.getComponentCategoryHierarchy()
                .subscribe( res => {    
                    this.dataSource.data = JSON.parse(res['hierarchy']);
                    this.isAdd = true;
                    this.isEdit = false;
                    
                });
                this.treeControl.expand(node);
              });
          });
      }else{
        this.toastr.warning('You do not have permission to perform this action.', '');
      }
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
    
    addLevel1(){
      if(this.canAccess('AddHSMAssetClassHierarchy')) {
        this._categoryHierarchyService.getComponentCategoryHierarchyLastCode()
          .subscribe(res => {
            this.categoryHierarchyObject = res;
            // console.log(res);
    
            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = "450px";
            dialogConfig.height = "auto";
            dialogConfig.position = { top: '30px' };
            dialogConfig.data = { mode: 'add1', item: this.categoryHierarchyObject };
            this._dataService.setData(dialogConfig.data);
            const dialogRef = this.dialog.open(CreateComponentModalComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(res => {
                this.ngOnInit();
            });
          });
      }else{
        this.toastr.warning('You do not have permission to perform this action.', '');
      }
    }

    deleteComponent(id: number, name: any){
        // console.log(id)
        if(this.canAccess('DeleteHSMAssetClassHierarchy')) {
          this._categoryHierarchyService.getCheckComponentHierarchyAttached(id)
          .subscribe(res => {
            // console.log(res);
            this.content = res;
            if(this.content.length >= 1){
              // this.toastr.warning('This Item can not be deleted as there is a attached Task, please remove this task prior to component deletion', 'Warning!');
              confirm("This Item can not be deleted as there is a attached Task, please remove this task prior to component deletion")
            }else{
              if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
                  this._categoryHierarchyService.deleteComponentHierarchy(id)
                  .subscribe(out => {
                    this.toastr.success('Deleted successfully', 'Success!');
                    this.ngOnInit();
                  });
              }
              // console.log("test");
            }
          })
        }else{
          this.toastr.warning('You do not have permission to perform this action.', '');
        }
    }

    addLevel1Site(){
      if(this.canAccess('AddSiteAssetClassHierarchy')) {
        this._categoryHierarchySiteService.getComponentCategoryHierarchySiteLastCode()
          .subscribe(res => {
            this.categoryHierarchySiteObject = res;
            console.log(res);
    
            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = "450px";
            dialogConfig.height = "auto";
            dialogConfig.position = { top: '30px' };
            dialogConfig.data = { mode: 'add1', item: this.categoryHierarchySiteObject };
            this._dataService.setData(dialogConfig.data);
            const dialogRef = this.dialog.open(CreateComponentSiteModalComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(res => {
                this.ngOnInit();
            });
          });
      }else{
        this.toastr.warning('You do not have permission to perform this action.', '');
      }
    }

    deleteComponentSite(id: number, name: any){
      if(this.canAccess('DeleteSiteAssetClassHierarchy')) {
        this._categoryHierarchySiteService.getCheckComponentHierarchySiteAttach(id)
          .subscribe(res => {
            // console.log(res);
            this.content = res;
            if(this.content.length >= 1){
              // this.toastr.warning('This Item can not be deleted as there is a attached Task, please remove this task prior to component deletion', 'Warning!');
              confirm("This Item can not be deleted as there is a attached Task, please remove this task prior to component deletion")
            }else{
              if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
                  this._categoryHierarchySiteService.deleteCategoryHierarchySite(id)
                  .subscribe(out => {
                    this.toastr.success('Deleted successfully', 'Success!');
                    this.ngOnInit();
                  });
              }
              // console.log("test");
            }
          })
      }else{
        this.toastr.warning('You do not have permission to perform this action.', '');
      }
    }

    addNewItemSite(node: any){
      if(this.canAccess('AddSiteAssetClassHierarchy')) {
        this.componentId = node.id;
        // console.log(this.componentId)
    
        this._categoryHierarchySiteService.getCategoryHierarchySiteRecordById(this.componentId)
          .subscribe(res => {
            // console.log(res)
              this.categoryHierarchySiteObject = res;
    
              const dialogConfig = new MatDialogConfig();
              dialogConfig.width = "450px";
              dialogConfig.height = "auto";
              dialogConfig.position = { top: '30px' };
              dialogConfig.data = { mode: 'add2', item: this.categoryHierarchySiteObject };
              this._dataService.setData(dialogConfig.data);
              const dialogRef = this.dialog.open(CreateComponentSiteModalComponent, dialogConfig);
              dialogRef.afterClosed().subscribe(res => {
                this._categoryHierarchySiteService.getCategoryHierarchySiteAssetClassTree(this.siteId)
                .subscribe( res => {    
                    this.dataSource2.data = JSON.parse(res['hierarchy']);
                    
                });
                this.treeControl.expand(node);
              });
          });
      }else{
        this.toastr.warning('You do not have permission to perform this action.', '');
      }
    }
}