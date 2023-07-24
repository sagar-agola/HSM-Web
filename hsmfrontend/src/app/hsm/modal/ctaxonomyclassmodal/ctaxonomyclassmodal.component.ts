import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { TaxonomyCategoryService } from '../../services/taxonomycategory.services';

//interface
import { IComTaxonomyCategory, ITaxonomyCategory } from './../../interfaces/ITaxonomyCategory';
import { TaxonomyClassService } from '../../services/taxonomyclass.services';
import { IComTaxonomyClass, ITaxonomyClass } from '../../interfaces/ITaxonomyClass';
import { ComTaxonomyCategoryService } from '../../services/comtaxonomycategory.services';
import { ComTaxonomyClassService } from '../../services/comtaxonomyclass.services';

@Component({
  selector: 'ctaxonomyclass-modal',
  templateUrl: './ctaxonomyclassmodal.component.html',
  styleUrls: ['./ctaxonomyclassmodal.component.scss']
})

export class CTaxonomyClassModalComponent implements OnInit {
    mode: string = "";
    className: string = "";
    categoryId: number;
    currentId: number;

    taxonomyCategoryList: any[] = [];

    taxClassObject: IComTaxonomyClass = {
        id: 0,
        className: '',
        ctaxonomyCategoryId: 0
    };

    taxCategoryObject: IComTaxonomyCategory = {
        id: 0,
        categoryName: ''
    }

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<CTaxonomyClassModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _classService: ComTaxonomyClassService,
        private _categoryService: ComTaxonomyCategoryService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.data);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._classService.getTaxonomyClassById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });

            this._categoryService.getTaxonomyCategory()
                .subscribe(res => {
                    this.taxonomyCategoryList = res;
                });
        }
        else{
            this.isEdit = false;

            this._categoryService.getTaxonomyCategory()
            .subscribe(res => {
                this.taxonomyCategoryList = res;
            });
        }
    }

    initializeData(data: IComTaxonomyClass): void{
        this.taxClassObject = data;

        this.className = data.className;
        this.categoryId = data.ctaxonomyCategoryId;

    }

    close(): void {
        this.dialogRef.close();
    }

    categoryOnselect(event){
        this.categoryId = parseInt(event.target.value);
    }

    onKeyUp(event){
        this.className = event.target.value;
    }

    saveChanges(): void{
        this.taxClassObject.className = this.className;
        this.taxClassObject.ctaxonomyCategoryId = this.categoryId;
    
        this._classService.addTaxonomyClass(this.taxClassObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.taxClassObject.className = this.className;
        this.taxClassObject.ctaxonomyCategoryId = this.categoryId;
    
        this._classService.updateClassTaxonomy(this.currentId, this.taxClassObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
