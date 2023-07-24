import { ChangeDetectorRef, Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, Component, Inject, } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { fromEvent, Subject, of as observableOf } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';
//Services

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
import { ComponentTaskService } from '../../services/componenttask.services';
import { FMEAService } from '../../services/fmea.services';


@Component({
  selector: 'transfer-maintunit-modal',
  templateUrl: './transfertomaintunitmodal.component.html',
  styleUrls: ['./transfertomaintunitmodal.component.scss']
})

export class TransferToMaintUnitModalComponent implements OnInit {
    private _target: HTMLElement;

    // dialog container element to resize
    private _container: HTMLElement;

    // Drag handle
    private _handle: HTMLElement;
    private _delta = {x: 0, y: 0};
    private _offset = {x: 0, y: 0};

    private _destroy$ = new Subject<void>();

    private _isResized = false;

    ELEMENT_DATA: IAssetHierarchy[] = [];

    dataSource2;

    taxonomyFamilyList: any[] = [];
    taxonomyClassList: any[] = [];
    taxonomySubClassList: any[] = [];
    taxonomyBuildSpecList: any[] = [];
    taxonomyManufacturerList: any[] = [];
    fmeaAssigntoMaintUnitList: any[] = [];
    fmeaFinaltoMaintUnitList: any[] = [];

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

    familyName: string = "";
    className: string = "";
    subClassName: string = "";
    buildSpecName: string = "";
    manufacturerName: string = "";
    categoryName: string = "";
    assetClassType: string = "";
    totalCount: number;
    categoryId: number;

    familyId: number;
    classId: number;
    subClassId: number;
    buildSpecId: number;
    manufacturerId: number;
    currentId: number;

    optionString: string;

    options: string[] = ['Taxonomy', 'Asset Hierarchy'];

