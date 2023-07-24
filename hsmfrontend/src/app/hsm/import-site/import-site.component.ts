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
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';
import { ImportFmeaModalComponent } from '../modal/importmodal/importfmeamodal/importfmeamodal.component';
import { DataService } from 'src/app/shared/services/data.service';
import { ImportMaintainableModalComponent } from '../modal/importmaintainablemodal/importmaintainablemodal.component';
import { ImportFmeaSiteModalComponent } from '../modal/importsitemodal/importfmeasitemodal/importfmeasitemodal.component';


@Component({
    selector: "import-site-page",
    templateUrl: './import-site.component.html',
    styleUrls: [
        './import-site.component.scss'
    ]
})

export class ImportSiteComponent implements OnInit {
    activeId: number;
    isSelected: boolean = true;
    isDisabled: boolean = true;
    destinationId: number = 0;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private _plantService: PlantService,
        private permissionService: PermissionManagerService,
        private _dataService: DataService,
    ) {
    }

    canAccess(roleKey: string): boolean {
        let access: boolean = false;
        access = this.permissionService.isGranted(roleKey);
        return access;
    }
    
    ngOnInit(): void {
        
    }

    openDialogFMEA() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "800px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        dialogConfig.data = { data: 'FMEA'}
        this._dataService.setData(dialogConfig.data);
        const dialogRef = this.dialog.open(ImportFmeaSiteModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
            this.ngOnInit();
        });
    }

    openDialogMaintainable(mode: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "800px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        dialogConfig.data = { data: mode}
        this._dataService.setData(dialogConfig.data);
        const dialogRef = this.dialog.open(ImportMaintainableModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
            this.ngOnInit();
        });
    }
}



