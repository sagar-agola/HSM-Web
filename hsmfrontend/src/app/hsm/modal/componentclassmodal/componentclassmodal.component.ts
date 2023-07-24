import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { ComponentClassService } from '../../services/componentclass.services';

//interface
import { IComponentClassTaxonomy } from './../../interfaces/IComponentTaxonomy';
import { ComponentTaskService } from '../../services/componenttask.services';

@Component({
  selector: 'componentclass-modal',
  templateUrl: './componentclassmodal.component.html',
  styleUrls: ['./componentclassmodal.component.scss']
})

export class ComponentClassModalComponent implements OnInit {
    mode: string = "";
    componentClass: string = "";
    customerId: number = 0;
    siteId: number = 0;
    maintUnitId: number = 0;
    currentId: number;

    maintUnitList: any[] = [];

    classObject: IComponentClassTaxonomy = {
        id: 0,
        componentClass: '',
        maintUnitId: 0,
        customerId: 0,
        siteId: 0
    };

    isEdit: boolean= false;
    isHSMUser: boolean = false;
    isAdmin: boolean = false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<ComponentClassModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _componentClassService: ComponentClassService,
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

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._componentClassService.getComponentClassById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else if(this.mode === 'CreateFMEA')
        {
            this.maintUnitId = this.data.paramId;
            this.isEdit = false;
        }
        else{
            this.isEdit = false;
        }

        this._componentTaskService.getComponentTask()
            .subscribe(res => {
                this.maintUnitList = res;
            })
    }

    initializeData(data: IComponentClassTaxonomy): void{
        this.classObject = data;

        this.componentClass = data.componentClass;
        this.maintUnitId = data.maintUnitId;
        this.customerId = data.customerId;
        this.siteId = data.siteId;

    }

    maintUnitOnSelect(event){
        this.maintUnitId = parseInt(event.target.value);
    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.classObject.componentClass = this.componentClass;
        this.classObject.customerId = this.customerId;
        this.classObject.siteId = this.siteId;
        this.classObject.maintUnitId = this.maintUnitId;
    
        this._componentClassService.addComponentClass(this.classObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.classObject.componentClass = this.componentClass;
        this.classObject.customerId = this.customerId;
        this.classObject.siteId = this.siteId;
        this.classObject.maintUnitId = this.maintUnitId;
    
        this._componentClassService.updateComponentClass(this.currentId, this.classObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
