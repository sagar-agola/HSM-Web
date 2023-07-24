import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';
import { CreateNewFMEAHierarchyModalComponent } from '../createfmeahierarchymodal/createfmeahierarchymodal.component';

//Services
import { TaxonomyCategoryService } from '../../services/taxonomycategory.services';
import { TaxonomyClassService} from '../../services/taxonomyclass.services';
import { TaxonomyTypeService} from '../../services/taxonomytype.services';

//interface
import { ITaxonomyCategory } from './../../interfaces/ITaxonomyCategory';
import { ITaxonomyClass } from './../../interfaces/ITaxonomyClass';
import { ITaxonomyType } from './../../interfaces/ITaxonomyType';
import { NestedTreeControl } from '@angular/cdk/tree';
import { IAssetHierarchy } from '../../interfaces/IAssetHierarchy';
import { TempHierarchyService } from '../../services/temphierarchy.services';

@Component({
  selector: 'taxonomy-modal',
  templateUrl: './taxonomymodal.component.html',
  styleUrls: ['./taxonomymodal.component.scss']
})

export class TaxonomyModalComponent implements OnInit {
    public data: [];

    dataSource2;

    taxonomyCategoryList: any[] = [];
    taxonomyClassList: any[] = [];
    taxonomyTypeList: any[] = [];

    taxonomyCategoryObject: ITaxonomyCategory;
    taxonomyClassObject: ITaxonomyClass;
    taxonomyTypeObject: ITaxonomyType;

    classDisabled: boolean = true;
    typeDisabled: boolean = true;

    isTaxonomy: boolean = false;
    isHierarchy: boolean = false;

    taxonomy = false;
    hierarchy = false;

    assetCode: string = "";

    categoryName: string = "";
    className: string = "";
    typeName: string = "";
    totalCount: number;

    optionString: string;

    options: string[] = ['Taxonomy', 'Asset Hierarchy'];

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<TaxonomyModalComponent>,
        @Inject(MAT_DIALOG_DATA) public node: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _tempHierarchyService: TempHierarchyService,
        private _taxonomyCategoryService: TaxonomyCategoryService,
        private _taxonomyClassService: TaxonomyClassService,
        private _taxonomyTypeService: TaxonomyTypeService,) {
        
    }
    
    ngOnInit(): void {
        forkJoin(
            this._taxonomyCategoryService.getTaxonomyCategory(),
            this._taxonomyClassService.getTaxonomyClass(),
            this._taxonomyTypeService.getTaxonomyType(),
            ).subscribe(([ct, cl, tp]) => {
                this.taxonomyCategoryList = ct;
                this.taxonomyClassList = cl;
                this.taxonomyTypeList = tp;
            });
    }

    categoryOnselect(event){
        this.classDisabled = false;

        this._taxonomyClassService.getTaxonomyClassByCategory(event.target.value)
            .subscribe(res => {
                this.taxonomyClassList = res;
                this._taxonomyCategoryService.getTaxonomyCategoryById(event.target.value)
                    .subscribe(out => {
                        this.taxonomyCategoryObject = out;
                    });
            });

        this._taxonomyTypeService.getTaxonomyTypeByCategory(event.target.value)
            .subscribe(res => {
                this.taxonomyTypeList = res;
            });
    }

    classOnselect(event){
        this.typeDisabled = false;

        this._taxonomyTypeService.getTaxonomyTypeByClass(event.target.value)
            .subscribe(res => {
                this.taxonomyTypeList = res;
                this._taxonomyClassService.getTaxonomyClassById(event.target.value)
                    .subscribe(out => {
                        this.taxonomyClassObject = out;
                    });
            });
    }

    typeOnSelect(event){
        this._taxonomyTypeService.getTaxonomyTypeById(event.target.value)
            .subscribe(res => {
                this.taxonomyTypeObject = res;
            });
    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges():void{
        localStorage.setItem("taxcategoryobject", JSON.stringify(this.taxonomyCategoryObject));
        localStorage.setItem("taxclassobject", JSON.stringify(this.taxonomyClassObject));
        localStorage.setItem("taxctypeobject", JSON.stringify(this.taxonomyTypeObject));
        this.close();
    }

    goToFMEAForm(): void{
        localStorage.setItem("componentName", this.categoryName);
        localStorage.setItem("assetName", this.assetCode);
        this.close();
        this.router.navigate(["/main/fmea-form"]);
    }
}
