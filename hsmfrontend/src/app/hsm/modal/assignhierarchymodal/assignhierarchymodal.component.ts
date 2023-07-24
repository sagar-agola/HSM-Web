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
import { AssetHierarchyIndustryService } from '../../services/assethierarchyindustry.services';
import { AssetHierarchyBusinessTypeService } from '../../services/assethierarchybusinesstype.services';
import { AssetHierarchyAssetTypeService } from '../../services/assethierarchyassettype.services';
import { AssetHierarchyProcessFunctionService } from '../../services/assethierarchyprocessfunction.services';


@Component({
  selector: 'assign-hierarchy-modal',
  templateUrl: './assignhierarchymodal.component.html',
  styleUrls: ['./assignhierarchymodal.component.scss']
})

export class AssignHierarchyModalComponent implements OnInit {

    industryList: any[] = [];
    businessTypeList: any[] = [];
    assetTypeList: any[] = [];
    processFunctionList: any[] = [];
    taxonomyIdList: ITaxonomyIdList [] = [];

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
    classId: number;
    typeId: number;
    currentId: number;

    industryId: number;
    businessTypeId: number;
    assetTypeId: number;
    processFunctionId: number;

    optionString: string;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AssignHierarchyModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _tempHierarchyService: TempHierarchyService,
        private _industryService: AssetHierarchyIndustryService,
        private _businessTypeService: AssetHierarchyBusinessTypeService,
        private _assetTypeService: AssetHierarchyAssetTypeService,
        private _processFuntionService: AssetHierarchyProcessFunctionService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();
        // this.dataObject = this._dataService.getData();
        // this.currentId = this.data;
        // console.log(this.data);
        this.taxonomyIdList  = this.data;
        this.hierarchy = true;
        this.isHierarchy = true;

        forkJoin(
            this._industryService.getAssetIndustry(),
            this._businessTypeService.getAssetBusinessType(),
            this._assetTypeService.getAssetType(),
            this._processFuntionService.getProcessFunction(),
            // this._tempHierarchyService.getTempHierarchyById(this.currentId)
            ).subscribe(([ct, ft, st, mt]) => {
                this.industryList = ct;
                this.businessTypeList = ft;
                this.assetTypeList = st;
                this.processFunctionList = mt
                // console.log(tb);
                // this.initializeFieldData(tb);
            });
    }

    initializeFieldData(data: ITempHierarchy): void {
        this.assetHierarchyObject = data;
    }

    industryOnSelect(event){

        // console.log(event.target.value);
        this.industryId = event.target.value;
    }

    businessTypeOnSelect(event){

        // console.log(event.target.value);

        this.businessTypeId = event.target.value;
    }

    assetTypeOnSelect(event){
        // console.log(event.target.value);

        this.assetTypeId = event.target.value;
    }

    processOnSelect(event){
        // console.log(event.target.value);

        this.processFunctionId = event.target.value;
    }


    Assign(): void{

        this.taxonomyIdList.forEach(x => {
            let currentid = x.id

            this._tempHierarchyService.getTempHierarchyById(currentid)
                .subscribe(y => {
                    this.assetHierarchyObject = y;

                    this.assetHierarchyObject.industryId = this.industryId;
                    this.assetHierarchyObject.businessTypeId = this.businessTypeId;
                    this.assetHierarchyObject.assetTypeId = this.assetTypeId;
                    this.assetHierarchyObject.processFunctionId = this.processFunctionId;

                    this._tempHierarchyService.updateTempHierarchy(this.assetHierarchyObject.id, this.assetHierarchyObject)
                        .subscribe(res => {
                            console.log("success");
                        });
                });
            // console.log(currentid);
            });

            this.close();
            setTimeout(()=>{
                this.toastr.success('Assigned hierarchy successfully', 'Success!');
            }, 1000);
    }

    close(): void {
        this.dialogRef.close();
    }
}
