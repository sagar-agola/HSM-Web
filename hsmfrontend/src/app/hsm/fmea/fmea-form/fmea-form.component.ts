import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { FMEASteps } from '../../enum/FMEAStepsEnum';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RevisionReportModalComponent } from '../../modal/revisionreportmodal/revisionreportmodal.component';

//Services
import { FrequencyService } from '../../services/frequency.services';
import { DurationService } from '../../services/duration.services';
import { OperationalModeService } from '../../services/operationalmode.services';
import { TradeTypeService } from '../../services/tradetype.services';
import { TaskTypeService } from '../../services/tasktype.services';
import { FMEAService } from '../../services/fmea.services';
import { DataService } from './../../../shared/services/data.service';

//interface
import { IFrequency } from './../../interfaces/IFrequency';
import { IDuration} from './../../interfaces/IDuration';
import { IOperationalMode} from './../../interfaces/IOperationalMode';
import { ITradeType} from './../../interfaces/ITradeType';
import { ITaskType } from './../../interfaces/ITaskType';
import { IFMEA } from './../../interfaces/IFMEA';
import { forkJoin } from 'rxjs';
import { IComponentHierarchy } from '../../interfaces/IComponentHierarchy';
import { AssetHierarchyService } from '../../services/assethierarchy.services';
import { IAssetHierarchyDataTaxonomy } from '../../interfaces/IAssetHierarchy';
import { ToastrService } from 'ngx-toastr';

//helpers
import { fmeaDefault } from '../../../shared/helpers/default.helpers';
import { ComponentTaskService } from '../../services/componenttask.services';
import { CommentModalComponent } from '../../modal/commentmodal/commentmodal.component';
import { AssignGroupToUserService } from '../../services/assigngrouptouser.services';
import { IAssignGroupToUser } from '../../interfaces/IAssignGroupToUser';
import { ComponentBuildSpecService } from '../../services/componentbuildspec.services';
import { ComponentManufacturerService } from '../../services/componentmanufacturer.services';

@Component({
    selector: "fmea-form",
    templateUrl: './fmea-form.component.html',
    styleUrls: [
        './fmea-form.component.scss'
    ]
})

export class FMEAFormComponent implements OnInit {

    durationList: any[] = [];
    frequencyList: any[] = [];
    operationModeList: any[] = [];
    tradeTypeList: any[] = [];
    taskTypeList: any[] = [];
    componentLevel1List: any[] = [];
    componentLevel2List: any[] = [];
    componentLevel3List: any[] = [];
    maintUnitList: any[] = [];
    taxonomyBuildSpecList: any[] = [];
    taxonomyManufacturerList: any[] = [];

    frequencyObject: IFrequency;
    durationObject: IDuration;
    operationModeObject: IOperationalMode;
    tradeTypeObject: ITradeType;
    taskTypeObject: ITaskType;
    fmeaObject: IFMEA = fmeaDefault();
    componentObject: IComponentHierarchy;
    assetTaxonomyObject: IAssetHierarchyDataTaxonomy;
    assignToUserObject: IAssignGroupToUser;

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

    componentTask: string = "";
    componentLevel1: string = "";
    componentLevel2: string = "";
    componentLevel3: string = "";
    componentLevel4: string = "";

    taxonomyCategoryName: string = "";
    taxonomyClassName: string = "";
    taxonomyTypeName: string = "";

    assetClassType: string ="";
    manufacturerName: string = "";
    subClass: string = "";
    buildSpec: string = "";

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
    isEditable: boolean = false;
    taskId: number;
    assetCode: string = "";
    user: string = "";
    systemStatus: number = 0;
    fmeamode: string = "";

    taskNo: number = 0;
    tempNo: number = 0;

