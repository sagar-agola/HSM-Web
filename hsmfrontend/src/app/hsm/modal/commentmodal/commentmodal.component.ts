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
import { IFMEA, IFmeaAssembly, IFmeaSiteAssembly, IFMUFTSite } from '../../interfaces/IFMEA';
import { fmeaAssemblyDefault, fmeaDefault, fmeaSiteAssemblyDefault, fmuftSiteDefault } from 'src/app/shared/helpers/default.helpers';
import { FMEAService } from '../../services/fmea.services';
import { IAssetTaskGroupStrategyHsm } from '../../interfaces/IAssetTaskGroupStrategy';
import { AssignAssetTaskGroupStrategyMaterialHsmService } from '../../services/assignassettaskgroupstrategymaterialhsm.services';
import { AssetTaskGroupStrategyHsmService } from '../../services/assettaskgroupstrategyhsm.services';
import { FmeaAssemblyService } from '../../services/fmeaassembly.services';
import { IAssignGroupToUser } from '../../interfaces/IAssignGroupToUser';
import { AssignGroupToUserService } from '../../services/assigngrouptouser.services';
import { FMaintainableUnitService } from '../../services/fmaintainableunitsite.services';
import { FmeaSiteService } from '../../services/fmeasite.services';
import { CustomerService } from '../../services/customer.services';
import { SitesService } from '../../services/sites.services';

@Component({
  selector: 'comment-modal',
  templateUrl: './commentmodal.component.html',
  styleUrls: ['./commentmodal.component.scss']
})

export class CommentModalComponent implements OnInit {

    dataSource2;

    fmeaObject: IFMEA = fmeaDefault();
    fmeaVariantObject: IFMEA = fmeaDefault();
    fmmtObject: IFmeaAssembly = fmeaAssemblyDefault();
    fmmtSiteObject: IFmeaSiteAssembly = fmeaSiteAssemblyDefault();
    fmuftObject: IFMUFTSite = fmuftSiteDefault();
    assignToUserObject: IAssignGroupToUser = {
        id: 0,
        transactionId: 0,
        transactionTypeId: 0,
        userPermissionGroupId: 0,
        userId: 0,
        status: 0,
        isActive: true
    };

    assetTaskGroupStrategyObject: IAssetTaskGroupStrategyHsm = {
        id: 0,
        taskGroupStrategyId: '',
        taskGroupDescription: '',
        frequencyId: 0,
        tradeTypeId: 0,
        operationalModeId: 0,
        durationId: 0,
        taskTypeId: 0,
        assetIndustryId: 0,
        businessTypeId: 0,
        assetTypeId: 0,
        processFunctionId: 0,
        assetCategoryId: 0,
        assetClassTaxonomyId: 0,
        assetSpecTaxonomyId: 0,
        assetFamilyTaxonomyId: 0,
        assetManufacturerTaxonomyId: 0,
        componentClassTaxonomyId: 0,
        componentFamilyTaxonomyId: 0,
        componentSubClassTaxonomyId: 0,
        componentBuildSpecTaxonomyId: 0,
        componentManufacturerId: 0,
        assetHierarchyId: 0,
        comment: '',
        createdBy: '',
        updatedBy: '',
        dtCreated: undefined,
        dtUpdated: undefined,
        systemStatus: 0
    };

    commentObject = {
        comment: '',
        customerId: 0,
        siteId: 0
    };
    
    taxonomyFamilyList: any[] = [];
    taxonomyClassList: any[] = [];
    taxonomySubClassList: any[] = [];
    taxonomyBuildSpecList: any[] = [];
    taxonomyManufacturerList: any[] = [];
    componentVariantList: any[] = [];
    materialHsmList: any[] = [];
    fmeavariantsList: any[] = [];
    fmeaAssemblyList: any[] = [];
    customerList: any[] = [];
    siteList: any[] = [];

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

    familyTaxonomyId: number;
    classTaxonomyId: number;
    subClassTaxonomyId: number;
    buildSpecTaxonomyId: number;
    manufacturerTaxonomyId: number;

    //NG MODELS
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
    createdBy: string = "";
    updatedBy: string = "";
    dtCreated: any;
    dtUpdated: any;

    //FMEA Models
    hsmManufacturerId: number;
    hsmBuildSpecId: number;
    hsmSubClassId: number;
    hsmcomponentHierarchyId: number;
    hsmassetClassType: string = "";
    hsmcomponentLevel1Id: number;
    hsmtaskIdentificationNo: string = "";
    hsmcomponentTaskFunction: string = "";
    hsmfailureMode: string = "";
    hsmfailureEffect: string = "";
    hsmfailureCause: string = "";
    hsmendEffect: string = "";
    hsmtaskDescription: string = "";
    hsmacceptableLimits: string = "";
    hsmcorrectiveActions: string = "";
    hsmtaskTypeId: number;
    hsmoperationalModeId: number;
    hsmfailureRiskTotalScore: number;
    hsmintervalId: number;
    hsmdurationId: number;
    hsmresourceQuantity: string = "";
    hsmtradeTypeId: number;
    hsmfamilyId: number;
    hsmclassId: number;
    hsmvariantid: number;
    hsmcreatedBy: string = "";
    hsmupdatedBy: string = "";
    hsmfmeaid: number;
    hsmdtCreated: any;
    hsmdtUpdated: any;
    hsmorigIndic:number;
    hsmparentCode:string = "";
    hsmsystemStatus:number = 0;

    //Asset Class Model
    hsmacManufacturerId: number;
    hsmacBuildSpecId: number;
    hsmacSubClassId: number;
    hsmaccomponentHierarchyId: number;
    hsmacassetClassType: string = "";
    hsmaccomponentLevel1Id: number;
    hsmactaskIdentificationNo: string = "";
    hsmaccomponentTaskFunction: string = "";
    hsmacfailureMode: string = "";
    hsmacfailureEffect: string = "";
    hsmacfailureCause: string = "";
    hsmacendEffect: string = "";
    hsmactaskDescription: string = "";
    hsmacacceptableLimits: string = "";
    hsmaccorrectiveActions: string = "";
    hsmactaskTypeId: number;
    hsmacoperationalModeId: number;
    hsmacfailureRiskTotalScore: number;
    hsmacintervalId: number;
    hsmacdurationId: number;
    hsmacresourceQuantity: string = "";
    hsmactradeTypeId: number;
    hsmacfamilyId: number;
    hsmacclassId: number;
    hsmacvariantid: number;
    hsmaccreatedBy: string = "";
    hsmacupdatedBy: string = "";
    hsmacfmeaid: number;
    hsmacdtCreated: any;
    hsmacdtUpdated: any;
    hsmacorigIndic:number;
    hsmacparentCode:string = "";
    hsmacsystemStatus:number = 0;
    hsmaccategoryId: number = 0;
    hsmacfmmtId: number = 0;

