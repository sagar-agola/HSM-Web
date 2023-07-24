import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { AssetCategoryService } from '../../services/assetcategory.services';

//interface
import { IAssetCategory, IAssetHierarchyClassTaxonomy } from './../../interfaces/IAssetHierarchyTaxonomy';
import { ITaskType, IWorkInstructionTaskType } from '../../interfaces/ITaskType';
import { TaskTypeService } from '../../services/tasktype.services';

@Component({
  selector: 'tasktype-modal',
  templateUrl: './tasktypemodal.component.html',
  styleUrls: ['./tasktypemodal.component.scss']
})

export class TaskTypeModalComponent implements OnInit {
    mode: string = "";
    taskType: string = "";
    customerId: number = 0;
    siteId: number = 0;
    currentId: number;

    tasktypeObject: ITaskType = {
        id: 0,
        taskTypeName: '',
        createdBy: '',
        dtCreated: undefined,
        lastUpdatedBy: '',
        dtLastUpdated: undefined,
        customerId: 0,
        siteId: 0
    };

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<TaskTypeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _taskTypeService: TaskTypeService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._taskTypeService.getTaskTypeById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: ITaskType): void{
        this.tasktypeObject = data;

        this.taskType = data.taskTypeName;
        this.customerId = data.customerId;
        this.siteId = data.siteId;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.tasktypeObject.taskTypeName = this.taskType;
        this.tasktypeObject.customerId = this.customerId;
        this.tasktypeObject.siteId = this.siteId;
    
        this._taskTypeService.addTaskType(this.tasktypeObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.tasktypeObject.taskTypeName = this.taskType;
        this.tasktypeObject.customerId = this.customerId;
        this.tasktypeObject.siteId = this.siteId;
    
        this._taskTypeService.updateTaskType(this.currentId, this.tasktypeObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
