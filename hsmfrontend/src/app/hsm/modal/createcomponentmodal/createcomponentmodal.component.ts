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
import { ComTaxonomyCategoryService } from '../../services/comtaxonomycategory.services';
import { CategoryHierarchyService } from '../../services/categoryhierarchy.services';
import { IComponentHierarchy } from '../../interfaces/IComponentHierarchy';

@Component({
  selector: 'create-component-modal',
  templateUrl: './createcomponentmodal.component.html',
  styleUrls: ['./createcomponentmodal.component.scss']
})

export class CreateComponentModalComponent implements OnInit {
    mode: string = "";
    category: string = "";
    currentId: number;
    categoryHierarchyId: number;
    categoryCode: string="";
    level: number;
    parentId: number;
    tempCode: number = 0;

    taxCategoryObject: ITaxonomyCategory = {
        id: 0,
        categoryName: ''
    };

    categoryHierarchyObject: IComponentHierarchy = {
        id: 0,
        parentId: null,
        categoryCode: '',
        level: 0,
        categoryName: '',
        familyTaxonomyId: 0,
        classTaxonomyId: 0,
        subClassTaxonomyId: 0,
        buildSpecTaxonomyId: 0,
        manufacturerIdTaxonomyId: 0
    }

    isEdit: boolean= false;
    isEditable: boolean = false;
    isLevel1: boolean = false;
    isLevel2: boolean = false;
    isLevel3: boolean = false;
    isLevel4: boolean = false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<CreateComponentModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _categoryService: ComTaxonomyCategoryService,
        private _componentCategoryService: CategoryHierarchyService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        console.log(this.data)

        if(this.data.mode === 'edit')
        {
            this.currentId = this.data.item.id
            this.category = this.data.item.categoryName;
            this.categoryCode = this.data.item.categoryCode;
            this.level = this.data.item.level;
            this.parentId = this.data.item.parentId;
            this.isEditable = true;
            // this.categoryHierarchyObject.categoryName = this
        }

        if(this.data.mode === 'add2'){

            if(this.data.item.level === 1){
                this._componentCategoryService.getComponentCategoryHierarchyLastRow()
                .subscribe(res => {
                    // console.log(res)
                    this.tempCode = res.id
                    this.categoryHierarchyId = this.tempCode + 1;
                    this.categoryCode = this.data.item.categoryCode + "." + "M"+ this.categoryHierarchyId;
                    // this.categoryCode = this.data.item.categoryCode + "."+ "M" + this.tempCode + 1;
                    this.parentId = this.data.item.id;
                    this.level = 2;
                    this.isEdit = true;

                })
            }
            
            if(this.data.item.level === 2){
                this._componentCategoryService.getComponentCategoryHierarchyLastRow()
                .subscribe(res => {

                    // console.log(res)
                    this.tempCode = res.id
                    this.categoryHierarchyId = this.tempCode + 1;
                    this.categoryCode = this.data.item.categoryCode + "." + "M"+ this.categoryHierarchyId;
                    // this.categoryCode = this.data.item.categoryCode + "."+ "M" + this.tempCode + 1;
                    this.parentId = this.data.item.id;
                    this.level = 3;
                    this.isEdit = true;

                })
            }
            
            if(this.data.item.level === 3){
                this._componentCategoryService.getComponentCategoryHierarchyLastRow()
                .subscribe(res => {
                    // console.log(res)
                    this.tempCode = res.id
                    this.categoryHierarchyId = this.tempCode + 1;
                    this.categoryCode = this.data.item.categoryCode + "." + "M"+ this.categoryHierarchyId;
                    // this.categoryCode = this.data.item.categoryCode + "."+ "M" + this.tempCode + 1;
                    this.parentId = this.data.item.id;
                    this.level = 4;
                    this.isEdit = true;

                })
            }
            if(this.data.item.level === 4){
                this._componentCategoryService.getComponentCategoryHierarchyLastRow()
                .subscribe(res => {
                    // console.log(res)
                    this.tempCode = res.id
                    this.categoryHierarchyId = this.tempCode + 1;
                    this.categoryCode = this.data.item.categoryCode + "." + "M"+ this.categoryHierarchyId;
                    // this.categoryCode = this.data.item.categoryCode + "."+ "M" + this.tempCode + 1;
                    this.parentId = this.data.item.id;
                    this.level = 5;
                    this.isEdit = true;

                })
            }
            // if(this.data.item.level === 5){
            //     this._componentCategoryService.getComponentCategoryHierarchyLastRow()
            //     .subscribe(res => {
            //         // console.log(res)
            //         this.tempCode = res.id
            //         this.categoryHierarchyId = this.tempCode + 1;
            //         this.categoryCode = this.data.item.categoryCode + "." + "M"+ this.categoryHierarchyId;
            //         // this.categoryCode = this.data.item.categoryCode + "."+ "M" + this.tempCode + 1;
            //         this.parentId = this.data.item.id;
            //         this.level = 6;
            //         this.isEdit = true;

            //     })
            // }
        }else if(this.data.mode === 'add1'){
            // console.log(this.data.item.level)
            // this.categoryHierarchyId = this.data.item.id + 1;
            this._componentCategoryService.getComponentCategoryHierarchyLastRow()
                .subscribe(res => {
                    this.tempCode = res.id
                    this.categoryHierarchyId = this.tempCode + 1;
                    this.categoryCode = "M"+ this.categoryHierarchyId;
                    // this.categoryCode = "M"+ this.tempCode + 1;
                    this.level = 1;
                    this.parentId = null;
                    this.isEdit = false;

                })
        }
    }

    close(): void {
        this.dialogRef.close();
    }

    onKeyUp(event){
        this.category = event.target.value;
    }

    saveChanges(): void{
        this.categoryHierarchyObject.categoryName = this.category;
        this.categoryHierarchyObject.level = this.level;
        this.categoryHierarchyObject.categoryCode = this.categoryCode;
        this.categoryHierarchyObject.parentId = this.parentId;

        this._componentCategoryService.addCategoryHierarchy(this.categoryHierarchyObject)
            .subscribe(res => {
                this.toastr.success("Successfully saved!", 'Success');
                this.close();
            });
    }

    updateChanges(): void{
        this.categoryHierarchyObject.categoryName = this.category;
        this.categoryHierarchyObject.level = this.level;
        this.categoryHierarchyObject.categoryCode = this.categoryCode;
        this.categoryHierarchyObject.parentId = this.parentId;
        this.categoryHierarchyObject.id = this.currentId

        this._componentCategoryService.updateCategoryHierarchyTaxonomy(this.categoryHierarchyObject.id, this.categoryHierarchyObject)
            .subscribe(res => {
                this.toastr.success('Successfully updated!', 'Success!');
                
                this.close();
            });
    }

}
