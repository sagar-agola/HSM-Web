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
import { IWorkInstructionTaskType } from '../../interfaces/ITaskType';
import { WorkInstructionTaskTypeService } from '../../services/workinstructiontasktype.services';

@Component({
  selector: 'workinstructiontasktype-modal',
  templateUrl: './workinstructiontasktypemodal.component.html',
  styleUrls: ['./workinstructiontasktypemodal.component.scss']
})

export class WorkInstructionTaskTypeModalComponent implements OnInit {
    mode: string = "";
    taskType: string = "";
    currentId: number;

    tasktypeObject: IWorkInstructionTaskType = {
        id: 0,
        taskTypeName: ''
    };

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<WorkInstructionTaskTypeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _taskTypeService: WorkInstructionTaskTypeService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._taskTypeService.getWorkInstructionTaskTypeById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IWorkInstructionTaskType): void{
        this.tasktypeObject = data;

        this.taskType = data.taskTypeName;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.tasktypeObject.taskTypeName = this.taskType;
    
        this._taskTypeService.addWorkInstructionTaskType(this.tasktypeObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.tasktypeObject.taskTypeName = this.taskType;
    
        this._taskTypeService.updateWorkInstructionTaskType(this.currentId, this.tasktypeObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
