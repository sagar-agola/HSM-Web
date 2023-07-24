import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { ComponentTaskService } from '../../services/componenttask.services';

//interface
import { IComponentTaskFMMT } from './../../interfaces/IFMEA';

@Component({
  selector: 'componenttask-modal',
  templateUrl: './componenttaskmodal.component.html',
  styleUrls: ['./componenttaskmodal.component.scss']
})

export class ComponentTaskModalComponent implements OnInit {
    mode: string = "";
    componentTaskName: string = "";
    customerId: number = 0;
    siteId: number = 0;
    currentId: number;

    componentTaskObject: IComponentTaskFMMT = {
        id: 0,
        componentTaskName: '',
        customerId: 0,
        siteId: 0
    };

    isEdit: boolean= false;
    isHSMUser: boolean = false;
    isAdmin: boolean = false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<ComponentTaskModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _componentTaskService: ComponentTaskService) {
            const user = JSON.parse(localStorage.currentUser);
            this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
            // console.log(user);
            this.isAdmin = user?.users?.isAdmin;
            this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
            this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'Edit'){
            this.isEdit = true;

            this._componentTaskService.getComponentTaskById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IComponentTaskFMMT): void{
        this.componentTaskObject = data;

        this.componentTaskName = data.componentTaskName;
        this.customerId = data.customerId;
        this.siteId = data.siteId;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.componentTaskObject.componentTaskName = this.componentTaskName;
        this.componentTaskObject.customerId = this.customerId;
        this.componentTaskObject.siteId = this.siteId;
    
        this._componentTaskService.addComponentTask(this.componentTaskObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.componentTaskObject.componentTaskName = this.componentTaskName;
        this.componentTaskObject.customerId = this.customerId;
        this.componentTaskObject.siteId = this.siteId;
    
        this._componentTaskService.updateComponentTask(this.currentId, this.componentTaskObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
