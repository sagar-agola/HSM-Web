import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

import { PlantService } from '../services/plant.services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IPlant } from '../interfaces/IPlant';

import { PlantModalComponent } from '../modal/plantmodal/plantmodal.component';
import { DurationModalComponent } from '../modal/durationmodal/durationmodal.component';
import { TradeTypeModalComponent } from '../modal/tradetypemodal/tradetypemodal.component';
import { FrequencyModalComponent } from '../modal/frequencymodal/frequencymodal.component';
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';

@Component({
    selector: "setup",
    templateUrl: './setup.component.html',
    styleUrls: [
        './setup.component.scss'
    ]
})

export class SetupComponent implements OnInit {
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



