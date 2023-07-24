import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule, Output, EventEmitter } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IImportHierarchy } from '../../../interfaces/IImportHierarchy';
import { ImportHierarchyService } from '../../../services/importhierarchy.services';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { AppSettings } from 'src/app/shared/app.settings';


@Component({
    selector: "assethierarchyimport-form",
    templateUrl: './assethierarchyimportform.component.html',
    styleUrls: [
        './assethierarchyimportform.component.scss'
    ]
})

export class AssetHierarchyImportFormComponent implements OnInit {

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private http: HttpClient,
        private _importHierarchyService: ImportHierarchyService,
        private toastr: ToastrService,
    ) {
    }
    
    ngOnInit(): void {
    }
}



