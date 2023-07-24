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
import { ICategoryHierarchySite } from '../../interfaces/ICategoryHierarchySite';
import { CategoryHierarchySiteService } from '../../services/categoryhierarchysite.services';

@Component({
  selector: 'create-component-site-modal',
  templateUrl: './createcomponentsitemodal.component.html',
  styleUrls: ['./createcomponentsitemodal.component.scss']
})

export class CreateComponentSiteModalComponent implements OnInit {
    mode: string = "";
    category: string = "";
    currentId: number;
    categoryHierarchyId: number;
    categoryCode: string="";
    level: number;
    parentId: number;
    tempCode: number = 0;
    siteId: number = 0;
    customerId: number = 0;

    taxCategoryObject: ITaxonomyCategory = {
        id: 0,
        categoryName: ''
    };

    categoryHierarchySiteObject: ICategoryHierarchySite = {
        id: 0,
        parentId: null,
        categoryCode: '',
        level: 0,
        categoryName: '',
        siteId: 0,
        customerId: 0
    }

    isEdit: boolean= false;
    isLevel1: boolean = false;
    isLevel2: boolean = false;
    isLevel3: boolean = false;
    isLevel4: boolean = false;
    isHSMUser: boolean = false;
    isAdmin: boolean = false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<CreateComponentSiteModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _categoryService: ComTaxonomyCategoryService,
        private _categoryHierarchySiteService: CategoryHierarchySiteService) {
            const user = JSON.parse(localStorage.currentUser);
            this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
            // console.log(user);
            this.isAdmin = user?.users?.isAdmin;
            this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
            this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        console.log(this.data)

        if(this.data.mode === 'add2'){

            if(this.data.item.level === 1){
                this._categoryHierarchySiteService.getComponentCategoryHierarchySiteLastCode()
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
                this._categoryHierarchySiteService.getComponentCategoryHierarchySiteLastCode()
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
                this._categoryHierarchySiteService.getComponentCategoryHierarchySiteLastCode()
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
        }else{
            // console.log(this.data.item.level)
            // this.categoryHierarchyId = this.data.item.id + 1;
            this._categoryHierarchySiteService.getComponentCategoryHierarchySiteLastCode()
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

    saveChanges(): void{
        this.categoryHierarchySiteObject.categoryName = this.category;
        this.categoryHierarchySiteObject.level = this.level;
        this.categoryHierarchySiteObject.categoryCode = this.categoryCode;
        this.categoryHierarchySiteObject.siteId = this.siteId;
        this.categoryHierarchySiteObject.customerId = this.customerId;

        this._categoryHierarchySiteService.addCategoryHierarchySite(this.categoryHierarchySiteObject)
            .subscribe(res => {
                this.toastr.success("Successfully saved!", 'Success');
                this.close();
            });
    }

    updateChanges(): void{
        this.categoryHierarchySiteObject.categoryName = this.category;
        this.categoryHierarchySiteObject.level = this.level;
        this.categoryHierarchySiteObject.categoryCode = this.categoryCode;
        this.categoryHierarchySiteObject.parentId = this.parentId;
        this.categoryHierarchySiteObject.siteId = this.siteId;
        this.categoryHierarchySiteObject.customerId = this.customerId;

        this._categoryHierarchySiteService.addCategoryHierarchySite(this.categoryHierarchySiteObject)
            .subscribe(res => {
                this.toastr.success('Successfully saved!', 'Success!');

                this.close();
            });
    }

}
