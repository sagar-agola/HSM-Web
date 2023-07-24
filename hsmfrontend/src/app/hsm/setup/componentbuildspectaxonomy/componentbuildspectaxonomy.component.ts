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
import { IComponentBuildSpecTaxonomy } from '../../interfaces/IComponentTaxonomy';
import { ComponentBuildSpecService } from '../../services/componentbuildspec.services';
import { TaxonomyCategoryModalComponent } from '../../modal/taxonomycategorymodal/taxonomycategorymodal.component';
import { UploadModalComponent } from '../../modal/uploadmodal/uploadmodal.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { AssetBusinessTypeModalComponent  } from '../../modal/assetbusinesstypemodal/assetbusinesstypemodal.component';
import { ComponentBuildSpecModalComponent } from '../../modal/componentbuildspecmodal/componentbuildspecmodal.component';
import * as XLSX from 'xlsx';
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';

@Component({
    selector: "component-buildspec",
    templateUrl: './componentbuildspectaxonomy.component.html',
    styleUrls: [
        './componentbuildspectaxonomy.component.scss'
    ]
})

export class ComBuildSpecTaxonomyComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['id', 'buildSpec', 'edit', 'delete'];

    ELEMENT_DATA: IComponentBuildSpecTaxonomy[] = [];
    jsonData: any[]=[];

    loading: boolean = false;
    default: boolean = false;
    
    dataSource;
    fileName = 'BuildSpec.xlsx';

    isHSMUser: boolean = false;
    isAdmin: boolean = false;
    customerId: number = 0;
    siteId: number = 0;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _componentBuildSpecService: ComponentBuildSpecService,
        private userPermissionService: PermissionManagerService,
    ) {
        const user = JSON.parse(localStorage.currentUser);
        this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
        // console.log(user);
        this.isAdmin = user?.users?.isAdmin;
        this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
        this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
    }

    canAccess(roleKey: string): boolean {
        let access: boolean = false;
        access = this.userPermissionService.isGranted(roleKey);
        return access;
    }
    
    ngOnInit(): void {
        this.default = true;
        this.getDataSource();
    }

    getDataSource(): void{
        this._componentBuildSpecService.getAllBuildSpecByCustomerSites(this.customerId, this.siteId)
          .subscribe(res => {
            this.default = false;
            this.loading = false;
            this.ELEMENT_DATA = res;
            this.jsonData = res;
            this.dataSource = new MatTableDataSource<IComponentBuildSpecTaxonomy>(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          })
      }

    openDialogBuildSpec(opt: string, data: any) {
        if(this.canAccess('AddEditBuildSpec')) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = "450px";
            dialogConfig.height = "auto";
            dialogConfig.position = { top: '30px' };
            dialogConfig.data = { mode: opt, item: data };
            this._dataService.setData(dialogConfig.data);
            const dialogRef = this.dialog.open(ComponentBuildSpecModalComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(res => {
                this.ngOnInit();
            });
        }else{
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
        
    }

    deleteAction(id: number, name: string): void {
        if(this.canAccess('DeleteBuildSpec')) {
            if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
                this._componentBuildSpecService.deleteComponentBuildSpec(id)
                .subscribe(res => {    
                    this.toastr.success("Deleted Successfully!", 'Success'); 
                    this.ngOnInit();           
                });
            }
        }else{
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
    }

    exportExcel(): void {
        if(this.canAccess('ExportBuildSpec')) {
            /* table id is passed over here */
            let element = document.getElementById('excel-table');
            const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        
            /* generate workbook and add the worksheet */
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        
            /* save to file */
            XLSX.writeFile(wb, this.fileName);
        }else{
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
    }
}