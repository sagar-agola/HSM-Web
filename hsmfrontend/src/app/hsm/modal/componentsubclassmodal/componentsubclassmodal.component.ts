import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { ComponentSubClassService } from '../../services/componentsubclass.services';

//interface
import { IComponentSubClassTaxonomy } from './../../interfaces/IComponentTaxonomy';
import { ComponentClassService } from '../../services/componentclass.services';

@Component({
  selector: 'componentsubclass-modal',
  templateUrl: './componentsubclassmodal.component.html',
  styleUrls: ['./componentsubclassmodal.component.scss']
})

export class ComponentSubClassModalComponent implements OnInit {
    mode: string = "";
    subClass: string = "";
    maintItemId: number = 0;
    customerId: number = 0;
    siteId: number = 0;
    currentId: number;

    maintItemList: any[] = [];

    subClassObject: IComponentSubClassTaxonomy = {
        id: 0,
        subClass: '',
        maintItemId: 0,
        customerId: 0,
        siteId: 0
    };

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<ComponentSubClassModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _componentSubClassService: ComponentSubClassService,
        private _maintItemService: ComponentClassService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._componentSubClassService.getComponentSubClassById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }else if(this.mode === 'CreateFMEA')
        {
            this.maintItemId = this.data.paramId;
            this.isEdit = false;
        }
        else{
            this.isEdit = false;
        }

        this._maintItemService.getComponentClass()
            .subscribe(res => {
                // console.log(res)
                this.maintItemList = res;
            })
    }

    initializeData(data: IComponentSubClassTaxonomy): void{
        this.subClassObject = data;

        this.subClass = data.subClass;
        this.maintItemId = data.maintItemId;
        this.customerId = data.customerId;
        this.siteId = data.siteId;

    }

    maintItemOnSelect(event){
        this.maintItemId = parseInt(event.target.value);
    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.subClassObject.subClass = this.subClass;
        this.subClassObject.maintItemId = this.maintItemId;
        this.subClassObject.customerId = this.customerId;
        this.subClassObject.siteId = this.siteId;
    
        this._componentSubClassService.addComponentSubClass(this.subClassObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.subClassObject.subClass = this.subClass;
        this.subClassObject.maintItemId = this.maintItemId;
        this.subClassObject.customerId = this.customerId;
        this.subClassObject.siteId = this.siteId;
    
        this._componentSubClassService.updateComponentSubClass(this.currentId, this.subClassObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
