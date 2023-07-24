import { Component, Inject, OnInit, ElementRef, ViewChild, AfterViewInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';

//Services
import { FrequencyService } from '../services/frequency.services';
import { DurationService } from '../services/duration.services';
import { OperationalModeService } from '../services/operationalmode.services';
import { TradeTypeService } from '../services/tradetype.services';
import { TaxonomyCategoryService } from '../services/taxonomycategory.services';
import { TaxonomyClassService } from '../services/taxonomyclass.services';
import { TaxonomyTypeService } from '../services/taxonomytype.services';
import { AssignTaskGroupStrategyService } from '../services/assigntaskgroupstrategy.services';

//interface
import { IFrequency } from './../interfaces/IFrequency';
import { IDuration } from './../interfaces/IDuration';
import { IOperationalMode } from './../interfaces/IOperationalMode';
import { ITradeType } from './../interfaces/ITradeType';
import { ITaxonomyCategory } from './../interfaces/ITaxonomyCategory';
import { ITaxonomyClass } from './../interfaces/ITaxonomyClass';
import { ITaxonomyType } from './../interfaces/ITaxonomyType';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { IEAMPlanPackage, ITaskGroupStrategyPackage } from '../interfaces/IEAMPlan';
import { IAssignAssetTaskGroupStrategy, ITaskGroupStrategyAdded } from '../interfaces/IAssignAssetTaskGroupStrategy';
import { TaskTypeService } from '../services/tasktype.services';
import { ITaskType } from '../interfaces/ITaskType';
import { ITaskGroupStrategy, ITaskGroupStrategyPackageAdded, ITaskGroupStrategyPackageSequenceAdded, ITaskGroupStrategyGroupId, ITaskGroupStrategySequence, ITaskGroupStrategyPackageFinalSequence } from '../interfaces/ITaskGroupStrategy';
import { TaskGroupStrategyAddedService } from '../services/taskgroupstrategyadded.services';
import { TaskGroupStrategySequenceService } from '../services/taskgroupstrategysequence.services';
import { id } from '@swimlane/ngx-charts';
import { ToastrService } from 'ngx-toastr';
import { AssetTaskGroupStrategySequenceService } from '../services/assettaskgroupstrategysequence.services';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { EAMPlanService } from '../services/eamplan.services';
import { AssetHierarchyIndustryService } from '../services/assethierarchyindustry.services';
import { AssetHierarchyBusinessTypeService } from '../services/assethierarchybusinesstype.services';
import { AssetHierarchyAssetTypeService } from '../services/assethierarchyassettype.services';
import { AssetHierarchyProcessFunctionService } from '../services/assethierarchyprocessfunction.services';

@Component({
    selector: "assign-asset-strategygroup",
    templateUrl: './assignassetstrategygroup.component.html',
    styleUrls: [
        './assignassetstrategygroup.component.scss'
    ],
    encapsulation: ViewEncapsulation.None
})

export class AssignAssetStrategyGroupComponent implements OnInit {
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('tableColumn') public tableColumn: ElementRef;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<ITaskGroupStrategySequence>;

    displayedColumns = ['isAdd', 'taskGroupStrategyId', 'taskGroupDescription', 'taskTypeName', 'frequencyName', 'tradeTypeName', 'operationalModeName', 'versions', 'activities'];
    @ViewChild('tableOnePaginator', { static: true }) tableOnePaginator: MatPaginator;
    @ViewChild('tableOneSort', { static: true }) tableOneSort: MatSort;

    displayedColumns2 = ['isAdd', 'code', 'flocDesc', 'maintItemText', 'taskId', 'maintItem', 'maintenancePlanName', 'mainWorkCtr', 'planningPlant'];
    @ViewChild('tableTwoPaginator', { static: true }) tableTwoPaginator: MatPaginator;
    @ViewChild('tableTwoSort', { static: true }) tableTwoSort: MatSort;

    displayedColumns3 = ['sequenceNo', 'taskIdentificationNo', 'taskDescription', 'acceptableLimits', 'correctiveActions', 'taskTypeName', 'frequencyName'];
    @ViewChild('tableThreePaginator', { static: true }) tableThreePaginator: MatPaginator;
    @ViewChild('tableThreeSort', { static: true }) tableThreeSort: MatSort;


    @ViewChild('sortColA', { static: true }) sortColA: MatSort;
    @ViewChild('sortColB', { static: true }) sortColB: MatSort;
    @ViewChild('sortColC', { static: true }) sortColC: MatSort;

    ELEMENT_DATA: ITaskGroupStrategyPackage[] = [];
    ELEMENT_DATA2: IEAMPlanPackage[] = [];
    ELEMENT_DATA3: ITaskGroupStrategySequence[] = [];

    taskGroupStrategyAddedList: ITaskGroupStrategyPackageAdded[] = [];
    taskGroupStrategyPackageList: ITaskGroupStrategy[] = [];
    taskGroupStrategySequenceList: ITaskGroupStrategyPackageSequenceAdded[] = [];
    taskGroupStrategyIdList: ITaskGroupStrategyGroupId[] = [];
    taskGroupSequenceList: ITaskGroupStrategySequence[] = [];
    taskGroupAddedSequenceList: ITaskGroupStrategySequence[] = [];
    taskGroupFinalSequenceList: ITaskGroupStrategyPackageFinalSequence[] = [];

    durationList: any[] = [];
    frequencyList: any[] = [];
    operationModeList: any[] = [];
    tradeTypeList: any[] = [];
    taxonomyCategoryList: any[] = [];
    taxonomyClassList: any[] = [];
    taxonomyTypeList: any[] = [];
    taskTypeList: any[] = [];
    industryList: any[] = [];
    businessTypeList: any = [];
    assetTypeList: any[] = [];
    processFunctionList: any[] = [];

    functionList: any[] = [];
    descriptionList: any[] = [];
    plantList: any[] = [];

    frequencyObject: IFrequency;
    durationObject: IDuration;
    operationModeObject: IOperationalMode;
    tradeTypeObject: ITradeType;
    taxonomyCategoryObject: ITaxonomyCategory;
    taxonomyClassObject: ITaxonomyClass;
    taxonomyTypeObject: ITaxonomyType;
    taskTypeObject: ITaskType;

    dataSource;
    dataSource2;
    dataSource3;

    taskStrategyPackageObject: ITaskGroupStrategy = {
        id: 0,
        stategyPackageId: 0,
        taskStrategyId: 0,
        isChecked: false,
        isActive: true,
    };

    taskStrategyPackageAddedObject: ITaskGroupStrategyPackageAdded = {
        id: 0,
        tGSPackageId: 0,
        eamItemId: 0,
        eamPlanId: 0,
        isChecked: false,
        isActive: true,
    };

    taskStrategyPackageSequenceObject: ITaskGroupStrategyPackageSequenceAdded = {
        id: 0,
        taskId: 0,
        tGSPackageId: 0,
        sequenceNo: 0
    };

    // NG MODEL
    tabIndex = 1;

    categoryId: number;
    classId: number;
    typeId: number;

    taskGroupStrategyId: number;
    strategyPackageId: number;
    taskId: number;
    eamItemId: number;
    eamPlanId: number;

    activeId: number = 1;
    isHide: boolean = false;
    isHideSlected: boolean = false;
    istab1: boolean = true;
    istab2: boolean = false;
    istab3: boolean = false;
    isHideTitle: boolean = false;
    isDefault: boolean = true;
    isDefault2: boolean = true;
    isDefault3: boolean = true;
    isDefault4: boolean = true;
    isChecked1: boolean = false;
    isChecked2: boolean = false;

    isDefaultTab: boolean = true;
    isDefaultTab2: boolean = true;
    isDefaultTab3: boolean = true;
    isDefaultTab4: boolean = true;

    isActive1: boolean = false;
    isActive2: boolean = false;
    isActive3: boolean = false;
    isActive4: boolean = false;
    isActiveTab1: boolean = false;

    checktab1: boolean = false;
    isHideFilter: boolean = false
    isAdd: boolean = false;

    isSelectFloc: boolean = false;
    isSelectDesc: boolean = false;

    displayTableColumn: boolean = false;
    displayMultiFilter: boolean = false;

    currentBatch: number = 0;

    flocName: string = "";
    description2: string = "";
    plant: string = "";
    totalCount: number;
    eamId: number;

    floc: string = "";
    flocDesc: string = "";
    plantName: string = "";

    default = false;
    loading = false;

    isLoading: boolean = false;

    //Filter NGMODEL
    taskGroupId: string = "";
    taskTypeId: number;
    taskGroupDesc: string = "";
    frequencyId: number;
    tradeTypeId: number;
    operationalModeId: number;
    industryId: number;
    businessTypeId: number;
    assetTypeId: number;
    processFunctionId: number;

    //Table Column NGMODEL
    taskGroupid: boolean = true;
    taskGroupdesc: boolean = true;
    tasktype: boolean = true;
    frequency: boolean = true;
    tradetype: boolean = true;
    operationalmode: boolean = true;
    industry: boolean = true;
    businesstype: boolean = true;
    assettype: boolean = true;
    processfunction: boolean = true;
    assetclass: boolean = false;
    assetspec: boolean = false;
    assetfamily: boolean = false;
    assetmanufacturer: boolean = false;
    componentfamily: boolean = false;
    componentclass: boolean = false;
    duration: boolean = false;
    activities: boolean = true;
    versions: boolean = true;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private _durationService: DurationService,
        private _operationModeService: OperationalModeService,
        private _taxonomyCategoryService: TaxonomyCategoryService,
        private _taxonomyClassService: TaxonomyClassService,
        private _taxonomyTypeService: TaxonomyTypeService,
        private _assignTaskGroupService: AssignTaskGroupStrategyService,
        private _tasktypeService: TaskTypeService,
        private _taskGroupStrategyAddedService: TaskGroupStrategyAddedService,
        private _taskGroupStrategySequenceService: TaskGroupStrategySequenceService,
        private _assetTaskGroupSequenceService: AssetTaskGroupStrategySequenceService,
        private _eamPlanService: EAMPlanService,
        private _frequenceService: FrequencyService,
        private _tradeTypeService: TradeTypeService,
        private _operationalModeService: OperationalModeService,
        private _industryService: AssetHierarchyIndustryService,
        private _businessTypeService: AssetHierarchyBusinessTypeService,
        private _assetTypeService: AssetHierarchyAssetTypeService,
        private _processFunctionService: AssetHierarchyProcessFunctionService,
        private toastr: ToastrService,
    ) { }

    ngOnInit(): void {

        this.isLoading = true;

        if (this.activeId = 1) {
            this.istab2 = false;
        }
        else if (this.activeId = 2) {
            this.istab2 = true;
        }

        forkJoin(
            this._frequenceService.getFrequency(),
            this._durationService.getDuration(),
            this._tradeTypeService.getTradeType(),
            this._operationModeService.getOperationalMode(),
            this._tasktypeService.getTaskType(),
            this._eamPlanService.getEAMDropdown(),
            this._eamPlanService.getTotalEAMPlanList(),
            this._industryService.getAssetIndustry(),
            this._businessTypeService.getAssetBusinessType(),
            this._assetTypeService.getAssetType(),
            this._processFunctionService.getProcessFunction(),
        ).subscribe(([fr, dr, tt, op, ty, fl, te, ai, bt, at, pf]) => {
            this.frequencyList = fr;
            this.durationList = dr;
            this.tradeTypeList = tt;
            this.operationModeList = op;
            this.taskTypeList = ty;
            this.functionList = fl;
            this.descriptionList = fl;
            this.plantList = fl;
            this.totalCount = te[0]['totalCount'];
            this.industryList = ai;
            this.businessTypeList = bt;
            this.assetTypeList = at;
            this.processFunctionList = pf;
            this.isLoading = false;
        });

        this.loading = true;
        this.default = true;

        this.getDataSource();
        this.getEAMPlanPackage();
        // this.getSequenceSource();

    }

    getDataSource() {
        this._assignTaskGroupService.getTaskGroupStrategyPackage()
            .subscribe(res => {
                // console.log(res);
                this.default = false;
                this.loading = false;
                this.ELEMENT_DATA = res;
                this.dataSource = new MatTableDataSource<ITaskGroupStrategyPackage>(this.ELEMENT_DATA);
                this.dataSource.paginator = this.tableOnePaginator;
                this.dataSource.sort = this.sortColA;
            })
    }

    getEAMPlanPackage() {
        this._assignTaskGroupService.getEAMPlanPackage()
            .subscribe(res => {
                // console.log(res);
                this.default = false;
                this.loading = false;
                this.ELEMENT_DATA2 = res;
                this.dataSource2 = new MatTableDataSource<IEAMPlanPackage>(this.ELEMENT_DATA2);
                this.dataSource2.paginator = this.tableTwoPaginator;
                this.dataSource2.sort = this.sortColB;
            })
    }

    type: string;

    hide() {
        this.isHide = true;
    }

    unhide() {
        this.isHide = false;
        // this.isDefaultTab = true;
        // this.isTab2 = true;
        // this.isDefault = false;
        // this.istab1 = false;
    }

    taskTypeOnSelect(event) {
        this.taskTypeId = parseInt(event.target.value);
    }

    frequencyOnSelect(event) {
        this.frequencyId = parseInt(event.target.value);
    }

    tradeTypeOnSelect(event) {
        this.tradeTypeId = parseInt(event.target.value);
    }

    operationalModeOnSelect(event) {
        this.operationalModeId = parseInt(event.target.value);
    }

    filter(): void {
        this._assignTaskGroupService.getTaskGroupStrategyPackageFilter(this.taskGroupId, this.taskGroupDesc, this.taskTypeId, this.frequencyId, this.tradeTypeId, this.operationalModeId)
            .subscribe(res => {
                this.default = false;
                this.loading = false;
                this.ELEMENT_DATA = res;
                this.dataSource = new MatTableDataSource<ITaskGroupStrategyPackage>(this.ELEMENT_DATA);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });

        this.untoggleFilter();
    }

    addThisPackage(event: any, taskGpStrategyId: number, taskId: number): void {
        this.taskGroupStrategyId = taskGpStrategyId;
        this.taskId = taskId;

        if (event.target.checked === true) {
            this.taskGroupStrategyPackageList.push({
                id: 0,
                stategyPackageId: 0,
                taskStrategyId: this.taskGroupStrategyId,
                isChecked: true,
                isActive: true
            });
        } else {
            this.taskGroupStrategyPackageList.push({
                id: 0,
                stategyPackageId: 0,
                taskStrategyId: 0,
                isChecked: false,
                isActive: false
            });
        }
    }

    saveNext(): void {
        this.activeId = 2;
        this.istab2 = true;
        this._taskGroupStrategyAddedService.upsertTaskGroupStrategyPackage(this.taskGroupStrategyPackageList)
            .subscribe(res => {
                this.currentBatch = res["currentBatch"];
                // this.toastr.success("Successfully saved!", 'Success');
            });
    }

    addThisEamPlan(event: any, eamItemId: number, eamPlanId: number): void {
        this.eamItemId = eamItemId;
        this.eamPlanId = eamPlanId;

        if (event.target.checked === true) {
            this.taskGroupStrategyAddedList.push({
                id: 0,
                tGSPackageId: this.currentBatch,
                eamItemId: this.eamItemId,
                eamPlanId: this.eamPlanId,
                isChecked: true,
                isActive: true,
            });
        } else {
            this.taskGroupStrategyAddedList.push({
                id: 0,
                tGSPackageId: 0,
                eamItemId: 0,
                eamPlanId: 0,
                isChecked: false,
                isActive: false,
            });
        }
    }

    dropTable(event: CdkDragDrop<ITaskGroupStrategySequence[]>) {
        const prevIndex = this.dataSource3.data.findIndex((d) => d === event.item.data);
        moveItemInArray(this.dataSource3.data, prevIndex, event.currentIndex);
        this.table.renderRows();

        console.log(this.dataSource3.data);
        this.taskGroupSequenceList = this.dataSource3.data;
        // this.fmeaTaskAddedList = this.dataSource3.data;
        this.dataSource3 = new MatTableDataSource<ITaskGroupStrategySequence>(this.ELEMENT_DATA3);
        this.dataSource3.paginator = this.paginator;
        this.dataSource3.sort = this.sort;



    }

    saveNextPackage(): void {
        this._taskGroupStrategyAddedService.upsertTaskGroupStrategyAdded(this.taskGroupStrategyAddedList)
            .subscribe(res => {

                this._taskGroupStrategySequenceService.getTaskAddedByStrategyPackageId(this.currentBatch)
                    .subscribe(fin => {
                        // console.log(fin);
                        this.taskGroupStrategyIdList = fin;

                        this.taskGroupStrategyIdList.forEach(x => {
                            let taskid = x.taskId

                            this.taskGroupStrategySequenceList.push({
                                id: 0,
                                taskId: taskid,
                                tGSPackageId: this.currentBatch,
                                sequenceNo: this.taskGroupStrategySequenceList.length + 1
                            });
                        });

                        this._taskGroupStrategyAddedService.upsertTaskGroupStrategySequence(this.taskGroupStrategySequenceList)
                            .subscribe(out => {
                                this._taskGroupStrategyAddedService.getTaskGroupStrategySequenceById(this.currentBatch)
                                    .subscribe(result => {
                                        this.taskGroupAddedSequenceList = result;
                                        this.loading = false;
                                        this.default = false;
                                        this.ELEMENT_DATA3 = result;
                                        this.dataSource3 = new MatTableDataSource<ITaskGroupStrategySequence>(this.ELEMENT_DATA3);
                                        this.dataSource3.paginator = this.tableThreePaginator;
                                        this.dataSource3.sort = this.sort;
                                    });

                                this.toastr.success("Successfully saved!", 'Success');
                            });

                    });
            });
    }

    getSequenceSource() {
        this._taskGroupStrategyAddedService.getTaskGroupStrategySequenceById(this.currentBatch)
            .subscribe(result => {
                this.loading = false;
                this.default = false;
                this.ELEMENT_DATA3 = result;
                this.dataSource3 = new MatTableDataSource<ITaskGroupStrategySequence>(this.ELEMENT_DATA3);
                this.dataSource3.paginator = this.tableThreePaginator;
                this.dataSource3.sort = this.sort;
            });
    }

    saveSequence(): void {
        this.taskGroupSequenceList.forEach(
            x => {
                let addedId = x.id;
                let tgsId = x.tgsPackageId;
                let taskId = x.taskId;
                let seqNum = x.sequenceNo;

                // console.log(x);

                this.taskGroupFinalSequenceList.push({
                    id: 0,
                    taskId: taskId,
                    tgsPackageId: tgsId,
                    sequenceNo: this.taskGroupFinalSequenceList.length + 1
                });

            });

        if (this.taskGroupSequenceList.length > 1) {
            this._taskGroupStrategySequenceService.upsertStrategySequence(this.taskGroupFinalSequenceList)
                .subscribe(res => {
                    // console.log(res);
                    this._taskGroupStrategySequenceService.getTaskGroupStrategyFinalSequenceById(this.currentBatch)
                        .subscribe(out => {
                            // console.log(out);
                            this.loading = false;
                            this.default = false;
                            this.ELEMENT_DATA3 = out;
                            this.dataSource3 = new MatTableDataSource<ITaskGroupStrategySequence>(this.ELEMENT_DATA3);
                            this.dataSource3.paginator = this.tableThreePaginator;
                            this.dataSource3.sort = this.sort;
                        });

                    this.toastr.success('Saved successfully.', 'Success');
                });
        } else {
            this.taskGroupAddedSequenceList.forEach(
                x => {
                    let taskid = x.taskId;
                    let tgsid = x.tgsPackageId;

                    this.taskGroupFinalSequenceList.push({
                        id: 0,
                        taskId: taskid,
                        tgsPackageId: tgsid,
                        sequenceNo: this.taskGroupFinalSequenceList.length + 1
                    });
                });

            this._taskGroupStrategySequenceService.upsertStrategySequence(this.taskGroupFinalSequenceList)
                .subscribe(res => {
                    // console.log(res);
                    this._taskGroupStrategySequenceService.getTaskGroupStrategyFinalSequenceById(this.currentBatch)
                        .subscribe(out => {
                            // console.log(out);
                            this.loading = false;
                            this.default = false;
                            this.ELEMENT_DATA3 = out;
                            this.dataSource3 = new MatTableDataSource<ITaskGroupStrategySequence>(this.ELEMENT_DATA3);
                            this.dataSource3.paginator = this.tableThreePaginator;
                            this.dataSource3.sort = this.sort;
                        });

                    this.toastr.success('Saved successfully.', 'Success');
                });
        }
    }

    goToATGEdit(id: number): void {
        this.router.navigate(["/main/asset-task-group-edit", id]);
        localStorage.setItem("taskId", id.toString());
    }

    addColumnTaskGroupId() {
        if (this.taskGroupid === true) {
            if (this.displayedColumns.length) {
                // this.displayedColumns.splice(1, 1, "code");
                this.displayedColumns.push('taskGroupStrategyId');
            }
        } else {
            this.removeColumn('taskGroupStrategyId');
        }
    }

    addColumnTaskGroupDesc() {
        if (this.taskGroupdesc === true) {
            if (this.displayedColumns.length) {
                // this.displayedColumns.splice(1, 1, "code");
                this.displayedColumns.push('taskGroupDescription');
            }
        } else {
            this.removeColumn('taskGroupDescription');
        }
    }

    addColumnTaskType() {
        if (this.tasktype === true) {
            if (this.displayedColumns.length) {
                // this.displayedColumns.splice(1, 1, "code");
                this.displayedColumns.push('taskTypeName');
            }
        } else {
            this.removeColumn('taskTypeName');
        }
    }

    addColumnFrequency() {
        if (this.frequency === true) {
            if (this.displayedColumns.length) {
                // this.displayedColumns.splice(1, 1, "code");
                this.displayedColumns.push('frequencyName');
            }
        } else {
            this.removeColumn('frequencyName');
        }
    }

    addColumnTradeType() {
        if (this.tradetype === true) {
            if (this.displayedColumns.length) {
                // this.displayedColumns.splice(1, 1, "code");
                this.displayedColumns.push('tradeTypeName');
            }
        } else {
            this.removeColumn('tradeTypeName');
        }
    }

    addColumnOperationalMode() {
        if (this.operationalmode === true) {
            if (this.displayedColumns.length) {
                // this.displayedColumns.splice(1, 1, "code");
                this.displayedColumns.push('operationalModeName');
            }
        } else {
            this.removeColumn('operationalModeName');
        }
    }

    addColumnVersions() {
        if (this.versions === true) {
            if (this.displayedColumns.length) {
                // this.displayedColumns.splice(1, 1, "code");
                this.displayedColumns.push('versions');
            }
        } else {
            this.removeColumn('versions');
        }
    }

    addColumnActivities() {
        if (this.activities === true) {
            if (this.displayedColumns.length) {
                // this.displayedColumns.splice(1, 1, "code");
                this.displayedColumns.push('activities');
            }
        } else {
            this.removeColumn('activities');
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

    onClickDocument(event) {
        if (this.displayTableColumn) {
            if (!this.tableColumn.nativeElement.contains(event.target)) // or some similar check
                this.toggleColumn();
        }

        if (this.displayMultiFilter) {
            if (!this.tableColumn.nativeElement.contains(event.target)) // or some similar check
                this.toggleFilter();
        }
    }

    close() {
        this.router.navigate(["/main/eam-maintenance"]);
    }
}



