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
import { IFMEA, IFMEATaskAdded, IFMEATaskAddedList, IFmeaAssembly, IAllFMEAList } from '../../interfaces/IFMEA';
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

@Component({
  selector: 'assigntask-modal',
  templateUrl: './assigntaskmodal.component.html',
  styleUrls: ['./assigntaskmodal.component.scss']
})

export class AssignTaskModalComponent implements OnInit {
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
    taskListSelect: any[] = [];
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

    isHsm: boolean = false;
    isSite: boolean = false;

    displayTableColumn: boolean = false;
    displayMultiFilter: boolean = false;
    
    mode: string = "";
    fmeaId: number;
    taskId: number;
    selectedIndex: number = 0;
    activeId: number = 0;
    taskid: string = "";

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

    tasktypeId: number = 0;
    failuremode: string = "";
    tradetypeId: number = 0;
    frequencyId: number = 0;
    durationid: number = 0;

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
    variantid: number;

    componentLevel1: string = "";
    componentLevel2: string = "";
    componentLevel3: string = "";
    componentLevel4: string = "";

    //column table
    hsmAsmtableTaskId: boolean = true;
    hsmAsmtableParent: boolean = true;
    hsmAsmtableFailureMode: boolean = true;
    hsmAsmtableTaskDesc: boolean = true;
    hsmAsmtableFailureRiskScore: boolean = true;
    hsmAsmtableAcceptableLimits: boolean = true;
    hsmAsmtableCorrective: boolean = true;
    hsmAsmtableTaskType: boolean = true;
    hsmAsmtableInterval: boolean = true;
    hsmAsmtableFamily: boolean = true;
    hsmAsmtableClass: boolean = true;
    hsmAsmtableSubClass: boolean = true;
    hsmAsmtableBuildSpec: boolean = true;
    hsmAsmtableManufacturer: boolean = true;
    hsmAsmtableVariant: boolean = false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AssignTaskModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _fmeaService: FMEAService,
        private _fmeaAssemblyService: FmeaAssemblyService,
        private _componentTaskService: ComponentTaskService,
        private _famnilyTaxonomyService: ComponentFamilyService,
        private _classTaxonomyService: ComponentClassService,
        private _subClassTaxonomyService: ComponentSubClassService,
        private _buildSpecTaxonomyService: ComponentBuildSpecService,
        private _manufacturerTaxonomyService: ComponentManufacturerService,
        private _categoryHierarchyService: CategoryHierarchyService,
        private _fmeaTaskAddedService: FMEATaskAddedService,
        private _fmeaSiteService: FmeaSiteService,
        private _taskTypeService: TaskTypeService,
        private _frequencyService: FrequencyService) {
        
    }
    ngOnInit(): void {
        this.loading = true;
        this.data = this._dataService.getData();

        console.log(this.data)
        this.batchId = this.data.item;

        if(this.data.mode === 'FmeaHsm'){
            this.isHsm = true;
        }
        
        if(this.data.mode === 'FmeaSite'){
            this.isSite = true;
        }

        var newdisplaycolumn = JSON.parse(localStorage.getItem('activeColsHsmAssign'));
        var taskval = JSON.parse(localStorage.getItem('hsmAsmtaskidNosite'));
        var parentc = JSON.parse(localStorage.getItem('hsmAsmparentsite'));
        var failmode = JSON.parse(localStorage.getItem('hsmAsmfmodesite'));
        var taskdesc = JSON.parse(localStorage.getItem('hsmAsmdescsite'));
        var failscore = JSON.parse(localStorage.getItem('hsmAsmfscoresite'));
        var acclimits = JSON.parse(localStorage.getItem('hsmAsmlimitsite'));
        var correctives = JSON.parse(localStorage.getItem('hsmAsmcorrectivesite'));
        var ttype = JSON.parse(localStorage.getItem('hsmAsmtasktypesite'));
        var frequency = JSON.parse(localStorage.getItem('hsmAsmintervalsite'));
        var maintUnit = JSON.parse(localStorage.getItem('hsmAsmmainunitsite'));
        var maintItem = JSON.parse(localStorage.getItem('hsmAsmmaintitemsite'));
        var maintSub = JSON.parse(localStorage.getItem('hsmAsmmaintsubitemsite'));
        var buildspec = JSON.parse(localStorage.getItem('hsmAsmbuildspecsite'));
        var manufacturer = JSON.parse(localStorage.getItem('hsmAsmmanufacturesite'));

        if(newdisplaycolumn !== null){
            this.displayedColumns =  JSON.parse(localStorage.getItem('activeColsHsmAssign'));
        }

        if(taskval !== null){
            this.hsmAsmtableTaskId = taskval;
        }

        if(parentc !== null){
            this.hsmAsmtableParent = parentc;
        }

        if(failmode !== null){
            this.hsmAsmtableFailureMode = failmode;
        }

        if(taskdesc !== null){
            this.hsmAsmtableTaskDesc = taskdesc;
        }

        if(failscore !== null){
            this.hsmAsmtableFailureRiskScore = failscore;
        }

        if(acclimits !== null){
            this.hsmAsmtableAcceptableLimits = acclimits;
        }

        if(correctives !== null){
            this.hsmAsmtableCorrective = correctives;
        }

        if(ttype !== null){
            this.hsmAsmtableTaskType = ttype;
        }

        if(frequency !== null){
            this.hsmAsmtableInterval = frequency;
        }

        if(maintUnit !== null){
            this.hsmAsmtableFamily = maintUnit;
        }

        if(maintItem !== null){
            this.hsmAsmtableClass = maintItem;
        }

        if(maintSub !== null){
            this.hsmAsmtableSubClass = maintSub;
        }

        if(buildspec !== null){
            this.hsmAsmtableBuildSpec = buildspec;
        }

        if(manufacturer !== null){
            this.hsmAsmtableManufacturer = manufacturer;
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
                // this.taxonomyClassList = cl;
                // this.taxonomySubClassList = tp;
                // this.taxonomyBuildSpecList = th;
                // this.taxonomyManufacturerList = mt;
                this.tasktypeList = ty;
                this.frequencyList = fr;
                this.maintUnitList = mu;
                // console.log(fr, ty)
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

    fmDataClick(item: number, name: string){
        // console.log(item)
        this.componentId = item;
        this.componentFailureMode = name;

        this._fmeaService.getFMEATaskByCategoryId(this.componentId)
            .subscribe(res => {
                // console.log(res);
                this.loading = false;
                this.default = false;
                this.ELEMENT_DATA = res;
                this.dataSource2 = new MatTableDataSource<IAllFMEAList>(this.ELEMENT_DATA);
                this.dataSource2.paginator = this.paginator;
                this.dataSource2.sort = this.sort;
            });

        this._fmeaService.getDropdownMaintItemList(this.componentId)
            .subscribe(i => {
               this.taxonomyClassList = i.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmeaService.getDropdownSubMaintItemList(this.componentId)
            .subscribe(s => {
               this.taxonomySubClassList = s.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmeaService.getDropdownBuildSpecList(this.componentId)
            .subscribe(b => {
               this.taxonomyBuildSpecList = b.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmeaService.getDropdownManufacturerList(this.componentId)
            .subscribe(m => {
               this.taxonomyManufacturerList = m.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });

        this._fmeaService.getDropdownTaskTypeList(this.componentId)
            .subscribe(t => {
               this.taskTypeList = t.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmeaService.getDropdownTradeTypeList(this.componentId)
            .subscribe(ty => {
               this.tradeTypeList = ty.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmeaService.getDropdownFrequencyList(this.componentId)
            .subscribe(fq => {
               this.frequencyList = fq.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
            });
        this._fmeaService.getDropdownDurationList(this.componentId)
            .subscribe(d => {
               this.durationList = d.sort((a, b) => (a.dropName < b.dropName ? -1 : 1));
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

    classOnselect(event){
        this.classId = parseInt(event.target.value);
        // console.log(this.classId)
        this.searchFilter();

        this._fmeaService.getDropdownSubMaintItemByItemIdList(this.componentId, this.classId)
        .subscribe(res => {
            this.taxonomySubClassList = res;
        });
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

    toggleFilter() {
        if(this.displayMultiFilter)
          this.displayMultiFilter = false;
        else
          this.displayMultiFilter = true;
    }

    untoggleFilter() {
        this.displayMultiFilter = false;
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

    filterTask(): void{
        this._fmeaService.getMaintUnitTaskListFilters(this.componentId, this.componentId, this.classId, this.subClassId, this.buildSpecId, this.manufacturerId, this.tradetypeId, this.tasktypeId, this.frequencyId, this.durationid)
            .subscribe(res => {
                // console.log(res)
                this.loading = false;
                this.default = false;
                this.ELEMENT_DATA = res;
                this.dataSource2 = new MatTableDataSource<IAllFMEAList>(this.ELEMENT_DATA);
                this.dataSource2.paginator = this.paginator;
                this.dataSource2.sort = this.sort;
            });

            this.untoggleFilter();
    }

    searchFilter(): void{
        this._fmeaService.getAllFMEATaskListAssignFilters(this.taskid, this.failuremode, this.tasktypeId, this.tradetypeId, this.frequencyId, this.durationid, this.variantid, this.componentId, this.classId, this.subClassId, this.buildSpecId, this.manufacturerId)
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

      onSelectAll(e: any, item: any): void {
    
        if(e.target.checked === true){
            // item.isAddTask = true;
            // this.fmeaTaskAdded.forEach(x => x.isAddTask === e.event.target.checked)
            this.fmeaTaskAdded.forEach(x => {
                let taskid = x.id
                // x.id === e.event.target.checked

                item.isAddTask = true;

                this.containerTask.push({
                    id: taskid
                });
            });
        }else{
            this.isAddTask = false;
            // item.isAddTask = true;
            this.fmeaTaskAdded.forEach(x => {
                let taskid = x.id
    
                this.containerTask = [];
            });
        }
        // console.log(this.fmeaTaskAdded)
        // console.log(this.containerTask)
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
        this.dataSource = new MatTableDataSource<IFMEA>(this.ELEMENT_DATA2);
      }

      unToggle(){
         if(!this.isAllSelected()){
            this.dataSource2.data.forEach(row => this.selection.select(row))
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
        this.dataSource = new MatTableDataSource<IFMEA>(this.ELEMENT_DATA2);
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

    AssignTaskHsm():void{
        // console.log(this.fmeataskaddedList)
        this._fmeaAssemblyService.upsertTaskAdded(this.fmeataskaddedList)
            .subscribe(res => {
                // console.log(res);
                this.toastr.success("Successfully assigned task!", 'Success');
            })
    }

    AssignTaskSite():void{
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
        if (this.hsmAsmtableTaskId === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(1, 0, "taskIdentificationNo");
            // this.displayedColumns.push('taskIdentificationNo');
            localStorage.removeItem('activeColsHsmAssign');
            localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('hsmAsmtaskidNosite');
            localStorage.setItem('hsmAsmtaskidNosite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('taskIdentificationNo');
          localStorage.removeItem('activeColsHsmAssign');
          localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('hsmAsmtaskidNosite');
          localStorage.setItem('hsmAsmtaskidNosite', JSON.stringify(false))
        }
      }
  
      addColumnParent() {
        if (this.hsmAsmtableParent === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(2, 0, "parentCode");
            // this.displayedColumns.push('parentCode');
            localStorage.removeItem('activeColsHsmAssign');
            localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('hsmAsmparentsite');
            localStorage.setItem('hsmAsmparentsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('parentCode');
          localStorage.removeItem('activeColsHsmAssign');
          localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('hsmAsmparentsite');
          localStorage.setItem('hsmAsmparentsite', JSON.stringify(false))
        }
      }
  
      addColumnFailureMode() {
        if (this.hsmAsmtableFailureMode === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(8, 0, "failureMode");
            // this.displayedColumns.push('failureMode');
            localStorage.removeItem('activeColsHsmAssign');
            localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('hsmAsmfmodesite');
            localStorage.setItem('hsmAsmfmodesite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('failureMode');
          localStorage.removeItem('activeColsHsmAssign');
          localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('hsmAsmfmodesite');
          localStorage.setItem('hsmAsmfmodesite', JSON.stringify(false))
        }
      }
  
      addColumnTaskDesc() {
        if (this.hsmAsmtableTaskDesc === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(9, 0, "taskDescription");
            // this.displayedColumns.push('taskDescription');
            localStorage.removeItem('activeColsHsmAssign');
            localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('hsmAsmdescsite');
            localStorage.setItem('hsmAsmdescsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('taskDescription');
          localStorage.removeItem('activeColsHsmAssign');
          localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('hsmAsmdescsite');
          localStorage.setItem('hsmAsmdescsite', JSON.stringify(false))
        }
      }
  
      addColumnFailureRiskScore() {
        if (this.hsmAsmtableFailureRiskScore === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(10, 0, "failureRiskTotalScore");
            // this.displayedColumns.push('failureRiskTotalScore');
            localStorage.removeItem('activeColsHsmAssign');
            localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('hsmAsmfscoresite');
            localStorage.setItem('hsmAsmfscoresite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('failureRiskTotalScore');
          localStorage.removeItem('activeColsHsmAssign');
          localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('hsmAsmfscoresite');
          localStorage.setItem('hsmAsmfscoresite', JSON.stringify(false))
        }
      }
  
      addColumnAcceptableLimits() {
        if (this.hsmAsmtableAcceptableLimits === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(11, 0, "acceptableLimits");
            // this.displayedColumns.push('acceptableLimits');
            localStorage.removeItem('activeColsHsmAssign');
            localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('hsmAsmlimitsite');
            localStorage.setItem('hsmAsmlimitsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('acceptableLimits');
          localStorage.removeItem('activeColsHsmAssign');
          localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('hsmAsmlimitsite');
          localStorage.setItem('hsmAsmlimitsite', JSON.stringify(false))
        }
      }
  
      addColumnCorrectiveActions() {
        if (this.hsmAsmtableCorrective === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(12, 0, "correctiveActions");
            // this.displayedColumns.push('correctiveActions');
            localStorage.removeItem('activeColsHsmAssign');
            localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('hsmAsmcorrectivesite');
            localStorage.setItem('hsmAsmcorrectivesite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('correctiveActions');
          localStorage.removeItem('activeColsHsmAssign');
          localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('hsmAsmcorrectivesite');
          localStorage.setItem('hsmAsmcorrectivesite', JSON.stringify(false))
        }
      }
  
      addColumnTaskType() {
        if (this.hsmAsmtableTaskType === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(13, 0, "taskTypeName");
            // this.displayedColumns.push('taskTypeName');
            localStorage.removeItem('activeColsHsmAssign');
            localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('hsmAsmtasktypesite');
            localStorage.setItem('hsmAsmtasktypesite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('taskTypeName');
          localStorage.removeItem('activeColsHsmAssign');
          localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('hsmAsmtasktypesite');
          localStorage.setItem('hsmAsmtasktypesite', JSON.stringify(false))
        }
      }
  
      addColumnFrequency() {
        if (this.hsmAsmtableInterval === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(14, 0, "frequencyName");
            // this.displayedColumns.push('frequencyName');
            localStorage.removeItem('activeColsHsmAssign');
            localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('hsmAsmintervalsite');
            localStorage.setItem('hsmAsmintervalsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('frequencyName');
          localStorage.removeItem('activeColsHsmAssign');
          localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('hsmAsmintervalsite');
          localStorage.setItem('hsmAsmintervalsite', JSON.stringify(false))
        }
      }
  
      addColumnFamily() {
        if (this.hsmAsmtableFamily === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(3, 0, "familyComponent");
            // this.displayedColumns.push('familyComponent');
            localStorage.removeItem('activeColsHsmAssign');
            localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('hsmAsmmainunitsite');
            localStorage.setItem('hsmAsmmainunitsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('familyComponent');
          localStorage.removeItem('activeColsHsmAssign');
          localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('hsmAsmmainunitsite');
          localStorage.setItem('hsmAsmmainunitsite', JSON.stringify(false))
        }
      }
  
      addColumnClass() {
        if (this.hsmAsmtableClass === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(4, 0, "componentClass");
            // this.displayedColumns.push('componentClass');
            localStorage.removeItem('activeColsHsmAssign');
            localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('hsmAsmmaintitemsite');
            localStorage.setItem('hsmAsmmaintitemsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('componentClass');
          localStorage.removeItem('activeColsHsmAssign');
          localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('hsmAsmmaintitemsite');
          localStorage.setItem('hsmAsmmaintitemsite', JSON.stringify(false))
        }
      }
  
      addColumnSubClass() {
        if (this.hsmAsmtableSubClass === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(5, 0, "subClass");
            // this.displayedColumns.push('subClass');
            localStorage.removeItem('activeColsHsmAssign');
            localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('hsmAsmmaintsubitemsite');
            localStorage.setItem('hsmAsmmaintsubitemsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('subClass');
          localStorage.removeItem('activeColsHsmAssign');
          localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('hsmAsmmaintsubitemsite');
          localStorage.setItem('hsmAsmmaintsubitemsite', JSON.stringify(false))
        }
      }
  
      addColumnBuildSpec() {
        if (this.hsmAsmtableBuildSpec === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(6, 0, "buildSpec");
            // this.displayedColumns.push('buildSpec');
            localStorage.removeItem('activeColsHsmAssign');
            localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('hsmAsmbuildspecsite');
            localStorage.setItem('hsmAsmbuildspecsite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('buildSpec');
          localStorage.removeItem('activeColsHsmAssign');
          localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('hsmAsmbuildspecsite');
          localStorage.setItem('hsmAsmbuildspecsite', JSON.stringify(false))
        }
      }
  
      addColumnManufacturer() {
        if (this.hsmAsmtableManufacturer === true) {
          if (this.displayedColumns.length) {
            this.displayedColumns.splice(7, 0, "componentManufacturer");
            // this.displayedColumns.push('componentManufacturer');
            localStorage.removeItem('activeColsHsmAssign');
            localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
            localStorage.removeItem('hsmAsmmanufacturesite');
            localStorage.setItem('hsmAsmmanufacturesite', JSON.stringify(true))
          }
        } else {
          this.removeColumn('componentManufacturer');
          localStorage.removeItem('activeColsHsmAssign');
          localStorage.setItem('activeColsHsmAssign', JSON.stringify(this.displayedColumns));
          localStorage.removeItem('hsmAsmmanufacturesite');
          localStorage.setItem('hsmAsmmanufacturesite', JSON.stringify(false))
        }
      }
  
      addColumnVariant() {
        if (this.hsmAsmtableVariant === true) {
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
