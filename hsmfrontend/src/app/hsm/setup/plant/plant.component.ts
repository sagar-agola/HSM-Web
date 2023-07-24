import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

//Services
import { PlantService } from '../../services/plant.services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IPlant } from '../../interfaces/IPlant';
import { PlantModalComponent } from '../../modal/plantmodal/plantmodal.component';
import { UploadModalComponent } from '../../modal/uploadmodal/uploadmodal.component';

@Component({
    selector: "plant-table",
    templateUrl: './plant.component.html',
    styleUrls: [
        './plant.component.scss'
    ]
})

export class PlantComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['id', 'plantCode', 'plantName'];

    ELEMENT_DATA: IPlant[] = [];

    loading: boolean = false;
    default: boolean = false;
    
    dataSource;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private _plantService: PlantService
    ) {
    }
    
    ngOnInit(): void {
        // this.getDataSource();
        // this.default = true;
    }

    getDataSource(): void{
        this._plantService.getPlants()
          .subscribe(res => {
            this.default = false;
            this.loading = false;
            this.ELEMENT_DATA = res;
            this.dataSource = new MatTableDataSource<IPlant>(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          })
      }

    openDialogPlant() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "700px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        const dialogRef = this.dialog.open(PlantModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
            this.ngOnInit();
        });
    }

    openDialogUpload(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "500px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        const dialogRef = this.dialog.open(UploadModalComponent, dialogConfig);
      }
}



