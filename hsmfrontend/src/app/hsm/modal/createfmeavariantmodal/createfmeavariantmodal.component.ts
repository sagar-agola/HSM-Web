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
import { ComponentBuildSpecService } from '../../services/componentbuildspec.services';
import { ComponentManufacturerService } from '../../services/componentmanufacturer.services';
import { ComponentFamilyService } from '../../services/componentfamily.services';
import { ComponentClassService } from '../../services/componentclass.services';
import { ComponentSubClassService } from '../../services/componentsubclass.services';
import { IComponentHierarchy } from '../../interfaces/IComponentHierarchy';
import { CategoryHierarchyService } from '../../services/categoryhierarchy.services';
import { AssetHierarchyManufacturerService } from '../../services/assethierarchymanufacturer.services';
import { ComponentVariantService } from '../../services/componentvariant.services';
import { IFMEA } from '../../interfaces/IFMEA';
import { fmeaDefault } from 'src/app/shared/helpers/default.helpers';
import { FMEAService } from '../../services/fmea.services';

@Component({
  selector: 'create-fmea-variant-modal',
  templateUrl: './createfmeavariantmodal.component.html',
  styleUrls: ['./createfmeavariantmodal.component.scss']
})

export class CreateFMEAVariantModalComponent implements OnInit {

    dataSource2;

    fmeaObject: IFMEA = fmeaDefault();
    
    taxonomyFamilyList: any[] = [];
    taxonomyClassList: any[] = [];
    taxonomySubClassList: any[] = [];
    taxonomyBuildSpecList: any[] = [];
    taxonomyManufacturerList: any[] = [];
    componentVariantList: any[] = [];

    classDisabled: boolean = true;
    typeDisabled: boolean = true;

    isTaxonomy: boolean = false;
    isHierarchy: boolean = false;

    taxonomy = false;
    hierarchy = false;

    assetCode: string = "";

    familyName: string = "";
    className: string = "";
    subClassName: string = "";
    buildSpecName: string = "";
    manufacturerName: string = "";
    categoryName: string = "";
    assetClassType: string = "";
    totalCount: number;

    familyId: number;
    classId: number;
    subClassId: number;
    buildSpecId: number;
    manufacturerId: number;
    variantId: number;
    currentId: number;
    variantName: string = "";
    variantCode: string = "";

    //NG MODELS
    user: string = "";
    fmeaid: number;
    componentHierarchyCode: string = "";
    assetHierarchyCode: string ="";
    taxonomyDescription: string ="";
    componentTypeId: number;
    subComponentTypeId: number;
    taskIdentificationNo: string = "";
    variantIdentificationNo: string = "";
    componentTaskFunction: string = "";
    failureMode: string = "";
    failureEffect: string ="";
    failureCause: string = "";
    endEffect: string ="";
    taskDescription: string ="";
    acceptableLimits: string ="";
    correctiveActions: string ="";
    taskTypeId: number;
    operationalModeId: number;
    failureRiskScore1: number;
    failureRiskScore2: number;
    failureRiskScore3: number;
    failureRiskScore4: number;
    failureRiskTotalScore: number = 0;
    intervalId: number;
    durationId: number;
    resourceQuantity: string;
    tradeTypeId: number;
    variantid: number;
    updatedBy: string = "";
    dtCreated: any;
    dtUpdated: any;
    status: number;

    componentLevel1Id: number;
    componentLevel2Id: number;
    componentLevel3Id: number;
    componentLevel4Id: number;

    assetHierarchyId: number;
    componentHierarchyId: number;

    componentName: string = "";
    comment: string = "";

    categoryHierarchyObject: IComponentHierarchy = {
        id: 0,
        parentId: 0,
        categoryCode: '',
        level: 0,
        categoryName: '',
        familyTaxonomyId: 0,
        classTaxonomyId: 0,
        subClassTaxonomyId: 0,
        buildSpecTaxonomyId: 0,
        manufacturerIdTaxonomyId: 0
      }
    
