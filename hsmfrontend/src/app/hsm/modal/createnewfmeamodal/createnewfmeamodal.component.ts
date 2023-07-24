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
import { ComponentTaskService } from '../../services/componenttask.services';
import { ComponentBuildSpecModalComponent } from '../componentbuildspecmodal/componentbuildspecmodal.component';
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';
import { ComponentClassModalComponent } from '../componentclassmodal/componentclassmodal.component';
import { ComponentSubClassModalComponent } from '../componentsubclassmodal/componentsubclassmodal.component';
import { ComponentManufacturerModalComponent } from '../componentmanufacturermodal/componentmanufacturermodal.component';

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
  selector: 'create-new-fmea-modal',
  templateUrl: './createnewfmeamodal.component.html',
  styleUrls: ['./createnewfmeamodal.component.scss']
})

export class CreateNewFMEAModalComponent implements OnInit {
    public data: [];

    hierarchyObject: RootObject;
    ELEMENT_DATA: IAssetHierarchy[] = [];

    dataSource2;

    treeControl = new NestedTreeControl<AssetHierarchy>(node => node.Children);
    dataSource = new MatTreeNestedDataSource<AssetHierarchy>();

    TREE_DATA: AssetHierarchy[] = [];


    taxonomyFamilyList: any[] = [];
    taxonomyClassList: any[] = [];
    taxonomySubClassList: any[] = [];
    taxonomyBuildSpecList: any[] = [];
    taxonomyManufacturerList: any[] = [];

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

    isSiteFmea: boolean = false;
    isMaintUnitSelect: boolean = false;
    isMaintItemSelect: boolean =false;
    isHSMUser: boolean = false;
    isAdmin: boolean = false;