    //TGS Model
    assetIndustryId: number = 0;
    assetBusinessTypeId: number = 0;
    assetTypeId: number = 0;
    assetProcessFunctionId: number = 0;
    assetCategoryId: number = 0;
    assetClassTaxonomyId: number = 0;
    assetClassId: number = 0;
    assetSpecTaxonomyId: number = 0;
    assetFamilyTaxonomyId: number = 0;
    assetManufacturerId: number = 0;
    componentFamilyId: number = 0;
    componentClass: number = 0;
    componentSubClassId: number = 0;
    componentBuildSpecId: number = 0;
    componentManufacturerId: number = 0;
    componentId: number = 0;
    tempTaskId: number;
    frequencyId: number = 0;
    operationalmode: string = ""
    taskGpStrategyId: string = "";
    taskGroupDescription: string = "";
    maintUnitId: number = 0;
    frequency: string = "";
    tradeType: string ="";
    taskType: string = "";
    origIndic: number;
    parentCode: string = "";
    systemStatus: number = 0;

    componentLevel1Id: number;
    componentLevel2Id: number;
    componentLevel3Id: number;
    componentLevel4Id: number;

    assetHierarchyId: number;
    componentHierarchyId: number;

    componentName: string = "";
    comment: string = "";
    isLocked: boolean = false;
    isSave: boolean = false;
    isLockInfo: boolean = false;

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
      siteId: number = 0;
      customerId: number = 0;

      isFmea: boolean = false;
      isSiteFmea: boolean = false;
      isHsmTGS: boolean = false;
      isSiteTGS: boolean = false;
      isEdit: boolean = false;
      isFmeaEdit: boolean = false;
      isAssemblyEdit: boolean = false;
      modalTitle: string = "";
      user: string = "";

      isCustomerSelect: boolean = true;
      isSysAdmin: boolean = false;
      isAdmin: boolean = false;
      isHSMUser: boolean = false;
      hasVariant: boolean = false;

      statusList: any =[
        {
            "name": "Created",
            "value": 1
        },
        {
            "name": "Active",
            "value": 2
        },
        {
            "name": "Inactive",
            "value": 3
        },
        {
            "name": "Approved",
            "value": 4
        },
        {
            "name": "Rejected",
            "value": 5
        }
    ];

