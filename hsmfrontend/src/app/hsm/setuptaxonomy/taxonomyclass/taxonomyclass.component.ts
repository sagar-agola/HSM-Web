import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

//Services
import {  } from '../../services/frequency.services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ITaxonomyClass, ITaxonomyClassList  } from '../../interfaces/ITaxonomyClass';
import { TaxonomyClassService } from '../../services/taxonomyclass.services';
import { TaxonomyClassModalComponent } from '../../modal/taxonomyclassmodal/taxonomyclassmodal.component';
import { UploadModalComponent } from '../../modal/uploadmodal/uploadmodal.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
    selector: "taxonomy-class",
    templateUrl: './taxonomyclass.component.html',
    styleUrls: [
        './taxonomyclass.component.scss'
    ]
})

export class TaxonomyClassComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['id', 'className', 'categoryName', 'edit', 'delete'];

    ELEMENT_DATA: ITaxonomyClassList[] = [];

    loading: boolean = false;
    default: boolean = false;
    
    dataSource;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _taxonomyClassService: TaxonomyClassService
    ) {
    }
    
    ngOnInit(): void {
        this.getDataSource();
        this.default = true;
    }

    getDataSource(): void{
        this._taxonomyClassService.getTaxonomyClassList()
          .subscribe(res => {
            this.default = false;
            this.loading = false;
            this.ELEMENT_DATA = res;
            this.dataSource = new MatTableDataSource<ITaxonomyClassList>(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          })
      }

      openDialogClass(opt: string, data: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { mode: opt };
        dialogConfig.width = "450px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        dialogConfig.data = { mode: opt, item: data };
        this._dataService.setData(dialogConfig.data);
        const dialogRef = this.dialog.open(TaxonomyClassModalComponent, dialogConfig);
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

    deleteAction(id: number, name: string): void {
        if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
            this._taxonomyClassService.deleteClassTaxonomy(id)
            .subscribe(res => {    
                this.toastr.success("Deleted Successfully!", 'Success');  
                this.ngOnInit();          
            });
        }
    }
}