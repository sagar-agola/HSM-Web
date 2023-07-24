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
import { ITaxonomyCategory } from './../../interfaces/ITaxonomyCategory';
import { IComTaxonomyType, ITaxonomyType } from '../../interfaces/ITaxonomyType';
import { IComTaxonomyClass, ITaxonomyClass } from '../../interfaces/ITaxonomyClass';
import { TaxonomyClassService } from '../../services/taxonomyclass.services';
import { TaxonomyTypeService } from '../../services/taxonomytype.services';
import { ComTaxonomyCategoryService } from '../../services/comtaxonomycategory.services';
import { ComTaxonomyClassService } from '../../services/comtaxonomyclass.services';
import { ComTaxonomyTypeService } from '../../services/comtaxonomytype.services';

@Component({
  selector: 'ctaxonomytype-modal',
  templateUrl: './ctaxonomytypemodal.component.html',
  styleUrls: ['./ctaxonomytypemodal.component.scss']
})

export class CTaxonomyTypeModalComponent implements OnInit {
    mode: string = "";
    typeName: string = "";
    categoryId: number;
    classId: number;
    currentId: number;
    classDisabled: boolean = true;

    taxonomyCategoryList: any[] = [];
    taxonomyClassList: any[] = [];

    taxTypeObject: IComTaxonomyType = {
        id: 0,
        typeName: '',
        ctaxonomyCategoryId: 0,
        ctaxonomyClassId: 0
    };

    taxClassObject: IComTaxonomyClass = {
        id: 0,
        className: '',
        ctaxonomyCategoryId: 0
    };

    taxCategoryObject: ITaxonomyCategory = {
        id: 0,
        categoryName: ''
    }

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<CTaxonomyTypeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _classService: ComTaxonomyClassService,
        private _categoryService: ComTaxonomyCategoryService,
        private _typeService: ComTaxonomyTypeService) {
        
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

    initializeData(data: IComTaxonomyType): void{
        this.taxTypeObject = data;

        this.typeName = data.typeName;
        this.classId = data.ctaxonomyClassId;
        this.categoryId = data.ctaxonomyCategoryId;
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

    saveChanges(): void{
        this.taxTypeObject.typeName = this.typeName;
        this.taxTypeObject.ctaxonomyCategoryId = this.categoryId;
        this.taxTypeObject.ctaxonomyClassId = this.classId;
    
        this._typeService.addTaxonomyType(this.taxTypeObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.taxTypeObject.typeName = this.typeName;
        this.taxTypeObject.ctaxonomyCategoryId = this.categoryId;
        this.taxTypeObject.ctaxonomyClassId = this.classId;
    
        this._typeService.updateTypeTaxonomy(this.currentId, this.taxTypeObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
