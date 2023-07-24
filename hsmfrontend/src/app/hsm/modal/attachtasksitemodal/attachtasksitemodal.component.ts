import { Component, Inject, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { AssetTaskGroupStrategyService } from '../../services/assettaskgroupstrategy.services';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IAddedFlocTask, IAddFlocList, IAssetTaskGroupStrategy, IAssignAssetTaskGroupStrategyMaterial } from '../../interfaces/IAssetTaskGroupStrategy';
import { MatTableDataSource } from '@angular/material/table';
import { AssignTaskGroupStrategyService } from '../../services/assigntaskgroupstrategy.services';
import { DataService } from 'src/app/shared/services/data.service';
import { IAllFMEAList, IFMEA, IFmeaAssembly, IFMEATaskAdded, IFMEATaskAddedList } from '../../interfaces/IFMEA';
import { FMEAService } from '../../services/fmea.services';
import { AssignAssetTaskGroupStrategyMaterialService } from '../../services/assignassettaskgroupstrategymaterial.services';
import { SelectionModel } from '@angular/cdk/collections';
import { FmeaAssemblyService } from '../../services/fmeaassembly.services';
import { ComponentTaskService } from '../../services/componenttask.services';
import { ComponentFamilyService } from '../../services/componentfamily.services';
import { ComponentClassService } from '../../services/componentclass.services';
import { ComponentSubClassService } from '../../services/componentsubclass.services';
import { ComponentBuildSpecService } from '../../services/componentbuildspec.services';
import { ComponentManufacturerService } from '../../services/componentmanufacturer.services';
import { CategoryHierarchyService } from '../../services/categoryhierarchy.services';
import { FMEATaskAddedService } from '../../services/fmeataskadded.services';
import { TaskTypeService } from '../../services/tasktype.services';
import { FrequencyService } from '../../services/frequency.services';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FormControl } from '@angular/forms';
import { AssetTaskGroupStrategyHsmService } from '../../services/assettaskgroupstrategyhsm.services';
import { FmeaSiteService } from '../../services/fmeasite.services';
import { FMaintainableUnitService } from '../../services/fmaintainableunitsite.services';

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
  
@Component({
  selector: 'attachtask-site-modal',
  templateUrl: './attachtasksitemodal.component.html',
  styleUrls: ['./attachtasksitemodal.component.scss']
})

export class AttachTaskSiteModalComponent implements OnInit {
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('tableColumn') public tableColumn: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['isAdd', 'taskIdentificationNo', 'parentCode', 'familyComponent', 'componentClass', 'subClass', 'buildSpec', 'componentManufacturer', 'failureMode', 'taskDescription', 'failureRiskTotalScore', 'acceptableLimits', 'correctiveActions', 'taskTypeName', 'frequencyName'];

    displayedColumns2 = ['taskIdentificationNo', 'parentCode', 'familyTaxonomyId', 'classTaxonomyId', 'subClassTaxonomyId', 'buildSpecTaxonomyId', 'manufacturerTaxonomyId', 'failureMode', 'taskDescription', 'failureRiskTotalScore', 'acceptableLimits', 'correctiveActions', 'taskTypeId', 'intervalId'];
    @ViewChild('tableOnePaginator', {static: false}) tableOnePaginator: MatPaginator;
    @ViewChild('tableOneSort', {static: false}) tableOneSort: MatSort;
    containers = [];
    dataList: any[] = [];
    selection = new SelectionModel<IFMEATaskAddedList>(true, []);

    containerTask: any[] = [];
    containerComponents: any[] = [];

    ELEMENT_DATA: IAllFMEAList[] = [];
    ELEMENT_DATA3: IAddFlocList[] = [];
    ELEMENT_DATA2: IFMEA[] = [];
    ELEMENT_DATA_3: IFMEATaskAddedList [] = [];
    checkedIDs = [];
    flocAddTaskList: IAddedFlocTask[] = [];
    componentTaskList: any[] = [];
    assetFlocList: any[] = [];
    fmeaTaskAdded: any[] = [];
    fmeaTaskAddedFamily: any[] = [];
    fmeaTaskAddedClass: any[] = [];
    fmeaTaskAddedSubClass: any[] = [];
    fmeaTaskAddedList: IFmeaAssembly [] = [];
    fmeataskaddedList: any[] = [];
    finalTaskAddedList: any[] = [];
    
    tempListfam: any[] = [];
    tempListclass: any[] = [];
    tempListsubclass: any[] = [];
    fmeaObject: IFMEA;
    assetStrategyObject: IAssetTaskGroupStrategy;
    dataSource2;
    dataSource3
    index: number;

