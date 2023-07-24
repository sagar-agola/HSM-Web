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
import { IAssetHierarchyClassTaxonomy } from '../../interfaces/IAssetHierarchyTaxonomy';
import { AssetHierarchyClassTaxonomyService } from '../../services/assethierarchyclasstaxonomy.services';
import { UploadModalComponent } from '../../modal/uploadmodal/uploadmodal.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { AssetBusinessTypeModalComponent  } from '../../modal/assetbusinesstypemodal/assetbusinesstypemodal.component';
import { AssetHierarchyClassModalComponent } from '../../modal/assetclasstaxonomymodal/assetclasstaxonomymodal.component';
import * as XLSX from 'xlsx';

@Component({
    selector: "asset-class",
    templateUrl: './assetclasstaxonomy.component.html',
    styleUrls: [
        './assetclasstaxonomy.component.scss'
    ]
})

export class AssetHierarchyClassTaxonomyComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['id', 'className', 'edit', 'delete'];

    ELEMENT_DATA: IAssetHierarchyClassTaxonomy[] = [];
    jsonData: any[]=[];

    loading: boolean = false;
    default: boolean = false;
    
    dataSource;
    fileName = 'AssetClass.xlsx';

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _assetClassTaxonomyService: AssetHierarchyClassTaxonomyService
    ) {
    }
    
    ngOnInit(): void {
        this.default = true;
        this.getDataSource();
    }

    getDataSource(): void{
        this._assetClassTaxonomyService.getAssetClassTaxonomy()
          .subscribe(res => {
            this.default = false;
            this.loading = false;
            this.ELEMENT_DATA = res;
            this.jsonData = res;
            this.dataSource = new MatTableDataSource<IAssetHierarchyClassTaxonomy>(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          })
      }

    openDialogClass(opt: string, data: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "450px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        dialogConfig.data = { mode: opt, item: data };
        this._dataService.setData(dialogConfig.data);
        const dialogRef = this.dialog.open(AssetHierarchyClassModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
            this.ngOnInit();
        });
    }

    deleteAction(id: number, name: string): void {
        if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
            this._assetClassTaxonomyService.deleteAssetClassTaxonomy(id)
            .subscribe(res => {    
                this.toastr.success("Deleted Successfully!", 'Success'); 
                this.ngOnInit();           
            });
        }
    }

    exportExcel(): void {
        /* table id is passed over here */
        let element = document.getElementById('excel-table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }
}