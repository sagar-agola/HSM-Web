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
import { IFMEA } from '../../interfaces/IFMEA';
import { FMEAService } from '../../services/fmea.services';
import { AssignAssetTaskGroupStrategyMaterialService } from '../../services/assignassettaskgroupstrategymaterial.services';

@Component({
  selector: 'addfloc-modal',
  templateUrl: './addflocmodal.component.html',
  styleUrls: ['./addflocmodal.component.scss']
})

export class AddFlocModalComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['isAdd', 'code', 'flocDescription'];
    containers = [];
    dataList: any[] = [];

    ELEMENT_DATA: IAddFlocList[] = [];
    checkedIDs = [];
    flocAddTaskList: IAddedFlocTask[] = [];
    fmeaObject: IFMEA;
    assetStrategyObject: IAssetTaskGroupStrategy;
    dataSource;

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

    mode: string = "";
    fmeaId: number;
    taskId: number;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AddFlocModalComponent>,
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

        // console.log(this.data);

        forkJoin(
            this._fmeaService.getFMEAById(this.data.item),
            this._assetTaskGroupStrategyService.getTaskGroupStrategyById(this.data.item),
            this._assignAssetTaskGroupService.getFlocAddedTasks(this.data.item),
            ).subscribe(([fm, tgs, fat]) => {
                this.initializeFieldData(fm);
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
                // console.log(res);
                this.loading = false;
                this.default = false;
                this.ELEMENT_DATA = res;
                this.dataSource = new MatTableDataSource<IAddFlocList>(this.ELEMENT_DATA);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    initializeFieldData(data: IFMEA): void {
        this.fmeaObject = data;
        
        this.fmeaId = this.fmeaObject.id;
    }

    initializeStrategyData(data: IAssetTaskGroupStrategy){
        this.assetStrategyObject = data;

        this.taskId = this.assetStrategyObject.id;
    }

    addThis(event: any, flocId: any): void{
        // fmeaId = this.fmeaId;
    
        if(event.target.checked === true)
        {
            this.containers.push(flocId);
            // console.log(this.containers);
        }else{
            this.containers.pop();
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

    addThisFloc(event: any, id: number): void{
        // fmeaId = this.fmeaId;
    
        if(event.target.checked === true)
        {
            // this.containers.push(flocId);
            // console.log(this.containers);
            this.flocAddTaskList.forEach(
                x => {
                // console.log(x);
                let fmeaid = x.fmeaId;
                let taskid = x.taskId;

                // this.assignAssetTaskGroupMaterialList.push({
                //     id: 0,
                //     fmeaId: fmeaid,
                //     taskId: taskid,
                //     assetHierarchyId: id,
                //     fileName: ''
                // });
                this.assignAssetTaskGroupMaterial ={
                    id: 0,
                    fmeaId: fmeaid,
                    taskId: taskid,
                    batchId: 0,
                    componentFamilyId: 0,
                    componentClassId: 0,
                    componentSubClassId: 0,
                    assetHierarchyId: id,
                    fileName: '',
                    sequenceNo: 0,
                    isMultiple: false,
                    isInclude: true
                };

                this.save();
            });

             // this.assignAssetTaskGroupMaterial ={
                //     id: 0,
                //     fmeaId: this.fmeaId,
                //     taskId: this.taskId,
                //     assetHierarchyId: id,
                //     fileName: ''
                // };
    
                // this.save();
            
        }else
        {
            this.assignAssetTaskGroupMaterial = {
                id: id,
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
        }
    }

    save(): void{

        this._assignAssetTaskGroupMaterialService.addAssignAssetTaskGroupStrategyMaterial(this.assignAssetTaskGroupMaterial)
            .subscribe(res => {
                // this.assignAssetTaskGroupMaterial.assetHierarchyId = res.assetHierarchyId;
                console.log("success");
                // console.log(res);
                this.assignAssetTaskGroupMaterial.id = res.id;
                this.dataList.push(this.assignAssetTaskGroupMaterial);
                // this.assignAssetTaskGroupMaterial = res;
                // this.close();
            });
    }

    cancel(): void{
        this.dialogRef.close();
    }

    close(): void {
        // this.toastr.success('added successfully.', 'Success');
        // localStorage.setItem("containers", JSON.stringify(this.containers));
        this.dialogRef.close(this.dataList);
    }

}
