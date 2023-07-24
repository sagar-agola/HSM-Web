import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
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
import { IFMEA, IFMEATaskAdded, IFMEATaskAddedList, IFmeaAssembly, IAllFMEAList, IFMEASite } from '../../interfaces/IFMEA';
import { FMEAService } from '../../services/fmea.services';
import { AssignAssetTaskGroupStrategyMaterialService } from '../../services/assignassettaskgroupstrategymaterial.services';
import { SelectionModel } from '@angular/cdk/collections';
import { FmeaAssemblyService } from '../../services/fmeaassembly.services';
import { ComponentTaskService } from '../../services/componenttask.services';
import { ComponentFamilyService } from '../../services/componentfamily.services';
import { ComponentClassService } from '../../services/componentclass.services';
import { ComponentSubClassService } from '../../services/componentsubclass.services';
import { ComponentBuildSpecService } from '../../services/componentbuildspec.services';
import { CategoryHierarchyService } from '../../services/categoryhierarchy.services';
import { ComponentManufacturerService } from '../../services/componentmanufacturer.services';
import { FMEATaskAddedService } from '../../services/fmeataskadded.services';
import { TaskTypeService } from '../../services/tasktype.services';
import { FrequencyService } from '../../services/frequency.services';
import { FmeaSiteService } from '../../services/fmeasite.services';
import { FMaintainableUnitService } from '../../services/fmaintainableunitsite.services';

@Component({
  selector: 'assigntask-site-modal',
  templateUrl: './assigntasksitemodal.component.html',
  styleUrls: ['./assigntasksitemodal.component.scss']
})

export class AssignTaskSiteModalComponent implements OnInit {
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
    dataSource3;
    selection = new SelectionModel<IFMEATaskAddedList>(true, []);

    containerTask: any[] = [];
    containerComponents: any[] = [];

    ELEMENT_DATA: IAllFMEAList[] = [];
    ELEMENT_DATA3: IAddFlocList[] = [];
    ELEMENT_DATA2: IFMEASite[] = [];
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
    taskListSelect: any[] = [];
    finalTaskAddedList: any[] = [];
    tempListfam: any[] = [];
    tempListclass: any[] = [];
    tempListsubclass: any[] = [];
    fmeaObject: IFMEA;
    assetStrategyObject: IAssetTaskGroupStrategy;
    dataSource;
    dataSource2;
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

    componentId: number = 0;
    componentCode: string = "";
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
    failureModeList: any[] = [];

    componentLevel1Id: number;
    componentLevel2Id: number;
    componentLevel3Id: number;
    componentLevel4Id: number;

    componentLevel1: string = "";
    componentLevel2: string = "";
    componentLevel3: string = "";
    componentLevel4: string = "";
    siteId: number;
    tasktypeId: number = 0;
    failuremode: string = "";
    tradetypeId: number = 0;
    frequencyId: number = 0;
    durationid: number = 0;
    variantid: number = 0;
    taskid: string = "";
    customerId: number = 0;

