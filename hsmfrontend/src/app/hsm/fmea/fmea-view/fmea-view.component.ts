import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { FMEASteps } from '../../enum/FMEAStepsEnum';
import { FormControl } from '@angular/forms';
import { RevisionReportModalComponent } from '../../modal/revisionreportmodal/revisionreportmodal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

//Services
import { FrequencyService } from '../../services/frequency.services';
import { DurationService } from '../../services/duration.services';
import { OperationalModeService } from '../../services/operationalmode.services';
import { TradeTypeService } from '../../services/tradetype.services';
import { TaskTypeService } from '../../services/tasktype.services';

//interface
import { IFrequency } from './../../interfaces/IFrequency';
import { IDuration} from './../../interfaces/IDuration';
import { IOperationalMode} from './../../interfaces/IOperationalMode';
import { ITradeType} from './../../interfaces/ITradeType';
import { ITaskType } from './../../interfaces/ITaskType';
import { forkJoin } from 'rxjs';
import { IFMEA, IFmeaAssembly } from '../../interfaces/IFMEA';
import { IComponentHierarchy } from '../../interfaces/IComponentHierarchy';
import { IAssetHierarchyDataTaxonomy } from '../../interfaces/IAssetHierarchy';
import { fmeaAssemblyDefault, fmeaDefault } from 'src/app/shared/helpers/default.helpers';
import { FMEAService } from '../../services/fmea.services';
import { CategoryHierarchyService } from '../../services/categoryhierarchy.services';
import { ToastrService } from 'ngx-toastr';
import { AssetHierarchyService } from '../../services/assethierarchy.services';
import { ComponentTaskService } from '../../services/componenttask.services';
import { ComponentClassService } from '../../services/componentclass.services';
import { ComponentSubClassService } from '../../services/componentsubclass.services';
import { ComponentBuildSpecService } from '../../services/componentbuildspec.services';
import { ComponentManufacturerService } from '../../services/componentmanufacturer.services';
import { FmeaAssemblyService } from '../../services/fmeaassembly.services';
import { DataService } from 'src/app/shared/services/data.service';
import { CommentModalComponent } from '../../modal/commentmodal/commentmodal.component';

@Component({
    selector: "fmea-view",
    templateUrl: './fmea-view.component.html',
    styleUrls: [
        './fmea-view.component.scss'
    ]
})

export class FMEAViewComponent implements OnInit {

    durationList: any[] = [];
    frequencyList: any[] = [];
    operationModeList: any[] = [];
    tradeTypeList: any[] = [];
    taskTypeList: any[] = [];
    componentLevel1List: any[] = [];
    componentLevel2List: any[] = [];
    componentLevel3List: any[] = [];
    fmeavariantsList: any[] = [];
    fmeaAssemblyList: any[] = [];

    frequencyObject: IFrequency;
    durationObject: IDuration;
    operationModeObject: IOperationalMode;
    tradeTypeObject: ITradeType;
    taskTypeObject: ITaskType;
    fmeaObject: IFMEA = fmeaDefault();
    fmmtObject: IFmeaAssembly = fmeaAssemblyDefault();
    componentObject: IComponentHierarchy;
    assetTaxonomyObject: IAssetHierarchyDataTaxonomy;

    loading: boolean = false;
    isLoading: boolean = true;

    // States
    stateBullet: number = 1;
    step = FMEASteps;
    forReview: boolean = false;
    isFailureRisk: boolean = false;

    //NG MODELS
    componentHierarchyCode: string = "";
    assetHierarchyCode: string ="";
    taxonomyDescription: string ="";
    componentTypeId: number;
    subComponentTypeId: number;
    taskIdentificationNo: string = "";
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
    taxonomyCategoryId: number;
    taxonomyClassId: number;
    taxonomyTypeId: number;
    parentCode: string;
    origIndic: number;
    categoryId: number;
    fmmtId: number;

    taxCategoryId: number;
    taxClassId: number;
    taxTypeId: number;

    componentLevel1Id: number;
    componentLevel2Id: number;
    componentLevel3Id: number;
    componentLevel4Id: number;

    familyTaxonomyId: number;
    classTaxonomyId: number;
    subClassTaxonomyId: number;
    buildSpecTaxonomyId: number;
    manufacturerTaxonomyId: number;
    variantId: number;

    assetHierarchyId: number;
    componentName: string = "";
    componentHierarchyId: number;

    componentLevel1: string = "";
    componentLevel2: string = "";
    componentLevel3: string = "";

    taxonomyCategoryName: string = "";
    taxonomyClassName: string = "";
    taxonomyTypeName: string = "";

    assetClassType: string ="";

    severityLevel1:number;
    severityLevel2:number;
    severityLevel3:number;
    severityLevel4:number;
    severityLevel5:number;
    severityLevel6:number;
    severityLevel7:number;
    likelihood1:number;
    likelihood2:number;
    likelihood3:number;
    likelihood4:number;
    likelihood5:number;
    likelihood: number;
    consequences: number;

    square1: boolean = false;
    square2: boolean = false;
    square3: boolean = false;
    square4: boolean = false;
    square5: boolean = false;
    square6: boolean = false;
    square7: boolean = false;
    square8: boolean = false;
    square9: boolean = false;
    square10: boolean = false;
    square11: boolean = false;
    square12: boolean = false;
    square13: boolean = false;
    square14: boolean = false;
    square15: boolean = false;
    square16: boolean = false;
    square17: boolean = false;
    square18: boolean = false;
    square19: boolean = false;
    square20: boolean = false;
    square21: boolean = false;
    square22: boolean = false;
    square23: boolean = false;
    square24: boolean = false;
    square25: boolean = false;
    square26: boolean = false;
    square27: boolean = false;
    square28: boolean = false;
    square29: boolean = false;
    square30: boolean = false;
    square31: boolean = false;
    square32: boolean = false;
    square33: boolean = false;
    square34: boolean = false;
    square35: boolean = false;

