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
import { IFMEA, IFMEATaskAdded, IFMEATaskAddedList } from '../../interfaces/IFMEA';
import { FMEAService } from '../../services/fmea.services';
import { AssignAssetTaskGroupStrategyMaterialService } from '../../services/assignassettaskgroupstrategymaterial.services';
import { SelectionModel } from '@angular/cdk/collections';
import { SelectTemplateComponentModalComponent } from '../selecttemplatemodal/selecttemplatemodal.component';

@Component({
  selector: 'addfloctoworkins-modal',
  templateUrl: './addfloctoworkinsmodal.component.html',
  styleUrls: ['./addfloctoworkinsmodal.component.scss']
})

export class AddFlocToWorkInstructionModalComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['isAdd', 'code', 'flocDescription'];
    displayedColumns2 = ['isAddDesc', 'flocDescription'];
    displayedColumns3 = ['isAddTask','taskIdentificationNo', 'familyComponent', 'componentClass', 'subClass', 'buildSpec', 'componentManufacturer', 'failureMode', 'taskDescription', 'failureRiskTotalScore', 'acceptableLimits', 'correctiveActions','taskTypeName', 'frequencyName'];
    containers = [];
    dataList: any[] = [];
    dataSource3;
    selection = new SelectionModel<IFMEATaskAddedList>(true, []);

    containerTask: any[] = [];
    containerComponents: any[] = [];

    ELEMENT_DATA: IAddFlocList[] = [];
    ELEMENT_DATA3: IAddFlocList[] = [];
    ELEMENT_DATA2: IFMEATaskAdded[] = [];
    ELEMENT_DATA_3: IFMEATaskAddedList [] = [];
    checkedIDs = [];
    flocAddTaskList: IAddedFlocTask[] = [];
    assetFlocList: any[] = [];
    fmeaTaskAdded: any[] = [];
    fmeaTaskAddedFamily: any[] = [];
    fmeaTaskAddedClass: any[] = [];
    fmeaTaskAddedSubClass: any[] = [];
    tempListfam: any[] = [];
    tempListclass: any[] = [];
    tempListsubclass: any[] = [];
    fmeaObject: IFMEA;
    assetStrategyObject: IAssetTaskGroupStrategy;
    dataSource;
    dataSource2;
    index: number;

    assetHierarchyObject: IAddFlocList = {
        id: 0,
        code: '',
        flocDescription: ''
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

    assignAssetTaskGroupMaterialList: IAssignAssetTaskGroupStrategyMaterial[] = [];

    loading: boolean = false;
    default: boolean = false;

    isAdd: boolean = false;
    isAddDesc: boolean = false;
    isAddFamily: boolean = false;
    isAddClass: boolean = false;
    isAddSubClass: boolean = false;
    isAddTask: boolean = false;
    isChecked: boolean = true;

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
    
    mode: string = "";
    fmeaId: number;
    taskId: number;
    flocId: number;
    selectedIndex: number = 0;
    activeId: number = 0;

    tgsId: number;
    batchId: number;
    workInstTitle: string = "";
    tgsNo: string = "";
    tgsDesc: string = "";
    frequencyId: number = 0;
    tradetypeId: number = 0;
    operationMode: number = 0;
    durationid: number = 0;
    tasktypeId: number = 0;
    assetIndustry: number = 0;
    businessType: number = 0;
    assetType: number = 0;
    processFunction: number = 0;
    assetCategory: number = 0;
    assetClassTaxonomy: number = 0;
    assetSpec: number = 0;
    assetFamily: number = 0;
    assetManufacturer: number = 0;
    familyId: number = 0;
    classId: number = 0;
    subClassId: number = 0;
    buildSpecId: number = 0;
    manufacturerId: number = 0;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AddFlocToWorkInstructionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _fmeaService: FMEAService,
        private _assetTaskGroupStrategyService: AssetTaskGroupStrategyService,
        private _assignAssetTaskGroupService: AssignTaskGroupStrategyService,
        private _assignAssetTaskGroupMaterialService: AssignAssetTaskGroupStrategyMaterialService) {
        
    }
    ngOnInit(): void {
        this.loading = true;
        this.data = this._dataService.getData();

        this.mode = this.data.mode;
        this.tgsId = this.data.item;
        this.workInstTitle = this.data.name;

        console.log(this.tgsId)
        console.log(this.workInstTitle)

        forkJoin(
            // this._fmeaService.getFMEAById(this.data.item),
            this._assetTaskGroupStrategyService.getAssetTaskGroupStrategyById(this.tgsId),
            this._assignAssetTaskGroupService.getFlocAddedTasks(this.tgsId),
            ).subscribe(([tgs, fat]) => {
                // this.initializeFieldData(fm);
                this.initializeStrategyData(tgs);
                this.flocAddTaskList = fat;
                // console.log(this.flocAddTaskList);
                // console.log(tgs)
            });

        this.getAddFlocData();
    }

    getAddFlocData(){
        this._assignAssetTaskGroupService.getAddFlocList()
            .subscribe(res => {
                // console.log(res)
                this.assetFlocList = res;
                this.loading = false;
                this.default = false;
                this.ELEMENT_DATA = res;
                this.dataSource = new MatTableDataSource<IAddFlocList>(this.ELEMENT_DATA);
                // this.assetFlocList = this.dataSource;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                // this.dataSource = this.assetFlocList;
            });
    }

    getAddFlocDescData(){
        this._assignAssetTaskGroupService.getAddFlocList()
            .subscribe(res => {
                // console.log(res)
                this.assetFlocList = res;
                this.loading = false;
                this.default = false;
                this.ELEMENT_DATA3 = res;
                this.dataSource2 = new MatTableDataSource<IAddFlocList>(this.ELEMENT_DATA3);
                // this.assetFlocList = this.dataSource;
                this.dataSource2.paginator = this.paginator;
                this.dataSource2.sort = this.sort;
                // this.dataSource = this.assetFlocList;
            });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    applyFilterDesc(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource2.filter = filterValue.trim().toLowerCase();
    }

    initializeFieldData(data: IFMEA): void {
        this.fmeaObject = data;
        
        this.fmeaId = this.fmeaObject.id;
    }

    addThis(event: any, flocId: any): void{
        console.log(flocId)

        // this.addThisDesc(event, flocId);
    
        if(event.target.checked === true)
        {
            this.flocId = flocId;
            this.isChecked = false;
        }else{
            this.isChecked = true;
        }
    }

    initializeStrategyData(data: IAssetTaskGroupStrategy){
        this.assetStrategyObject = data;
        // console.log(this.assetStrategyObject)

        this.assetStrategyObject.assetHierarchyId = this.flocId;
    }

    next(): void{
        this.assetStrategyObject.assetHierarchyId = this.flocId;
        this._assetTaskGroupStrategyService.updateStrategyGroup(this.tgsId , this.assetStrategyObject)
            .subscribe(res => {
                // console.log(res);
                this.openSelectTemplate();
                this.close();
            });
    }

    openSelectTemplate() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "500px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        dialogConfig.data = { item: this.tgsId, name: this.workInstTitle };
        this._dataService.setData(dialogConfig.data);
        const dialogRef = this.dialog.open(SelectTemplateComponentModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
        });
      }

    cancel(): void{
        this.dialogRef.close();
    }

    close(): void {
        this.dialogRef.close();
    }

}
