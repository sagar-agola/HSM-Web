import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { TaxonomyClassService } from '../../services/taxonomyclass.services';

//interface
import { ITaxonomyClass } from './../../interfaces/ITaxonomyClass';
import { TaxonomyCategoryService } from '../../services/taxonomycategory.services';
import { ITaxonomyCategory } from '../../interfaces/ITaxonomyCategory';

@Component({
  selector: 'taxonomyclass-modal',
  templateUrl: './taxonomyclassmodal.component.html',
  styleUrls: ['./taxonomyclassmodal.component.scss']
})

export class TaxonomyClassModalComponent implements OnInit {
    mode: string = "";
    className: string = "";
    categoryId: number;
    currentId: number;

    taxonomyCategoryList: any[] = [];

    taxClassObject: ITaxonomyClass = {
        id: 0,
        className: '',
        ahcategoryId: 0
    };

    taxCategoryObject: ITaxonomyCategory = {
        id: 0,
        categoryName: ''
    }

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<TaxonomyClassModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _classService: TaxonomyClassService,
        private _categoryService: TaxonomyCategoryService) {
        
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

    initializeData(data: ITaxonomyClass): void{
        this.taxClassObject = data;

        this.className = data.className;
        this.categoryId = data.ahcategoryId;

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
        this.taxClassObject.ahcategoryId = this.categoryId;
    
        this._classService.addTaxonomyClass(this.taxClassObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.taxClassObject.className = this.className;
        this.taxClassObject.ahcategoryId = this.categoryId;
    
        this._classService.updateClassTaxonomy(this.currentId, this.taxClassObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
