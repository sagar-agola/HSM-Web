import { Component, Inject, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import {ArrayDataSource} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MultiFilterModalComponent } from '../../modal/multifiltermodal/multifiltermodal.component';

//Services
import { AssetTaskGroupStrategyService } from '../../services/assettaskgroupstrategy.services';

//interface
import { IAssetTaskGroupStrategy } from './../../interfaces/IAssetTaskGroupStrategy';
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
import { IAllFMEAList, IFMEATaskAdded, IFMEATaskAddedList, IFMEATaskAddedSequence } from '../../interfaces/IFMEA';

import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle} from '@angular/cdk/drag-drop';
import { AssetTaskGroupStrategySequenceService } from '../../services/assettaskgroupstrategysequence.services';
import { EAMPlanService } from '../../services/eamplan.services';
import { IEAMPlanList } from '../../interfaces/IEAMPlan';

@Component({
    selector: "eam-details",
    templateUrl: './eam-details.component.html',
    styleUrls: [
        './eam-details.component.scss'
    ]
})

export class EamDetailsComponent implements OnInit {
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;
    // @ViewChild(MatTable) table: MatTable<IFMEATaskAddedSequence>;

    displayedColumns = ['sequenceNo', 'taskIdentificationNo', 'taskDescription', 'acceptableLimits', 'correctiveActions', 'frequencyName', 'taskTypeName'];
    
    ELEMENT_DATA: IEAMPlanList[] = [];
    
    fmeaTaskAddedList: IFMEATaskAdded [] = [];
    fmeaTaskAddedListData: IFMEATaskAddedList [] = [];
    fmeaTaskAddedSequenceList: IFMEATaskAddedSequence [] = [];

    dataSource;
    
    durationList: any[] = [];
    frequencyList: any[] = [];
    operationModeList: any[] = [];
    tradeTypeList: any[] = [];
    taskTypeList: any[] = [];
    taxonomyCategoryList: any[] = [];
    taxonomyClassList: any[] = [];
    taxonomyTypeList: any[] = [];

    frequencyObject: IFrequency;
    durationObject: IDuration;
    operationModeObject: IOperationalMode;
    tradeTypeObject: ITradeType;
    taskTypeObject: ITaskType;

    taxonomyCategoryObject: ITaxonomyCategory;
    taxonomyClassObject: ITaxonomyClass;
    taxonomyTypeObject: ITaxonomyType;

    frequency: string = "";
    tradeType: string ="";
    className: string = "";
    taskType: string = "";

    taskId: number;
    taxCategoryId: number;
    taxClassId: number;
    taxTypeId: number;
    taskGroupDescription: string = "";
    frequencyId: number;
    tradeTypeId: number;
    operationalModeId: number;
    durationId: number;
    taskTypeId: number;
    componentName: string = "";
    failureScore: number;

    currentId: number;

    code: string = "";
    hierarchyDesc: string = "";
    mainWorkCtr: string = "";
    maintItem: string = "";
    maintItemText: string = "";
    maintPlanId: string = "";
    plannerGroup: string = "";
    planningPlant: string = "";
    taskListId: string = "";

    isHide: boolean = false;

    loading: boolean = false;
    default: boolean = false;

    isAdd: boolean = false;

    myControl = new FormControl();

    isLoading: boolean = true;

    constructor(
      private router: Router,
      private _eref: ElementRef,
      public dialog: MatDialog,
      private route: ActivatedRoute,
      private _assetTaskGroupStrategyService: AssetTaskGroupStrategyService,
      private _eamPlanService: EAMPlanService,
      private toastr: ToastrService,
      ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.currentId = params['id'];
            
        });
        this.loading = true;
        this.default = true;

        this.getDataSource(this.currentId);

        this.getEAMDetails(this.currentId);
        
    }

    getDataSource(id: number){
        this._eamPlanService.getEAMPlanDetailById(id)
            .subscribe(res => {
                console.log(res);
                this.ELEMENT_DATA = res;
                this.dataSource = new MatTableDataSource<IEAMPlanList>(this.ELEMENT_DATA);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.loading = false;
                this.default = false;
                this.isLoading = false;
            });
    }

    getEAMDetails(id:number){
        this._eamPlanService.getEAMPlanListDetailById(id)
            .subscribe(res => {
                console.log(res);
                this.code = res.code;
                this.hierarchyDesc = res.hierarchyDesc;
                this.plannerGroup = res.plannerGroup;
                this.maintItemText = res.maintItemText;
                this.maintItem = res.maintItem;
                this.taskListId = res.taskListId;
                this.maintPlanId = res.maintPlanId;
                this.mainWorkCtr = res.mainWorkCtr;
                this.planningPlant = res.planningPlant;
                this.isLoading = false;
            });
    }

    goToFMEAEdit(id: number): void{
        this.router.navigate(["/main/fmea-edit", id]);
    }
}

