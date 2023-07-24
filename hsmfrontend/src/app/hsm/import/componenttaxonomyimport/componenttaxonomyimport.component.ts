import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
    selector: "componenttaxonomy-import",
    templateUrl: './componenttaxonomyimport.component.html',
    styleUrls: [
        './componenttaxonomyimport.component.scss'
    ]
})

export class ComponentTaxonomyImportComponent implements OnInit {

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
    ) {
    }
    
    ngOnInit(): void {
        
    }
}