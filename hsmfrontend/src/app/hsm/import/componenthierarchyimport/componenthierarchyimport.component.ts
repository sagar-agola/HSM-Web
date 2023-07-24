import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule, Output, EventEmitter } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UploadComponentModalComponent } from '../../modal/uploadcomponentmodal/uploadcomponentmodal.component';
import { AppSettings } from 'src/app/shared/app.settings';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ImportComponentHierarchyService } from '../../services/importcomponenthierarchy.services';
import { ToastrService } from 'ngx-toastr';
import { CreateComponentModalComponent } from '../../modal/createcomponentmodal/createcomponentmodal.component';
import { IComponentHierarchy } from '../../interfaces/IComponentHierarchy';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CategoryHierarchyService } from '../../services/categoryhierarchy.services';
import { DataService } from 'src/app/shared/services/data.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { HttpClientExt } from 'src/app/shared/services/httpclient.services';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

interface RootObject {
  hierarchy: ComponentHierarchy[];
}

interface ComponentHierarchy {
  Id: number,
  CategoryName: string;  
  Children?: ComponentHierarchy[];
}

interface ExampleFlatNode {
  expandable: boolean;
  id: number;
  name: string;
  level: number;
}

@Component({
    selector: "componenthierarchy-import",
    templateUrl: './componenthierarchyimport.component.html',
    styleUrls: [
        './componenthierarchyimport.component.scss'
    ]
})

export class ComponentHierarchyImportComponent implements OnInit {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ImportComponentHierarchy/ImportExcel`;

    @ViewChild('table', { static: false }) table: ElementRef;

    @ViewChild('fileInput') fileInput;
    public progress: number;
    @Output() public onUploadFinished = new EventEmitter();

    myControl = new FormControl();
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

    message: string ="";
    fileName: string = "";
    file: any;

    loading: boolean = false;
    default: boolean = false;

    isClicked: boolean = false;
    status: boolean = false;

    dataSource2;

    public data: [];
    content: any[]=[];
    categoryHierarchyList: any[] = [];

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

    currentId: number;
    hierarchyName: string = "";
    categoryCode: string = "";
    parentId: number;
    categoryHierarchyId: number;
    componentId: number;

    isAdd: boolean = true;
    isDelete: boolean = false;

    hierarchy: RootObject;

    private _transformer = (node: ComponentHierarchy, level: number) => {
      return {
        expandable: !!node.Children && node.Children.length > 0,
        id: node.Id,
        name: node.CategoryName,
        level: level,
      };
    }

    treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);
  
    treeFlattener = new MatTreeFlattener(
        this._transformer, node => node.level, node => node.expandable, node => node.Children);
  
    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  
    TREE_DATA: ComponentHierarchy[] = [];

    isLoading: boolean = true;
    
    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private http: HttpClientExt,
        private _dataService: DataService,
        private _importComponentHierarchyService: ImportComponentHierarchyService,
        private _categoryHierarchyService: CategoryHierarchyService,
        private toastr: ToastrService,
        private el: ElementRef,
    ) {
    }

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
    
    ngOnInit(): void {

      this._categoryHierarchyService.getComponentCategoryHierarchy()
      .subscribe( res => {    
        this.dataSource.data = JSON.parse(res['hierarchy']);
        this.isLoading = false;
        // console.log(this.dataSource.data)
      });

      this._categoryHierarchyService.getComponentHierarchy()
        .subscribe(out => {
            // console.log(out);
            this.categoryHierarchyList = out;
            this.isLoading = false;
        });

      this.default = true;
        
    }

    nodeClick(node: any): void{
      this.hierarchyName = node;
      console.log(node);
    }

    initializeComponentData(data: IComponentHierarchy): void{
      this.categoryHierarchyObject = data;
    }

    public uploadFile = (files) => {
        this.loading = true;
        if (files.length === 0) {
          return;
        }
     
        let fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
     
        this.http.post(this.controllerApi, formData)
          .subscribe(res => {
            this.loading = false;
            this.toastr.success('Component Hierarchy Excel File uploaded successfully', 'Success!');
          });
    }

    openDialogUpload(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "500px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        const dialogRef = this.dialog.open(UploadComponentModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
            this.ngOnInit();
        });
    }

    openDialogComponent() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "450px";
      dialogConfig.height = "auto";
      dialogConfig.position = { top: '30px' };
      const dialogRef = this.dialog.open(CreateComponentModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(res => {
          this.ngOnInit();
      });
  }

  clickEvent() {
    this.isDelete = true;
    this.isAdd = false;

  }

  clickAdd(){
    this.isDelete = false;
    this.isAdd = true;
  }

  addNewItem(node:any){
    this.componentId = node.id;
    // console.log(this.componentId)

    this._categoryHierarchyService.getComponentByCategoryId(this.componentId)
      .subscribe(res => {
        // console.log(res)
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

  deleteComponent(id: number, name: any){
      console.log(id)
      this._categoryHierarchyService.getCheckComponentHierarchyAttached(id)
        .subscribe(res => {
          // console.log(res);
          this.content = res;
          if(this.content.length >= 1){
            // this.toastr.warning('This Item can not be deleted as there is a attached Task, please remove this task prior to component deletion', 'Warning!');
            confirm("This Item can not be deleted as there is a attached Task, please remove this task prior to component deletion")
          }else{
            if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
                this._categoryHierarchyService.deleteComponentHierarchy(id)
                .subscribe(out => {
                  this.toastr.success('Deleted successfully', 'Success!');
                  this.ngOnInit();
                });
            }
            // console.log("test");
          }
        })
  }

  exportToExcel(): void {

    let fileName = 'HSMAssetClass' + '.xlsx';

    // save to file
    // XLSX.writeFile(wb, fileName);
    let category = document.getElementById('import-table'); 
    let categoryList = document.getElementById('import-oldcategory');

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(category);
    const mu: XLSX.WorkSheet =XLSX.utils.table_to_sheet(categoryList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'New Asset Class');
    XLSX.utils.book_append_sheet(wb, mu, 'Current Asset Class');
    XLSX.writeFile(wb, fileName);
}

    goToCreateHierarchy(){
      this.router.navigate(["/main/create-componenthierarchy"]);
    }
}