    assignAssetTaskGroupMaterialList: IAssignAssetTaskGroupStrategyMaterial[] = [];

    loading: boolean = false;
    default: boolean = false;

    isAdd: boolean = false;
    isAddDesc: boolean = false;
    isAddFamily: boolean = false;
    isAddClass: boolean = false;
    isAddSubClass: boolean = false;
    isAddTask: boolean = false;
    isChecked: boolean = false;

    disabledTab1: boolean = false;
    disabledTab2: boolean = false;
    disabledTab3: boolean = false;

    isMulti: boolean = false;
    isInclude: boolean = true;
    selectAll: boolean = false;
    isMinFloc: boolean = false;
    isMaxFloc: boolean = true;
    isMinDesc: boolean = false;
    isMaxDesc: boolean = true;

    isMax:boolean = true;
    isMin: boolean = false;
    displayMultiFilter: boolean = false;
    displayTableColumn: boolean = false;
    
    mode: string = "";
    fmeaId: number;
    taskId: number;
    selectedIndex: number = 0;
    activeId: number = 0;

    familyId: number;
    classId: number;
    subClassId: number;
    buildSpecId: number;
    manufacturerId: number;
    currentId: number;
    batchId: number;
    taskid: string = ""

    tasktypeId: number = 0;
    failuremode: string = "";
    tradetypeId: number = 0;
    frequencyId: number = 0;
    durationid: number = 0;
    variantid: number = 0;

    componentId: number = 0;
    componentCode: string = "";
    componentName: string = "";
    componentHierarchyCode: string = "";
    componentFailureMode: string = "";
    maintainableUnit: string = "";
    maintainableUnitId: number;

    taxonomyFamilyList: any[] = [];
    taxonomyClassList: any[] = [];
    taxonomySubClassList: any[] = [];
    taxonomyBuildSpecList: any[] = [];
    taxonomyManufacturerList: any[] = [];
    tasktypeList: any[] = [];
    frequencyList: any[] = [];
    maintUnitList: any[] = [];

    taskTypeList: any[] = [];
    tradeTypeList: any[] = [];
    durationList: any[] = [];

    taskIdList: any[] = [];

    taskAssignList: any[] = [];
    taskSiteAssignList: any[] = [];

    componentLevel1Id: number;
    componentLevel2Id: number;
    componentLevel3Id: number;
    componentLevel4Id: number;

    componentLevel1: string = "";
    componentLevel2: string = "";
    componentLevel3: string = "";
    componentLevel4: string = "";

    //column table
    siteAtmtableTaskId: boolean = true;
    siteAtmtableParent: boolean = true;
    siteAtmtableFailureMode: boolean = true;
    siteAtmtableTaskDesc: boolean = true;
    siteAtmtableFailureRiskScore: boolean = true;
    siteAtmtableAcceptableLimits: boolean = true;
    siteAtmtableCorrective: boolean = true;
    siteAtmtableTaskType: boolean = true;
    siteAtmtableInterval: boolean = true;
    siteAtmtableFamily: boolean = true;
    siteAtmtableClass: boolean = true;
    siteAtmtableSubClass: boolean = true;
    siteAtmtableBuildSpec: boolean = true;
    siteAtmtableManufacturer: boolean = true;
    siteAtmtableVariant: boolean = false;

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

