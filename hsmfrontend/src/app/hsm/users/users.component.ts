import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

import { UsersService } from '../services/users.services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IUserModel, IUsers } from '../interfaces/IUsers';
import { UserModalComponent } from '../modal/usermodal/usermodal.component';
import { DataService } from 'src/app/shared/services/data.service';
import { IUserPermissionGroup } from '../interfaces/IUserPermissionGroup';
import { UserPermissionGroupService } from '../services/userpermissiongroup.services';
import { UserGroupModalComponent } from '../modal/usergroupmodal/usergroupmodal.component';
import { ToastrService } from 'ngx-toastr';
import { ISites } from '../interfaces/ISites';
import { SitesService } from '../services/sites.services';
import { UserSiteModalComponent } from '../modal/usersitemodal/usersitemodal.component';
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';
import { CustomerService } from '../services/customer.services';
import { GroupService } from '../services/group.service';
import { IGroup } from '../interfaces/IGroup';

@Component({
    selector: "user-page",
    templateUrl: './users.component.html',
    styleUrls: [
        './users.component.scss'
    ]
})

export class UsersComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['firstName', 'lastName', 'userName', 'emailAddress', 'phoneNo', 'groupName', 'siteName', 'userStatus', 'edit', 'delete'];

    displayedColumns2 = ['owner', 'name', 'isActive', 'add', 'editGp', 'deleteGp'];
    @ViewChild('tableOnePaginator', {static: false}) tableOnePaginator: MatPaginator;
    @ViewChild('tableOneSort', {static: false}) tableOneSort: MatSort;

    displayedColumns3 = ['id', 'siteName', 'customerId', 'edit', 'delete'];
    @ViewChild('tableTwoPaginator', {static: false}) tableTwoPaginator: MatPaginator;
    @ViewChild('tableTwoSort', {static: false}) tableTwoSort: MatSort;

    ELEMENT_DATA_3: ISites[] = [];
    ELEMENT_DATA: IUserModel[] = [];
    ELEMENT_DATA_2: IGroup [] = [];
    customerList: any[] = [];

    loading: boolean = false;
    isLoading: boolean = true;
    default: boolean = false;
    
    dataSource;
    dataSource2;
    dataSource3;

    activeId: number;

    coreUser: number = 0;
    customerId: number = 0;
    isHSMAdmin: boolean = false;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        public toastr: ToastrService,
        public _dataService: DataService,
        private _userService: UsersService,
        private _userPermissionGroupService: UserPermissionGroupService,
        private _siteService: SitesService,
        private userPermissionService: PermissionManagerService,
        private _customerService: CustomerService,
        private _groupService: GroupService
    ) {
        const user = JSON.parse(localStorage.currentUser);
        this.coreUser = user?.users?.group?.isCoreUser ? 1 : 0;
        this.customerId = user?.users?.customerId || 0;

        this.isHSMAdmin = (this.coreUser && user?.users?.isAdmin) ? true : false;
    }

    canAccess(roleKey: string): boolean {
        let access: boolean = false;
        access = this.userPermissionService.isGranted(roleKey);
        return access;
    }
    
    ngOnInit(): void {
        let sourceActiveId = localStorage.getItem("source");
        this.activeId = (sourceActiveId !== null) ? parseInt(sourceActiveId) : 1;
        
        this.getDataSource();
        this.getDataSource2();
        this.getDataSource3();

        this._customerService.getCustomer().subscribe(res => { this.customerList = res; })
    }

    getDataSource(): void{
        this._userService.getUsersInCustomer(this.customerId)
          .subscribe(res => {
            // console.log(res);
            this.default = false;
            this.loading = false;
            this.ELEMENT_DATA = res;
            this.dataSource = new MatTableDataSource<IUserModel>(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.isLoading= false;
          })
    }

    getDataSource2(): void{
        this._groupService.getGroups()
          .subscribe(res => {
            // console.log(res);
            this.default = false;
            this.loading = false;
            this.ELEMENT_DATA_2 = res;
            this.dataSource2 = new MatTableDataSource<IGroup>(this.ELEMENT_DATA_2);
            this.dataSource2.paginator = this.tableOnePaginator;
            this.dataSource2.sort = this.tableOneSort;
            this.isLoading = false;
          })
    }

    getDataSource3(): void{
        this._siteService.getSitesByCustomerId(this.customerId)
          .subscribe(res => {
            // console.log(res);
            this.default = false;
            this.loading = false;
            this.ELEMENT_DATA_3 = res;
            this.dataSource3 = new MatTableDataSource<ISites>(this.ELEMENT_DATA_3);
            this.dataSource3.paginator = this.tableTwoPaginator;
            this.dataSource3.sort = this.tableTwoSort;
            this.isLoading = false;
          })
    }

    mapCustomerData(id: number): string {
        let retData = "";
        retData = this.customerList.find(e => e.id === id);
        return retData;
    }

    openDialogUser(opt: string, data: any) {
        if(this.canAccess('AddEditUsers')) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = "600px";
            dialogConfig.height = "auto";
            dialogConfig.position = { top: '30px' };
            dialogConfig.data = { mode: opt, item: data };
            this._dataService.setData(dialogConfig.data);
            const dialogRef = this.dialog.open(UserModalComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(res => {
                this.ngOnInit();
            });
        }else {
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
        
    }

    openDialogUserGroup(opt: string, data: any) {
        if(this.canAccess('AddEditUserGroups')) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = "600px";
            dialogConfig.height = "auto";
            dialogConfig.position = { top: '30px' };
            dialogConfig.data = { mode: opt, item: data };
            this._dataService.setData(dialogConfig.data);
            const dialogRef = this.dialog.open(UserGroupModalComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(res => {
                this.ngOnInit();
            });
        }else {
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
    }

    openDialogUserSite(opt: string, data: any) {
        if(this.canAccess('AddEditSites')) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = "600px";
            dialogConfig.height = "auto";
            dialogConfig.position = { top: '30px' };
            dialogConfig.data = { mode: opt, item: data };
            this._dataService.setData(dialogConfig.data);
            const dialogRef = this.dialog.open(UserSiteModalComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(res => {
                this.ngOnInit();
            });
        }else {
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
    }

    routeMeOutUser(mode: string, data: any, module: string): void {
        if(this.canAccess('DeleteUser')) {
            this.openDialogUser(mode, data);
        }
        else {
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
    }

    routeMeOutUserGroup(mode: string, data: any, module: string): void {

        if(this.canAccess(module)) {
            if(mode == 'Add')
            {
                this.openDialogUserGroup(mode, data);
            }
            else if(mode == 'Edit')
            {
                this.openDialogUserGroup(mode, data);
            }
        }
        else {
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
    }

    deleteUser(id: number, name: string): void {
        if(this.canAccess('DeleteUser')) {
            if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
                this._userService.deleteUser(id)
                .subscribe(res => {    
                    this.toastr.success("Deleted Successfully!", 'Success'); 
                    this.ngOnInit();           
                });
            }
        }else {
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
        
    }

    deleteGroup(id: number, name: string): void {
        if(this.canAccess('DeleteUserGroups')) {
            if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
                this._groupService.deleteGroup(id)
                .subscribe(res => {    
                    this.toastr.success("Deleted Successfully!", 'Success'); 
                    this.ngOnInit();           
                });
            }
        }else {
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
        
    }

    deleteSite(id: number, name: string): void {
        if(this.canAccess('DeleteSites')) {
            if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
                this._siteService.deleteSites(id)
                .subscribe(res => {    
                    this.toastr.success("Deleted Successfully!", 'Success'); 
                    this.ngOnInit();           
                });
            }
        }else {
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
    }

    goToUserRole(id: number): void{
        if(this.canAccess('AddUserRoles')) {
            // const url = this.router.serializeUrl(
            //     this.router.createUrlTree(["/main/user-roles", id])
            //   );
            this.router.navigate(["/main/user-roles", id]);
            //   window.open(url, '_blank');
        }else {
            this.toastr.warning('You do not have permission to perform this action.', '');
        }
    }

    goToUserGroup(id: number): void{
        const url = this.router.serializeUrl(
          this.router.createUrlTree(["/main/user-groups", id])
        );
  
        window.open(url, '_blank');
    }
}