    isSelected:boolean =  false;
    isNotSelected: boolean = true;
    isLocked: boolean = false;
    taskId: number;
    assetCode: string = "";
    componentTask: string = "";
    className: string = "";
    subClassName: string = "";
    buildSpecName: string = "";
    manufacturerName: string = "";

    taxonomyFamilyList: any[] = [];
    taxonomyClassList: any[] = [];
    taxonomySubClassList: any[] = [];
    taxonomyBuildSpecList: any[] = [];
    taxonomyManufacturerList: any[] = [];
    maintUnitList: any[] = [];

    myControl = new FormControl();
    isLockInfo: boolean = true;
    isEditable: boolean = false;
    currentId: number;
    taskNo: number = 0;
    tempNo: number = 0;
    taskIdentificationNo2: string = "";
    user: string = "";
    comment: string = "";
    createdBy: string = "";
    updatedBy: string = "";
    dtCreated: any;
    dtupdated: any;
    systemStatus: any;
    fmeamode: string = "";

    statusList: any = [
        {
            "name": "Created",
            "id": 1
        },
        {
            "name": "Review",
            "id": 2
        },
        {
            "name": "Approved",
            "id": 3
        },
        {
            "name": "Rejected",
            "id": 4
        }
      ];

    customerId: number = 0;
    siteId: number = 0;