    customerId: number = 0;
    siteId: number = 0;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<CreateNewFMEAModalComponent>,
        @Inject(MAT_DIALOG_DATA) public node: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _tempHierarchyService: TempHierarchyService,
        private _famnilyTaxonomyService: ComponentFamilyService,
        private _classTaxonomyService: ComponentClassService,
        private _subClassTaxonomyService: ComponentSubClassService,
        private _buildSpecTaxonomyService: ComponentBuildSpecService,
        private _manufacturerTaxonomyService: ComponentManufacturerService,
        private _categoryHierarchyService: CategoryHierarchyService,
        private _componentTaskService: ComponentTaskService,
        private userPermissionService: PermissionManagerService) {
            this.dataSource.data = this.TREE_DATA;
            const user = JSON.parse(localStorage.currentUser);
            this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
            // console.log(user);
            this.isAdmin = user?.users?.isAdmin;
            this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
            this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
        
    }

    canAccess(roleKey: string): boolean {
        let access: boolean = false;
        access = this.userPermissionService.isGranted(roleKey);
        return access;
      }

    hasChild = (_: number, node: AssetHierarchy) => !!node.Children && node.Children.length > 0;

    ngOnInit(): void {
        var newdata = this._dataService.getData();
        this.hierarchy = true;
        this.isHierarchy = true;

        console.log(this.node.mode)
        this.familyId = this.node.item;

        if(this.node.mode === 'CreateSiteFMEA'){
            this.isSiteFmea = true;
        }else{
            this.isSiteFmea = false;
        }

        forkJoin(
            this._famnilyTaxonomyService.getComponentFamily(),
            // this._classTaxonomyService.getComponentClass(),
            this._classTaxonomyService.getComponentTaxonomyClassesByIds(this.familyId, this.customerId, this.siteId),
            this._subClassTaxonomyService.getAllSubClassByCustomerSites(this.customerId, this.siteId),
            this._buildSpecTaxonomyService.getAllBuildSpecByCustomerSites(this.customerId, this.siteId),
            this._manufacturerTaxonomyService.getAllManufacturerByCustomerSites(this.customerId, this.siteId),
            this._componentTaskService.getComponentTaskById(this.node.item),
            ).subscribe(([ct, cl, tp, th, mt, tt]) => {
                this.taxonomyFamilyList = ct.filter(e=> e.customerId === 0 && e.siteId === 0);
                this.taxonomyClassList = cl.filter(e=> e.customerId === 0 && e.siteId === 0);
                this.taxonomySubClassList = tp.filter(e=> e.customerId === 0 && e.siteId === 0);
                this.taxonomyBuildSpecList = th.filter(e=> e.customerId === 0 && e.siteId === 0);
                this.taxonomyManufacturerList = mt.filter(e=> e.customerId === 0 && e.siteId === 0);
                this.familyName = tt.componentTaskName;
            });

        // console.log(this.node);
        this.categoryId = this.node.item;
    }

    initializeComponentData(data: IComponentHierarchy): void{
        this.categoryHierarchyObject = data;
    }

    familyOnselect(event){
        this.familyId = parseInt(event.target.value);
        this.isMaintUnitSelect = true;

        this._famnilyTaxonomyService.getComponentFamilyById(this.familyId)
            .subscribe(res => {
                this.familyName = res.familyComponent;
            });

        this._classTaxonomyService.getComponentTaxonomyClassesByIds(this.familyId, this.customerId, this.siteId)
            .subscribe(out => {
                this.taxonomyClassList = out;
            });
        
    }

    classOnselect(event){
        this.classId = parseInt(event.target.value);
        this.isMaintItemSelect = true;

        this._classTaxonomyService.getComponentClassById(this.classId)
            .subscribe(res => {
                this.className = res.componentClass;
                this.className= (res.componentClass != null || res.componentClass != undefined) ? res.componentClass: "";
            });

        this._subClassTaxonomyService.getComponentTaxonomySubClassByIds(this.classId, this.customerId, this.siteId)
            .subscribe(out => {
                this.taxonomySubClassList = out;
            });
    }

    subclassOnselect(event){
        this.subClassId = parseInt(event.target.value);

        this._subClassTaxonomyService.getComponentSubClassById(this.subClassId)
            .subscribe(res => {
                this.subClassName = res.subClass;
                this.subClassName= (res.subClass != null || res.subClass != undefined) ? res.subClass: "";
            })
    }

    buildSpecOnselect(event){
        this.buildSpecId = parseInt(event.target.value);

        this._buildSpecTaxonomyService.getComponentBuildSpecById(this.buildSpecId)
            .subscribe(res => {
                this.buildSpecName = res.buildSpec;
                this.buildSpecName= (res.buildSpec != null || res.buildSpec != undefined) ? res.buildSpec: "";
            })
    }

    manufacturerOnselect(event){
        this.manufacturerId = parseInt(event.target.value);

        this._manufacturerTaxonomyService.getComponentManufacturerById(this.manufacturerId)
            .subscribe(res => {
                this.manufacturerName = res.componentManufacturer;
                this.manufacturerName= (res.componentManufacturer != null || res.componentManufacturer != undefined) ? res.componentManufacturer: "";
            })
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
    

    nodeClick(node: any){
        console.log(node);
        this.assetCode = node;
    }

    openDialogCreate(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "700px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        const dialogRef = this.dialog.open(CreateNewFMEAHierarchyModalComponent, dialogConfig);
      }
      
    goToFMEASiteForm(): void{
        if(this.className === undefined || this.className === null || this.className === ""){
            this.className = '';
            this.assetClassType = this.familyName;
        }
        else if(this.subClassName === undefined || this.subClassName === null || this.subClassName === "")
        {
            this.subClassName = '';
            this.assetClassType = this.familyName;
        }
        else{
            this.assetClassType = this.familyName + '- ' + this.className + '- ' + this.subClassName;
        }
        
        localStorage.setItem("assetclass", this.className);
        localStorage.setItem("componentName", this.categoryName);
        localStorage.setItem("componentid", this.categoryId.toString());
        localStorage.setItem("assetName", this.assetCode);

        // localStorage.setItem("familyId", this.familyId.toString());

        if(this.classId === null || this.classId === undefined || this.classId === 0)
        {
            this.classId = 0;
        }else{
            localStorage.setItem("classId", this.classId.toString());
        }

        if(this.subClassId === null || this.subClassId === undefined || this.subClassId === 0)
        {
            this.subClassId = 0
        }else{
            localStorage.setItem("subclass", this.subClassName);
            localStorage.setItem("subClassId", this.subClassId.toString());
        }

        if(this.buildSpecId === null || this.buildSpecId === undefined || this.buildSpecId === 0)
        {
            this.buildSpecId = 0
        }else{
            localStorage.setItem("buildspec", this.buildSpecName);
            localStorage.setItem("buildSpecId", this.buildSpecId.toString());
        }

        if(this.manufacturerId === null || this.manufacturerId === undefined || this.manufacturerId === 0)
        {
            this.manufacturerId = 0
        }else{
            localStorage.setItem("manufacturer", this.manufacturerName);
            localStorage.setItem("manufacturerId", this.manufacturerId.toString());
        }

        localStorage.removeItem("TaskGroupStrategy");
        this.close();
        this.router.navigate(["/main/fmea-site-form"]);
    }

    goToFMEAForm(): void{
        if(this.className === undefined || this.className === null || this.className === ""){
            this.className = '';
            this.assetClassType = this.familyName;
        }
        else if(this.subClassName === undefined || this.subClassName === null || this.subClassName === "")
        {
            this.subClassName = '';
            this.assetClassType = this.familyName;
        }
        else{
            this.assetClassType = this.familyName + '- ' + this.className + '- ' + this.subClassName;
        }
        
        localStorage.setItem("assetclass", this.className);
        localStorage.setItem("componentName", this.categoryName);
        localStorage.setItem("componentid", this.categoryId.toString());
        localStorage.setItem("assetName", this.assetCode);

        // localStorage.setItem("familyId", this.familyId.toString());

        if(this.classId === null || this.classId === undefined || this.classId === 0)
        {
            this.classId = 0;
        }else{
            localStorage.setItem("classId", this.classId.toString());
        }

        if(this.subClassId === null || this.subClassId === undefined || this.subClassId === 0)
        {
            this.subClassId = 0
        }else{
            localStorage.setItem("subclass", this.subClassName);
            localStorage.setItem("subClassId", this.subClassId.toString());
        }

        if(this.buildSpecId === null || this.buildSpecId === undefined || this.buildSpecId === 0)
        {
            this.buildSpecId = 0
        }else{
            localStorage.setItem("buildspec", this.buildSpecName);
            localStorage.setItem("buildSpecId", this.buildSpecId.toString());
        }

        if(this.manufacturerId === null || this.manufacturerId === undefined || this.manufacturerId === 0)
        {
            this.manufacturerId = 0
        }else{
            localStorage.setItem("manufacturer", this.manufacturerName);
            localStorage.setItem("manufacturerId", this.manufacturerId.toString());
        }
        localStorage.setItem("CREATEHSMFMEA", this.node.mode)
        localStorage.removeItem("TaskGroupStrategy");
        this.close();
        this.router.navigate(["/main/fmea-form"]);
    }

    assignTaxonomy(): void{
        this.categoryHierarchyObject.familyTaxonomyId = this.familyId;
        this.categoryHierarchyObject.classTaxonomyId = this.classId;
        this.categoryHierarchyObject.subClassTaxonomyId = this.subClassId;
        this.categoryHierarchyObject.buildSpecTaxonomyId = this.buildSpecId;
        this.categoryHierarchyObject.manufacturerIdTaxonomyId = this.manufacturerId;

        this._categoryHierarchyService.updateCategoryHierarchyTaxonomy(this.currentId, this.categoryHierarchyObject)
      .subscribe(res => {
        setTimeout(()=>{
              this.toastr.success('Assigned Taxonomy successfully', 'Success!');
          }, 1000);
      });

    }

    openDialogMaintItem(opt: string, data: any, field: any) {
        if(this.canAccess('AddEditMaintItem')) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = "450px";
            dialogConfig.height = "auto";
            dialogConfig.position = { top: '30px' };
            dialogConfig.data = { mode: opt, item: data, paramId: field };
            this._dataService.setData(dialogConfig.data);
            const dialogRef = this.dialog.open(ComponentClassModalComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(res => {
                this.ngOnInit();
            });
        }else{
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
        
    }

    openDialogSubMaintItem(opt: string, data: any, field: any) {
        if(this.canAccess('AddEditMaintSubItem')) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = "450px";
            dialogConfig.height = "auto";
            dialogConfig.position = { top: '30px' };
            dialogConfig.data = { mode: opt, item: data, paramId: field };
            this._dataService.setData(dialogConfig.data);
            const dialogRef = this.dialog.open(ComponentSubClassModalComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(res => {
                this.ngOnInit();
            });
        }else{
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
        
    }

    openDialogBuildSpec(opt: string, data: any) {
        if(this.canAccess('AddEditBuildSpec')) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = "450px";
            dialogConfig.height = "auto";
            dialogConfig.position = { top: '30px' };
            dialogConfig.data = { mode: opt, item: data };
            this._dataService.setData(dialogConfig.data);
            const dialogRef = this.dialog.open(ComponentBuildSpecModalComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(res => {
                this.ngOnInit();
            });
        }else{
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
        
    }

    openDialogManufacturer(opt: string, data: any) {
        if(this.canAccess('AddEditManufacturer')) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = "450px";
            dialogConfig.height = "auto";
            dialogConfig.position = { top: '30px' };
            dialogConfig.data = { mode: opt, item: data };
            this._dataService.setData(dialogConfig.data);
            const dialogRef = this.dialog.open(ComponentManufacturerModalComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(res => {
                this.ngOnInit();
            });
        }else{
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
        
    }
}
