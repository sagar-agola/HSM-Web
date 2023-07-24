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
import { FrequencyService } from '../../services/frequency.services';
import { DurationService } from '../../services/duration.services';
import { OperationalModeService } from '../../services/operationalmode.services';
import { TradeTypeService } from '../../services/tradetype.services';
import { TaskTypeService } from '../../services/tasktype.services';
import { TaxonomyCategoryService } from '../../services/taxonomycategory.services';
import { TaxonomyClassService} from '../../services/taxonomyclass.services';
import { TaxonomyTypeService} from '../../services/taxonomytype.services';

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
import { CategoryHierarchyService } from '../../services/categoryhierarchy.services';
import { IAllFMEAList, IFMEATaskAdded, IFMEATaskAddedList, IFMEATaskAddedSequence } from '../../interfaces/IFMEA';
import { FMEAService } from '../../services/fmea.services';

import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle} from '@angular/cdk/drag-drop';
import { TaxonomyModalComponent } from '../../modal/taxonomymodal/taxonomymodal.component';
import { AssetHierarchyModalComponent } from '../../modal/assethierarchymodal/assethierarchymodal.component';
import { FMEATaskAddedService } from '../../services/fmeataskadded.services';
import { AssetTaskGroupStrategySequenceService } from '../../services/assettaskgroupstrategysequence.services';

interface RootObject {
  hierarchy: ComponentHierarchy[];
}

interface ComponentHierarchy {
  CategoryName: string;  
  Children?: ComponentHierarchy[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
    selector: "asset-task-group-edit",
    templateUrl: './assettaskgroupedit.component.html',
    styleUrls: [
        './assettaskgroupedit.component.scss'
    ]
})

export class AssetTaskGroupEditComponent implements OnInit {
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;
    // @ViewChild(MatTable) table: MatTable<IFMEATaskAddedSequence>;

    displayedColumns = ['sequenceNo', 'taskIdentificationNo', 'taskDescription', 'acceptableLimits', 'correctiveActions', 'frequencyName', 'taskTypeName'];
    
    ELEMENT_DATA: IFMEATaskAddedSequence[] = [];
    // ELEMENT_DATA_2: IAllFMEAList [] = [];
    // ELEMENT_DATA_3: IFMEATaskAddedList [] = [];
    // ELEMENT_DATA_4: IFMEATaskAddedSequence [] = [];
    
    fmeaTaskAddedList: IFMEATaskAdded [] = [];
    fmeaTaskAddedListData: IFMEATaskAddedList [] = [];
    fmeaTaskAddedSequenceList: IFMEATaskAddedSequence [] = [];

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
    hierarchyData: [] = [];
    taskTempList : any[] = [];
    taskList: any[]=[];
    taskList2: any[] = [];

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

    taxonomyCategory: string = "";
    taxonomyClass: string = "";
    taxonomyType: string = "";
    taxonomyText: string = "";
    operationalMode: string = "";
    durationName: string = "";
    tradeTypeName: string = "";
    taskTypeName: string = "";

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

    loading: boolean = false;
    loading2: boolean = false;
    default: boolean = false;
    default2: boolean = false;

    isAdd: boolean = false;

    public data: [];

    tabIndex = 1;
    activeId: number = 1;
    fmeaId: number;
    currentId: number;

    hierarchy: RootObject;

    private _transformer = (node: ComponentHierarchy, level: number) => {
      return {
        expandable: !!node.Children && node.Children.length > 0,
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

    isLoading: boolean = false;


    myControl = new FormControl();

    constructor(
      private router: Router,
      private _eref: ElementRef,
      public dialog: MatDialog,
      private _frequenceService: FrequencyService,
      private _durationService: DurationService,
      private _operationModeService: OperationalModeService,
      private _tradeTypeService: TradeTypeService,
      private _taskTypeService: TaskTypeService,
      private _taxonomyCategoryService: TaxonomyCategoryService,
      private _taxonomyClassService: TaxonomyClassService,
      private _taxonomyTypeService: TaxonomyTypeService,
      private _assetTaskGroupStrategyService: AssetTaskGroupStrategyService,
      private _categoryHierarchyService: CategoryHierarchyService,
      private _fmeaService: FMEAService,
      private _fmeaTaskAddedService: FMEATaskAddedService,
      private _assetTaskgroupSequenceService: AssetTaskGroupStrategySequenceService,
      private toastr: ToastrService,
      private _route: ActivatedRoute
      ) { }

      hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

    ngOnInit(): void {
        this.default = true;
        this.default2 = true;
        this.isLoading = true;

        this._route.params.subscribe(params => {
        this.currentId = params['id'];
      });

        this.getTaskGpStrategyDetails();
        this.getTGSTasks();
    }

    getTGSTasks(){
      this._assetTaskGroupStrategyService.getTaskGroupStrategyDetails(this.currentId)
        .subscribe(res => {
          this.hierarchyData = JSON.parse(res['hierarchy']);
          // console.log(this.hierarchyData);
          this.taskTempList = this.hierarchyData['PRTData'];
          this.taskList = this.taskTempList[0]['MultipleTask'];
          this.taskList2 = this.taskTempList[0]['MultipleComponent'];
          this.isLoading = false;
          // console.log(this.hierarchyData)
        });
    }

  getTaskGpStrategyDetails(){

    this._assetTaskGroupStrategyService.getTaskGroupStrategyById(this.currentId)
        .subscribe(res => {
          // console.log(res);
          if(res.familyComponent === null)
          {

          }
          this.taxonomyText = res.familyComponent + ' - ' + res.componentClass;
          this.taskGroupDescription = res.taskGroupDescription;
          this.taskId = res.taskGroupStrategyId;
          this.operationalMode = res.operationalModeName;
          this.tradeTypeName = res.tradeTypeName;
          this.frequency = res.frequencyName;
          this.durationName = res.durationName;
          this.taskTypeName = res.taskTypeName;
          this.isLoading = false;
        });

    this._assetTaskGroupStrategyService.getTaskGroupStrategyMaxFailureScore(this.currentId)
        .subscribe(out => {
            this.failureScore = out.failureScore;
        });
  }

  getSequenceDatasource(){

    this._assetTaskgroupSequenceService.getFMEATaskAddedFinalSequenceById(this.currentId)
      .subscribe(res => {
        // console.log(res);
        this.loading2 = false;
        this.default2 = false;
        this.ELEMENT_DATA = res;
        this.dataSource3 = new MatTableDataSource<IFMEATaskAddedSequence>(this.ELEMENT_DATA);
        this.dataSource3.paginator = this.paginator;
        this.dataSource3.sort = this.sort;
      });
  }

  openDialogFilter(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "700px";
      dialogConfig.height = "auto";
      dialogConfig.position = { top: '30px' };
      const dialogRef = this.dialog.open(MultiFilterModalComponent, dialogConfig);
  }

  goToFMEAEdit(id: number): void{
    this.router.navigate(["/main/fmea-edit", id]);
  }
}



