import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule, Output, EventEmitter } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EAMPlanService } from '../../../services/eamplan.services';
import { IEAMPlan } from '../../../interfaces/IEAMPlan';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { AppSettings } from 'src/app/shared/app.settings';


@Component({
    selector: "eamplanimport-form",
    templateUrl: './eamplanimportform.component.html',
    styleUrls: [
        './eamplanimportform.component.scss'
    ]
})

export class EAMPlanImportFormComponent implements OnInit {

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private http: HttpClient,
        private _eamPlanImportService: EAMPlanService,
        private toastr: ToastrService,
    ) {
    }
    
    ngOnInit(): void {
    }
}