    siteId: number = 0;
    customerId: number = 0;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AttachTaskSiteModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data2: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _fmuftSiteService: FMaintainableUnitService,
        private _fmeaSiteService: FmeaSiteService,
        private _componentTaskService: ComponentTaskService,
        private _famnilyTaxonomyService: ComponentFamilyService,
        private _classTaxonomyService: ComponentClassService,
        private _subClassTaxonomyService: ComponentSubClassService,
        private _buildSpecTaxonomyService: ComponentBuildSpecService,
        private _manufacturerTaxonomyService: ComponentManufacturerService,
        private _assetTaskGroupStrategyService: AssetTaskGroupStrategyService,
        private _fmeaTaskAddedService: FMEATaskAddedService,
        private _taskTypeService: TaskTypeService,
        private _frequencyService: FrequencyService) {

        const user = JSON.parse(localStorage.currentUser);
        this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
        this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
        
    }

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

    ngOnInit(): void {
        this.loading = true;
        this.data2 = this._dataService.getData();

        // console.log(this.data2.item)
        // this.batchId = this.data2.item;

        var addedtasks = JSON.parse(localStorage.getItem("containers"));

        this.taskSiteAssignList = addedtasks;

        this.dataSource.data = this.data2.item;

        var newdisplaycolumn = JSON.parse(localStorage.getItem('activeColsSiteAttach'));
        var taskval = JSON.parse(localStorage.getItem('siteAtmtaskidNosite'));
        var parentc = JSON.parse(localStorage.getItem('siteAtmparentsite'));
        var failmode = JSON.parse(localStorage.getItem('siteAtmfmodesite'));
        var taskdesc = JSON.parse(localStorage.getItem('siteAtmdescsite'));
        var failscore = JSON.parse(localStorage.getItem('siteAtmfscoresite'));
        var acclimits = JSON.parse(localStorage.getItem('siteAtmlimitsite'));
        var correctives = JSON.parse(localStorage.getItem('siteAtmcorrectivesite'));
        var ttype = JSON.parse(localStorage.getItem('siteAtmtasktypesite'));
        var frequency = JSON.parse(localStorage.getItem('siteAtmintervalsite'));
        var maintUnit = JSON.parse(localStorage.getItem('siteAtmmainunitsite'));
        var maintItem = JSON.parse(localStorage.getItem('siteAtmmaintitemsite'));
        var maintSub = JSON.parse(localStorage.getItem('siteAtmmaintsubitemsite'));
        var buildspec = JSON.parse(localStorage.getItem('siteAtmbuildspecsite'));
        var manufacturer = JSON.parse(localStorage.getItem('siteAtmmanufacturesite'));

        if(newdisplaycolumn !== null){
            this.displayedColumns =  JSON.parse(localStorage.getItem('activeColsSiteAttach'));
        }

        if(taskval !== null){
            this.siteAtmtableTaskId = taskval;
        }

        if(parentc !== null){
            this.siteAtmtableParent = parentc;
        }

        if(failmode !== null){
            this.siteAtmtableFailureMode = failmode;
        }

        if(taskdesc !== null){
            this.siteAtmtableTaskDesc = taskdesc;
        }

        if(failscore !== null){
            this.siteAtmtableFailureRiskScore = failscore;
        }

        if(acclimits !== null){
            this.siteAtmtableAcceptableLimits = acclimits;
        }

        if(correctives !== null){
            this.siteAtmtableCorrective = correctives;
        }

        if(ttype !== null){
            this.siteAtmtableTaskType = ttype;
        }

        if(frequency !== null){
            this.siteAtmtableInterval = frequency;
        }

        if(maintUnit !== null){
            this.siteAtmtableFamily = maintUnit;
        }

        if(maintItem !== null){
            this.siteAtmtableClass = maintItem;
        }

        if(maintSub !== null){
            this.siteAtmtableSubClass = maintSub;
        }

        if(buildspec !== null){
            this.siteAtmtableBuildSpec = buildspec;
        }

        if(manufacturer !== null){
            this.siteAtmtableManufacturer = manufacturer;
        }

        forkJoin(
            this._famnilyTaxonomyService.getComponentFamily(),
            this._classTaxonomyService.getComponentClass(),
            this._subClassTaxonomyService.getComponentSubClass(),
            this._buildSpecTaxonomyService.getComponentBuildSpec(),
            this._manufacturerTaxonomyService.getComponentManufacturer(),
            this._taskTypeService.getTaskType(),
            this._frequencyService.getFrequency(),
            this._componentTaskService.getComponentTask(),
            ).subscribe(([ct, cl, tp, th, mt, ty, fr, mu]) => {
                // this.taxonomyFamilyList = ct;
                // this.taxonomyClassList = cl;
                // this.taxonomySubClassList = tp;
                // this.taxonomyBuildSpecList = th;
                // this.taxonomyManufacturerList = mt;
                this.tasktypeList = ty;
                this.frequencyList = fr;
                // this.maintUnitList = mu;
                // console.log(mu)
                
        });

        this.getFMTData();
    }

    nodeClick(node: any){
        this.componentId = node.id;
        this.componentName = node.name;
        console.log(this.componentId)

        this._fmuftSiteService.getFMUFTByComponentId(this.componentId, this.siteId, this.customerId)
            .subscribe(fc => {
                this.maintainableUnit = fc[0]['categoryName'];
                this.maintainableUnitId = fc[0]['id'];
                this.componentLevel1= fc[0]['categoryName'];
                this.componentLevel2= (fc[1] != null || fc[1] != undefined) ? fc[1]['categoryName']: "";
                this.componentLevel3= (fc[2] != null || fc[2] != undefined) ? fc[2]['categoryName']: "";
                this.componentLevel4 = (fc[3] != null || fc[3] != undefined) ? fc[3]['categoryName']: "";
                this.maintainableUnitId = fc[0]['id'];
                this.componentLevel2Id = (fc[1] != null || fc[1] != undefined) ? fc[1]['id'] : 0;
                this.componentLevel3Id = (fc[2] != null || fc[2] != undefined) ? fc[2]['id'] : 0;
                this.componentLevel4Id = (fc[3] != null || fc[3] != undefined) ? fc[3]['id'] : 0;

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

            this._fmeaSiteService.getFmeaSiteTaskByCategoryId(this.componentId)
                .subscribe(res => {
                // console.log(res)
                this.loading = false;
                this.default = false;
                this.ELEMENT_DATA = res;
                this.dataSource2 = new MatTableDataSource<IAllFMEAList>(this.ELEMENT_DATA);
                this.dataSource2.paginator = this.paginator;
                this.dataSource2.sort = this.sort;
                });

            this._fmeaSiteService.getDropdownMaintUnitList(this.componentId)
                .subscribe(i => {
                   this.maintUnitList = i.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
                });

            this._fmeaSiteService.getDropdownMaintItemList(this.componentId)
                .subscribe(i => {
                   this.taxonomyClassList = i.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
                });
            this._fmeaSiteService.getDropdownSubItemList(this.componentId)
                .subscribe(s => {
                   this.taxonomySubClassList = s.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
                });
            this._fmeaSiteService.getDropdownBuildSpecList(this.componentId)
                .subscribe(b => {
                   this.taxonomyBuildSpecList = b.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
                });
            this._fmeaSiteService.getDropdownManufacturerList(this.componentId)
                .subscribe(m => {
                   this.taxonomyManufacturerList = m.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
                });
            this._fmeaSiteService.getDropdownTaskTypeList(this.componentId)
                .subscribe(tt => {
                  this.taskTypeList = tt.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
                });
        
            this._fmeaSiteService.getDropdownTradeTypeList(this.componentId)
                .subscribe(ty => {
                  this.tradeTypeList = ty.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
                });
        
            this._fmeaSiteService.getDropdownFrequencyList(this.componentId)
                .subscribe(fr => {
                  this.frequencyList = fr.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
                });
        
            this._fmeaSiteService.getDropdownDurationList(this.componentId)
                .subscribe(dr => {
                  this.durationList = dr.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
                });
    }

    onKeyupTask(name: string){
        if(name !== '')
        {
            this._fmeaSiteService.getDropdownTaskIdList(name, this.componentId)
            .subscribe(res => {
                // console.log(res)
                this.taskIdList = res;
                
            })
        }else{
            return false;
        }
    }

    getFMTData(){
        this._componentTaskService.getComponentTask()
            .subscribe(res => {
                this.componentTaskList = res;
            })
    }

    toggleFilter() {
        if(this.displayMultiFilter)
          this.displayMultiFilter = false;
        else
          this.displayMultiFilter = true;
    }

    untoggleFilter() {
        this.displayMultiFilter = false;
    }

    toggleMin(){
        this.isMin = true;
        this.isMax = false;
    }

    toggleMax(){
        this.isMin = false;
        this.isMax = true;
    }

    maintUnitOnselect(event){
        this.familyId = parseInt(event.target.value);
        // console.log(this.classId)

        this.searchFilter();
    }

    classOnselect(event){
        this.classId = parseInt(event.target.value);
        // console.log(this.classId)

        this.searchFilter();
    }

    subclassOnselect(event){
        this.subClassId = parseInt(event.target.value);
        // console.log(this.subClassId)

        this.searchFilter();
    }

    buildSpecOnselect(event){
        this.buildSpecId = parseInt(event.target.value);
        // console.log(this.buildSpecId)

        this.searchFilter();
    }

    manufacturerOnselect(event){
        this.manufacturerId = parseInt(event.target.value);
        // console.log(this.manufacturerId)

        this.searchFilter();
    }

    tradeTypeOnSelect(event){
        this.tradetypeId = parseInt(event.target.value);
    }

    taskTypeOnSelect(event){
        this.tasktypeId = parseInt(event.target.value);
    }

    durationOnSelect(event){
        this.durationid = parseInt(event.target.value);
    }

    frequencyOnSelect(event){
        this.frequencyId = parseInt(event.target.value);
    }

    variantOnSelect(event){
        this.variantid = parseInt(event.target.value);
        // console.log(this.variantid)
      }

    fmDataClick(item: number, name: string){
        // console.log(item)
        this.componentId = item;
        this.componentFailureMode = name;

        this._fmeaSiteService.getFailureModeTaskList(item)
            .subscribe(res => {
                this.loading = false;
                this.default = false;
                this.ELEMENT_DATA = res;
                this.dataSource2 = new MatTableDataSource<IAllFMEAList>(this.ELEMENT_DATA);
                this.dataSource2.paginator = this.paginator;
                this.dataSource2.sort = this.sort;
            });
    }

    filterTask(): void{
        this._fmeaSiteService.getFmeaAssemblyTaskListFilter(this.componentId, this.familyId, this.classId, this.subClassId, this.buildSpecId, this.manufacturerId)
            .subscribe(res => {
                // console.log(res)
                this.loading = false;
                this.default = false;
                this.ELEMENT_DATA = res;
                this.dataSource2 = new MatTableDataSource<IAllFMEAList>(this.ELEMENT_DATA);
                this.dataSource2.paginator = this.paginator;
                this.dataSource2.sort = this.sort;
            })
    }

    searchFilter(): void{
        this._fmeaSiteService.getAllFmeaSiteTaskListAttachFilters(this.componentId, this.taskid, this.failuremode, this.tasktypeId, this.tradetypeId, this.frequencyId, this.durationid, this.variantid, this.familyId, this.classId, this.subClassId, this.buildSpecId, this.manufacturerId, this.customerId, this.siteId)
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

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource2.data.length; 
        this.selectAll = true;
        return numSelected === numRows;
      }
    
      /** Selects all rows if they are not all selected; otherwise clear selection. */
      masterToggle() {

        if (this.isAllSelected()){
            this.selection.clear();
            this.fmeataskaddedList = [];
        } 
        else {
            this.dataSource2.data.forEach(e => {
                this.selection.select(e);
                this.addFMEATask(true, e)
            })
        }

        this.ELEMENT_DATA2 = this.fmeataskaddedList; 
        this.dataSource3 = new MatTableDataSource<IFMEA>(this.ELEMENT_DATA2);
      }

      unToggle(){
         if(!this.isAllSelected()){
            this.dataSource3.data.forEach(row => this.selection.select(row))
            this.fmeataskaddedList = []
         }

        //  console.log(this.isAllSelected())
      }

      checkAll(event: any){
          if(event.target.checked === true){
              this.masterToggle();
          }else{
              this.unToggle();
          }
      }

    fetchCheckedIDs(event: any, id: number) {
        this.checkedIDs = []
        if (event.target.checked === true) {
            this.checkedIDs.push(id);
            // console.log(this.checkedIDs)
        }
        else{
            let index = this.checkedIDs.indexOf(event.target.value);
            this.checkedIDs.splice(index, 1);
            // console.log(this.checkedIDs)
        }
    }

    addFMEATask(checked: boolean, data: any): void{
        
        if (checked) {
            data.id = 0;
            this.fmeataskaddedList.push(data);
        }
        else{
            var index = this.fmeataskaddedList.findIndex(e => { return e.taskIdentificationNo ===  data.taskIdentificationNo});
            this.fmeataskaddedList.splice(index, 1);
        }

        this.ELEMENT_DATA2 = this.fmeataskaddedList;
        this.dataSource3 = new MatTableDataSource<IFMEA>(this.ELEMENT_DATA2);
    }

    // addFMEATask(event: any, fmeaid: number): void{
    //     var index = this.fmeataskaddedList.map(x => {
    //       return x.id;
    //     }).indexOf(fmeaid);
    
    //     if (event.target.checked === true) {
    //     //   console.log(fmeaid)
    
    //       this._fmeaSiteService.getFMEASiteTask(fmeaid)
    //         .subscribe(res => {
    //         //   console.log(res);
    //         //   this.finalTaskAddedList = res;
    //           res.forEach(x => {
    //             let acclimits  = x.acceptableLimits;
    //             let builds  = x.buildSpecTaxonomyId;
    //             let cClass  = x.classTaxonomyId;
    //             let comHierarchy = x.componentHierarchyId;
    //             let comLevl1 = x.componentLevel1Id;
    //             let comLevl2 = x.componentLevel2Id;
    //             let comLevl3 = x.componentLevel3Id;
    //             let comLevl4 = x.componentLevel4Id;
    //             let comTaskFunc = x.componentTaskFunction;
    //             let cActions  = x.correctiveActions;
    //             let duration = x.durationId;
    //             let endEffect = x.endEffect;
    //             let failureCause = x.failureCause;
    //             let failureEffect = x.failureEffect;
    //             let fmode  = x.failureMode;
    //             let fScore  = x.failureRiskTotalScore;
    //             let familyCom  = x.familyTaxonomyId;
    //             let freq  = x.intervalId;
    //             let unId  = x.id;
    //             let cManufacture  = x.manufacturerTaxonomyId;
    //             let operaMode = x.operationalModeId;
    //             let origIn = x.origIndic;
    //             let pCode  = x.parentCode;
    //             let resourceQ = x.resourceQuantity;
    //             let sClass  = x.subClassTaxonomyId;
    //             let sysDesc  = x.systemDescription;
    //             let taskDesc = x.taskDescription;
    //             let taskIdent  = x.taskIdentificationNo;
    //             let tType  = x.taskTypeId;
    //             let tradeType = x.tradeTypeId;
    //             let variant = x.variantId;
    
    //             this.fmeataskaddedList.push({
    //                 acceptableLimits: acclimits,
    //                 buildSpecTaxonomyId: builds,
    //                 classTaxonomyId: cClass,
    //                 componentHierarchyId: comHierarchy,
    //                 componentLevel1Id: comLevl1,
    //                 componentLevel2Id: comLevl2,
    //                 componentLevel3Id: comLevl3,
    //                 componentLevel4Id: comLevl4,
    //                 componentTaskFunction: comTaskFunc,
    //                 correctiveActions: cActions,
    //                 durationId: duration,
    //                 endEffect: endEffect,
    //                 failureCause: failureCause,
    //                 failureEffect: failureEffect,
    //                 failureMode: fmode,
    //                 failureRiskTotalScore: fScore,
    //                 familyTaxonomyId: familyCom,
    //                 intervalId: freq,
    //                 manufacturerTaxonomyId: cManufacture,
    //                 operationalModeId: operaMode,
    //                 origIndic: origIn,
    //                 parentCode: pCode,
    //                 resourceQuantity: resourceQ,
    //                 subClassTaxonomyId: sClass,
    //                 systemDescription: sysDesc,
    //                 taskDescription: taskDesc,
    //                 taskIdentificationNo: taskIdent,
    //                 taskTypeId: tType,
    //                 tradeTypeId: tradeType,
    //                 variantId: variant,
    //                 categoryId: this.batchId,
    //                 fmmtId: unId
    //             });

    //             // console.log(this.fmeataskaddedList)
    
    //             this.ELEMENT_DATA2 = this.fmeataskaddedList;
    //             this.dataSource3 = new MatTableDataSource<IFMEA>(this.ELEMENT_DATA2);
    //           });          
    //         });
    //     }
    //     else{
    //       this.fmeataskaddedList.splice(index, fmeaid);
    //       this.ELEMENT_DATA2 = this.fmeataskaddedList;
    //       this.dataSource3 = new MatTableDataSource<IFMEA>(this.ELEMENT_DATA2);
    //     }
        
    // }

    mapMaintUnit(id: number): string {
        let retData = "";
        retData = this.maintUnitList.find(e => e.id === id);
        return retData;
    }

    mapMaintItem(id: number): string {
        let retData = "";
        retData = this.taxonomyClassList.find(e => e.id === id);
        return retData;
    }

    mapSubMaintItem(id: number): string {
        let retData = "";
        retData = this.taxonomySubClassList.find(e => e.id === id);
        return retData;
    }

    mapBuildSpec(id: number): string {
        let retData = "";
        retData = this.taxonomyBuildSpecList.find(e => e.id === id);
        return retData;
    }

    mapManufacturer(id: number): string {
        let retData = "";
        retData = this.taxonomyManufacturerList.find(e => e.id === id);
        return retData;
    }

    mapTaskType(id: number): string {
        let retData = "";
        retData = this.tasktypeList.find(e => e.id === id);
        return retData;
    }

    mapFrequency(id: number): string {
        let retData = "";
        retData = this.frequencyList.find(e => e.id === id);
        return retData;
    }

    AssignTask():void{
        // console.log(this.fmeataskaddedList)
        if(this.taskSiteAssignList !== null){
            this.fmeataskaddedList.forEach( x => {
                // console.log(x)
                let maintunit = x.componentHierarchyId;
                let cClass = x.classTaxonomyId;
                let sClass = x.subClassTaxonomyId;
                let taskDesc = x.taskDescription;
                let acclimits = x.acceptableLimits;
                let corrective = x.correctiveActions;
                let fmeaid = x.fmmtId;
    
                this.taskSiteAssignList.push({
                    fmeaid: fmeaid,
                    categoryId: this.componentId,
                    categoryName: this.componentHierarchyCode,
                    taskDescription: taskDesc,
                    acceptableLimits: acclimits,
                    correctiveActions: corrective,
                    maintUnitId: maintunit,
                    maintItemId: cClass,
                    maintSubItem: sClass
                });
            });

            localStorage.setItem("containersTask", JSON.stringify(this.taskSiteAssignList));

            // var groupBy = function(xs, key) {
            //     return xs.reduce(function(rv, x) {
            //       (rv[x[key]] = rv[x[key]] || []).push(x);
            //       return rv;
            //     }, {});
            //   }
            
            // // Group by color as key to the person array
            // const taskGroupById = groupBy(this.taskHsmAssignList, 'categoryName');
            // this.taskHsmAssignList = taskGroupById;
            // console.log(this.taskHsmAssignList)
        }
        else{
            this.fmeataskaddedList.forEach( x => {
                // console.log(x)
                let maintunit = x.componentHierarchyId;
                let cClass = x.classTaxonomyId;
                let sClass = x.subClassTaxonomyId;
                let taskDesc = x.taskDescription;
                let acclimits = x.acceptableLimits;
                let corrective = x.correctiveActions;
                let fmeaid = x.fmmtId;
    
                
                this.taskAssignList.push({
                    fmeaid: fmeaid,
                    categoryId: this.componentId,
                    categoryName: this.componentHierarchyCode,
                    taskDescription: taskDesc,
                    acceptableLimits: acclimits,
                    correctiveActions: corrective,
                    maintUnitId: maintunit,
                    maintItemId: cClass,
                    maintSubItem: sClass
                });
            });

            localStorage.setItem("containersTask", JSON.stringify(this.taskAssignList));
        }
        

        if(this.taskSiteAssignList !== null){
            localStorage.setItem("containers", JSON.stringify(this.taskSiteAssignList));
        }
        else{
            localStorage.setItem("containers", JSON.stringify(this.taskAssignList));
        }
        // this._fmeaAssemblyService.upsertTaskAdded(this.fmeataskaddedList)
        //     .subscribe(res => {
        //         console.log(res);
        //         this.toastr.success("Successfully assigned task!", 'Success');
        //     })
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
        if (this.siteAtmtableTaskId === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(1, 0, "taskIdentificationNo");
            // this.displayedColumns.push('taskIdentificationNo');
            localStorage.removeItem('activeColsSiteAttach');
            localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAtmtaskidNosite');
            localStorage.setItem('siteAtmtaskidNosite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('taskIdentificationNo');
          localStorage.removeItem('activeColsSiteAttach');
          localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAtmtaskidNosite');
          localStorage.setItem('siteAtmtaskidNosite', JSON.stringify(false))
        }
      }
  
      addColumnParent() {
        if (this.siteAtmtableParent === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(2, 0, "parentCode");
            // this.displayedColumns.push('parentCode');
            localStorage.removeItem('activeColsSiteAttach');
            localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAtmparentsite');
            localStorage.setItem('siteAtmparentsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('parentCode');
          localStorage.removeItem('activeColsSiteAttach');
          localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAtmparentsite');
          localStorage.setItem('siteAtmparentsite', JSON.stringify(false))
        }
      }
  
      addColumnFailureMode() {
        if (this.siteAtmtableFailureMode === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(8, 0, "failureMode");
            // this.displayedColumns.push('failureMode');
            localStorage.removeItem('activeColsSiteAttach');
            localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAtmfmodesite');
            localStorage.setItem('siteAtmfmodesite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('failureMode');
          localStorage.removeItem('activeColsSiteAttach');
          localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAtmfmodesite');
          localStorage.setItem('siteAtmfmodesite', JSON.stringify(false))
        }
      }
  
      addColumnTaskDesc() {
        if (this.siteAtmtableTaskDesc === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(9, 0, "taskDescription");
            // this.displayedColumns.push('taskDescription');
            localStorage.removeItem('activeColsSiteAttach');
            localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAtmdescsite');
            localStorage.setItem('siteAtmdescsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('taskDescription');
          localStorage.removeItem('activeColsSiteAttach');
          localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAtmdescsite');
          localStorage.setItem('siteAtmdescsite', JSON.stringify(false))
        }
      }
  
      addColumnFailureRiskScore() {
        if (this.siteAtmtableFailureRiskScore === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(10, 0, "failureRiskTotalScore");
            // this.displayedColumns.push('failureRiskTotalScore');
            localStorage.removeItem('activeColsSiteAttach');
            localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAtmfscoresite');
            localStorage.setItem('siteAtmfscoresite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('failureRiskTotalScore');
          localStorage.removeItem('activeColsSiteAttach');
          localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAtmfscoresite');
          localStorage.setItem('siteAtmfscoresite', JSON.stringify(false))
        }
      }
  
      addColumnAcceptableLimits() {
        if (this.siteAtmtableAcceptableLimits === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(11, 0, "acceptableLimits");
            // this.displayedColumns.push('acceptableLimits');
            localStorage.removeItem('activeColsSiteAttach');
            localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAtmlimitsite');
            localStorage.setItem('siteAtmlimitsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('acceptableLimits');
          localStorage.removeItem('activeColsSiteAttach');
          localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAtmlimitsite');
          localStorage.setItem('siteAtmlimitsite', JSON.stringify(false))
        }
      }
  
      addColumnCorrectiveActions() {
        if (this.siteAtmtableCorrective === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(12, 0, "correctiveActions");
            // this.displayedColumns.push('correctiveActions');
            localStorage.removeItem('activeColsSiteAttach');
            localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAtmcorrectivesite');
            localStorage.setItem('siteAtmcorrectivesite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('correctiveActions');
          localStorage.removeItem('activeColsSiteAttach');
          localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAtmcorrectivesite');
          localStorage.setItem('siteAtmcorrectivesite', JSON.stringify(false))
        }
      }
  
      addColumnTaskType() {
        if (this.siteAtmtableTaskType === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(13, 0, "taskTypeName");
            // this.displayedColumns.push('taskTypeName');
            localStorage.removeItem('activeColsSiteAttach');
            localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAtmtasktypesite');
            localStorage.setItem('siteAtmtasktypesite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('taskTypeName');
          localStorage.removeItem('activeColsSiteAttach');
          localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAtmtasktypesite');
          localStorage.setItem('siteAtmtasktypesite', JSON.stringify(false))
        }
      }
  
      addColumnFrequency() {
        if (this.siteAtmtableInterval === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(14, 0, "frequencyName");
            // this.displayedColumns.push('frequencyName');
            localStorage.removeItem('activeColsSiteAttach');
            localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAtmintervalsite');
            localStorage.setItem('siteAtmintervalsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('frequencyName');
          localStorage.removeItem('activeColsSiteAttach');
          localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAtmintervalsite');
          localStorage.setItem('siteAtmintervalsite', JSON.stringify(false))
        }
      }
  
      addColumnFamily() {
        if (this.siteAtmtableFamily === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(3, 0, "familyComponent");
            // this.displayedColumns.push('familyComponent');
            localStorage.removeItem('activeColsSiteAttach');
            localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAtmmainunitsite');
            localStorage.setItem('siteAtmmainunitsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('familyComponent');
          localStorage.removeItem('activeColsSiteAttach');
          localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAtmmainunitsite');
          localStorage.setItem('siteAtmmainunitsite', JSON.stringify(false))
        }
      }
  
      addColumnClass() {
        if (this.siteAtmtableClass === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(4, 0, "componentClass");
            // this.displayedColumns.push('componentClass');
            localStorage.removeItem('activeColsSiteAttach');
            localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAtmmaintitemsite');
            localStorage.setItem('siteAtmmaintitemsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('componentClass');
          localStorage.removeItem('activeColsSiteAttach');
          localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAtmmaintitemsite');
          localStorage.setItem('siteAtmmaintitemsite', JSON.stringify(false))
        }
      }
  
      addColumnSubClass() {
        if (this.siteAtmtableSubClass === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(5, 0, "subClass");
            // this.displayedColumns.push('subClass');
            localStorage.removeItem('activeColsSiteAttach');
            localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAtmmaintsubitemsite');
            localStorage.setItem('siteAtmmaintsubitemsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('subClass');
          localStorage.removeItem('activeColsSiteAttach');
          localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAtmmaintsubitemsite');
          localStorage.setItem('siteAtmmaintsubitemsite', JSON.stringify(false))
        }
      }
  
      addColumnBuildSpec() {
        if (this.siteAtmtableBuildSpec === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(6, 0, "buildSpec");
            // this.displayedColumns.push('buildSpec');
            localStorage.removeItem('activeColsSiteAttach');
            localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAtmbuildspecsite');
            localStorage.setItem('siteAtmbuildspecsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('buildSpec');
          localStorage.removeItem('activeColsSiteAttach');
          localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAtmbuildspecsite');
          localStorage.setItem('siteAtmbuildspecsite', JSON.stringify(false))
        }
      }
  
      addColumnManufacturer() {
        if (this.siteAtmtableManufacturer === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(7, 0, "componentManufacturer");
            // this.displayedColumns.push('componentManufacturer');
            localStorage.removeItem('activeColsSiteAttach');
            localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAtmmanufacturesite');
            localStorage.setItem('siteAtmmanufacturesite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('componentManufacturer');
          localStorage.removeItem('activeColsSiteAttach');
          localStorage.setItem('activeColsSiteAttach', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAtmmanufacturesite');
          localStorage.setItem('siteAtmmanufacturesite', JSON.stringify(false))
        }
      }
  
      addColumnVariant() {
        if (this.siteAtmtableVariant === true) {
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

    close(): void {
        this.dialogRef.close();
    }

}
