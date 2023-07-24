import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

import { PlantService } from '../services/plant.services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';

@Component({
    selector: "setup-taxonomy",
    templateUrl: './setuptaxonomy.component.html',
    styleUrls: [
        './setuptaxonomy.component.scss'
    ]
})

export class SetupTaxonomyComponent implements OnInit {
    activeId: number;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private _plantService: PlantService,
        private permissionService: PermissionManagerService,
    ) {
    }

    canAccess(roleKey: string): boolean {
        let access: boolean = false;
        access = this.permissionService.isGranted(roleKey);
        return access;
    }
    
    ngOnInit(): void {
        
    }
}