    isHSMUser: boolean = false;
    isAdmin: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private _categoryService: CategoryHierarchyService,
        private router: Router,
        private _dataService: DataService,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private _frequenceService: FrequencyService,
        private _durationService: DurationService,
        private _operationModeService: OperationalModeService,
        private _tradeTypeService: TradeTypeService,
        private _taskTypeService: TaskTypeService,
        private _classTaxonomyService: ComponentClassService,
        private _subClassTaxonomyService: ComponentSubClassService,
        private _buildSpecTaxonomyService: ComponentBuildSpecService,
        private _manufacturerTaxonomyService: ComponentManufacturerService,
        private _fmeaService: FMEAService,
        private _assetHierarchyService: AssetHierarchyService,
        private _componentTaskService: ComponentTaskService,
        private _fmeaAssemblyService: FmeaAssemblyService,
        private toastr: ToastrService,
        ) { 
            const user = JSON.parse(localStorage.currentUser);
            this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
            // console.log(user);
            this.isAdmin = user?.users?.isAdmin;
            this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
            this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
         }
    
    ngOnInit(): void {
        this.user = localStorage.getItem("loggUser");
        // console.log(this.statusList)

        if(this.fmeamode === "CreateFMEATask")
        {
            this.isEditable = false;
        }else{
            this.isEditable = true;
        }
        
        this._fmeaService.getFMEALastNumber()
          .subscribe(out => {
            this.taskNo = Number(out.lastId);

            // console.log(this.taskNo)
            this.tempNo = this.taskNo+1
            
            if(this.taskNo === 9){
                this.taskIdentificationNo2 = "FFT.0000000" + this.tempNo;
            }

            if(this.taskNo >= 99){
                this.taskIdentificationNo2 = "FFT.000000" + this.tempNo;
            }

            if(this.taskNo >= 999){
                this.taskIdentificationNo2 = "FFT.00000" + this.tempNo;
            }

            if(this.taskNo >= 9999){
                this.taskIdentificationNo2 = "FFT.0000" + this.tempNo;
            }

            if(this.taskNo >= 99999){
                this.taskIdentificationNo2 = "FFT.000" + this.tempNo; 
            }

            if(this.taskNo >= 999999){
                this.taskIdentificationNo2 = "FFT.00"  + this.tempNo;
            }
            if(this.taskNo >= 9999999){
                this.taskIdentificationNo2 = "FFT.0"  + this.tempNo;
            }
            if(this.taskNo >= 99999999){
                this.taskIdentificationNo2 = "FFT."  + this.tempNo;
            }
            if(this.taskNo < 9){
                this.taskIdentificationNo2 = "FFT.00000000"   + this.tempNo;
            }
        });

        this.route.params.subscribe(params => {
            this.currentId = params['id'];
            
        });

        forkJoin(
            this._classTaxonomyService.getAllClassesByCustomerSites(this.customerId, this.siteId),
            // this._classTaxonomyService.getComponentTaxonomyClassesByIds(this.familyTaxonomyId, this.customerId, this.siteId),
            this._subClassTaxonomyService.getAllSubClassByCustomerSites(this.customerId, this.siteId),
            this._buildSpecTaxonomyService.getAllBuildSpecByCustomerSites(this.customerId, this.siteId),
            this._manufacturerTaxonomyService.getAllManufacturerByCustomerSites(this.customerId, this.siteId),
            this._frequenceService.getAllFrequencyByCustomerSites(this.customerId, this.siteId),
            this._durationService.getAllDurationByCustomerSites(this.customerId, this.siteId),
            this._tradeTypeService.GetAllTradeTypeByCustomerSites(this.customerId, this.siteId),
            this._operationModeService.getOperationalMode(),
            this._taskTypeService.getAllTaskTypeByCustomerSites(this.customerId, this.siteId),
            this._fmeaAssemblyService.getFmeaAssemblyById(this.currentId),
            // this._fmeaService.getAllStatus(),
            ).subscribe(([cc, sc, bs, mf, fr, dr, tt, op, ty, fm]) => {
                this.taxonomyClassList = cc.filter(e=> e.customerId === 0 && e.siteId === 0);
                this.taxonomySubClassList = sc.filter(e=> e.customerId === 0 && e.siteId === 0);
                this.taxonomyBuildSpecList = bs.filter(e=> e.customerId === 0 && e.siteId === 0);
                this.taxonomyManufacturerList = mf.filter(e=> e.customerId === 0 && e.siteId === 0);
                this.frequencyList = fr.filter(e=> e.customerId === 0 && e.siteId === 0);
                this.durationList = dr.filter(e=> e.customerId === 0 && e.siteId === 0);
                this.tradeTypeList = tt.filter(e=> e.customerId === 0 && e.siteId === 0);
                this.operationModeList = op;
                this.taskTypeList = ty.filter(e=> e.customerId === 0 && e.siteId === 0);
                this.initializeFieldData(fm);
                this.isLoading = false;
                // this.statusList = as;
                // console.log(fm)
                this._componentTaskService.getComponentTaskById(fm.componentHierarchyId)
                    .subscribe(foo => {
                        this.componentTask = foo.componentTaskName;
                    })
                // this._categoryService.getComponentById(fm.componentHierarchyId)
                //     .subscribe(res => {
                //         this.componentHierarchyCode = res.categoryName;
                //         this._fmeaService.getFMEAByComponentId(fm.componentHierarchyId)
                //             .subscribe(out => {
                //                 this.componentLevel1 = out[0]['categoryName'];
                //                 this.componentLevel2 = (out[1] != null || out[1] != undefined) ? out[1]['categoryName']: "";
                //                 this.componentLevel3 = (out[2] != null || out[2] != undefined) ? out[2]['categoryName']: "";
                //             })
                //     });
            });
      
    }

    initializeFieldData(data: IFmeaAssembly): void {
        this.fmmtObject = data;

        this.componentHierarchyId = data.componentHierarchyId;
        this.componentLevel1Id = data.componentLevel1Id;
        // this.componentLevel2Id = data.componentLevel2Id;
        // this.componentLevel3Id = data.componentLevel3Id;
        // this.componentLevel4Id = data.componentLevel4Id;
        this.assetClassType = data.systemDescription;
        this.componentTaskFunction = data.componentTaskFunction;
        this.failureMode = data.failureMode;
        this.failureEffect = data.failureEffect;
        this.failureCause = data.failureCause;
        this.endEffect = data.endEffect;
        this.taskDescription = data.taskDescription;
        this.acceptableLimits = data.acceptableLimits;
        this.correctiveActions = data.correctiveActions;
        this.taskTypeId = data.taskTypeId;
        this.operationalModeId = data.operationalModeId;
        this.failureRiskTotalScore = data.failureRiskTotalScore;
        this.intervalId = data.intervalId;
        this.durationId = data.durationId;
        this.resourceQuantity = data.resourceQuantity;
        this.tradeTypeId = data.tradeTypeId;
        this.taskIdentificationNo = data.taskIdentificationNo;
        this.parentCode = data.parentCode;
        this.familyTaxonomyId = data.familyTaxonomyId;
        this.classTaxonomyId = data.classTaxonomyId;
        this.subClassTaxonomyId = data.subClassTaxonomyId ? data.subClassTaxonomyId: null;
        this.buildSpecTaxonomyId = data.buildSpecTaxonomyId;
        this.manufacturerTaxonomyId = data.manufacturerTaxonomyId;
        this.variantId = data.variantId;
        this.origIndic = data.origIndic;
        this.comment = data.comment;
        this.createdBy = data.createdBy;
        this.updatedBy = data.updatedBy;
        this.dtCreated = data.dtCreated;
        this.dtupdated = data.dtUpdated;
        this.systemStatus = data.systemStatus;
        this.categoryId = data.categoryId;
        this.fmmtId = data.fmmtId;

        this.fmmtObject.componentHierarchyId = this.componentHierarchyId;
        this.fmmtObject.componentLevel1Id = this.componentLevel1Id;
        this.fmmtObject.systemDescription = this.assetClassType;
        this.fmmtObject.componentTaskFunction = this.componentTaskFunction;
        this.fmmtObject.failureMode = this.failureMode;
        this.fmmtObject.failureEffect = this.failureEffect;
        this.fmmtObject.failureCause = this.failureCause;
        this.fmmtObject.endEffect = this.endEffect;
        this.fmmtObject.taskDescription = this.taskDescription;
        this.fmmtObject.acceptableLimits = this.acceptableLimits;
        this.fmmtObject.correctiveActions = this.correctiveActions;
        this.fmmtObject.resourceQuantity = this.resourceQuantity;
        this.fmmtObject.taskTypeId = this.taskTypeId;
        this.fmmtObject.operationalModeId = this.operationalModeId;
        this.fmmtObject.failureRiskTotalScore = this.failureRiskTotalScore;
        this.fmmtObject.intervalId = this.intervalId;
        this.fmmtObject.durationId = this.durationId;
        this.fmmtObject.tradeTypeId = this.tradeTypeId;
        this.fmmtObject.taskIdentificationNo = this.taskIdentificationNo;
        this.fmmtObject.parentCode = this.parentCode;
        this.fmmtObject.familyTaxonomyId = this.familyTaxonomyId;
        this.fmmtObject.classTaxonomyId = this.classTaxonomyId;
        this.fmmtObject.subClassTaxonomyId = this.subClassTaxonomyId;
        this.fmmtObject.buildSpecTaxonomyId = this.buildSpecTaxonomyId;
        this.fmmtObject.manufacturerTaxonomyId = this.manufacturerTaxonomyId;
        this.fmmtObject.variantId = this.variantId;
        this.fmmtObject.origIndic = this.origIndic;
        this.fmmtObject.comment = this.comment;
        this.fmmtObject.createdBy = this.createdBy;
        this.fmmtObject.updatedBy = this.updatedBy;
        this.fmmtObject.dtCreated = this.dtCreated;
        this.fmmtObject.dtUpdated = this.dtupdated;
        this.fmmtObject.systemStatus = this.systemStatus;
        this.fmmtObject.categoryId = this.categoryId;
        this.fmmtObject.fmmtId = this.fmmtId;
        this.fmmtObject.id = this.currentId;
        // console.log(this.systemStatus)

        if(this.classTaxonomyId === null || this.classTaxonomyId === 0){
        }
        else{
            this.className = this.mapMaintItem(this.classTaxonomyId)['componentClass'];
        }
        // console.log(this.buildSpecTaxonomyId)
        if(this.subClassTaxonomyId === null || this.subClassTaxonomyId === 0){
            this.subClassTaxonomyId = 0;
        }
        else{
            this.subClassName = this.mapSubMaintItem(this.subClassTaxonomyId)['subClass']; 
        }
        
        if(this.buildSpecTaxonomyId === null || this.buildSpecTaxonomyId === 0){
            this.buildSpecTaxonomyId = 0;
        }else{
            this.buildSpecName = this.mapBuildSpec(this.buildSpecTaxonomyId)['buildSpec'];
        }
        
        if(this.manufacturerTaxonomyId === null || this.manufacturerTaxonomyId === 0){
            this.manufacturerTaxonomyId = 0;
        }else{
            this.manufacturerName = this.mapManufacturer(this.manufacturerTaxonomyId)['componentManufacturer'];
        }
        
        if(data.parentCode !== ''){
            this.stateBullet = 5
            this.isLockInfo = false;
        }else{
            this.stateBullet = 6;
            this.isLocked = true;
            this.isLockInfo = true;
            this.forReview = true;
        }

        this._classTaxonomyService.getComponentTaxonomyClassesByIds(this.familyTaxonomyId, this.customerId, this.siteId)
            .subscribe(out => {
                this.taxonomyClassList = out;
            });

        this._subClassTaxonomyService.getComponentTaxonomySubClassByIds(this.classTaxonomyId, this.customerId, this.siteId)
            .subscribe(out => {
                this.taxonomySubClassList = out;
            });

    }

    mapStatusData(id: number): string {
        let retData = "";
        retData = this.statusList.find(e => e.id === id);
        return retData;
    }

    mapMaintUnit(id: number): string {
        let retData = "";
        retData = this.maintUnitList.find(e => e.id === id);
        return retData;
    }

    mapMaintItem(id: number): string {
        let retData = "";
        retData = this.taxonomyClassList.find(e => e.id === id);
        return retData;
    }

    mapSubMaintItem(id: number): string {
        let retData = "";
        retData = this.taxonomySubClassList.find(e => e.id === id);
        if(retData === undefined)
        {
            retData = "";
        }
        else{
            return retData;
        }
    }

    mapBuildSpec(id: number): string {
        let retData = "";
        retData = this.taxonomyBuildSpecList.find(e => e.id === id);
        return retData;
    }

    mapManufacturer(id: number): string {
        let retData = "";
        retData = this.taxonomyManufacturerList.find(e => e.id === id);
        return retData;
    }

    classOnselect(event){
        this.classTaxonomyId = parseInt(event.target.value);

        this.fmmtObject.classTaxonomyId = this.classTaxonomyId;

        this._subClassTaxonomyService.getComponentTaxonomySubClassByIds(this.classTaxonomyId, this.customerId, this.siteId)
            .subscribe(out => {
                this.taxonomySubClassList = out;
            });

        this.assetClassType = this.componentTask + ' ' + this.mapMaintItem(this.classTaxonomyId)['componentClass'];

        this.fmmtObject.systemDescription = this.assetClassType;
    }

    subclassOnselect(event){
        this.subClassTaxonomyId = parseInt(event.target.value);

        this.fmmtObject.subClassTaxonomyId = this.subClassTaxonomyId;

        this.assetClassType = this.mapMaintItem(this.classTaxonomyId)['componentClass'] + ' ' + this.mapSubMaintItem(this.subClassTaxonomyId)['subClass']; 

        this.fmmtObject.systemDescription = this.assetClassType;
    }

    buildSpecOnselect(event){
        this.buildSpecTaxonomyId = parseInt(event.target.value);

        this.fmmtObject.buildSpecTaxonomyId = this.buildSpecTaxonomyId;
    }

    manufacturerOnselect(event){
        this.manufacturerTaxonomyId = parseInt(event.target.value);

        this.fmmtObject.manufacturerTaxonomyId = this.manufacturerTaxonomyId;
    }

    isActive(state): boolean {
        return this.stateBullet === state;
    }

    next(): void{
        this.stateBullet++;

        if(this.stateBullet === 4){
            this.isFailureRisk = true;
        }
    }

    create(): void{
        this.stateBullet++;
    }

    switchStep(section: any): void{
        if(section === 1)
        {
            this.stateBullet = 1
        }
        else if(section === 2)
        {
            this.stateBullet = 2
        }
        else if(section === 3)
        {
            this.stateBullet = 3
        }else if(section === 4)
        {
            this.stateBullet = 4
            this.isFailureRisk = true;
        }else if(section === 5)
        {
            this.stateBullet = 5
        }else if(section === 6)
        {
            this.stateBullet = 6
            this.forReview = true;
        }
    }

    onFunctionStatement(data: string){
        this.fmmtObject.componentTaskFunction = data;
    }

    onFailureMode(data: string){
        this.fmmtObject.failureMode = data;
    }

    onFailureEffect(data: string){
        this.fmmtObject.failureEffect = data;
    }

    onFailureCause(data: string){
        this.fmmtObject.failureCause = data;
    }

    onEndEffect(data: string){
        this.fmmtObject.endEffect = data;
    }

    onTaskDesc(data: string){
        this.fmmtObject.taskDescription = data;
    }

    onAcceptLimits(data: string){
        this.fmmtObject.acceptableLimits = data;
    }

    onCorrective(data: string){
        this.fmmtObject.correctiveActions = data;
    }

    onResource(data: string){
        this.fmmtObject.resourceQuantity = data;
    }

    previous(): void {
        if(this.stateBullet > 1) this.stateBullet--;
    }

    computeAll(id:number){
        console.log(id);
        this.consequences = id;
        
        // this.failureRiskTotalScore = 100;

        if(this.likelihood === 3 && this.consequences === 1){
            this.failureRiskTotalScore = this.likelihood1 * this.severityLevel1;
            this.square1 = true;
            this.square2 = false;
            this.square3 = false;
            this.square4 = false;
            this.square5 = false;
            this.square6 = false;
            this.square7 = false;
        }
        else if(this.likelihood === 3 && this.consequences === 3){
            this.failureRiskTotalScore = this.likelihood1 * this.severityLevel2;
            this.square2 = true;
            this.square1 = false;
            this.square3 = false;
            this.square4 = false;
            this.square5 = false;
            this.square6 = false;
            this.square7 = false;
        }
        else if(this.likelihood === 3 && this.consequences === 10){
            this.failureRiskTotalScore = this.likelihood1 * this.severityLevel3;
            this.square3 = true;
            this.square1 = false;
            this.square2 = false;
            this.square4 = false;
            this.square5 = false;
            this.square6 = false;
            this.square7 = false;
        }
        else if(this.likelihood === 3 && this.consequences === 30){
            this.failureRiskTotalScore = this.likelihood1 * this.severityLevel4;
            this.square4 = true;
            this.square1 = false;
            this.square2 = false;
            this.square3 = false;
            this.square5 = false;
            this.square6 = false;
            this.square7 = false;
        }
        else if(this.likelihood === 3 && this.consequences === 100){
            this.failureRiskTotalScore = this.likelihood1 * this.severityLevel5;
            this.square5 = true;
            this.square1 = false;
            this.square2 = false;
            this.square3 = false;
            this.square4 = false;
            this.square6 = false;
            this.square7 = false;
        }
        else if(this.likelihood === 3 && this.consequences === 300){
            this.failureRiskTotalScore = this.likelihood1 * this.severityLevel6;
            this.square6 = true;
            this.square1 = false;
            this.square2 = false;
            this.square3 = false;
            this.square4 = false;
            this.square5 = false;
            this.square7 = false;
        }
        else if(this.likelihood === 3 && this.consequences === 1000){
            this.failureRiskTotalScore = this.likelihood1 * this.severityLevel7;
            this.square7 = true;
            this.square1 = false;
            this.square2 = false;
            this.square3 = false;
            this.square4 = false;
            this.square5 = false;
            this.square6 = false;
        }
        else if(this.likelihood === 1 && this.consequences === 1){
            this.failureRiskTotalScore = this.likelihood2 * this.severityLevel1;
            this.square8 = true;
            this.square9 = false;
            this.square10 = false;
            this.square11 = false;
            this.square12 = false;
            this.square13 = false;
            this.square14 = false;
        }
        else if(this.likelihood === 1 && this.consequences === 3){
            this.failureRiskTotalScore = this.likelihood2 * this.severityLevel2;
            this.square9 = true;
            this.square8 = false;
            this.square10 = false;
            this.square11 = false;
            this.square12 = false;
            this.square13 = false;
            this.square14 = false;
        }
        else if(this.likelihood === 1 && this.consequences === 10){
            this.failureRiskTotalScore = this.likelihood2 * this.severityLevel3;
            this.square10 = true;
            this.square8 = false;
            this.square9 = false;
            this.square11 = false;
            this.square12 = false;
            this.square13 = false;
            this.square14 = false;
        }
        else if(this.likelihood === 1 && this.consequences === 30){
            this.failureRiskTotalScore = this.likelihood2 * this.severityLevel4;
            this.square11 = true;
            this.square8 = false;
            this.square9 = false;
            this.square10 = false;
            this.square12 = false;
            this.square13 = false;
            this.square14 = false;
        }
        else if(this.likelihood === 1 && this.consequences === 100){
            this.failureRiskTotalScore = this.likelihood2 * this.severityLevel5;
            this.square12 = true;
            this.square8 = false;
            this.square9 = false;
            this.square10 = false;
            this.square11 = false;
            this.square13 = false;
            this.square14 = false;
        }
        else if(this.likelihood === 1 && this.consequences === 300){
            this.failureRiskTotalScore = this.likelihood2 * this.severityLevel6;
            this.square13 = true;
            this.square8 = false;
            this.square9 = false;
            this.square10 = false;
            this.square11 = false;
            this.square12 = false;
            this.square14 = false;
        }
        else if(this.likelihood === 1 && this.consequences === 1000){
            this.failureRiskTotalScore = this.likelihood2 * this.severityLevel7;
            this.square14 = true;
            this.square8 = false;
            this.square9 = false;
            this.square10 = false;
            this.square11 = false;
            this.square12 = false;
            this.square13 = false;
        }
        else if(this.likelihood === 0.3 && this.consequences === 1){
            this.failureRiskTotalScore = this.likelihood3 * this.severityLevel1;
            this.square15 = true;
            this.square16 = false;
            this.square17 = false;
            this.square18 = false;
            this.square19 = false;
            this.square20 = false;
            this.square21 = false;
        }
        else if(this.likelihood === 0.3 && this.consequences === 3){
            // this.failureRiskTotalScore = this.likelihood3 * this.severityLevel2;
            this.failureRiskTotalScore = 0.9;
            this.square16 = true;
            this.square15 = false;
            this.square17 = false;
            this.square18 = false;
            this.square19 = false;
            this.square20 = false;
            this.square21 = false;
        }
        else if(this.likelihood === 0.3 && this.consequences === 10){
            this.failureRiskTotalScore = this.likelihood3 * this.severityLevel3;
            this.square17 = true;
            this.square15 = false;
            this.square16 = false;
            this.square18 = false;
            this.square19 = false;
            this.square20 = false;
            this.square21 = false;
        }
        else if(this.likelihood === 0.3 && this.consequences === 30){
            this.failureRiskTotalScore = this.likelihood3 * this.severityLevel4;
            this.square18 = true;
            this.square15 = false;
            this.square16 = false;
            this.square17 = false;
            this.square19 = false;
            this.square20 = false;
            this.square21 = false;
        }
        else if(this.likelihood === 0.3 && this.consequences === 100){
            this.failureRiskTotalScore = this.likelihood3 * this.severityLevel5;
            this.square19 = true;
            this.square15 = false;
            this.square16 = false;
            this.square17 = false;
            this.square18 = false;
            this.square20 = false;
            this.square21 = false;
        }
        else if(this.likelihood === 0.3 && this.consequences === 300){
            this.failureRiskTotalScore = this.likelihood3 * this.severityLevel6;
            this.square20 = true;
            this.square15 = false;
            this.square16 = false;
            this.square17 = false;
            this.square18 = false;
            this.square19 = false;
            this.square21 = false;
        }
        else if(this.likelihood === 0.3 && this.consequences === 1000){
            this.failureRiskTotalScore = this.likelihood3 * this.severityLevel7;
            this.square21 = true;
            this.square15 = false;
            this.square16 = false;
            this.square17 = false;
            this.square18 = false;
            this.square19 = false;
            this.square20 = false;
        }
        else if(this.likelihood === 0.1 && this.consequences === 1){
            this.failureRiskTotalScore = this.likelihood4 * this.severityLevel1;
            this.square22 = true;
            this.square23 = false;
            this.square24 = false;
            this.square25 = false;
            this.square26 = false;
            this.square27 = false;
            this.square28 = false;
        }
        else if(this.likelihood === 0.1 && this.consequences === 3){
            //this.failureRiskTotalScore = this.likelihood4 * this.severityLevel2;
            this.failureRiskTotalScore = 0.3;
            this.square23 = true;
            this.square22 = false;
            this.square24 = false;
            this.square25 = false;
            this.square26 = false;
            this.square27 = false;
            this.square28 = false;
        }
        else if(this.likelihood === 0.1 && this.consequences === 10){
            this.failureRiskTotalScore = this.likelihood4 * this.severityLevel3;
            this.square24 = true;
            this.square22 = false;
            this.square23 = false;
            this.square25 = false;
            this.square26 = false;
            this.square27 = false;
            this.square28 = false;
        }
        else if(this.likelihood === 0.1 && this.consequences === 30){
            this.failureRiskTotalScore = this.likelihood4 * this.severityLevel4;
            this.square25 = true;
            this.square22 = false;
            this.square23 = false;
            this.square24 = false;
            this.square26 = false;
            this.square27 = false;
            this.square28 = false;
        }
        else if(this.likelihood === 0.1 && this.consequences === 100){
            this.failureRiskTotalScore = this.likelihood4 * this.severityLevel5;
            this.square26 = true;
            this.square22 = false;
            this.square23 = false;
            this.square24 = false;
            this.square25 = false;
            this.square27 = false;
            this.square28 = false;
        }
        else if(this.likelihood === 0.1 && this.consequences === 300){
            this.failureRiskTotalScore = this.likelihood4 * this.severityLevel6;
            this.square27 = true;
            this.square22 = false;
            this.square23 = false;
            this.square24 = false;
            this.square25 = false;
            this.square26 = false;
            this.square28 = false;
        }
        else if(this.likelihood === 0.1 && this.consequences === 1000){
            this.failureRiskTotalScore = this.likelihood4 * this.severityLevel7;
            this.square28 = true;
            this.square22 = false;
            this.square23 = false;
            this.square24 = false;
            this.square25 = false;
            this.square26 = false;
            this.square27 = false;
        }
        else if(this.likelihood === 0.03 && this.consequences === 1){
            this.failureRiskTotalScore = this.likelihood5 * this.severityLevel1;
            this.square29 = true;
            this.square30 = false;
            this.square31 = false;
            this.square32 = false;
            this.square33 = false;
            this.square34 = false;
            this.square35 = false;
        }
        else if(this.likelihood === 0.03 && this.consequences === 3){
            this.failureRiskTotalScore = this.likelihood5 * this.severityLevel2;
            this.square30 = true;
            this.square29 = false;
            this.square31 = false;
            this.square32 = false;
            this.square33 = false;
            this.square34 = false;
            this.square35 = false;
        }
        else if(this.likelihood === 0.03 && this.consequences === 10){
            this.failureRiskTotalScore = this.likelihood5 * this.severityLevel3;
            this.square31 = true;
            this.square29 = false;
            this.square30 = false;
            this.square32 = false;
            this.square33 = false;
            this.square34 = false;
            this.square35 = false;
        }
        else if(this.likelihood === 0.03 && this.consequences === 30){
            // this.failureRiskTotalScore = this.likelihood5 * this.severityLevel4;
            this.failureRiskTotalScore = 0.9;
            this.square32 = true;
            this.square29 = false;
            this.square30 = false;
            this.square31 = false;
            this.square33 = false;
            this.square34 = false;
            this.square35 = false;
        }
        else if(this.likelihood === 0.03 && this.consequences === 100){
            this.failureRiskTotalScore = this.likelihood5 * this.severityLevel5;
            this.square33 = true;
            this.square29 = false;
            this.square30 = false;
            this.square31 = false;
            this.square32 = false;
            this.square34 = false;
            this.square35 = false;
        }
        else if(this.likelihood === 0.03 && this.consequences === 300){
            this.failureRiskTotalScore = this.likelihood5 * this.severityLevel6;
            this.square34 = true;
            this.square29 = false;
            this.square30 = false;
            this.square31 = false;
            this.square32 = false;
            this.square33 = false;
            this.square35 = false;
        }
        else if(this.likelihood === 0.03 && this.consequences === 1000){
            this.failureRiskTotalScore = this.likelihood5 * this.severityLevel7;
            this.square35 = true;
            this.square29 = false;
            this.square30 = false;
            this.square31 = false;
            this.square32 = false;
            this.square33 = false;
            this.square34 = false;
        }

        this.fmmtObject.failureRiskTotalScore = this.failureRiskTotalScore;
    }

    mapFrequencyData(id: number): string {
        let retData = "";
        retData = this.frequencyList.find(function (el) {
            return el.id == id;
        });
        return retData;
    }

    mapDurationData(id: number): string {
        let retData = "";
        retData = this.durationList.find(function (el) {
            return el.id == id;
        });
        return retData;
    }

    mapTradeTypeData(id: number): string {
        let retData = "";
        retData = this.tradeTypeList.find(function (el) {
            return el.id == id;
        });
        return retData;
    }

    mapTaskTypeData(id: number): string {
        let retData = "";
        retData = this.taskTypeList.find(function (el) {
            return el.id == id;
        });
        return retData;
    }

    mapOperationalModeData(id: number): string {
        let retData = "";
        retData = this.operationModeList.find(function (el) {
            return el.id == id;
        });
        return retData;
    }

    onFmea(): void{
        this.router.navigate(["/main/fmea"]);
    }

    onExit(): void{
        this.router.navigate(["/main/fmea"]);
    }

    taskTypeOnSelect(event){
        this._taskTypeService.getTaskTypeById(event.target.value)
            .subscribe(res => {
                this.taskTypeId = res.id;
                this.fmmtObject.taskTypeId = this.taskTypeId;
            });
    }

    statusOnSelect(event){
        this.systemStatus = parseInt(event.value);
        // console.log(this.systemStatus)
        this.fmmtObject.systemStatus = this.systemStatus;
        // console.log(event.target.value)
    }

    operationalModeOnSelect(event){
        this._operationModeService.getOperationalModeById(event.target.value)
            .subscribe(res => {
                this.operationalModeId = res.id;
                this.fmmtObject.operationalModeId = this.operationalModeId;
            });
    }

    frequencyOnSelect(event){
        this._frequenceService.getFrequencyById(event.target.value)
            .subscribe(res => {
                this.intervalId = res.id;
                this.fmmtObject.intervalId = this.intervalId;
            });
    }

    durationOnSelect(event){
        this._durationService.getDurationById(event.target.value)
            .subscribe(res => {
                this.durationId = res.id;
                this.fmmtObject.durationId = this.durationId;
            });
    }

    tradeTypeOnSelect(event){
        this._tradeTypeService.getTradeTypeById(event.target.value)
            .subscribe(res => {
                this.tradeTypeId = res.id;
                this.fmmtObject.tradeTypeId = this.tradeTypeId;
            });
    }

    openDialogComment(mode: any, param: number) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {mode: mode, id: param, item: this.fmmtObject };
        this._dataService.setData(dialogConfig.data);
        dialogConfig.width = "600px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        const dialogRef = this.dialog.open(CommentModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
            console.log(res);
            if(res !== "cancel")
            {
                this.isLocked = true;
                this.isLockInfo = true;
                this.isEditable = false;
                this.router.navigate(["/main/fmea"]);
            }else{
                this.isLocked = false;
                this.isLockInfo = false;
                this.isEditable = true;
            }
        });
      }

    saveChanges(){
        this.fmeaObject.componentHierarchyId = this.componentHierarchyId;
        this.fmeaObject.systemDescription = this.assetClassType;
        this.fmeaObject.componentLevel1Id = this.componentHierarchyId;
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
        this.fmeaObject.taskIdentificationNo = this.taskIdentificationNo;
        this.fmeaObject.parentCode = this.parentCode;
        this.fmeaObject.familyTaxonomyId = this.familyTaxonomyId;
        this.fmeaObject.classTaxonomyId = this.classTaxonomyId;
        this.fmeaObject.subClassTaxonomyId = this.subClassTaxonomyId;
        this.fmeaObject.buildSpecTaxonomyId = this.buildSpecTaxonomyId;
        this.fmeaObject.manufacturerTaxonomyId = this.manufacturerTaxonomyId;
        this.fmeaObject.variantId = this.variantId;
        this.fmeaObject.origIndic = this.origIndic;
        this.fmeaObject.id = this.currentId;
        this.fmeaObject.comment = this.comment;
        this.fmeaObject.createdBy = this.createdBy;
        this.fmeaObject.updatedBy = this.user;
        this.fmeaObject.dtCreated = this.dtCreated;
        this.fmeaObject.dtUpdated = this.dtupdated;
        this.fmeaObject.systemStatus = this.systemStatus;

        this.fmmtObject.componentHierarchyId = this.componentHierarchyId;
        this.fmmtObject.systemDescription = this.assetClassType;
        this.fmmtObject.componentLevel1Id = this.componentHierarchyId;
        // this.fmmtObject.componentLevel2Id = this.componentLevel2Id;
        // this.fmmtObject.componentLevel3Id = this.componentLevel3Id;
        // this.fmmtObject.componentLevel4Id = this.componentLevel4Id;
        this.fmmtObject.componentTaskFunction = this.componentTaskFunction;
        this.fmmtObject.failureMode = this.failureMode;
        this.fmmtObject.failureEffect = this.failureEffect;
        this.fmmtObject.failureCause = this.failureCause;
        this.fmmtObject.endEffect = this.endEffect;
        this.fmmtObject.taskDescription = this.taskDescription;
        this.fmmtObject.acceptableLimits = this.acceptableLimits;
        this.fmmtObject.correctiveActions = this.correctiveActions;
        this.fmmtObject.taskTypeId = this.taskTypeId;
        this.fmmtObject.operationalModeId = this.operationalModeId;
        this.fmmtObject.failureRiskTotalScore = this.failureRiskTotalScore;
        this.fmmtObject.intervalId = this.intervalId;
        this.fmmtObject.durationId = this.durationId;
        this.fmmtObject.resourceQuantity = this.resourceQuantity;
        this.fmmtObject.tradeTypeId = this.tradeTypeId;
        this.fmmtObject.taskIdentificationNo = this.taskIdentificationNo;
        this.fmmtObject.parentCode = this.parentCode;
        this.fmmtObject.familyTaxonomyId = this.familyTaxonomyId;
        this.fmmtObject.classTaxonomyId = this.classTaxonomyId;
        this.fmmtObject.subClassTaxonomyId = this.subClassTaxonomyId;
        this.fmmtObject.buildSpecTaxonomyId = this.buildSpecTaxonomyId;
        this.fmmtObject.manufacturerTaxonomyId = this.manufacturerTaxonomyId;
        this.fmmtObject.variantId = this.variantId;
        this.fmmtObject.origIndic = this.origIndic;
        this.fmmtObject.fmmtId = this.currentId;
        this.fmmtObject.comment = this.comment;
        this.fmmtObject.createdBy = this.createdBy;
        this.fmmtObject.updatedBy = this.user;
        this.fmmtObject.dtCreated = this.dtCreated;
        this.fmmtObject.dtUpdated = this.dtupdated;
        this.fmmtObject.systemStatus = this.systemStatus;

        this._fmeaService.updateFMEARecords(this.currentId, this.fmeaObject)
            .subscribe(out => {
                console.log(out);
                this.toastr.success("Successfully updated!", 'Success');
                this.isLocked = true;
                this.isLockInfo = true;

                this._fmeaAssemblyService.getFmeaAsseblyTaskById(this.currentId)
                    .subscribe(foo => {
                        console.log(foo);
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
                                // componentLevel2Id: this.fmmtObject.componentLevel2Id,
                                // componentLevel3Id: this.fmmtObject.componentLevel3Id,
                                // componentLevel4Id: this.fmmtObject.componentLevel4Id,
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
                        })
                    });

                    

                

                // this._fmeaService.getFMEAVariant(this.fmeaObject.taskIdentificationNo)
                //     .subscribe(result => {
                //         console.log(result);
                //         this.fmeavariantsList = result;

                //         this.fmeavariantsList.forEach(x=> {
                //             x.id
                //             x.parentCode
        
                //             if(x.parentCode !== ''){
                //                 this.fmeaObject.id = x.id;
                //                 this.fmeaObject.taskIdentificationNo = "FFTV.000.00" + this.fmeaObject.id;
                //                 this.fmeaObject.parentCode = x.parentCode;
                //                 this._fmeaService.updateFMEARecords(this.fmeaObject.id, this.fmeaObject)
                //                     .subscribe(res => {
                //                 this.toastr.success("Successfully updated!", 'Success');
                //                 });
                //             }
                //             else{
                //                 this.toastr.success("Successfully updated!", 'Success');
                //             }
                //         });
                //     });
            });
    }

    updateMirror():void{
        this._fmeaAssemblyService.upsertTaskAdded(this.fmeaAssemblyList)
            .subscribe(res => {
                console.log(res);
                // this.toastr.success("Successfully assigned task!", 'Success');
            })
    }

    openRevision() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {item: this.fmeaObject };
        this._dataService.setData(dialogConfig.data);
        dialogConfig.width = "900px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        const dialogRef = this.dialog.open(RevisionReportModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
        });
      }

    editFMEA(){
        this.isLocked = false;
        this.isLockInfo = false;
        this.toastr.success("Input fields are enabled!", 'Success');
    }

    deleteFMEA(): void {
        // console.log(id);
        if (confirm("Are you sure to delete " + this.componentTask + " ? This cannot be undone.")) {
            this._fmeaAssemblyService.deleteFMEA(this.currentId)
            .subscribe(out => {
              this.toastr.success('Deleted successfully', 'Success!');
            });
          }
        
    }
}
