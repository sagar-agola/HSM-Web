import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

//Services
import { CustomerService } from '../../services/customer.services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ICustomer } from '../../interfaces/ICustomer';
import { TradeTypeModalComponent } from '../../modal/tradetypemodal/tradetypemodal.component';
import * as XLSX from 'xlsx';
import { DataService } from 'src/app/shared/services/data.service';
import { CustomerModalComponent } from '../../modal/customermodal/customermodal.component';
import { ToastrService } from 'ngx-toastr';
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';

@Component({
    selector: "customer-table",
    templateUrl: './customer.component.html',
    styleUrls: [
        './customer.component.scss'
    ]
})

export class CustomerNameComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['id', 'customerName', 'emailAddress', 'location', 'contactNumber', 'edit', 'delete'];

    ELEMENT_DATA: any[] = [];
    jsonData: any[]=[];

    loading: boolean = false;
    default: boolean = false;
    
    dataSource;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private _dataService: DataService,
        private _customerService: CustomerService,
        private userPermissionService: PermissionManagerService,
        public toastr: ToastrService
    ) {
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
        this._customerService.getCustomer()
          .subscribe(res => {
            this.default = false;
            this.loading = false;
            this.ELEMENT_DATA = res;
            this.jsonData = res;
            this.dataSource = new MatTableDataSource<ICustomer>(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          })
      }

      openDialogCustomer(opt: string, data: any) {
        if(this.canAccess('AddEditCustomer')) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = "550px";
            dialogConfig.height = "auto";
            dialogConfig.position = { top: '30px' };
            dialogConfig.data = { mode: opt, item: data };
            this._dataService.setData(dialogConfig.data);
            const dialogRef = this.dialog.open(CustomerModalComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(res => {
                this.ngOnInit();
            });
        }else {
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
    }

    deleteAction(id: number): void {
        if(this.canAccess('DeleteCustomer')) {
            if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
                this._customerService.delete(id)
                .subscribe(res => {    
                    this.toastr.success("Deleted Successfully!", 'Success'); 
                    this.ngOnInit();           
                });
            }
        }else {
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
    }
}