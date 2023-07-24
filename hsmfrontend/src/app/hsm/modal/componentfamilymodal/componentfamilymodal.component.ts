import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { ComponentFamilyService } from '../../services/componentfamily.services';

//interface
import { IComponentFamilyTaxonomy } from './../../interfaces/IComponentTaxonomy';

@Component({
  selector: 'compfamily-modal',
  templateUrl: './componentfamilymodal.component.html',
  styleUrls: ['./componentfamilymodal.component.scss']
})

export class ComponentFamilyModalComponent implements OnInit {
    mode: string = "";
    familyComponent: string = "";
    currentId: number;

    familyObject: IComponentFamilyTaxonomy = {
        id: 0,
        familyComponent: ''
    };

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<ComponentFamilyModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _componentFamilyService: ComponentFamilyService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._componentFamilyService.getComponentFamilyById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IComponentFamilyTaxonomy): void{
        this.familyObject = data;

        this.familyComponent = data.familyComponent;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.familyObject.familyComponent = this.familyComponent;
    
        this._componentFamilyService.addComponentFamily(this.familyObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.familyObject.familyComponent = this.familyComponent;
    
        this._componentFamilyService.updateComponentFamily(this.currentId, this.familyObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
