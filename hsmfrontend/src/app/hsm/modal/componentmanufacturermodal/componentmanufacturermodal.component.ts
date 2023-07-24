import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { ComponentManufacturerService } from '../../services/componentmanufacturer.services';

//interface
import { IComponentManufacturerTaxonomy } from './../../interfaces/IComponentTaxonomy';

@Component({
  selector: 'componentmanufacturer-modal',
  templateUrl: './componentmanufacturermodal.component.html',
  styleUrls: ['./componentmanufacturermodal.component.scss']
})

export class ComponentManufacturerModalComponent implements OnInit {
    mode: string = "";
    componentManufacturer: string = "";
    currentId: number;

    manufacturerObject: IComponentManufacturerTaxonomy = {
        id: 0,
        componentManufacturer: '',
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
        public dialogRef: MatDialogRef<ComponentManufacturerModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _componentManufacturerService: ComponentManufacturerService) {
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

            this._componentManufacturerService.getComponentManufacturerById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IComponentManufacturerTaxonomy): void{
        this.manufacturerObject = data;

        this.componentManufacturer = data.componentManufacturer;
        this.customerId = data.customerId;
        this.siteId = data.siteId;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.manufacturerObject.componentManufacturer = this.componentManufacturer;
        this.manufacturerObject.customerId = this.customerId;
        this.manufacturerObject.siteId = this.siteId;
    
        this._componentManufacturerService.addComponentManufacturer(this.manufacturerObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.manufacturerObject.componentManufacturer = this.componentManufacturer;
        this.manufacturerObject.customerId = this.customerId;
        this.manufacturerObject.siteId = this.siteId;
    
        this._componentManufacturerService.updateComponentManufacturer(this.currentId, this.manufacturerObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
