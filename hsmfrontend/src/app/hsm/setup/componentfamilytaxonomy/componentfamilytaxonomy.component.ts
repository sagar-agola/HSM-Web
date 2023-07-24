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
import { IComponentFamilyTaxonomy } from '../../interfaces/IComponentTaxonomy';
import { ComponentFamilyService } from '../../services/componentfamily.services';
import { TaxonomyCategoryModalComponent } from '../../modal/taxonomycategorymodal/taxonomycategorymodal.component';
import { UploadModalComponent } from '../../modal/uploadmodal/uploadmodal.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { AssetBusinessTypeModalComponent  } from '../../modal/assetbusinesstypemodal/assetbusinesstypemodal.component';
import { ComponentFamilyModalComponent } from '../../modal/componentfamilymodal/componentfamilymodal.component';

@Component({
    selector: "component-family",
    templateUrl: './componentfamilytaxonomy.component.html',
    styleUrls: [
        './componentfamilytaxonomy.component.scss'
    ]
})

export class ComFamilyTaxonomyComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['id', 'familyComponent', 'edit', 'delete'];

    ELEMENT_DATA: IComponentFamilyTaxonomy[] = [];
    jsonData: any[]=[];

    loading: boolean = false;
    default: boolean = false;
    
    dataSource;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _componentFamilyService: ComponentFamilyService
    ) {
    }
    
    ngOnInit(): void {
        this.default = true;
        this.getDataSource();
    }

    getDataSource(): void{
        this._componentFamilyService.getComponentFamily()
          .subscribe(res => {
            this.default = false;
            this.loading = false;
            this.ELEMENT_DATA = res;
            this.jsonData = res;
            this.dataSource = new MatTableDataSource<IComponentFamilyTaxonomy>(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          })
      }

    openDialogFamily(opt: string, data: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "450px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        dialogConfig.data = { mode: opt, item: data };
        this._dataService.setData(dialogConfig.data);
        const dialogRef = this.dialog.open(ComponentFamilyModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
            this.ngOnInit();
        });
    }

    deleteAction(id: number, name: string): void {
        if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
            this._componentFamilyService.deleteComponentFamily(id)
            .subscribe(res => {    
                this.toastr.success("Deleted Successfully!", 'Success'); 
                this.ngOnInit();           
            });
        }
    }
}