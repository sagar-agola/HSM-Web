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
import { ITaxonomyIdList, ITempHierarchy } from '../../interfaces/ITempHierarchy';
import { AssetHierarchyManufacturerService } from '../../services/assethierarchymanufacturer.services';
import { AssetHierarchyClassTaxonomyService } from '../../services/assethierarchyclasstaxonomy.services';
import { AssetHierarchySpecService } from '../../services/assethierarchyspec.services';
import { AssetHierarchyFamilyService } from '../../services/assethierarchyfamily.services';

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
  selector: 'assign-taxonomy-modal',
  templateUrl: './assigntaxonomymodal.component.html',
  styleUrls: ['./assigntaxonomymodal.component.scss']
})

export class AssignTaxonomyModalComponent implements OnInit {

    taxonomyClassList: any[] = [];
    taxonomySpecList: any[] = [];
    taxonomyFamilyList: any[] = [];
    taxonomyManufacturerList: any[] = [];
    taxonomyIdList: ITaxonomyIdList [] = [];

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
        public dialogRef: MatDialogRef<AssignTaxonomyModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _tempHierarchyService: TempHierarchyService,
        private _taxonomyClassService: AssetHierarchyClassTaxonomyService,
        private _taxonomySpecService: AssetHierarchySpecService,
        private _taxonomyFamilyService: AssetHierarchyFamilyService,
        private _taxonomyManufacturerService: AssetHierarchyManufacturerService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();
        // this.dataObject = this._dataService.getData();
        // this.currentId = this.data;
        console.log(this.data);
        this.taxonomyIdList  = this.data;
        this.hierarchy = true;
        this.isHierarchy = true;

        forkJoin(
            this._taxonomyClassService.getAssetClassTaxonomy(),
            this._taxonomyFamilyService.getAssetFamilyTaxonomy(),
            this._taxonomySpecService.getSpecTaxonomy(),
            this._taxonomyManufacturerService.getAssetManufacturer(),
            // this._tempHierarchyService.getTempHierarchyById(this.currentId)
            ).subscribe(([ct, ft, st, mt]) => {
                this.taxonomyClassList = ct;
                this.taxonomyFamilyList = ft;
                this.taxonomySpecList = st;
                this.taxonomyManufacturerList = mt
                // console.log(tb);
                // this.initializeFieldData(tb);
            });
    }

    initializeFieldData(data: ITempHierarchy): void {
        this.assetHierarchyObject = data;
    }

    classOnselect(event){

        // console.log(event.target.value);

        this.classId = event.target.value;
    }

    specOnSelect(event){
        // console.log(event.target.value);

        this.specId = event.target.value;
    }

    familyOnSelect(event){
        this.familyId = event.target.value;
    }

    manufactureOnSelect(event){
        this.manufacturerId = event.target.value;
    }

    Assign(): void{

        this.taxonomyIdList.forEach(x => {
            let currentid = x.id

            this._tempHierarchyService.getTempHierarchyById(currentid)
                .subscribe(y => {
                    this.assetHierarchyObject = y;

                    this.assetHierarchyObject.classId = this.classId;
                    this.assetHierarchyObject.specId = this.specId;
                    this.assetHierarchyObject.familyId = this.familyId;
                    this.assetHierarchyObject.manufacturerId = this.manufacturerId;

                    this._tempHierarchyService.updateTempHierarchy(this.assetHierarchyObject.id, this.assetHierarchyObject)
                        .subscribe(res => {
                            console.log("success");
                        });
                });
            // console.log(currentid);
            });

            this.close();
            setTimeout(()=>{
                this.toastr.success('Assigned Taxonomy successfully', 'Success!');
            }, 1000);
    }

    close(): void {
        this.dialogRef.close();
    }
}
