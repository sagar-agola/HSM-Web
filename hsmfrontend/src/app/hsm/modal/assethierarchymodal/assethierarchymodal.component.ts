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
import { IAssetHierarchy, IAssetHierarchyDataTaxonomy } from '../../interfaces/IAssetHierarchy';
import { TempHierarchyService } from '../../services/temphierarchy.services';
import { AssetHierarchyService } from '../../services/assethierarchy.services';

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
  selector: 'assethierarchy-modal',
  templateUrl: './assethierarchymodal.component.html',
  styleUrls: ['./assethierarchymodal.component.scss']
})

export class AssetHierarchyModalComponent implements OnInit {
    public data: [];

    hierarchyObject: RootObject;
    ELEMENT_DATA: IAssetHierarchy[] = [];

    dataSource2;

    treeControl = new NestedTreeControl<AssetHierarchy>(node => node.Children);
    dataSource = new MatTreeNestedDataSource<AssetHierarchy>();

    TREE_DATA: AssetHierarchy[] = [];


    taxonomyCategoryList: any[] = [];
    taxonomyClassList: any[] = [];
    taxonomyTypeList: any[] = [];

    taxonomyCategoryObject: ITaxonomyCategory;
    taxonomyClassObject: ITaxonomyClass;
    taxonomyTypeObject: ITaxonomyType;

    assetTaxonomyObject: IAssetHierarchyDataTaxonomy;

    classDisabled: boolean = true;
    typeDisabled: boolean = true;

    isTaxonomy: boolean = false;
    isHierarchy: boolean = false;
    isClick: boolean = false;

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
        public dialogRef: MatDialogRef<AssetHierarchyModalComponent>,
        @Inject(MAT_DIALOG_DATA) public node: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _tempHierarchyService: TempHierarchyService,
        private _assetHierarchyService: AssetHierarchyService,
        private _taxonomyCategoryService: TaxonomyCategoryService,
        private _taxonomyClassService: TaxonomyClassService,
        private _taxonomyTypeService: TaxonomyTypeService,) {
            this.dataSource.data = this.TREE_DATA;
        
    }

    hasChild = (_: number, node: AssetHierarchy) => !!node.Children && node.Children.length > 0;

    ngOnInit(): void {
        let hierarchyData = localStorage.getItem("hierarchyData");
        // this.dataObject = this._dataService.getData();
        this.hierarchy = true;
        this.isHierarchy = true;

        if(hierarchyData !== null){
            this.dataSource.data = JSON.parse(hierarchyData);
          }else{
            this.getDataSource();
          }

        // console.log(this.node);
        // this.categoryName = this.node.item;
    }

    getDataSource(){
        this._tempHierarchyService.getAssetHierarchy()
            .subscribe(res => {
                // this.dataSource.data = JSON.parse(res['hierarchy']);
                localStorage.setItem("hierarchyData", JSON.stringify(JSON.parse(res['hierarchy'])));
            });
    }

    categoryOnselect(event){
        this.classDisabled = false;

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

        this._taxonomyTypeService.getTaxonomyTypeByClass(event.target.value)
            .subscribe(res => {
                this.taxonomyTypeList = res;
            });
    }

    close(): void {
        localStorage.setItem("assetcode", this.assetCode.toString());
        this.dialogRef.close();
    }
    

    nodeClick(node: any){
        console.log(node);
        this.assetCode = node;
        localStorage.removeItem("taxonomyCategory");
        localStorage.removeItem("taxonomyClass");
        localStorage.removeItem("taxonomyType");

        this._assetHierarchyService.getAssetHierarchyDataTaxonomy(this.assetCode)
            .subscribe(res => {
                this.assetTaxonomyObject = res;
                this.categoryName = res.categoryName;
                this.className = res.className;
                this.typeName = res.typeName;
            });
        this.isClick = true;
    }

    saveChanges(): void{
        if(this.isClick === true){
            localStorage.setItem("taxonomyName", JSON.stringify(this.assetTaxonomyObject));
            // localStorage.setItem("taxonomyCategory", this.categoryName);
            // localStorage.setItem("taxonomyClass", this.className);
            // localStorage.setItem("taxonomyType", this.typeName);
            this.close();
        }else{
            this.close();
        }
    }

    openDialogCreate(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "700px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        const dialogRef = this.dialog.open(CreateNewFMEAHierarchyModalComponent, dialogConfig);
      }

    goToFMEAForm(): void{
        localStorage.setItem("componentName", this.categoryName);
        localStorage.setItem("assetName", this.assetCode);
        this.close();
        this.router.navigate(["/main/fmea-form"]);
    }
}