    isSiteFmea: boolean = false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<TransferToMaintUnitModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _fmeaService: FMEAService,
        private _famnilyTaxonomyService: ComponentFamilyService,
        private _classTaxonomyService: ComponentClassService,
        private _subClassTaxonomyService: ComponentSubClassService,
        private _buildSpecTaxonomyService: ComponentBuildSpecService,
        private _manufacturerTaxonomyService: AssetHierarchyManufacturerService,
        private _categoryHierarchyService: CategoryHierarchyService,
        private _componentTaskService: ComponentTaskService,
        private _elementRef: ElementRef,
        private _zone: NgZone,
        private _cd: ChangeDetectorRef) {
        
    }

    ngOnInit(): void {
        this.hierarchy = true;
        this.isHierarchy = true;

        this.data = this._dataService.getData();
        // console.log(this.data.item)
        this.fmeaAssigntoMaintUnitList = this.data.item;

        forkJoin(
            this._componentTaskService.getComponentTask(),
            this._classTaxonomyService.getComponentClass(),
            this._subClassTaxonomyService.getComponentSubClass(),
            this._buildSpecTaxonomyService.getComponentBuildSpec(),
            this._manufacturerTaxonomyService.getAssetManufacturer(),
            ).subscribe(([ct, cl, tp, th, mt]) => {
                this.taxonomyFamilyList = ct.sort((a, b) => (a.componentTaskName < b.componentTaskName ? -1 : 1));
                this.taxonomyClassList = cl.sort((a, b) => (a.componentClass < b.componentClass ? -1 : 1));
                this.taxonomySubClassList = tp.sort((a, b) => (a.subClass < b.subClass ? -1 : 1));
                this.taxonomyBuildSpecList = th;
                this.taxonomyManufacturerList = mt;
            });

        this._elementRef.nativeElement.style.cursor = 'default';
        this._handle = this._elementRef.nativeElement.parentElement.parentElement.parentElement;
        this._target = this._elementRef.nativeElement.parentElement.parentElement.parentElement;
        this._container = this._elementRef.nativeElement.parentElement.parentElement;
        this._container.style.resize = 'both';
        this._container.style.overflow = 'hidden';
    
        // this._setupEvents();
    }

    public ngOnDestroy(): void {
        if (!!this._destroy$ && !this._destroy$.closed) {
          this._destroy$.next();
          this._destroy$.complete();
        }
      }

    familyOnselect(event){
        this.familyId = parseInt(event.target.value);
        // console.log(this.familyId)
        
    }

    classOnselect(event){
        this.classId = parseInt(event.target.value);
        // console.log(this.classId)
    }

    subclassOnselect(event){
        this.subClassId = parseInt(event.target.value);
        // console.log(this.subClassId)
    }

    checkValue(event: any){
        console.log(event);

        if(event.checked === true){
            this.isTaxonomy = true;
            this.isHierarchy = false;
            this.hierarchy = false;
        }
     }

     checkHierarchy(event: any){
        if(event.checked === true){
            this.isHierarchy = true;
            this.isTaxonomy = false;
            this.taxonomy = false;
        }
     }

    close(): void {
        this.dialogRef.close();
    }

    assignTaxonomy(): void{
        this.fmeaAssigntoMaintUnitList.forEach(x => {
            let acclimits  = x.acceptableLimits;
            let builds  = x.buildSpecTaxonomyId;
            let cClass  = this.classId;
            let comHierarchy = x.componentHierarchyId;
            let comLevl1 = x.componentLevel1Id;
            let comTaskFunc = x.componentTaskFunction;
            let cActions  = x.correctiveActions;
            let duration = x.durationId;
            let endEffect = x.endEffect;
            let failureCause = x.failureCause;
            let failureEffect = x.failureEffect;
            let fmode  = x.failureMode;
            let fScore  = x.failureRiskTotalScore;
            let familyCom  = x.familyTaxonomyId;
            let freq  = x.intervalId;
            let unId  = x.id;
            let cManufacture  = x.manufacturerTaxonomyId;
            let operaMode = x.operationalModeId;
            let origIn = x.origIndic;
            let pCode  = x.parentCode;
            let resourceQ = x.resourceQuantity;
            let sClass  = x.subClassTaxonomyId;
            let sysDesc  = x.systemDescription;
            let taskDesc = x.taskDescription;
            let taskIdent  = x.taskIdentificationNo;
            let tType  = x.taskTypeId;
            let tradeType = x.tradeTypeId;
            let variant = x.variantId;
            let comment = x.comment;
            let created = x.createdBy;
            let updated = x.updatedBy;
            let dtcreated = x.dtCreated;
            let dtupdated = x.dtUpdated;
            let sysStatus = x.systemStatus;

            this.fmeaFinaltoMaintUnitList.push({
                acceptableLimits: acclimits,
                buildSpecTaxonomyId: builds,
                classTaxonomyId: this.classId,
                componentHierarchyId: this.familyId,
                componentLevel1Id: this.familyId,
                componentTaskFunction: comTaskFunc,
                correctiveActions: cActions,
                durationId: duration,
                endEffect: endEffect,
                failureCause: failureCause,
                failureEffect: failureEffect,
                failureMode: fmode,
                failureRiskTotalScore: fScore,
                familyTaxonomyId: this.familyId,
                intervalId: freq,
                manufacturerTaxonomyId: cManufacture,
                operationalModeId: operaMode,
                origIndic: origIn,
                parentCode: pCode,
                resourceQuantity: resourceQ,
                subClassTaxonomyId: this.subClassId,
                systemDescription: sysDesc,
                taskDescription: taskDesc,
                taskIdentificationNo: taskIdent,
                taskTypeId: tType,
                tradeTypeId: tradeType,
                variantId: variant,
                comment: comment,
                createdBy: created,
                updatedBy: updated,
                dtcreated: dtcreated,
                dtUpdated: dtupdated,
                systemStatus: sysStatus,
                id: unId
            });
        });

        this._fmeaService.upsertTasktoMaintUnit(this.fmeaFinaltoMaintUnitList)
            .subscribe(res => {
                this.toastr.success("Successfully moved task!", 'Success');
            })

    }

    // private _setupEvents() {
    //     this._zone.runOutsideAngular(() => {
    //       const mousedown$ = fromEvent(this._handle, 'mousedown');
    //       const mousemove$ = fromEvent(document, 'mousemove');
    //       const mouseup$ = fromEvent(document, 'mouseup');
    
    //       const mousedrag$ = mousedown$.pipe(
    //         switchMap((event: MouseEvent) => {
    //           const startX = event.clientX;
    //           const startY = event.clientY;
    
    //           const rectX = this._container.getBoundingClientRect();
    //           if (
    //             // if the user is clicking on the bottom-right corner, he will resize the dialog
    //             startY > rectX.bottom - 15 &&
    //             startY <= rectX.bottom &&
    //             startX > rectX.right - 15 &&
    //             startX <= rectX.right
    //           ) {
    //             this._isResized = true;
    //             return observableOf(null);
    //           }
    
    //           return mousemove$.pipe(
    //             map((innerEvent: MouseEvent) => {
    //               innerEvent.preventDefault();
    //               this._delta = {
    //                 x: innerEvent.clientX - startX,
    //                 y: innerEvent.clientY - startY,
    //               };
    //             }),
    //             takeUntil(mouseup$),
    //           );
    //         }),
    //         takeUntil(this._destroy$),
    //       );
    
    //       mousedrag$.subscribe(() => {
    //         if (this._delta.x === 0 && this._delta.y === 0) {
    //           return;
    //         }
    
    //         this._translate();
    //       });
    
    //       mouseup$.pipe(takeUntil(this._destroy$)).subscribe(() => {
    //         if (this._isResized) {
    //           this._handle.style.width = 'auto';
    //         }
    
    //         this._offset.x += this._delta.x;
    //         this._offset.y += this._delta.y;
    //         this._delta = {x: 0, y: 0};
    //         this._cd.markForCheck();
    //       });
    //     });
    //   }
    
    //   private _translate() {
    //     // this._target.style.left = `${this._offset.x + this._delta.x}px`;
    //     // this._target.style.top = `${this._offset.y + this._delta.y}px`;
    //     // this._target.style.position = 'relative';
    //     requestAnimationFrame(() => {
    //       this._target.style.transform = `
    //         translate(${this._offset.x + this._delta.x}px,
    //                   ${this._offset.y + this._delta.y}px)
    //       `;
    //     });
    //   }
}
