import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UploadModalComponent } from '../../modal/uploadmodal/uploadmodal.component';
import { IImportHierarchy } from '../../interfaces/IImportHierarchy';
import { ImportHierarchyService } from '../../services/importhierarchy.services';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { AppSettings } from 'src/app/shared/app.settings';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { HttpClientExt } from 'src/app/shared/services/httpclient.services';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
    selector: "assethierarchy-import",
    templateUrl: './assethierarchyimport.component.html',
    styleUrls: [
        './assethierarchyimport.component.scss'
    ]
})

export class AssetHierarchyImportComponent implements OnInit {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ImportHierarchy/ImportExcel`;

    @ViewChild('table', { static: false }) table: ElementRef;

    @ViewChild('fileInput') fileInput;
    public progress: number;
    @Output() public onUploadFinished = new EventEmitter();

    myControl = new FormControl();
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();


    dataSource;
    inputEl: any;
    message: string = "";
    fileName: string = "";
    file: any;
    loading: boolean = false;
    data: any = [];

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private http: HttpClientExt,
        private _importHierarchyService: ImportHierarchyService,
        private toastr: ToastrService,
    ) {
    }

    ngOnInit(): void {
    }

    openDialogUpload() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "500px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        const dialogRef = this.dialog.open(UploadModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
            this.ngOnInit();
        });
    }

    upload() {
        let formData = new FormData();
        formData.append('upload', this.fileInput.nativeElement.files[0])

        this._importHierarchyService.UploadExcel(formData)
            .subscribe(response => {
                console.log(response);
                this.message = "Successfully uploaded!";
                // if (response.status === 200) {
                //     this.toastr.success('File uploaded successfully', 'Success!');
                // }
            }, error => {
                this.toastr.error('File contents mismatch', error.statusText);
            });
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
                this.toastr.success('Asset Hierarchy File uploaded successfully', 'Success!');
            });

        localStorage.removeItem("hierarchyData");
    }

    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    exportAsXLSX():void {
        this.exportAsExcelFile(this.data, 'sample');
     }


    exportToExcel(): void {
        // table id 
        // let element = document.getElementById('import-table');
        // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        // generate workbook and add the worksheet
        // const wb: XLSX.WorkBook = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        let fileName = 'AssetHierarchy' + '.xlsx';

        // save to file
        // XLSX.writeFile(wb, fileName);

        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, fileName);
    }


    goToCreateAssetHierarchy() {
        this.router.navigate(["/main/create-assethierarchy"]);
    }
}



