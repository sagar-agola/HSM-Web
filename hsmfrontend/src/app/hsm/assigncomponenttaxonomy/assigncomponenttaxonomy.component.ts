import { Component, OnInit, Inject, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../shared/services/data.service';

//Services

//interface
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AppSettings } from 'src/app/shared/app.settings';
import { FormControl } from '@angular/forms';
import { TempHierarchyService } from '../services/temphierarchy.services';
import { IAssetHierarchy, IAssetHierarchyList, IAssetHierarchyParam } from '../interfaces/IAssetHierarchy';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AssignTaxonomyModalComponent } from '../modal/assigntaxonomymodal/assigntaxonomymodal.component';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { AssetHierarchyService } from '../services/assethierarchy.services';
import { AssignTaxonomyEditModalComponent } from '../modal/assigntaxonomyeditmodal/assigntaxonomyeditmodal.component';
import { ITaxonomyIdList } from '../interfaces/ITempHierarchy';
import { CategoryHierarchyService } from '../services/categoryhierarchy.services';
import { ComTaxonomyCategoryService } from '../services/comtaxonomycategory.services';
import { IComTaxonomyType } from '../interfaces/ITaxonomyType';
import { IComTaxonomyClass } from '../interfaces/ITaxonomyClass';
import { IComTaxonomyCategory, ITaxonomyCategory } from '../interfaces/ITaxonomyCategory';
import { ComTaxonomyClassService } from '../services/comtaxonomyclass.services';
import { ComTaxonomyTypeService } from '../services/comtaxonomytype.services';
import { IComponentHierarchy } from '../interfaces/IComponentHierarchy';
import { CreateComponentModalComponent } from '../modal/createcomponentmodal/createcomponentmodal.component';

interface RootObject {
  hierarchy: ComponentHierarchy[];
}

interface ComponentHierarchy {
  CategoryName: string;  
  Children?: ComponentHierarchy[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'assign-component-taxonomy',
  templateUrl: './assigncomponenttaxonomy.component.html',
  styleUrls: ['./assigncomponenttaxonomy.component.scss']
})

export class AssignComponentTaxonomyComponent implements OnInit {
  @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('TABLE', {static: true}) table: ElementRef;

  loading: boolean = false;
  default: boolean = false;

  isClicked: boolean = false;
  status: boolean = false;

  dataSource2;

  public data: [];

  taxonomyCategoryList: any[] = [];
  taxonomyClassList: any[] = [];
  taxonomyTypeList: any[] = [];

    taxTypeObject: IComTaxonomyType = {
        id: 0,
        typeName: '',
        ctaxonomyCategoryId: 0,
        ctaxonomyClassId: 0
    };

    taxClassObject: IComTaxonomyClass = {
        id: 0,
        className: '',
        ctaxonomyCategoryId: 0
    };

    taxCategoryObject: ITaxonomyCategory = {
        id: 0,
        categoryName: ''
    }

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

    typeName: string = "";
    categoryId: number;
    classId: number;
    typeId: number;
    currentId: number;
    hierarchyName: string = "";
    categoryCode: string = "";
    parentId: number;
    categoryHierarchyId: number;


  hierarchy: RootObject;

  private _transformer = (node: ComponentHierarchy, level: number) => {
    return {
      expandable: !!node.Children && node.Children.length > 0,
      name: node.CategoryName,
      level: level,
    };
  }

  isLoading: boolean = false;

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.Children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  TREE_DATA: ComponentHierarchy[] = [];


