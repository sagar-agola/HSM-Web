import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
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
import { CategoryHierarchySiteService } from '../../services/categoryhierarchysite.services';

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
    selector: "categoryhierarchysite-import",
    templateUrl: './categoryhierarchysiteimport.component.html',
    styleUrls: [
        './categoryhierarchysiteimport.component.scss'
    ]
})

export class CategoryHierarchySiteImportComponent implements OnInit {
    private controllerApi = `${AppSettings.SITE_HOST}/api/CategoryHierarchySite/ImportExcel`;

    @ViewChild('table', { static: false }) table: ElementRef;

    @ViewChild('fileInput') fileInput;
    public progress: number;
    @Output() public onUploadFinished = new EventEmitter();

    myControl = new FormControl();
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

    message: string = "";
    fileName: string = "";
    file: any;

    loading: boolean = false;
    default: boolean = false;

    isClicked: boolean = false;
    status: boolean = false;

    dataSource2;

    public data: [];
    content: any[] = [];
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

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private http: HttpClientExt,
        private _dataService: DataService,
        private _importComponentHierarchyService: ImportComponentHierarchyService,
        private _categoryHierarchySiteService: CategoryHierarchySiteService,
        private toastr: ToastrService,
        private el: ElementRef,
    ) {
    }

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

    ngOnInit(): void {

        // this._categoryHierarchySiteService.getCategoryHierarchySiteTree()
        //     .subscribe(res => {
        //         this.dataSource.data = JSON.parse(res['hierarchy']);
        //         // console.log(this.dataSource.data)
        //     });

        // this._categoryHierarchySiteService.getCategoryHierarchySiteRecords()
        //     .subscribe(out => {
        //         // console.log(out);
        //         this.categoryHierarchyList = out;
        //     });

        this.default = true;

    }

    nodeClick(node: any): void {
        this.hierarchyName = node;
        console.log(node);
    }

    initializeComponentData(data: IComponentHierarchy): void {
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

    openDialogUpload() {
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

    clickAdd() {
        this.isDelete = false;
        this.isAdd = true;
    }

    exportToExcel(): void {

        let fileName = 'SiteAssetClass' + '.xlsx';

        // save to file
        // XLSX.writeFile(wb, fileName);
        let category = document.getElementById('import-table');
        let categoryList = document.getElementById('import-oldcategory');

        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(category);
        const mu: XLSX.WorkSheet = XLSX.utils.table_to_sheet(categoryList);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'New Asset Class');
        XLSX.utils.book_append_sheet(wb, mu, 'Current Asset Class');
        XLSX.writeFile(wb, fileName);
    }
}