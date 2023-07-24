import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { ComponentBuildSpecService } from '../../services/componentbuildspec.services';

//interface
import { IComponentBuildSpecTaxonomy } from './../../interfaces/IComponentTaxonomy';

@Component({
  selector: 'componentbuildspec-modal',
  templateUrl: './componentbuildspecmodal.component.html',
  styleUrls: ['./componentbuildspecmodal.component.scss']
})

export class ComponentBuildSpecModalComponent implements OnInit {
    mode: string = "";
    buildSpec: string = "";
    currentId: number;

    buildSpecObject: IComponentBuildSpecTaxonomy = {
        id: 0,
        buildSpec: '',
        customerId: 0,
        siteId: 0
    };

    isEdit: boolean= false;
    customerId: number = 0;
    siteId: number = 0;

    isHSMUser: boolean = false;
    isAdmin: boolean = false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<ComponentBuildSpecModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _componentBuildSpecService: ComponentBuildSpecService) {
            const user = JSON.parse(localStorage.currentUser);
            this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
            // console.log(user);
            this.isAdmin = user?.users?.isAdmin;
            this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
            this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._componentBuildSpecService.getComponentBuildSpecById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IComponentBuildSpecTaxonomy): void{
        this.buildSpecObject = data;

        this.buildSpec = data.buildSpec;
        this.customerId = data.customerId;
        this.siteId = data.siteId;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.buildSpecObject.buildSpec = this.buildSpec;
        this.buildSpecObject.customerId = this.customerId;
        this.buildSpecObject.siteId = this.siteId;
    
        this._componentBuildSpecService.addComponentBuildSpec(this.buildSpecObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.buildSpecObject.buildSpec = this.buildSpec;
        this.buildSpecObject.customerId = this.customerId;
        this.buildSpecObject.siteId = this.siteId;
    
        this._componentBuildSpecService.updateComponentBuildSpec(this.currentId, this.buildSpecObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