    transactionTypeList: any = [
        {
            "name": "Fmea",
            "id": 1
        },
        {
            "name": "SiteFmea",
            "id": 2
        },
        {
            "name": "HsmTGS",
            "id": 3
        },
        {
            "name": "SiteTGS",
            "id": 4
        }
    ];

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<CommentModalComponent>,
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
        private _assignAssetTGSMaterialHsmService: AssignAssetTaskGroupStrategyMaterialHsmService,
        private _assetTaskGroupStrategyHsmService: AssetTaskGroupStrategyHsmService,
        private _fmeaAssemblyService: FmeaAssemblyService,
        private _assignToUserService: AssignGroupToUserService,
        private _fmeaService: FMEAService,
        private _fmuftService: FMaintainableUnitService,
        private fmeaSiteAssemblyService: FmeaSiteService,
        private _customerService: CustomerService,
        private _siteService: SitesService) {
            const user = JSON.parse(localStorage.currentUser);
            this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
            this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
            this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
            // console.log(user);
            this.isAdmin = user?.users?.isAdmin;
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        console.log(this.data)
        this.currentId = parseInt(this.data.id);

        if(this.data.mode === 'HsmFMEA'){
            this.isFmea = true;
            this.modalTitle = 'Why you created this FMEA?'
            this.hsmcomponentHierarchyId = this.data.item.componentHierarchyId;
            this.hsmassetClassType = this.data.item.systemDescription;
            this.hsmcomponentLevel1Id = this.data.item.componentLevel1Id;
            this.hsmtaskIdentificationNo = this.data.item.taskIdentificationNo;
            this.hsmcomponentTaskFunction = this.data.item.componentTaskFunction;
            this.hsmfailureMode = this.data.item.failureMode;
            this.hsmfailureEffect = this.data.item.failureEffect;
            this.hsmfailureCause = this.data.item.failureCause;
            this.hsmendEffect = this.data.item.endEffect;
            this.hsmtaskDescription = this.data.item.taskDescription;
            this.hsmacceptableLimits = this.data.item.acceptableLimits;
            this.hsmcorrectiveActions = this.data.item.correctiveActions;
            this.hsmtaskTypeId = this.data.item.taskTypeId;
            this.hsmoperationalModeId = this.data.item.operationalModeId;
            this.hsmfailureRiskTotalScore = this.data.item.failureRiskTotalScore;
            this.hsmintervalId = this.data.item.intervalId;
            this.hsmdurationId = this.data.item.durationId;
            this.hsmresourceQuantity = this.data.item.resourceQuantity;
            this.hsmtradeTypeId = this.data.item.tradeTypeId;
            this.hsmfamilyId = this.data.item.familyTaxonomyId;
            this.hsmclassId = this.data.item.classTaxonomyId;
            this.hsmSubClassId = this.data.item.subClassTaxonomyId;
            this.hsmBuildSpecId = this.data.item.buildSpecTaxonomyId;
            this.hsmManufacturerId = this.data.item.manufacturerTaxonomyId;
            this.hsmvariantid = this.data.item.variantId;
            this.hsmfmeaid = this.data.item.id;
            this.hsmcreatedBy = this.data.item.createdBy;
            this.hsmupdatedBy = this.data.item.updatedBy;

        }

        if(this.data.mode === 'FmeaEdit'){
            this.isEdit = true;
            this.modalTitle = 'Justify your changes';
            this.hsmacceptableLimits = this.data.item.acceptableLimits;
            this.hsmBuildSpecId = this.data.item.buildSpecTaxonomyId;
            this.hsmclassId = this.data.item.classTaxonomyId;
            this.comment = this.data.item.comment;
            this.hsmcomponentHierarchyId = this.data.item.componentHierarchyId;
            this.hsmcomponentLevel1Id = this.data.item.componentLevel1Id;
            this.hsmcomponentTaskFunction = this.data.item.componentTaskFunction;
            this.hsmcorrectiveActions = this.data.item.correctiveActions;
            this.hsmcreatedBy = this.data.item.createdBy;
            this.hsmdtCreated = this.data.item.dtCreated;
            this.hsmdtUpdated = this.data.item.dtUpdated;
            this.hsmdurationId = this.data.item.durationId;
            this.hsmendEffect = this.data.item.endEffect;
            this.hsmfailureCause = this.data.item.failureCause;
            this.hsmfailureEffect = this.data.item.failureEffect;
            this.hsmfailureMode = this.data.item.failureMode;
            this.hsmfailureRiskTotalScore = this.data.item.failureRiskTotalScore;
            this.hsmfamilyId = this.data.item.familyTaxonomyId;
            this.hsmfmeaid = this.data.item.id;
            this.hsmintervalId = this.data.item.intervalId;
            this.hsmManufacturerId = this.data.item.manufacturerTaxonomyId;
            this.hsmoperationalModeId = this.data.item.operationalModeId;
            this.hsmorigIndic = this.data.item.origIndic;
            this.hsmparentCode = this.data.item.parentCode;
            this.hsmresourceQuantity = this.data.item.resourceQuantity;
            this.hsmSubClassId = this.data.item.subClassTaxonomyId;
            this.hsmassetClassType = this.data.item.systemDescription;
            this.hsmsystemStatus = this.data.item.systemStatus;
            this.hsmtaskDescription = this.data.item.taskDescription;
            this.hsmtaskIdentificationNo = this.data.item.taskIdentificationNo;
            this.hsmtaskTypeId = this.data.item.taskTypeId;
            this.hsmtradeTypeId = this.data.item.tradeTypeId;
            this.hsmupdatedBy = this.data.item.updatedBy;
            this.hsmvariantid = this.data.item.variantId;

            this._fmeaService.getFMEAVariant(this.hsmtaskIdentificationNo)
                .subscribe(result => {
                    // console.log(result);
                    if(result.length >= 1)
                    {
                        console.log("has")
                        this.hasVariant = true;
                    }else{
                        console.log("has not")
                        this.hasVariant = false;
                    }
                });
        }

        if(this.data.mode === 'SiteFMEA'){
            this.isSiteFmea = true;
            this.modalTitle = 'Why you created this FMEA?';
            this.componentHierarchyId = this.data.item.componentHierarchyId;
            this.assetClassType = this.data.item.systemDescription;
            this.componentLevel1Id = this.data.item.componentLevel1Id;
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
            this.createdBy = this.data.item.createdBy;
            this.updatedBy = this.data.item.updatedBy;
            this.siteId = this.data.item.siteId;
            this.customerId = this.data.item.customerId;
        }

        if(this.data.mode === 'SiteFMEAEdit'){
            this.isFmeaEdit = true;
            this.modalTitle = 'Why you created this FMEA?';
            this.componentHierarchyId = this.data.item.componentHierarchyId;
            this.assetClassType = this.data.item.systemDescription;
            this.componentLevel1Id = this.data.item.componentLevel1Id;
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
            this.createdBy = this.data.item.createdBy;
            this.updatedBy = this.data.item.updatedBy;
            this.siteId = this.data.item.siteId;
            this.customerId = this.data.item.customerId;
        }

        if(this.data.mode === 'HSMAssetClassFMEAEdit'){
            this.isAssemblyEdit = true;
            this.modalTitle = 'Justify your changes';
            this.hsmacacceptableLimits = this.data.item.acceptableLimits;
            this.hsmacBuildSpecId = this.data.item.buildSpecTaxonomyId;
            this.hsmacclassId = this.data.item.classTaxonomyId;
            this.comment = this.data.item.comment;
            this.hsmaccomponentHierarchyId = this.data.item.componentHierarchyId;
            this.hsmaccomponentLevel1Id = this.data.item.componentLevel1Id;
            this.hsmaccomponentTaskFunction = this.data.item.componentTaskFunction;
            this.hsmaccorrectiveActions = this.data.item.correctiveActions;
            this.hsmaccreatedBy = this.data.item.createdBy;
            this.hsmacdtCreated = this.data.item.dtCreated;
            this.hsmacdtUpdated = this.data.item.dtUpdated;
            this.hsmacdurationId = this.data.item.durationId;
            this.hsmacendEffect = this.data.item.endEffect;
            this.hsmacfailureCause = this.data.item.failureCause;
            this.hsmacfailureEffect = this.data.item.failureEffect;
            this.hsmacfailureMode = this.data.item.failureMode;
            this.hsmacfailureRiskTotalScore = this.data.item.failureRiskTotalScore;
            this.hsmacfamilyId = this.data.item.familyTaxonomyId;
            this.hsmacfmeaid = this.data.item.id;
            this.hsmacintervalId = this.data.item.intervalId;
            this.hsmacManufacturerId = this.data.item.manufacturerTaxonomyId;
            this.hsmacoperationalModeId = this.data.item.operationalModeId;
            this.hsmacorigIndic = this.data.item.origIndic;
            this.hsmacparentCode = this.data.item.parentCode;
            this.hsmacresourceQuantity = this.data.item.resourceQuantity;
            this.hsmacSubClassId = this.data.item.subClassTaxonomyId;
            this.hsmacassetClassType = this.data.item.systemDescription;
            this.hsmacsystemStatus = this.data.item.systemStatus;
            this.hsmactaskDescription = this.data.item.taskDescription;
            this.hsmactaskIdentificationNo = this.data.item.taskIdentificationNo;
            this.hsmactaskTypeId = this.data.item.taskTypeId;
            this.hsmactradeTypeId = this.data.item.tradeTypeId;
            this.hsmacupdatedBy = this.data.item.updatedBy;
            this.hsmacvariantid = this.data.item.variantId;
            this.hsmaccategoryId = this.data.item.categoryId;
            this.hsmacfmmtId = this.data.item.fmmtId;
            this.hsmacfmeaid = this.data.item.id;
        }

        if(this.data.mode === 'HsmTGS'){
            this.isHsmTGS = true;
            this.modalTitle = 'Why you created this Task Group Strategy?'
            this.assetCategoryId = this.data.item.assetCategoryId;
            this.assetClassId = this.data.item.assetClassTaxonomyId;
            this.assetFamilyTaxonomyId = this.data.item.assetFamilyTaxonomyId;
            this.tempTaskId = this.data.item.assetHierarchyId;
            this.assetIndustryId = this.data.item.assetIndustryId;
            this.assetManufacturerId = this.data.item.assetManufacturerTaxonomyId;
            this.assetSpecTaxonomyId = this.data.item.assetSpecTaxonomyId;
            this.assetTypeId = this.data.item.assetTypeId;
            this.assetBusinessTypeId = this.data.item.businessTypeId;
            this.componentBuildSpecId = this.data.item.componentBuildSpecTaxonomyId;
            this.componentClass = this.data.item.componentClassTaxonomyId;
            this.maintUnitId = this.data.item.componentFamilyTaxonomyId;
            this.componentManufacturerId = this.data.item.componentManufacturerId;
            this.componentSubClassId = this.data.item.componentSubClassTaxonomyId;
            this.durationId = this.data.item.durationId;
            this.frequencyId = this.data.item.frequencyId;
            this.operationalModeId = this.data.item.operationalModeId;
            this.assetProcessFunctionId = this.data.item.processFunctionId;
            this.taskGroupDescription = this.data.item.taskGroupDescription;
            this.taskGpStrategyId = this.data.item.taskGroupStrategyId;
            this.taskTypeId = this.data.item.taskTypeId;
            this.tradeTypeId = this.data.item.tradeTypeId;
        }

        if(this.data.mode === 'SiteTGS'){
            this.isSiteTGS = true;
            this.modalTitle = 'Why you created this Task Group Strategy?'
            
            forkJoin(
                this._customerService.getCustomer(),
                this._customerService.getCustomerById(this.customerId),
                this._siteService.getSitesByCustomerId(this.customerId)
                ).subscribe(([cm, cb, sl,]) => {
                    this.customerList = cm;
                    this.siteList = sl;
                });
        }
    }

    customerOnSelect(event){
        this.customerId = parseInt(event.target.value)
        this.isCustomerSelect = false;

        this._siteService.getSitesByCustomerId(this.customerId)
            .subscribe(res => {
                this.siteList = res;
            })
    }
  
    siteOnSelect(event){
        this.siteId = parseInt(event.target.value);
    }

    saveChanges(){
        this.fmeaObject.componentHierarchyId = this.hsmcomponentHierarchyId;
        this.fmeaObject.systemDescription = this.hsmassetClassType;
        this.fmeaObject.componentLevel1Id = this.hsmcomponentHierarchyId;
        this.fmeaObject.componentTaskFunction = this.hsmcomponentTaskFunction;
        this.fmeaObject.failureMode = this.hsmfailureMode;
        this.fmeaObject.failureEffect = this.hsmfailureEffect;
        this.fmeaObject.failureCause = this.hsmfailureCause;
        this.fmeaObject.endEffect = this.hsmendEffect;
        this.fmeaObject.taskDescription = this.hsmtaskDescription;
        this.fmeaObject.acceptableLimits = this.hsmacceptableLimits;
        this.fmeaObject.correctiveActions = this.hsmcorrectiveActions;
        this.fmeaObject.taskTypeId = this.hsmtaskTypeId;
        this.fmeaObject.operationalModeId = this.hsmoperationalModeId;
        this.fmeaObject.failureRiskTotalScore = this.hsmfailureRiskTotalScore;
        this.fmeaObject.intervalId = this.hsmintervalId;
        this.fmeaObject.durationId = this.hsmdurationId;
        this.fmeaObject.resourceQuantity = this.hsmresourceQuantity;
        this.fmeaObject.tradeTypeId = this.hsmtradeTypeId;
        this.fmeaObject.parentCode = '';
        this.fmeaObject.origIndic = 1;
        this.fmeaObject.familyTaxonomyId = this.hsmcomponentHierarchyId;
        this.fmeaObject.classTaxonomyId = this.hsmclassId;
        this.fmeaObject.subClassTaxonomyId = this.hsmSubClassId;
        this.fmeaObject.buildSpecTaxonomyId = this.hsmBuildSpecId;
        this.fmeaObject.manufacturerTaxonomyId = this.hsmManufacturerId;
        this.fmeaObject.taskIdentificationNo = this.hsmtaskIdentificationNo;
        this.fmeaObject.variantId = this.hsmvariantid;
        this.fmeaObject.comment = this.comment;
        this.fmeaObject.createdBy = this.hsmcreatedBy;
        this.fmeaObject.updatedBy = this.hsmupdatedBy;
        this.fmeaObject.systemStatus = 2;

        this._fmeaService.addFMEA(this.fmeaObject)
            .subscribe(res =>{

                this.assignToUserObject.transactionId = res.id;
                this.assignToUserObject.transactionTypeId = 1;
                this.assignToUserObject.userPermissionGroupId = 5;
                this.assignToUserObject.status = 1;
                this.assignToUserObject.isActive = true;

                this._assignToUserService.addAssignGroupToUser(this.assignToUserObject)
                    .subscribe(out => {
                        this.isLocked = true;
                        // this.fmeaObject.taskIdentificationNo = "FFT.000.00" + res.id;
                        this.toastr.success("Successfully saved!", 'Success');
                        localStorage.removeItem("assetclass");
                        localStorage.removeItem("manufacturer");
                        localStorage.removeItem("subclass");
                        localStorage.removeItem("buildspec");
                        localStorage.removeItem("familyId");
                        localStorage.removeItem("classId");
                        localStorage.removeItem("subClassId");
                        localStorage.removeItem("buildSpecId");
                        localStorage.removeItem("manufacturerId");
                        this.close();
                    });
            });
    }

    updateChanges(){
        this.fmeaObject.componentHierarchyId = this.hsmcomponentHierarchyId;
        this.fmeaObject.systemDescription = this.hsmassetClassType;
        this.fmeaObject.componentLevel1Id = this.hsmcomponentHierarchyId;
        this.fmeaObject.componentTaskFunction = this.hsmcomponentTaskFunction;
        this.fmeaObject.failureMode = this.hsmfailureMode;
        this.fmeaObject.failureEffect = this.hsmfailureEffect;
        this.fmeaObject.failureCause = this.hsmfailureCause;
        this.fmeaObject.endEffect = this.hsmendEffect;
        this.fmeaObject.taskDescription = this.hsmtaskDescription;
        this.fmeaObject.acceptableLimits = this.hsmacceptableLimits;
        this.fmeaObject.correctiveActions = this.hsmcorrectiveActions;
        this.fmeaObject.taskTypeId = this.hsmtaskTypeId;
        this.fmeaObject.operationalModeId = this.hsmoperationalModeId;
        this.fmeaObject.failureRiskTotalScore = this.hsmfailureRiskTotalScore;
        this.fmeaObject.intervalId = this.hsmintervalId;
        this.fmeaObject.durationId = this.hsmdurationId;
        this.fmeaObject.resourceQuantity = this.hsmresourceQuantity;
        this.fmeaObject.tradeTypeId = this.hsmtradeTypeId;
        this.fmeaObject.taskIdentificationNo = this.hsmtaskIdentificationNo;
        this.fmeaObject.parentCode = this.hsmparentCode;        
        this.fmeaObject.familyTaxonomyId = this.hsmfamilyId;
        this.fmeaObject.classTaxonomyId = this.hsmclassId;
        this.fmeaObject.subClassTaxonomyId = this.hsmSubClassId;
        this.fmeaObject.buildSpecTaxonomyId = this.hsmBuildSpecId;
        this.fmeaObject.manufacturerTaxonomyId = this.hsmManufacturerId;
        this.fmeaObject.variantId = this.hsmvariantid;
        this.fmeaObject.origIndic = this.hsmorigIndic;
        this.fmeaObject.id = this.currentId;
        this.fmeaObject.comment = this.comment;
        this.fmeaObject.createdBy = this.hsmcreatedBy;
        this.fmeaObject.updatedBy = this.user;
        this.fmeaObject.dtCreated = this.hsmdtCreated;
        this.fmeaObject.dtUpdated = this.hsmdtUpdated;
        this.fmeaObject.systemStatus = this.hsmsystemStatus;

        //Asset Class mirror data
        this.fmmtObject.componentHierarchyId = this.hsmcomponentHierarchyId;
        this.fmmtObject.systemDescription = this.hsmassetClassType;
        this.fmmtObject.componentLevel1Id = this.hsmcomponentHierarchyId;
        this.fmmtObject.componentTaskFunction = this.hsmcomponentTaskFunction;
        this.fmmtObject.failureMode = this.hsmfailureMode;
        this.fmmtObject.failureEffect = this.hsmfailureEffect;
        this.fmmtObject.failureCause = this.hsmfailureCause;
        this.fmmtObject.endEffect = this.hsmendEffect;
        this.fmmtObject.taskDescription = this.hsmtaskDescription;
        this.fmmtObject.acceptableLimits = this.hsmacceptableLimits;
        this.fmmtObject.correctiveActions = this.hsmcorrectiveActions;
        this.fmmtObject.taskTypeId = this.hsmtaskTypeId;
        this.fmmtObject.operationalModeId = this.hsmoperationalModeId;
        this.fmmtObject.failureRiskTotalScore = this.hsmfailureRiskTotalScore;
        this.fmmtObject.intervalId = this.hsmintervalId;
        this.fmmtObject.durationId = this.hsmdurationId;
        this.fmmtObject.resourceQuantity = this.hsmresourceQuantity;
        this.fmmtObject.tradeTypeId = this.hsmtradeTypeId;
        this.fmmtObject.taskIdentificationNo = this.hsmtaskIdentificationNo;
        this.fmmtObject.parentCode = this.hsmparentCode;
        this.fmmtObject.familyTaxonomyId = this.hsmfamilyId;
        this.fmmtObject.classTaxonomyId = this.hsmclassId;
        this.fmmtObject.subClassTaxonomyId = this.hsmSubClassId;
        this.fmmtObject.buildSpecTaxonomyId = this.hsmBuildSpecId;
        this.fmmtObject.manufacturerTaxonomyId = this.hsmManufacturerId;
        this.fmmtObject.variantId = this.hsmvariantid;
        this.fmmtObject.origIndic = this.hsmorigIndic;
        this.fmmtObject.fmmtId = this.currentId;
        this.fmmtObject.comment = this.comment;
        this.fmmtObject.createdBy = this.hsmcreatedBy;
        this.fmmtObject.updatedBy = this.hsmupdatedBy;
        this.fmmtObject.dtCreated = this.hsmdtCreated;
        this.fmmtObject.dtUpdated = this.hsmdtUpdated;
        this.fmmtObject.systemStatus = this.hsmsystemStatus;

        this._fmeaService.updateFMEARecords(this.currentId, this.fmeaObject)
            .subscribe(out => {
                // console.log(out);
                this.toastr.success("Successfully updated!", 'Success');
                this.isLocked = true;
                this.isLockInfo = true;

                this._fmeaAssemblyService.getFmeaAsseblyTaskById(this.currentId)
                    .subscribe(foo => {
                        // console.log(foo);
                        foo.forEach( x => {
                            let id = x.id;
                            let category = x.categoryId;

                            this.fmmtObject.categoryId = category;

                            this.fmeaAssemblyList.push({
                                acceptableLimits: this.fmmtObject.acceptableLimits,
                                buildSpecTaxonomyId: this.fmmtObject.buildSpecTaxonomyId,
                                classTaxonomyId: this.fmmtObject.classTaxonomyId,
                                componentHierarchyId: this.fmmtObject.componentHierarchyId,
                                componentLevel1Id: this.fmmtObject.componentLevel1Id,
                                componentTaskFunction: this.fmmtObject.componentTaskFunction,
                                correctiveActions: this.fmmtObject.correctiveActions,
                                durationId: this.fmmtObject.durationId,
                                endEffect: this.fmmtObject.endEffect,
                                failureCause: this.fmmtObject.failureCause,
                                failureEffect: this.fmmtObject.failureEffect,
                                failureMode: this.fmmtObject.failureMode,
                                failureRiskTotalScore: this.fmmtObject.failureRiskTotalScore,
                                familyTaxonomyId: this.fmmtObject.familyTaxonomyId,
                                intervalId: this.fmmtObject.intervalId,
                                manufacturerTaxonomyId: this.fmmtObject.manufacturerTaxonomyId,
                                operationalModeId: this.fmmtObject.operationalModeId,
                                origIndic: this.fmmtObject.origIndic,
                                parentCode: this.fmmtObject.parentCode,
                                resourceQuantity: this.fmmtObject.resourceQuantity,
                                subClassTaxonomyId: this.fmmtObject.subClassTaxonomyId,
                                systemDescription: this.fmmtObject.systemDescription,
                                taskDescription: this.fmmtObject.taskDescription,
                                taskIdentificationNo: this.fmmtObject.taskIdentificationNo,
                                taskTypeId: this.fmmtObject.taskTypeId,
                                tradeTypeId: this.fmmtObject.tradeTypeId,
                                variantId: this.fmmtObject.variantId,
                                categoryId: this.fmmtObject.categoryId,
                                fmmtId: this.currentId,
                                id: id,
                                commment: this.fmmtObject.comment,
                                createdBy: this.fmmtObject.createdBy,
                                updatedBy: this.fmmtObject.updatedBy,
                                dtCreated: this.fmmtObject.dtCreated,
                                dtUpdated: this.fmmtObject.dtUpdated,
                                systemStatus: this.fmmtObject.systemStatus
                            })
                        })

                        this._fmeaAssemblyService.upsertTaskAdded(this.fmeaAssemblyList)
                        .subscribe(res => {
                            console.log(res);
                            // this.toastr.success("Successfully assigned task!", 'Success');
                        });

                        if(this.hasVariant === true){
                            //if has FMEA Variant
                            this.updateVariant();
                        }

                        this.close();
                    });

                    
        });
    }

    updateVariant(){
        this._fmeaService.getFMEAVariant(this.hsmtaskIdentificationNo)
                .subscribe(result => {

                    result.forEach( x => {

                        let taskid = x.taskIdentificationNo;
                        let varId = x.id;
                        let assetclasstype = x.assetClassType;
                        let componentHierarchyId = x.componentHierarchyId;
                        let systemDescription = x.systemDescription;
                        let componentLevel1Id = x.componentLevel1Id;
                        let componentTaskFunction = x.componentTaskFunction;
                        let failureMode = x.failureMode;
                        let failureEffect = x.failureEffect;
                        let failureCause = x.failureCause;
                        let endEffect = x.endEffect;
                        let taskDescription = x.taskDescription;
                        let acceptableLimits = x.acceptableLimits;
                        let correctiveActions = x.correctiveActions;
                        let taskTypeId = x.taskTypeId;
                        let operationalModeId = x.operationalModeId;
                        let failureRiskTotalScore = x.failureRiskTotalScore;
                        let intervalId = x.intervalId;
                        let durationId = x.durationId
                        let resourceQuantity = x.resourceQuantity;
                        let tradeTypeId = x.tradeTypeId;
                        let taskIdentificationNo = x.taskIdentificationNo;
                        let parentCode = x.parentCode
                        let familyTaxonomyId = x.familyTaxonomyId;
                        let classTaxonomyId = x.classTaxonomyId;
                        let subClassTaxonomyId = x.subClassTaxonomyId;
                        let buildSpecTaxonomyId = x.buildSpecTaxonomyId;
                        let manufacturerTaxonomyId = x.manufacturerTaxonomyId;
                        let variantId = x.variantId;
                        let origIndic = x.origIndic;
                        let comment = x.comment;
                        let createdBy = x.createdBy;
                        let updatedBy = x.updatedBy;
                        let dtCreated = x.dtCreated;
                        let dtUpdated = x.dtUpdated;
                        let systemStatus = x.systemStatus

                        this.fmeaVariantObject.id = varId;
                        this.fmeaVariantObject.componentHierarchyId = this.hsmcomponentHierarchyId;
                        this.fmeaVariantObject.systemDescription = this.hsmassetClassType;
                        this.fmeaVariantObject.componentLevel1Id = this.hsmcomponentLevel1Id;
                        this.fmeaVariantObject.componentTaskFunction = this.hsmcomponentTaskFunction;
                        this.fmeaVariantObject.failureMode = this.hsmfailureMode;
                        this.fmeaVariantObject.failureEffect = this.hsmfailureEffect;
                        this.fmeaVariantObject.failureCause = this.hsmfailureCause;
                        this.fmeaVariantObject.endEffect = this.hsmendEffect;
                        this.fmeaVariantObject.taskDescription = this.hsmtaskDescription;
                        this.fmeaVariantObject.acceptableLimits = this.hsmacceptableLimits;
                        this.fmeaVariantObject.correctiveActions = this.hsmcorrectiveActions;
                        this.fmeaVariantObject.taskTypeId = this.hsmtaskTypeId;
                        this.fmeaVariantObject.operationalModeId = this.hsmoperationalModeId;
                        this.fmeaVariantObject.failureRiskTotalScore = this.hsmfailureRiskTotalScore;
                        this.fmeaVariantObject.intervalId = this.hsmintervalId
                        this.fmeaVariantObject.durationId = this.hsmdurationId
                        this.fmeaVariantObject.resourceQuantity = this.hsmresourceQuantity
                        this.fmeaVariantObject.tradeTypeId = this.hsmtradeTypeId
                        this.fmeaVariantObject.taskIdentificationNo = taskIdentificationNo
                        this.fmeaVariantObject.parentCode = parentCode
                        this.fmeaVariantObject.familyTaxonomyId = this.hsmfamilyId
                        this.fmeaVariantObject.classTaxonomyId = this.hsmclassId
                        this.fmeaVariantObject.subClassTaxonomyId = this.hsmSubClassId
                        this.fmeaVariantObject.buildSpecTaxonomyId = this.hsmBuildSpecId
                        this.fmeaVariantObject.manufacturerTaxonomyId = this.hsmManufacturerId
                        this.fmeaVariantObject.variantId = variantId
                        this.fmeaVariantObject.origIndic = origIndic
                        this.fmeaVariantObject.comment = comment
                        this.fmeaVariantObject.createdBy = this.hsmcreatedBy
                        this.fmeaVariantObject.updatedBy = this.hsmupdatedBy
                        this.fmeaVariantObject.dtCreated = this.hsmdtCreated
                        this.fmeaVariantObject.dtUpdated = this.hsmdtUpdated
                        this.fmeaVariantObject.systemStatus = this.hsmsystemStatus

                        this._fmeaService.updateFMEAVariant(taskid, this.fmeaVariantObject)
                        .subscribe(foo=> {
                            console.log("variant updated")
                        });
                    });
                });
    }

    updateFmeaAssemblyChanges(){
        this.fmmtObject.componentHierarchyId = this.hsmaccomponentHierarchyId;
        this.fmmtObject.componentLevel1Id = this.hsmaccomponentLevel1Id;
        this.fmmtObject.systemDescription = this.hsmacassetClassType;
        this.fmmtObject.componentTaskFunction = this.hsmaccomponentTaskFunction;
        this.fmmtObject.failureMode = this.hsmacfailureMode;
        this.fmmtObject.failureEffect = this.hsmacfailureEffect;
        this.fmmtObject.failureCause = this.hsmacfailureCause;
        this.fmmtObject.endEffect = this.hsmacendEffect;
        this.fmmtObject.taskDescription = this.hsmactaskDescription;
        this.fmmtObject.acceptableLimits = this.hsmacacceptableLimits;
        this.fmmtObject.correctiveActions = this.hsmaccorrectiveActions;
        this.fmmtObject.resourceQuantity = this.hsmacresourceQuantity;
        this.fmmtObject.taskTypeId = this.hsmactaskTypeId;
        this.fmmtObject.operationalModeId = this.hsmacoperationalModeId;
        this.fmmtObject.failureRiskTotalScore = this.hsmacfailureRiskTotalScore;
        this.fmmtObject.intervalId = this.hsmacintervalId;
        this.fmmtObject.durationId = this.hsmacdurationId;
        this.fmmtObject.tradeTypeId = this.hsmactradeTypeId;
        this.fmmtObject.taskIdentificationNo = this.hsmactaskIdentificationNo;
        this.fmmtObject.parentCode = this.hsmacparentCode;
        this.fmmtObject.familyTaxonomyId = this.hsmacfamilyId;
        this.fmmtObject.classTaxonomyId = this.hsmacclassId;
        this.fmmtObject.subClassTaxonomyId = this.hsmacSubClassId;
        this.fmmtObject.buildSpecTaxonomyId = this.hsmacBuildSpecId;
        this.fmmtObject.manufacturerTaxonomyId = this.hsmacManufacturerId;
        this.fmmtObject.variantId = this.hsmacvariantid;
        this.fmmtObject.origIndic = this.hsmacorigIndic;
        this.fmmtObject.comment = this.comment;
        this.fmmtObject.createdBy = this.hsmaccreatedBy;
        this.fmmtObject.updatedBy = this.hsmacupdatedBy;
        this.fmmtObject.dtCreated = this.hsmacdtCreated;
        this.fmmtObject.dtUpdated = this.hsmacdtUpdated;
        this.fmmtObject.systemStatus = this.hsmacsystemStatus;
        this.fmmtObject.categoryId = this.hsmaccategoryId;
        this.fmmtObject.fmmtId = this.hsmacfmmtId;
        this.fmmtObject.id = this.currentId;

        this._fmeaAssemblyService.updateFmeaAssemblyRecords(this.currentId, this.fmmtObject)
            .subscribe(out => {
                // console.log(out);
                this.toastr.success("Successfully updated!", 'Success');
                this.isLocked = true;
                this.isLockInfo = true;
                this.close();
            });
    }

    saveChangesSiteFmea(){
        this.fmuftObject.componentHierarchyId = this.componentHierarchyId;
        this.fmuftObject.systemDescription = this.assetClassType;
        this.fmuftObject.componentLevel1Id = this.componentHierarchyId;
        this.fmuftObject.componentTaskFunction = this.componentTaskFunction;
        this.fmuftObject.failureMode = this.failureMode;
        this.fmuftObject.failureEffect = this.failureEffect;
        this.fmuftObject.failureCause = this.failureCause;
        this.fmuftObject.endEffect = this.endEffect;
        this.fmuftObject.taskDescription = this.taskDescription;
        this.fmuftObject.acceptableLimits = this.acceptableLimits;
        this.fmuftObject.correctiveActions = this.correctiveActions;
        this.fmuftObject.taskTypeId = this.taskTypeId;
        this.fmuftObject.operationalModeId = this.operationalModeId;
        this.fmuftObject.failureRiskTotalScore = this.failureRiskTotalScore;
        this.fmuftObject.intervalId = this.intervalId;
        this.fmuftObject.durationId = this.durationId;
        this.fmuftObject.resourceQuantity = this.resourceQuantity;
        this.fmuftObject.tradeTypeId = this.tradeTypeId;
        this.fmuftObject.parentCode = '';
        this.fmuftObject.origIndic = 1;
        this.fmuftObject.familyTaxonomyId = this.componentHierarchyId;
        this.fmuftObject.classTaxonomyId = this.classId;
        this.fmuftObject.subClassTaxonomyId = this.subClassTaxonomyId;
        this.fmuftObject.buildSpecTaxonomyId = this.buildSpecTaxonomyId;
        this.fmuftObject.manufacturerTaxonomyId = this.manufacturerTaxonomyId;
        this.fmuftObject.taskIdentificationNo = this.taskIdentificationNo;
        this.fmuftObject.variantId = this.variantId;
        this.fmuftObject.comment = this.comment;
        this.fmuftObject.createdBy = this.createdBy;
        this.fmuftObject.updatedBy = this.updatedBy;
        this.fmuftObject.systemStatus = 2;
        this.fmuftObject.siteId = this.siteId;
        this.fmuftObject.customerId = this.customerId;

        this._fmuftService.addFMUFTSite(this.fmuftObject)
            .subscribe(res =>{
                this.assignToUserObject.transactionId = res.id;
                this.assignToUserObject.transactionTypeId = 2;
                this.assignToUserObject.userPermissionGroupId = 5;
                this.assignToUserObject.status = 1;
                this.assignToUserObject.isActive = true;

                this._assignToUserService.addAssignGroupToUser(this.assignToUserObject)
                    .subscribe(out => {
                        this.isLocked = true;
                        // this.fmeaObject.taskIdentificationNo = "FFT.000.00" + res.id;
                        this.toastr.success("Successfully saved!", 'Success');
                        localStorage.removeItem("assetclass");
                        localStorage.removeItem("manufacturer");
                        localStorage.removeItem("subclass");
                        localStorage.removeItem("buildspec");
                        localStorage.removeItem("familyId");
                        localStorage.removeItem("classId");
                        localStorage.removeItem("subClassId");
                        localStorage.removeItem("buildSpecId");
                        localStorage.removeItem("manufacturerId");
                        this.close();
                    });
            });
    }

    updateChangesFmeaSite(){
        this.fmuftObject.componentHierarchyId = this.componentHierarchyId;
        this.fmuftObject.systemDescription = this.assetClassType;
        this.fmuftObject.componentLevel1Id = this.componentHierarchyId;
        this.fmuftObject.componentTaskFunction = this.componentTaskFunction;
        this.fmuftObject.failureMode = this.failureMode;
        this.fmuftObject.failureEffect = this.failureEffect;
        this.fmuftObject.failureCause = this.failureCause;
        this.fmuftObject.endEffect = this.endEffect;
        this.fmuftObject.taskDescription = this.taskDescription;
        this.fmuftObject.acceptableLimits = this.acceptableLimits;
        this.fmuftObject.correctiveActions = this.correctiveActions;
        this.fmuftObject.taskTypeId = this.taskTypeId;
        this.fmuftObject.operationalModeId = this.operationalModeId;
        this.fmuftObject.failureRiskTotalScore = this.failureRiskTotalScore;
        this.fmuftObject.intervalId = this.intervalId;
        this.fmuftObject.durationId = this.durationId;
        this.fmuftObject.resourceQuantity = this.resourceQuantity;
        this.fmuftObject.tradeTypeId = this.tradeTypeId;
        this.fmuftObject.taskIdentificationNo = this.taskIdentificationNo;
        this.fmuftObject.parentCode = this.parentCode;
        this.fmuftObject.familyTaxonomyId = this.familyId;
        this.fmuftObject.classTaxonomyId = this.classId;
        this.fmuftObject.subClassTaxonomyId = this.subClassId;
        this.fmuftObject.buildSpecTaxonomyId = this.buildSpecId;
        this.fmuftObject.manufacturerTaxonomyId = this.manufacturerId;
        this.fmuftObject.variantId = this.variantId;
        this.fmuftObject.origIndic = this.origIndic;
        this.fmuftObject.id = this.currentId;
        this.fmuftObject.comment = this.comment;
        this.fmuftObject.createdBy = this.createdBy;
        this.fmuftObject.updatedBy = this.user;
        this.fmuftObject.dtCreated = this.dtCreated;
        this.fmuftObject.dtUpdated = this.dtUpdated;
        this.fmuftObject.systemStatus = this.systemStatus;
        this.fmuftObject.siteId = this.siteId;
        this.fmuftObject.customerId = this.customerId;

        this.fmmtSiteObject.componentHierarchyId = this.componentHierarchyId;
        this.fmmtSiteObject.systemDescription = this.assetClassType;
        this.fmmtSiteObject.componentLevel1Id = this.componentHierarchyId;
        this.fmmtSiteObject.componentTaskFunction = this.componentTaskFunction;
        this.fmmtSiteObject.failureMode = this.failureMode;
        this.fmmtSiteObject.failureEffect = this.failureEffect;
        this.fmmtSiteObject.failureCause = this.failureCause;
        this.fmmtSiteObject.endEffect = this.endEffect;
        this.fmmtSiteObject.taskDescription = this.taskDescription;
        this.fmmtSiteObject.acceptableLimits = this.acceptableLimits;
        this.fmmtSiteObject.correctiveActions = this.correctiveActions;
        this.fmmtSiteObject.taskTypeId = this.taskTypeId;
        this.fmmtSiteObject.operationalModeId = this.operationalModeId;
        this.fmmtSiteObject.failureRiskTotalScore = this.failureRiskTotalScore;
        this.fmmtSiteObject.intervalId = this.intervalId;
        this.fmmtSiteObject.durationId = this.durationId;
        this.fmmtSiteObject.resourceQuantity = this.resourceQuantity;
        this.fmmtSiteObject.tradeTypeId = this.tradeTypeId;
        this.fmmtSiteObject.taskIdentificationNo = this.taskIdentificationNo;
        this.fmmtSiteObject.parentCode = this.parentCode;
        this.fmmtSiteObject.familyTaxonomyId = this.familyTaxonomyId;
        this.fmmtSiteObject.classTaxonomyId = this.classTaxonomyId;
        this.fmmtSiteObject.subClassTaxonomyId = this.subClassTaxonomyId;
        this.fmmtSiteObject.buildSpecTaxonomyId = this.buildSpecTaxonomyId;
        this.fmmtSiteObject.manufacturerTaxonomyId = this.manufacturerTaxonomyId;
        this.fmmtSiteObject.variantId = this.variantId;
        this.fmmtSiteObject.origIndic = this.origIndic;
        this.fmmtSiteObject.fmmtId = this.currentId;
        this.fmmtSiteObject.comment = this.comment;
        this.fmmtSiteObject.createdBy = this.createdBy;
        this.fmmtSiteObject.updatedBy = this.user;
        this.fmmtSiteObject.dtCreated = this.dtCreated;
        this.fmmtSiteObject.dtUpdated = this.dtUpdated;
        this.fmmtSiteObject.systemStatus = this.systemStatus;

        this._fmuftService.updateFMUFTSite(this.currentId, this.fmuftObject)
            .subscribe(out => {
                // console.log(out);
                this.toastr.success("Successfully updated!", 'Success');
                this.isLocked = true;
                this.isLockInfo = true;

                this.fmeaSiteAssemblyService.getFmeaAsseblyTaskById(this.currentId)
                    .subscribe(foo => {
                        console.log(foo);
                        foo.forEach( x => {
                            let id = x.id;
                            let category = x.categoryId;

                            this.fmmtSiteObject.categoryId = category;

                            this.fmeaAssemblyList.push({
                                acceptableLimits: this.fmmtSiteObject.acceptableLimits,
                                buildSpecTaxonomyId: this.fmmtSiteObject.buildSpecTaxonomyId,
                                classTaxonomyId: this.fmmtSiteObject.classTaxonomyId,
                                componentHierarchyId: this.fmmtSiteObject.componentHierarchyId,
                                componentLevel1Id: this.fmmtSiteObject.componentLevel1Id,
                                componentTaskFunction: this.fmmtSiteObject.componentTaskFunction,
                                correctiveActions: this.fmmtSiteObject.correctiveActions,
                                durationId: this.fmmtSiteObject.durationId,
                                endEffect: this.fmmtSiteObject.endEffect,
                                failureCause: this.fmmtSiteObject.failureCause,
                                failureEffect: this.fmmtSiteObject.failureEffect,
                                failureMode: this.fmmtSiteObject.failureMode,
                                failureRiskTotalScore: this.fmmtSiteObject.failureRiskTotalScore,
                                familyTaxonomyId: this.fmmtSiteObject.familyTaxonomyId,
                                intervalId: this.fmmtSiteObject.intervalId,
                                manufacturerTaxonomyId: this.fmmtSiteObject.manufacturerTaxonomyId,
                                operationalModeId: this.fmmtSiteObject.operationalModeId,
                                origIndic: this.fmmtSiteObject.origIndic,
                                parentCode: this.fmmtSiteObject.parentCode,
                                resourceQuantity: this.fmmtSiteObject.resourceQuantity,
                                subClassTaxonomyId: this.fmmtSiteObject.subClassTaxonomyId,
                                systemDescription: this.fmmtSiteObject.systemDescription,
                                taskDescription: this.fmmtSiteObject.taskDescription,
                                taskIdentificationNo: this.fmmtSiteObject.taskIdentificationNo,
                                taskTypeId: this.fmmtSiteObject.taskTypeId,
                                tradeTypeId: this.fmmtSiteObject.tradeTypeId,
                                variantId: this.fmmtSiteObject.variantId,
                                categoryId: this.fmmtSiteObject.categoryId,
                                fmmtId: this.currentId,
                                id: id,
                                commment: this.fmmtSiteObject.comment,
                                createdBy: this.fmmtSiteObject.createdBy,
                                updatedBy: this.fmmtSiteObject.updatedBy,
                                dtCreated: this.fmmtSiteObject.dtCreated,
                                dtUpdated: this.fmmtSiteObject.dtUpdated,
                                systemStatus: this.fmmtSiteObject.systemStatus
                            })
                        })

                        this.fmeaSiteAssemblyService.upsertTaskAdded(this.fmeaAssemblyList)
                        .subscribe(res => {
                            console.log(res);
                            // this.toastr.success("Successfully assigned task!", 'Success');
                        })
                    });

                    this.close();
            });
    }

    saveChangesHsmTGS(){
        this.assetTaskGroupStrategyObject.frequencyId = this.frequencyId;
        this.assetTaskGroupStrategyObject.taskTypeId = this.taskTypeId;
        this.assetTaskGroupStrategyObject.operationalModeId = this.operationalModeId;
        this.assetTaskGroupStrategyObject.tradeTypeId = this.tradeTypeId;
        this.assetTaskGroupStrategyObject.durationId = this.durationId;
        this.assetTaskGroupStrategyObject.taskGroupDescription = this.taskGroupDescription;
        // this.taskGpStrategyId = "";
        this.assetTaskGroupStrategyObject.taskGroupStrategyId = this.taskGpStrategyId;
        this.assetTaskGroupStrategyObject.assetIndustryId = this.assetIndustryId;
        this.assetTaskGroupStrategyObject.businessTypeId = this.assetBusinessTypeId;
        this.assetTaskGroupStrategyObject.assetTypeId = this.assetTypeId;
        this.assetTaskGroupStrategyObject.processFunctionId = this.assetProcessFunctionId;
        this.assetTaskGroupStrategyObject.assetCategoryId = this.assetCategoryId;
        this.assetTaskGroupStrategyObject.assetClassTaxonomyId = this.assetClassId;
        this.assetTaskGroupStrategyObject.assetSpecTaxonomyId = this.assetSpecTaxonomyId;
        this.assetTaskGroupStrategyObject.assetFamilyTaxonomyId = this.assetFamilyTaxonomyId;
        this.assetTaskGroupStrategyObject.assetManufacturerTaxonomyId = this.assetManufacturerId;
        this.assetTaskGroupStrategyObject.componentFamilyTaxonomyId = this.maintUnitId;
        this.assetTaskGroupStrategyObject.componentClassTaxonomyId = this.componentClass;
        this.assetTaskGroupStrategyObject.componentSubClassTaxonomyId = this.componentSubClassId;
        this.assetTaskGroupStrategyObject.componentBuildSpecTaxonomyId = this.componentBuildSpecId;
        this.assetTaskGroupStrategyObject.componentManufacturerId = this.componentManufacturerId;
        this.assetTaskGroupStrategyObject.assetHierarchyId = this.tempTaskId;
        this.assetTaskGroupStrategyObject.comment = this.comment;
        this.assetTaskGroupStrategyObject.createdBy = this.user;
        this.assetTaskGroupStrategyObject.updatedBy = this.user;
        this.assetTaskGroupStrategyObject.systemStatus = 2;

        this._assetTaskGroupStrategyHsmService.addStrategyGroup(this.assetTaskGroupStrategyObject)
            .subscribe(res => {
                this.assignToUserObject.transactionId = res.id;
                this.assignToUserObject.transactionTypeId = 3;
                this.assignToUserObject.userPermissionGroupId = 5;
                this.assignToUserObject.status = 1;
                this.assignToUserObject.isActive = true;

                this._assignToUserService.addAssignGroupToUser(this.assignToUserObject)
                    .subscribe(out => {
                        this.close();
                    });
            });
    }

    saveChangesSiteTGS(){

        this._assetTaskGroupStrategyHsmService.addStrategyGroup(this.assetTaskGroupStrategyObject)
            .subscribe(res => {
                this.assignToUserObject.transactionId = res.id;
                this.assignToUserObject.transactionTypeId = 4;
                this.assignToUserObject.userPermissionGroupId = 5;
                this.assignToUserObject.status = 1;
                this.assignToUserObject.isActive = true;

                this._assignToUserService.addAssignGroupToUser(this.assignToUserObject)
                    .subscribe(out => {
                        this.close();
                    });
            });
    }

    close(): void {
        this.dialogRef.close();
    }

    commentClose(): void {
        if(this.isHSMUser){
            this.commentObject.comment = this.comment;
            this.commentObject.customerId = this.customerId;
            this.commentObject.siteId = this.siteId;

            if(this.comment !== "")
            {
                this.dialogRef.close(this.commentObject);
            }else{
                this.toastr.warning("Comment field is required", 'Warning');
            }
        }
        else{
            if(this.comment !== "")
            {
                this.dialogRef.close(this.comment);
            }else{
                this.toastr.warning("Comment field is required", 'Warning');
            }
        }
    }

    commentCloseHSM(): void{
        if(this.comment !== "")
        {
            this.dialogRef.close(this.comment);
        }else{
            this.toastr.warning("Comment field is required", 'Warning');
        }
    }

    cancel(): void{
        this.dialogRef.close('cancel');
    }
}