  myControl = new FormControl();

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private http: HttpClient,
    public toastr: ToastrService,
    private _dataService: DataService,
    private _categoryHierarchyService: CategoryHierarchyService,
    private _classService: ComTaxonomyClassService,
    private _categoryService: ComTaxonomyCategoryService,
    private _typeService: ComTaxonomyTypeService,
    private el: ElementRef,) {
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
    
  ngOnInit(): void {
    this.isLoading = true;
    this._categoryHierarchyService.getComponentCategoryHierarchy()
      .subscribe( res => {    
        this.dataSource.data = JSON.parse(res['hierarchy']);
      });

      this.default = true;

      forkJoin(
        this._categoryService.getTaxonomyCategory(),
        this._classService.getTaxonomyClass(),
        this._typeService.getTaxonomyType(),
        // this._typeService.getTaxonomyTypeById(this.currentId),
        ).subscribe(([ct, cl, ty]) => {
            this.taxonomyCategoryList = ct;
            this.taxonomyClassList = cl;
            this.taxonomyTypeList = ty;
            this.isLoading = false;
            // console.log(tt);
            // this.initializeTypeData(tt);
        });
  }

  nodeClick(node: any): void{
    this.hierarchyName = node;
    console.log(node);

    this._categoryHierarchyService.getComponentByCategoryName(node)
      .subscribe(res => {
        // console.log(res);
        this.currentId = res.id;
        // console.log(this.currentId)

        this._categoryHierarchyService.getComponentById(this.currentId)
          .subscribe(out => {
            this.initializeComponentData(out);
          });
        
      })
  }

  initializeCategoryData(data: IComTaxonomyCategory): void{
    this.taxCategoryObject = data;
    // this.categoryId = data.ahcategoryId;
    this.categoryId = this.taxCategoryObject.id;

  }

  initializeClassData(data: IComTaxonomyClass): void{
    this.taxClassObject = data;
    // this.categoryId = data.ahcategoryId;
    this.classId = this.taxClassObject.id;

  }

  initializeTypeData(data: IComTaxonomyType): void{
    this.taxTypeObject = data;

    this.typeName = data.typeName;
    // this.categoryId = data.ahcategoryId;
    this.typeId = this.taxTypeObject.id;

  }

  initializeComponentData(data: IComponentHierarchy): void{
    this.categoryHierarchyObject = data;

    // this.categoryId = this.categoryHierarchyObject.comTaxonomyCategoryId;
    // this.classId = this.categoryHierarchyObject.comTaxonomyClassId;
    // this.typeId = this.categoryHierarchyObject.comTaxonomyTypeId;
  }

  clickEvent() {
    this.status = !this.status;
    //this.statusLink = !this.statusLink;

  }

  categoryOnselect(event){
    this.categoryId = parseInt(event.target.value);

    this._classService.getTaxonomyClassByCategory(event.target.value)
      .subscribe(res => {
          this.taxonomyClassList = res;
      });
  }

  classOnselect(event){
    this.classId = parseInt(event.target.value);

    this._typeService.getTaxonomyTypeByClass(this.classId)
      .subscribe(res => {
        this.taxonomyTypeList = res;
      });
    
  }

  typeOnselect(event){
    this.typeId = parseInt(event.target.value);
  }

  assignChanges(): void{
    // this.categoryHierarchyObject.comTaxonomyCategoryId = this.categoryId;
    // this.categoryHierarchyObject.comTaxonomyClassId = this.classId;
    // this.categoryHierarchyObject.comTaxonomyTypeId = this.typeId;

    this._categoryHierarchyService.updateCategoryHierarchyTaxonomy(this.currentId, this.categoryHierarchyObject)
      .subscribe(res => {
        setTimeout(()=>{
              this.toastr.success('Assigned Taxonomy successfully', 'Success!');
          }, 1000);
      });
  }

  addNewItem(node:any){
    // console.log(node)

    this._categoryHierarchyService.getComponentByCategoryName(node)
      .subscribe(res => {
          this.categoryHierarchyObject = res;

          const dialogConfig = new MatDialogConfig();
          dialogConfig.width = "450px";
          dialogConfig.height = "auto";
          dialogConfig.position = { top: '30px' };
          dialogConfig.data = { mode: 'add2', item: this.categoryHierarchyObject };
          this._dataService.setData(dialogConfig.data);
          const dialogRef = this.dialog.open(CreateComponentModalComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(res => {
              this.ngOnInit();
          });
      });
  }

  addLevel1(){
    this._categoryHierarchyService.getComponentCategoryHierarchyLastCode()
      .subscribe(res => {
        this.categoryHierarchyObject = res;
        // console.log(res);

        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "450px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        dialogConfig.data = { mode: 'add1', item: this.categoryHierarchyObject };
        this._dataService.setData(dialogConfig.data);
        const dialogRef = this.dialog.open(CreateComponentModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
            this.ngOnInit();
        });
      });
  }

}
