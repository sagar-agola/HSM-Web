import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { TaxonomyClassService } from '../../services/taxonomyclass.services';
import { TaxonomyCategoryService } from '../../services/taxonomycategory.services';
import { TaxonomyTypeService } from '../../services/taxonomytype.services';

//interface
import { ITaxonomyClass } from './../../interfaces/ITaxonomyClass';
import { ITaxonomyCategory } from '../../interfaces/ITaxonomyCategory';
import { ITaxonomyType } from '../../interfaces/ITaxonomyType';

@Component({
  selector: 'taxonomytype-modal',
  templateUrl: './taxonomytypemodal.component.html',
  styleUrls: ['./taxonomytypemodal.component.scss']
})

export class TaxonomyTypeModalComponent implements OnInit {
    mode: string = "";
    typeName: string = "";
    categoryId: number;
    classId: number;
    currentId: number;
    classDisabled: boolean = true;

    taxonomyCategoryList: any[] = [];
    taxonomyClassList: any[] = [];

    taxTypeObject: ITaxonomyType = {
        id: 0,
        typeName: '',
        ahcategoryId: 0,
        ahclassId: 0
    };

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
        public dialogRef: MatDialogRef<TaxonomyTypeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _classService: TaxonomyClassService,
        private _categoryService: TaxonomyCategoryService,
        private _typeService: TaxonomyTypeService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.data);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            forkJoin(
                this._categoryService.getTaxonomyCategory(),
                this._classService.getTaxonomyClass(),
                this._typeService.getTaxonomyTypeById(this.currentId),
                ).subscribe(([ct, cl, tt]) => {
                    this.taxonomyCategoryList = ct;
                    this.taxonomyClassList = cl;
                    // console.log(tt);
                    this.initializeData(tt);
                });
        }
        else{
            this.isEdit = false;

            forkJoin(
                this._categoryService.getTaxonomyCategory(),
                this._classService.getTaxonomyClass(),
                ).subscribe(([ct, cl]) => {
                    this.taxonomyCategoryList = ct;
                    this.taxonomyClassList = cl;
                });
        }
    }

    initializeData(data: ITaxonomyType): void{
        this.taxTypeObject = data;

        this.typeName = data.typeName;
        this.classId = data.ahclassId;
        this.categoryId = data.ahcategoryId;
        // this.categoryId = data.ahcategoryId;

    }

    close(): void {
        this.dialogRef.close();
    }

    categoryOnselect(event){
        this.classDisabled = false;

        this.categoryId = parseInt(event.target.value);

        this._classService.getTaxonomyClassByCategory(this.categoryId)
            .subscribe(res => {
                this.taxonomyClassList = res;
            });
    }

    classOnselect(event){
        this.classId = parseInt(event.target.value);
    }

    onKeyUp(event){
        this.typeName = event.target.value;
    }

    saveChanges(): void{
        this.taxTypeObject.typeName = this.typeName;
        this.taxTypeObject.ahcategoryId = this.categoryId;
        this.taxTypeObject.ahclassId = this.classId;
    
        this._typeService.addTaxonomyType(this.taxTypeObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.taxTypeObject.typeName = this.typeName;
        this.taxTypeObject.ahcategoryId = this.categoryId;
        this.taxTypeObject.ahclassId = this.classId;
    
        this._typeService.updateTypeTaxonomy(this.currentId, this.taxTypeObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
