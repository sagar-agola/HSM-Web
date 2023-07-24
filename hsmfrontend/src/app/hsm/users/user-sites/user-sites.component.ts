import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// import { UserModalComponent } from '../modal/usermodal/usermodal.component';
import { DataService } from 'src/app/shared/services/data.service';
// import { IUserPermissionGroup } from '../interfaces/IUserPermissionGroup';
// import { UserPermissionGroupService } from '../services/userpermissiongroup.services';
// import { UserGroupModalComponent } from '../modal/usergroupmodal/usergroupmodal.component';
import { ToastrService } from 'ngx-toastr';
import { SitesService } from '../../services/sites.services';
import { ISites } from '../../interfaces/ISites';

@Component({
    selector: "user-sites-page",
    templateUrl: './user-sites.component.html',
    styleUrls: [
        './user-sites.component.scss'
    ]
})

export class UserSitesComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['id', 'siteName', 'siteCode', 'edit', 'delete'];

    ELEMENT_DATA: ISites[] = [];

    loading: boolean = false;
    default: boolean = false;
    
    dataSource;
    dataSource2;

    activeId: number;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        public toastr: ToastrService,
        public _dataService: DataService,
        private _siteService: SitesService
    ) {
    }
    
    ngOnInit(): void {
        this.getDataSource();
    }

    getDataSource(): void{
        this._siteService.getSitesRecords()
          .subscribe(res => {
            console.log(res);
            this.default = false;
            this.loading = false;
            this.ELEMENT_DATA = res;
            this.dataSource = new MatTableDataSource<ISites>(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          })
    }

    // openDialogUser(opt: string, data: any) {
    //     const dialogConfig = new MatDialogConfig();
    //     dialogConfig.width = "600px";
    //     dialogConfig.height = "auto";
    //     dialogConfig.position = { top: '30px' };
    //     dialogConfig.data = { mode: opt, item: data };
    //     this._dataService.setData(dialogConfig.data);
    //     const dialogRef = this.dialog.open(UserModalComponent, dialogConfig);
    //     dialogRef.afterClosed().subscribe(res => {
    //         this.ngOnInit();
    //     });
    // }

    deleteUser(id: number, name: string): void {
        if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
            this._siteService.deleteSites(id)
            .subscribe(res => {    
                this.toastr.success("Deleted Successfully!", 'Success'); 
                this.ngOnInit();           
            });
        }
    }
}