    //column table
    siteAsmtableTaskId: boolean = true;
    siteAsmtableParent: boolean = true;
    siteAsmtableFailureMode: boolean = true;
    siteAsmtableTaskDesc: boolean = true;
    siteAsmtableFailureRiskScore: boolean = true;
    siteAsmtableAcceptableLimits: boolean = true;
    siteAsmtableCorrective: boolean = true;
    siteAsmtableTaskType: boolean = true;
    siteAsmtableInterval: boolean = true;
    siteAsmtableFamily: boolean = true;
    siteAsmtableClass: boolean = true;
    siteAsmtableSubClass: boolean = true;
    siteAsmtableBuildSpec: boolean = true;
    siteAsmtableManufacturer: boolean = true;
    siteAsmtableVariant: boolean = false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AssignTaskSiteModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _fmeaService: FMEAService,
        private _fmuService: FMaintainableUnitService,
        private _fmmtSiteService: FMaintainableUnitService,
        private _fmeaAssemblyService: FmeaAssemblyService,
        private _componentTaskService: ComponentTaskService,
        private _famnilyTaxonomyService: ComponentFamilyService,
        private _classTaxonomyService: ComponentClassService,
        private _subClassTaxonomyService: ComponentSubClassService,
        private _buildSpecTaxonomyService: ComponentBuildSpecService,
        private _manufacturerTaxonomyService: ComponentManufacturerService,
        private _categoryHierarchyService: CategoryHierarchyService,
        private _fmeaSiteService: FmeaSiteService,
        private _taskTypeService: TaskTypeService,
        private _frequencyService: FrequencyService) {
        
    }
    ngOnInit(): void {
        const user = JSON.parse(localStorage.currentUser);
        this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
        this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;


        this.loading = true;
        this.data = this._dataService.getData();

        console.log(this.data.item)
        this.batchId = this.data.item;

        var newdisplaycolumn = JSON.parse(localStorage.getItem('activeColsSiteAssign'));
        var taskval = JSON.parse(localStorage.getItem('siteAsmtaskidNosite'));
        var parentc = JSON.parse(localStorage.getItem('siteAsmparentsite'));
        var failmode = JSON.parse(localStorage.getItem('siteAsmfmodesite'));
        var taskdesc = JSON.parse(localStorage.getItem('siteAsmdescsite'));
        var failscore = JSON.parse(localStorage.getItem('siteAsmfscoresite'));
        var acclimits = JSON.parse(localStorage.getItem('siteAsmlimitsite'));
        var correctives = JSON.parse(localStorage.getItem('siteAsmcorrectivesite'));
        var ttype = JSON.parse(localStorage.getItem('siteAsmtasktypesite'));
        var frequency = JSON.parse(localStorage.getItem('siteAsmintervalsite'));
        var maintUnit = JSON.parse(localStorage.getItem('siteAsmmainunitsite'));
        var maintItem = JSON.parse(localStorage.getItem('siteAsmmaintitemsite'));
        var maintSub = JSON.parse(localStorage.getItem('siteAsmmaintsubitemsite'));
        var buildspec = JSON.parse(localStorage.getItem('siteAsmbuildspecsite'));
        var manufacturer = JSON.parse(localStorage.getItem('siteAsmmanufacturesite'));

        if(newdisplaycolumn !== null){
            this.displayedColumns =  JSON.parse(localStorage.getItem('activeColsSiteAssign'));
        }

        if(taskval !== null){
            this.siteAsmtableTaskId = taskval;
        }

        if(parentc !== null){
            this.siteAsmtableParent = parentc;
        }

        if(failmode !== null){
            this.siteAsmtableFailureMode = failmode;
        }

        if(taskdesc !== null){
            this.siteAsmtableTaskDesc = taskdesc;
        }

        if(failscore !== null){
            this.siteAsmtableFailureRiskScore = failscore;
        }

        if(acclimits !== null){
            this.siteAsmtableAcceptableLimits = acclimits;
        }

        if(correctives !== null){
            this.siteAsmtableCorrective = correctives;
        }

        if(ttype !== null){
            this.siteAsmtableTaskType = ttype;
        }

        if(frequency !== null){
            this.siteAsmtableInterval = frequency;
        }

        if(maintUnit !== null){
            this.siteAsmtableFamily = maintUnit;
        }

        if(maintItem !== null){
            this.siteAsmtableClass = maintItem;
        }

        if(maintSub !== null){
            this.siteAsmtableSubClass = maintSub;
        }

        if(buildspec !== null){
            this.siteAsmtableBuildSpec = buildspec;
        }

        if(manufacturer !== null){
            this.siteAsmtableManufacturer = manufacturer;
        }

        forkJoin(
            this._famnilyTaxonomyService.getComponentFamily(),
            this._classTaxonomyService.getComponentClass(),
            this._subClassTaxonomyService.getComponentSubClass(),
            this._buildSpecTaxonomyService.getComponentBuildSpec(),
            this._manufacturerTaxonomyService.getComponentManufacturer(),
            this._categoryHierarchyService.getComponentById(this.data.item),
            this._fmeaService.getFMEAByComponentId(this.data.item),
            this._taskTypeService.getTaskType(),
            this._frequencyService.getFrequency(),
            this._componentTaskService.getComponentTask(),
            ).subscribe(([ct, cl, tp, th, mt, tt, fc, ty, fr, mu]) => {
                this.taxonomyFamilyList = ct;
                this.taxonomyClassList = cl;
                this.taxonomySubClassList = tp;
                this.taxonomyBuildSpecList = th;
                this.taxonomyManufacturerList = mt;
                this.tasktypeList = ty;
                this.frequencyList = fr;
                this.maintUnitList = mu;
                // console.log(ty, fr)
                this.maintainableUnit = tt.categoryName;
                this.maintainableUnitId = tt.id;
                this.componentLevel1= fc[0]['categoryName'];
                this.componentLevel2= (fc[1] != null || fc[1] != undefined) ? fc[1]['categoryName']: "";
                this.componentLevel3= (fc[2] != null || fc[2] != undefined) ? fc[2]['categoryName']: "";
                this.componentLevel4 = (fc[3] != null || fc[3] != undefined) ? fc[3]['categoryName']: "";
                this.componentLevel1Id = fc[0]['id'];
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

        this.getFMTData();
    }

    getFMTData(){
        this._componentTaskService.getComponentTask()
            .subscribe(res => {
                this.componentTaskList = res;
            })
    }

    toggleMin(){
        this.isMin = true;
        this.isMax = false;
    }

    toggleMax(){
        this.isMin = false;
        this.isMax = true;
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

        this._fmuService.getFMUFTSiteTaskByCategoryId(this.componentId, this.customerId, this.siteId)
            .subscribe(res => {
                // console.log(res);
                this.loading = false;
                this.default = false;
                this.ELEMENT_DATA = res;
                this.dataSource2 = new MatTableDataSource<IAllFMEAList>(this.ELEMENT_DATA);
                this.dataSource2.paginator = this.paginator;
                this.dataSource2.sort = this.sort;
            });

        this._fmuService.getDropdownMaintItemList(this.componentId)
            .subscribe(i => {
               this.taxonomyClassList = i.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmuService.getDropdownSubMaintItemList(this.componentId)
            .subscribe(s => {
               this.taxonomySubClassList = s.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmuService.getDropdownBuildSpecList(this.componentId)
            .subscribe(b => {
               this.taxonomyBuildSpecList = b.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmuService.getDropdownManufacturerList(this.componentId)
            .subscribe(m => {
               this.taxonomyManufacturerList = m.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmuService.getDropdownTaskTypeList(this.componentId)
            .subscribe(t => {
               this.taskTypeList = t.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmuService.getDropdownTradeTypeList(this.componentId)
            .subscribe(ty => {
               this.tradeTypeList = ty.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmuService.getDropdownFrequencyList(this.componentId)
            .subscribe(fq => {
               this.frequencyList = fq.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmuService.getDropdownDurationList(this.componentId)
            .subscribe(d => {
               this.durationList = d.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
    }

    onKeyupTask(name: string){
        if(name !== '')
        {
            this._fmuService.getDropdownTaskIdList(name, this.componentId)
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

    filterTask(): void{
        this._fmmtSiteService.getFailureModeTaskListFilter(this.componentId, this.classId, this.subClassId, this.buildSpecId, this.manufacturerId)
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

    toggleFilter() {
        if(this.displayMultiFilter)
          this.displayMultiFilter = false;
        else
          this.displayMultiFilter = true;
    }

    untoggleFilter() {
        this.displayMultiFilter = false;
    }

    searchFilter(): void{
        this._fmmtSiteService.getAllFMUFTsiteTaskListAssignFilters(this.taskid, this.failuremode, this.tasktypeId, this.tradetypeId, this.frequencyId, this.durationid, this.variantid, this.componentId, this.classId, this.subClassId, this.buildSpecId, this.manufacturerId, this.customerId, this.siteId)
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
        this.dataSource = new MatTableDataSource<IFMEASite>(this.ELEMENT_DATA2);
      }

    addFMEATask(checked: boolean, data: any): void{
        
        if (checked) {
            data.categoryId = this.batchId;
            data.fmmtId = data.id;
            data.id = 0;
            this.fmeataskaddedList.push(data);
        }
        else{
            var index = this.fmeataskaddedList.findIndex(e => { return e.taskIdentificationNo ===  data.taskIdentificationNo});
            this.fmeataskaddedList.splice(index, 1);
        }

        this.ELEMENT_DATA2 = this.fmeataskaddedList;
        this.dataSource = new MatTableDataSource<IFMEASite>(this.ELEMENT_DATA2);
    }

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
        this._fmeaSiteService.upsertTaskAdded(this.fmeataskaddedList)
            .subscribe(res => {
                // console.log(res);
                this.toastr.success("Successfully assigned task!", 'Success');
            })
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
        if (this.siteAsmtableTaskId === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(1, 0, "taskIdentificationNo");
            // this.displayedColumns.push('taskIdentificationNo');
            localStorage.removeItem('activeColsSiteAssign');
            localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAsmtaskidNosite');
            localStorage.setItem('siteAsmtaskidNosite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('taskIdentificationNo');
          localStorage.removeItem('activeColsSiteAssign');
          localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAsmtaskidNosite');
          localStorage.setItem('siteAsmtaskidNosite', JSON.stringify(false))
        }
      }
  
      addColumnParent() {
        if (this.siteAsmtableParent === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(2, 0, "parentCode");
            // this.displayedColumns.push('parentCode');
            localStorage.removeItem('activeColsSiteAssign');
            localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAsmparentsite');
            localStorage.setItem('siteAsmparentsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('parentCode');
          localStorage.removeItem('activeColsSiteAssign');
          localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAsmparentsite');
          localStorage.setItem('siteAsmparentsite', JSON.stringify(false))
        }
      }
  
      addColumnFailureMode() {
        if (this.siteAsmtableFailureMode === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(8, 0, "failureMode");
            // this.displayedColumns.push('failureMode');
            localStorage.removeItem('activeColsSiteAssign');
            localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAsmfmodesite');
            localStorage.setItem('siteAsmfmodesite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('failureMode');
          localStorage.removeItem('activeColsSiteAssign');
          localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAsmfmodesite');
          localStorage.setItem('siteAsmfmodesite', JSON.stringify(false))
        }
      }
  
      addColumnTaskDesc() {
        if (this.siteAsmtableTaskDesc === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(9, 0, "taskDescription");
            // this.displayedColumns.push('taskDescription');
            localStorage.removeItem('activeColsSiteAssign');
            localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAsmdescsite');
            localStorage.setItem('siteAsmdescsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('taskDescription');
          localStorage.removeItem('activeColsSiteAssign');
          localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAsmdescsite');
          localStorage.setItem('siteAsmdescsite', JSON.stringify(false))
        }
      }
  
      addColumnFailureRiskScore() {
        if (this.siteAsmtableFailureRiskScore === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(10, 0, "failureRiskTotalScore");
            // this.displayedColumns.push('failureRiskTotalScore');
            localStorage.removeItem('activeColsSiteAssign');
            localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAsmfscoresite');
            localStorage.setItem('siteAsmfscoresite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('failureRiskTotalScore');
          localStorage.removeItem('activeColsSiteAssign');
          localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAsmfscoresite');
          localStorage.setItem('siteAsmfscoresite', JSON.stringify(false))
        }
      }
  
      addColumnAcceptableLimits() {
        if (this.siteAsmtableAcceptableLimits === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(11, 0, "acceptableLimits");
            // this.displayedColumns.push('acceptableLimits');
            localStorage.removeItem('activeColsSiteAssign');
            localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAsmlimitsite');
            localStorage.setItem('siteAsmlimitsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('acceptableLimits');
          localStorage.removeItem('activeColsSiteAssign');
          localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAsmlimitsite');
          localStorage.setItem('siteAsmlimitsite', JSON.stringify(false))
        }
      }
  
      addColumnCorrectiveActions() {
        if (this.siteAsmtableCorrective === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(12, 0, "correctiveActions");
            // this.displayedColumns.push('correctiveActions');
            localStorage.removeItem('activeColsSiteAssign');
            localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAsmcorrectivesite');
            localStorage.setItem('siteAsmcorrectivesite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('correctiveActions');
          localStorage.removeItem('activeColsSiteAssign');
          localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAsmcorrectivesite');
          localStorage.setItem('siteAsmcorrectivesite', JSON.stringify(false))
        }
      }
  
      addColumnTaskType() {
        if (this.siteAsmtableTaskType === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(13, 0, "taskTypeName");
            // this.displayedColumns.push('taskTypeName');
            localStorage.removeItem('activeColsSiteAssign');
            localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAsmtasktypesite');
            localStorage.setItem('siteAsmtasktypesite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('taskTypeName');
          localStorage.removeItem('activeColsSiteAssign');
          localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAsmtasktypesite');
          localStorage.setItem('siteAsmtasktypesite', JSON.stringify(false))
        }
      }
  
      addColumnFrequency() {
        if (this.siteAsmtableInterval === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(14, 0, "frequencyName");
            // this.displayedColumns.push('frequencyName');
            localStorage.removeItem('activeColsSiteAssign');
            localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAsmintervalsite');
            localStorage.setItem('siteAsmintervalsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('frequencyName');
          localStorage.removeItem('activeColsSiteAssign');
          localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAsmintervalsite');
          localStorage.setItem('siteAsmintervalsite', JSON.stringify(false))
        }
      }
  
      addColumnFamily() {
        if (this.siteAsmtableFamily === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(3, 0, "familyComponent");
            // this.displayedColumns.push('familyComponent');
            localStorage.removeItem('activeColsSiteAssign');
            localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAsmmainunitsite');
            localStorage.setItem('siteAsmmainunitsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('familyComponent');
          localStorage.removeItem('activeColsSiteAssign');
          localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAsmmainunitsite');
          localStorage.setItem('siteAsmmainunitsite', JSON.stringify(false))
        }
      }
  
      addColumnClass() {
        if (this.siteAsmtableClass === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(4, 0, "componentClass");
            // this.displayedColumns.push('componentClass');
            localStorage.removeItem('activeColsSiteAssign');
            localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAsmmaintitemsite');
            localStorage.setItem('siteAsmmaintitemsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('componentClass');
          localStorage.removeItem('activeColsSiteAssign');
          localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAsmmaintitemsite');
          localStorage.setItem('siteAsmmaintitemsite', JSON.stringify(false))
        }
      }
  
      addColumnSubClass() {
        if (this.siteAsmtableSubClass === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(5, 0, "subClass");
            // this.displayedColumns.push('subClass');
            localStorage.removeItem('activeColsSiteAssign');
            localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAsmmaintsubitemsite');
            localStorage.setItem('siteAsmmaintsubitemsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('subClass');
          localStorage.removeItem('activeColsSiteAssign');
          localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAsmmaintsubitemsite');
          localStorage.setItem('siteAsmmaintsubitemsite', JSON.stringify(false))
        }
      }
  
      addColumnBuildSpec() {
        if (this.siteAsmtableBuildSpec === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(6, 0, "buildSpec");
            // this.displayedColumns.push('buildSpec');
            localStorage.removeItem('activeColsSiteAssign');
            localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAsmbuildspecsite');
            localStorage.setItem('siteAsmbuildspecsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('buildSpec');
          localStorage.removeItem('activeColsSiteAssign');
          localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAsmbuildspecsite');
          localStorage.setItem('siteAsmbuildspecsite', JSON.stringify(false))
        }
      }
  
      addColumnManufacturer() {
        if (this.siteAsmtableManufacturer === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(7, 0, "componentManufacturer");
            // this.displayedColumns.push('componentManufacturer');
            localStorage.removeItem('activeColsSiteAssign');
            localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('siteAsmmanufacturesite');
            localStorage.setItem('siteAsmmanufacturesite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('componentManufacturer');
          localStorage.removeItem('activeColsSiteAssign');
          localStorage.setItem('activeColsSiteAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('siteAsmmanufacturesite');
          localStorage.setItem('sitesmmanufacturesite', JSON.stringify(false))
        }
      }
  
      addColumnVariant() {
        if (this.siteAsmtableVariant === true) {
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

    cancel(): void{
        this.dialogRef.close();
    }

}
