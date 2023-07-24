import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

//Services
import { DurationService } from '../../services/duration.services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IDuration } from '../../interfaces/IDuration';
import { DurationModalComponent } from '../../modal/durationmodal/durationmodal.component';
import { UploadModalComponent } from '../../modal/uploadmodal/uploadmodal.component';
import * as XLSX from 'xlsx';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';

@Component({
    selector: "duration-table",
    templateUrl: './duration.component.html',
    styleUrls: [
        './duration.component.scss'
    ]
})

export class DurationComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['id', 'durationName', 'edit', 'delete'];

    ELEMENT_DATA: IDuration[] = [];
    jsonData: any[]=[];

    loading: boolean = false;
    default: boolean = false;
    
    dataSource;
    fileName = 'Duration.xlsx';

    isHSMUser: boolean = false;
    isAdmin: boolean = false;
    customerId: number = 0;
    siteId: number = 0;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private _durationService: DurationService,
        private _dataService: DataService,
        public toastr: ToastrService,
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
        this.getDataSource();
        this.default = true;
    }

    getDataSource(): void{
        this._durationService.getAllDurationByCustomerSites(this.customerId, this.siteId)
          .subscribe(res => {
            this.default = false;
            this.loading = false;
            this.ELEMENT_DATA = res;
            this.jsonData = res;
            this.dataSource = new MatTableDataSource<IDuration>(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          })
      }

    openDialogDuration(opt: string, data: any) {
        if(this.canAccess('AddEditDuration')) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = "450px";
            dialogConfig.height = "auto";
            dialogConfig.position = { top: '30px' };
            dialogConfig.data = { mode: opt, item: data };
            this._dataService.setData(dialogConfig.data);
            const dialogRef = this.dialog.open(DurationModalComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(res => {
                this.ngOnInit();
            });
        }else{
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
    }

    openDialogUpload(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "500px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        const dialogRef = this.dialog.open(UploadModalComponent, dialogConfig);
    }

    deleteAction(id: number, name: string): void {
        if(this.canAccess('DeleteDuration')) {
            if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
                this._durationService.deleteDuration(id)
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
        if(this.canAccess('ExportDuration')) {
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



