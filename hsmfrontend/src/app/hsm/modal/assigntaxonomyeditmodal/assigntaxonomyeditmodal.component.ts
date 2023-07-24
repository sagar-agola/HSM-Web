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
import { ITempHierarchy } from '../../interfaces/ITempHierarchy';

interface RootObject {
    hierarchy: AssetHierarchy[];
  }
  
  interface AssetHierarchy {
    Code: string;
    Description: string;  
    Children?: AssetHierarchy[];
  }
  
  interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
  }

@Component({
  selector: 'assign-taxonomy-edit-modal',
  templateUrl: './assigntaxonomyeditmodal.component.html',
  styleUrls: ['./assigntaxonomyeditmodal.component.scss']
})

export class AssignTaxonomyEditModalComponent implements OnInit {

    taxonomyCategoryList: any[] = [];
    taxonomyClassList: any[] = [];
    taxonomyTypeList: any[] = [];

    taxonomyCategoryObject: ITaxonomyCategory;
    taxonomyClassObject: ITaxonomyClass;
    taxonomyTypeObject: ITaxonomyType;

    assetHierarchyObject: ITempHierarchy = {
        id: 0,
        parentId: 0,
        code: '',
        level: 0,
        description: '',
        constType: '',
        mainWorkCtr: '',
        plannerGroup: '',
        planningPlant: '',
        maintenancePlant: '',
        costCenter: '',
        sortField: '',
        supFuncLoc: '',
        objectType: '',
        systemStatus: '',
        createdOn: '',
        abcindicator: '',
        abcindicatorOrig: '',
        industryId: 0,
        businessTypeId: 0,
        assetTypeId: 0,
        processFunctionId: 0,
        classId: 0,
        specId: 0,
        familyId: 0,
        manufacturerId: 0
    }

    classDisabled: boolean = true;
    typeDisabled: boolean = true;

    isTaxonomy: boolean = false;
    isHierarchy: boolean = false;

    taxonomy = false;
    hierarchy = false;

    assetCode: string = "";
    code: string = "";

    categoryName: string = "";
    className: string = "";
    typeName: string = "";
    totalCount: number;

    categoryId: number;
    typeId: number;
    currentId: number;

    classId: number;
    specId: number;
    familyId: number;
    manufacturerId: number;

    optionString: string;

    options: string[] = ['Taxonomy', 'Asset Hierarchy'];

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AssignTaxonomyEditModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _tempHierarchyService: TempHierarchyService,
        private _taxonomyCategoryService: TaxonomyCategoryService,
        private _taxonomyClassService: TaxonomyClassService,
        private _taxonomyTypeService: TaxonomyTypeService,) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();
        // this.dataObject = this._dataService.getData();
        this.currentId = this.data;
        // console.log(this.currentId);
        this.hierarchy = true;
        this.isHierarchy = true;

        forkJoin(
            this._taxonomyCategoryService.getTaxonomyCategory(),
            this._taxonomyClassService.getTaxonomyClass(),
            this._taxonomyTypeService.getTaxonomyType(),
            this._tempHierarchyService.getTempHierarchyById(this.currentId)
            ).subscribe(([ct, cl, tp, tb]) => {
                this.taxonomyCategoryList = ct;
                this.taxonomyClassList = cl;
                this.taxonomyTypeList = tp;
                console.log(tb);
                this.initializeFieldData(tb);
            });
    }

    initializeFieldData(data: ITempHierarchy): void {
        this.assetHierarchyObject = data;

        this.classId = data.classId;
        this.specId = data.specId;
        this.familyId = data.familyId;
        this.manufacturerId = data.manufacturerId;
    }

    categoryOnselect(event){
        this.classDisabled = false;

        console.log(event.target.value);
        this.categoryId = event.target.value;

        this._taxonomyClassService.getTaxonomyClassByCategory(event.target.value)
            .subscribe(res => {
                this.taxonomyClassList = res;
            });

        this._taxonomyTypeService.getTaxonomyTypeByCategory(event.target.value)
            .subscribe(res => {
                this.taxonomyTypeList = res;
            });
    }

    classOnselect(event){
        this.typeDisabled = false;

        console.log(event.target.value);

        this.classId = event.target.value;

        this._taxonomyTypeService.getTaxonomyTypeByClass(event.target.value)
            .subscribe(res => {
                this.taxonomyTypeList = res;
            });
    }

    typeOSelect(event){
        console.log(event.target.value);

        this.typeId = event.target.value;
    }

    Assign(): void{
        this.assetHierarchyObject.classId = this.classId;
        this.assetHierarchyObject.specId = this.specId;
        this.assetHierarchyObject.familyId = this.familyId;
        this.assetHierarchyObject.manufacturerId = this.manufacturerId;
        // this._tempHierarchyService.updateTaxonomyHierarchy(this.categoryId, this.classId, this.typeId, this.code)
        //     .subscribe(res => {
        //         console.log("success");
        //     });
        this._tempHierarchyService.updateTempHierarchy(this.currentId, this.assetHierarchyObject)
            .subscribe(res => {
                console.log("success");
            });

        this.close();
    }

    close(): void {
        this.dialogRef.close();
    }
}