    statusList: any = [
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
        ,
        {
            "name": "Approved",
            "value": 4
        },
        {
            "name": "Rejected",
            "value": 5
        },
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

    myControl = new FormControl();
    customerId: number = 0;
    siteId: number = 0;

    isHSMUser: boolean = false;
    isAdmin: boolean = false;

    constructor(
        // @Inject(FormData) public data: any,
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private _dataService: DataService,
        private _frequenceService: FrequencyService,
        private _durationService: DurationService,
        private _operationModeService: OperationalModeService,
        private _tradeTypeService: TradeTypeService,
        private _taskTypeService: TaskTypeService,
        private _fmeaService: FMEAService,
        private _assetHierarchyService: AssetHierarchyService,
        private _componentTaskService: ComponentTaskService,
        private _assignToUserService: AssignGroupToUserService,
        private _buildSpecTaxonomyService: ComponentBuildSpecService,
        private _manufacturerTaxonomyService: ComponentManufacturerService,
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
        var componentCode = localStorage.getItem("componentName");
        var componentid = localStorage.getItem("componentid");
        var assetHierarchy = localStorage.getItem("assetName");
        var taskGroup = localStorage.getItem("TaskGroupStrategy");
        var assetcode = localStorage.getItem("assetcode");
        var taskid = +localStorage.getItem("taskId");

        this.taskId = taskid;
        this.assetCode = assetcode;
        this.componentName = componentCode;
        this.componentHierarchyId = parseInt(componentid);
        this.assetClassType = localStorage.getItem("assetclass");
        this.manufacturerName = localStorage.getItem("manufacturer");
        this.buildSpec = localStorage.getItem("buildspec");
        this.subClass = localStorage.getItem("subclass");
        this.familyTaxonomyId = +localStorage.getItem("familyId");
        this.classTaxonomyId = +localStorage.getItem("classId");
        this.subClassTaxonomyId = +localStorage.getItem("subClassId");
        this.buildSpecTaxonomyId = +localStorage.getItem("buildSpecId");
        this.manufacturerTaxonomyId = +localStorage.getItem("manufacturerId");
        this.fmeamode = localStorage.getItem("CREATEHSMFMEA");

        // console.log(this.fmeamode)

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
                this.taskIdentificationNo = "FFT.0000000" + this.tempNo;
            }

            if(this.taskNo >= 99){
                this.taskIdentificationNo = "FFT.000000" + this.tempNo;
            }

            if(this.taskNo >= 999){
                this.taskIdentificationNo = "FFT.00000" + this.tempNo;
            }

            if(this.taskNo >= 9999){
                this.taskIdentificationNo = "FFT.0000" + this.tempNo;
            }

            if(this.taskNo >= 99999){
                this.taskIdentificationNo = "FFT.000" + this.tempNo; 
            }

            if(this.taskNo >= 999999){
                this.taskIdentificationNo = "FFT.00"  + this.tempNo;
            }
            if(this.taskNo >= 9999999){
                this.taskIdentificationNo = "FFT.0"  + this.tempNo;
            }
            if(this.taskNo >= 99999999){
                this.taskIdentificationNo = "FFT."  + this.tempNo;
            }
            if(this.taskNo < 9){
                this.taskIdentificationNo = "FFT.00000000"   + this.tempNo;
            }
        });
        
        if(taskGroup){
            // let taxonomyData = JSON.parse(localStorage.getItem("taxonomyData"));
            // this.taxCategoryId = taxonomyData.categoryId;
            // this.taxClassId = taxonomyData.classId;
            // this.taxTypeId = taxonomyData.typeId;
            // this.componentName = componentCode;

            forkJoin(
                this._frequenceService.getAllFrequencyByCustomerSites(this.customerId, this.siteId),
                this._durationService.getAllDurationByCustomerSites(this.customerId, this.siteId),
                this._tradeTypeService.GetAllTradeTypeByCustomerSites(this.customerId, this.siteId),
                this._operationModeService.getOperationalMode(),
                this._taskTypeService.getAllTaskTypeByCustomerSites(this.customerId, this.siteId),
                this._fmeaService.getFMEAByComponentId(this.componentHierarchyId),
                this._componentTaskService.getComponentTaskById(this.componentHierarchyId),
                // this._assetHierarchyService.getAssetHierarchyDataTaxonomy(assetcode),
                ).subscribe(([fr, dr, tt, op, ty, cc]) => {
                    this.frequencyList = fr.filter(e=> e.customerId === 0 && e.siteId === 0);
                    this.durationList = dr.filter(e=> e.customerId === 0 && e.siteId === 0);
                    this.tradeTypeList = tt.filter(e=> e.customerId === 0 && e.siteId === 0);
                    this.operationModeList = op;
                    this.taskTypeList = ty.filter(e=> e.customerId === 0 && e.siteId === 0);
                    this.componentLevel1List = cc;
                    this.isLoading = false;
                    // this.assetTaxonomyObject = dt;
                    // this.assetHierarchyId = dt.id;
                    // this.taxonomyCategoryName = dt.categoryName;
                    // this.taxonomyClassName = dt.className;
                    // this.taxonomyTypeName = dt.typeName;
                    // this.taxonomyCategoryId = dt.categoryId;
                    // this.taxonomyClassId = dt.classId;
                    // this.taxonomyTypeId = dt.typeId;
                    // this.assetClassType = this.taxonomyCategoryName + '- ' + this.taxonomyClassName + '- ' + this.taxonomyTypeName;
                    
                });

                this.assetHierarchyCode = assetHierarchy;
                // this.componentHierarchyCode = componentCode;
                

                this.severityLevel1 = 1;
                this.severityLevel2 = 3;
                this.severityLevel3 = 10;
                this.severityLevel4 = 30;
                this.severityLevel5 = 100;
                this.severityLevel6 = 300;
                this.severityLevel7 = 1000;
                this.likelihood1 = 3;
                this.likelihood2 = 1;
                this.likelihood3 = 0.3;
                this.likelihood4 = 0.1;
                this.likelihood5 = 0.03;
        }
        else{
            forkJoin(
                this._frequenceService.getAllFrequencyByCustomerSites(this.customerId, this.siteId),
                this._durationService.getAllDurationByCustomerSites(this.customerId, this.siteId),
                this._tradeTypeService.GetAllTradeTypeByCustomerSites(this.customerId, this.siteId),
                this._operationModeService.getOperationalMode(),
                this._taskTypeService.getAllTaskTypeByCustomerSites(this.customerId, this.siteId),
                this._fmeaService.getFMEAByComponentId(this.componentHierarchyId),
                this._componentTaskService.getComponentTaskById(this.componentHierarchyId),
                this._buildSpecTaxonomyService.getAllBuildSpecByCustomerSites(this.customerId, this.siteId),
                this._manufacturerTaxonomyService.getAllManufacturerByCustomerSites(this.customerId, this.siteId),
                // this._assetHierarchyService.getAssetHierarchyDataTaxonomy(assetHierarchy),
                ).subscribe(([fr, dr, tt, op, ty, cc, ct, bs, mf]) => {
                    this.frequencyList = fr.filter(e=> e.customerId === 0 && e.siteId === 0);
                    this.durationList = dr.filter(e=> e.customerId === 0 && e.siteId === 0);
                    this.tradeTypeList = tt.filter(e=> e.customerId === 0 && e.siteId === 0);
                    this.operationModeList = op;
                    this.taskTypeList = ty.filter(e=> e.customerId === 0 && e.siteId === 0);
                    this.componentLevel1List = cc;
                    this.componentTask = ct.componentTaskName;
                    // console.log(ct)
                    this.maintUnitList = ct;
                    this.taxonomyBuildSpecList = bs.filter(e=> e.customerId === 0 && e.siteId === 0);
                    this.taxonomyManufacturerList = mf.filter(e=> e.customerId === 0 && e.siteId === 0);
                    this.fmeaObject.componentHierarchyId = this.componentHierarchyId;
                    this.fmeaObject.taskIdentificationNo = this.taskIdentificationNo;
                    this.fmeaObject.componentTaskFunction = this.componentTaskFunction;
                    this.fmeaObject.familyTaxonomyId = this.componentHierarchyId;
                    this.fmeaObject.classTaxonomyId = this.classTaxonomyId;
                    this.fmeaObject.subClassTaxonomyId = this.subClassTaxonomyId;
                    this.fmeaObject.buildSpecTaxonomyId = this.buildSpecTaxonomyId;
                    this.fmeaObject.manufacturerTaxonomyId = this.manufacturerTaxonomyId;
                    this.fmeaObject.updatedBy = this.user;
                    this.fmeaObject.createdBy = this.user;
                    this.fmeaObject.origIndic = 1;
                    this.fmeaObject.parentCode = '';
                    this.fmeaObject.systemDescription = this.assetClassType;
                    this.isLoading = false;
                });

                this.assetHierarchyCode = assetHierarchy;
                
                this.assetHierarchyCode = assetHierarchy;
                this.systemStatus = 1;
                // this.componentHierarchyCode = componentCode;
                

                this.severityLevel1 = 1;
                this.severityLevel2 = 3;
                this.severityLevel3 = 10;
                this.severityLevel4 = 30;
                this.severityLevel5 = 100;
                this.severityLevel6 = 300;
                this.severityLevel7 = 1000;
                this.likelihood1 = 3;
                this.likelihood2 = 1;
                this.likelihood3 = 0.3;
                this.likelihood4 = 0.1;
                this.likelihood5 = 0.03;
        }
        
    }

    isActive(state): boolean {
        return this.stateBullet === state;
    }

    next(): void{
        this.stateBullet++;

        if(this.stateBullet === 3){
            
        }

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
        }
    }

    previous(): void {
        if(this.stateBullet > 1) this.stateBullet--;
    }

    mapStatusData(id: number): string {
        let retData = "";
        retData = this.statusList.find(e => e.value === id);
        return retData;
    }

    mapMaintUnitData(id: number): string {
        let retData = "";
        retData = this.maintUnitList.find(function (el) {
            return el.id == id;
        });
        return retData;
    }

    buildSpecOnselect(event){
        this.buildSpecTaxonomyId = parseInt(event.target.value);

        this.fmeaObject.buildSpecTaxonomyId = this.buildSpecTaxonomyId;
    }

    manufacturerOnselect(event){
        this.manufacturerTaxonomyId = parseInt(event.target.value);

        this.fmeaObject.manufacturerTaxonomyId = this.manufacturerTaxonomyId;
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

    compLevel1OnSelect(event){
        this._fmeaService.getFMEAByComponentById(event.target.value)
            .subscribe(res => {
                this.componentLevel2List = res;
            });
    }

    compLevel2OnSelect(event){
        this._fmeaService.getFMEAByComponentById(event.target.value)
            .subscribe(res => {
                this.componentLevel3List = res;
            });
    }

    onFunctionStatement(data: string){
        this.fmeaObject.componentTaskFunction = data;
    }

    onFailureMode(data: string){
        this.fmeaObject.failureMode = data;
    }

    onFailureEffect(data: string){
        this.fmeaObject.failureEffect = data;
    }

    onFailureCause(data: string){
        this.fmeaObject.failureCause = data;
    }

    onEndEffect(data: string){
        this.fmeaObject.endEffect = data;
    }

    onTaskDesc(data: string){
        this.fmeaObject.taskDescription = data;
    }

    onAcceptLimits(data: string){
        this.fmeaObject.acceptableLimits = data;
    }

    onCorrective(data: string){
        this.fmeaObject.correctiveActions = data;
    }

    onResource(data: string){
        this.fmeaObject.resourceQuantity = data;
    }

    onClick1(){
        console.log(1);
    }

    openDialogRevision(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "860px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        const dialogRef = this.dialog.open(RevisionReportModalComponent, dialogConfig);
      }

    clickLikelihood(id: number){
        console.log(id);
        this.likelihood = id;

        this.isSelected = true;
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

        this.fmeaObject.failureRiskTotalScore = this.failureRiskTotalScore;
    }

    taskTypeOnSelect(event){
        this._taskTypeService.getTaskTypeById(event.target.value)
            .subscribe(res => {
                this.taskTypeId = res.id;
                this.fmeaObject.taskTypeId = this.taskTypeId;
            });
    }

    operationalModeOnSelect(event){
        this._operationModeService.getOperationalModeById(event.target.value)
            .subscribe(res => {
                this.operationalModeId = res.id;
                this.fmeaObject.operationalModeId = this.operationalModeId;
            });
    }

    frequencyOnSelect(event){
        this._frequenceService.getFrequencyById(event.target.value)
            .subscribe(res => {
                this.intervalId = res.id;
                this.fmeaObject.intervalId = this.intervalId;
            });
    }

    durationOnSelect(event){
        this._durationService.getDurationById(event.target.value)
            .subscribe(res => {
                this.durationId = res.id;
                this.fmeaObject.durationId = this.durationId;
            });
    }

    tradeTypeOnSelect(event){
        this._tradeTypeService.getTradeTypeById(event.target.value)
            .subscribe(res => {
                this.tradeTypeId = res.id;
                this.fmeaObject.tradeTypeId = this.tradeTypeId;
            });
    }

    openDialogComment(mode: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {mode: mode, item: this.fmeaObject };
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
                this.router.navigate(["/main/component-task-list"]);
            }else{
                this.isLocked = false;
            }
        });
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
        this.fmeaObject.parentCode = '';
        this.fmeaObject.origIndic = 1;
        this.fmeaObject.familyTaxonomyId = this.componentHierarchyId;
        this.fmeaObject.classTaxonomyId = this.classTaxonomyId;
        this.fmeaObject.subClassTaxonomyId = this.subClassTaxonomyId;
        this.fmeaObject.buildSpecTaxonomyId = this.buildSpecTaxonomyId;
        this.fmeaObject.manufacturerTaxonomyId = this.manufacturerTaxonomyId;
        // this.taskIdentificationNo = "";
        this.fmeaObject.taskIdentificationNo = this.taskIdentificationNo;
        this.fmeaObject.variantId = this.variantId;

        this._fmeaService.addFMEA(this.fmeaObject)
            .subscribe(res =>{
                // console.log(res);
                this.isLocked = true;
                // this.fmeaObject.taskIdentificationNo = "FFT.000.00" + res.id;
                this.fmeaObject.id = res.id;
                this._fmeaService.updateFMEARecords(this.fmeaObject.id, this.fmeaObject)
                    .subscribe(out => {
                        // this.taskIdentificationNo = this.fmeaObject.taskIdentificationNo;
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
                    });
            });
    }

    onFmea(): void{
        var taskGroup = localStorage.getItem("TaskGroupStrategy");
        localStorage.removeItem("assetclass");
        localStorage.removeItem("manufacturer");
        localStorage.removeItem("subclass");
        localStorage.removeItem("buildspec");
        localStorage.removeItem("familyId");
        localStorage.removeItem("classId");
        localStorage.removeItem("subClassId");
        localStorage.removeItem("buildSpecId");
        localStorage.removeItem("manufacturerId");
        localStorage.removeItem("CREATEHSMFMEA");

        if(taskGroup){
            localStorage.setItem('fmeaform', 'fmea');
            localStorage.setItem('source', '2');
            localStorage.setItem('taskid', this.taskId.toString());
            localStorage.setItem('taxcategoryid', this.taxonomyCategoryId.toString());
            localStorage.setItem('taxclassid', this.taxonomyClassId.toString());
            localStorage.setItem('taxtypeid', this.taxonomyTypeId.toString());
            localStorage.setItem('assetcode', this.assetCode);
            localStorage.setItem('componentname', this.componentName);
            this.router.navigate(["/main/asset-task-group-form"]);
            // localStorage.removeItem("componentName");
        }else{
            this.router.navigate(["/main/component-task-list"]);
        }
    }

    editFMEA(){
        this.isLocked = false;
    }
}