      taskNo: number = 0;
      tempNo: number = 0;
      variantTaskNo: string = "";

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<CreateFMEAVariantModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _tempHierarchyService: TempHierarchyService,
        private _famnilyTaxonomyService: ComponentFamilyService,
        private _classTaxonomyService: ComponentClassService,
        private _subClassTaxonomyService: ComponentSubClassService,
        private _buildSpecTaxonomyService: ComponentBuildSpecService,
        private _manufacturerTaxonomyService: AssetHierarchyManufacturerService,
        private _categoryHierarchyService: CategoryHierarchyService,
        private _componentVariantService: ComponentVariantService,
        private _fmeaService: FMEAService) {
        
    }

    ngOnInit(): void {
        this.user = localStorage.getItem("loggUser");
        this.data = this._dataService.getData();

        // console.log(this.data.item)

        this._fmeaService.getFMEALastNumber()
          .subscribe(out => {
            this.taskNo = Number(out.lastId);

            // console.log(this.taskNo+1)
            this.tempNo = this.taskNo+1
            
            if(this.taskNo === 9){
                this.variantTaskNo = "0000000" + this.tempNo;
            }

            if(this.taskNo >= 99){
                this.variantTaskNo = "000000" + this.tempNo;
            }

            if(this.taskNo >= 999){
                this.variantTaskNo = "00000" + this.tempNo;
            }

            if(this.taskNo >= 9999){
                this.variantTaskNo = "0000" + this.tempNo;
            }

            if(this.taskNo >= 99999){
                this.variantTaskNo = "000" + this.tempNo; 
            }

            if(this.taskNo >= 999999){
                this.variantTaskNo = "00"  + this.tempNo;
            }
            if(this.taskNo >= 9999999){
                this.variantTaskNo = "0"  + this.tempNo;
            }
            if(this.taskNo >= 99999999){
                this.variantTaskNo = "" + this.tempNo;
            }
            if(this.taskNo <= 9){
                this.variantTaskNo = "00000000"   + this.tempNo;
            }
        });

        this.componentHierarchyId = this.data.item.componentHierarchyId;
        this.assetClassType = this.data.item.systemDescription;
        this.componentLevel1Id = this.data.item.componentLevel1Id;
        this.componentLevel2Id = this.data.item.componentLevel2Id;
        this.componentLevel3Id = this.data.item.componentLevel3Id;
        this.componentLevel4Id = this.data.item.componentLevel4Id;
        this.taskIdentificationNo = this.data.item.taskIdentificationNo;
        this.componentTaskFunction = this.data.item.componentTaskFunction;
        this.failureMode = this.data.item.failureMode;
        this.failureEffect = this.data.item.failureEffect;
        this.failureCause = this.data.item.failureCause;
        this.endEffect = this.data.item.endEffect;
        this.taskDescription = this.data.item.taskDescription;
        this.acceptableLimits = this.data.item.acceptableLimits;
        this.correctiveActions = this.data.item.correctiveActions;
        this.taskTypeId = this.data.item.taskTypeId;
        this.operationalModeId = this.data.item.operationalModeId;
        this.failureRiskTotalScore = this.data.item.failureRiskTotalScore;
        this.intervalId = this.data.item.intervalId;
        this.durationId = this.data.item.durationId;
        this.resourceQuantity = this.data.item.resourceQuantity;
        this.tradeTypeId = this.data.item.tradeTypeId;
        this.familyId = this.data.item.familyTaxonomyId;
        this.classId = this.data.item.classTaxonomyId;
        this.subClassId = this.data.item.subClassTaxonomyId;
        this.buildSpecId = this.data.item.buildSpecTaxonomyId;
        this.manufacturerId = this.data.item.manufacturerTaxonomyId;
        this.variantid = this.data.item.variantId;
        this.fmeaid = this.data.item.id;
        this.dtCreated = this.data.item.dtCreated;
        this.status = this.data.item.systemStatus;
        // console.log(this.fmeaid)

        forkJoin(
            this._componentVariantService.getComponentVariants(),
            ).subscribe(([cv]) => {
                // console.log(cv)
                this.componentVariantList = cv;
            });
    }

    initializeComponentData(data: IComponentHierarchy): void{
        this.categoryHierarchyObject = data;
    }

    variantOnSelect(event){
        this.variantId = parseInt(event.target.value);

        // console.log(this.variantId);

        if(this.variantId === 1){
            this.variantIdentificationNo = "MFT";
            // console.log(this.variantIdentificationNo)
        }
        if(this.variantId === 2){
            this.variantIdentificationNo = "AVT";
        }
        if(this.variantId === 3){
            this.variantIdentificationNo = "MVT";
        }       
        
        if(this.variantId === 4){
            this.variantIdentificationNo = "EVT";
        }
    }

    nodeClick(node: any){
        console.log(node);
    }

    saveChanges(){
        this.fmeaObject.componentHierarchyId = this.componentHierarchyId;
        this.fmeaObject.systemDescription = this.assetClassType;
        this.fmeaObject.componentLevel1Id = this.componentLevel1Id;
        // this.fmeaObject.componentLevel2Id = this.componentLevel2Id;
        // this.fmeaObject.componentLevel3Id = this.componentLevel3Id;
        // this.fmeaObject.componentLevel4Id = this.componentLevel4Id;
        this.fmeaObject.componentTaskFunction = this.componentTaskFunction;
        this.fmeaObject.failureMode = this.failureMode;
        this.fmeaObject.failureEffect = this.failureEffect;
        this.fmeaObject.failureCause = this.failureCause;
        this.fmeaObject.endEffect = this.endEffect;
        this.fmeaObject.taskDescription = this.taskDescription;
        this.fmeaObject.acceptableLimits = this.acceptableLimits;
        this.fmeaObject.correctiveActions = this.correctiveActions;
        this.fmeaObject.taskTypeId = this.taskTypeId;
        this.fmeaObject.operationalModeId = this.operationalModeId;
        this.fmeaObject.failureRiskTotalScore = this.failureRiskTotalScore;
        this.fmeaObject.intervalId = this.intervalId;
        this.fmeaObject.durationId = this.durationId;
        this.fmeaObject.resourceQuantity = this.resourceQuantity;
        this.fmeaObject.tradeTypeId = this.tradeTypeId;
        this.fmeaObject.origIndic = 2;
        this.fmeaObject.parentCode = this.taskIdentificationNo;
        this.fmeaObject.familyTaxonomyId = this.familyId;
        this.fmeaObject.classTaxonomyId = this.classId;
        this.fmeaObject.subClassTaxonomyId = this.subClassId;
        this.fmeaObject.buildSpecTaxonomyId = this.buildSpecId;
        this.fmeaObject.manufacturerTaxonomyId = this.manufacturerId;
        this.fmeaObject.taskIdentificationNo = this.variantIdentificationNo;
        this.fmeaObject.variantId = this.variantId;
        this.fmeaObject.comment = this.comment;
        this.fmeaObject.createdBy = this.user;
        this.fmeaObject.updatedBy = this.user;
        this.fmeaObject.dtCreated = this.dtCreated;
        this.fmeaObject.systemStatus = this.status;
  
        this._fmeaService.addFMEA(this.fmeaObject)
            .subscribe(res =>{
                // console.log(res);
                // console.log(this.variantId)                

                this.fmeaObject.id = res.id;

                this.fmeaObject.taskIdentificationNo = this.fmeaObject.taskIdentificationNo + '.' + this.variantTaskNo;

                this._fmeaService.updateFMEARecords(this.fmeaObject.id, this.fmeaObject)
                    .subscribe(out => {
                        this.toastr.success("Variant successfully created!", 'Success');
  
                    });
            });

            this.close();
      }

    close(): void {
        this.dialogRef.close();
    }
}
