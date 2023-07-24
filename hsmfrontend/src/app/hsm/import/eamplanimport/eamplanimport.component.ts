import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule, Output, EventEmitter } from '@angular/core';
import {Router} from '@angular/router';
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
import { ToastrService } from 'ngx-toastr';
import { HttpClientExt } from 'src/app/shared/services/httpclient.services';


@Component({
    selector: "eamplan-import",
    templateUrl: './eamplanimport.component.html',
    styleUrls: [
        './eamplanimport.component.scss'
    ]
})

export class EAMPlanImportComponent implements OnInit {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ImportEAM/ImportExcel`;

    @ViewChild('fileInput') fileInput;
    public progress: number;
    @Output() public onUploadFinished = new EventEmitter();

    myControl = new FormControl();
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

    message: string ="";
    fileName: string = "";
    file: any;
    loading: boolean = false;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private http: HttpClientExt,
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
              this.loading = false;
              this.toastr.success('EAM Plan Excel File uploaded successfully', 'Success!');
          });
    }
}