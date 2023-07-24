import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppSettings } from 'src/app/shared/app.settings';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MaintenanceItemImportService } from '../../services/maintenanceitemimport.services';
import { ToastrService } from 'ngx-toastr';

import * as XLSX from 'xlsx';
import { HttpClientExt } from 'src/app/shared/services/httpclient.services';

@Component({
  selector: "maintitem-import",
  templateUrl: './maintenanceitem.component.html',
  styleUrls: [
    './maintenanceitem.component.scss'
  ]
})

export class MaintenanceItemComponent implements OnInit {
  private controllerApi = `${AppSettings.SITE_HOST}/api/ImportMaintenanceItem/ImportExcelData`;

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


  constructor(
    private router: Router,
    private _eref: ElementRef,
    public dialog: MatDialog,
    private http: HttpClientExt,
    private _importMaintItemService: MaintenanceItemImportService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {

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
          this.toastr.success('Maintenance Item File uploaded successfully', 'Success!');
          this.loading = false;
      });
  }

  exportToExcel(): void {
    // table id 
    // let element = document.getElementById('import-table');
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    // generate workbook and add the worksheet
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    let fileName = 'MaintenanceItem' + '.xlsx';

    // save to file
    // XLSX.writeFile(wb, fileName);

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }
}