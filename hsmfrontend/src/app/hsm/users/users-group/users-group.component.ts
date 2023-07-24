import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

import { UsersService } from '../../services/users.services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IUserModel, IUsers } from '../../interfaces/IUsers';
import { DataService } from 'src/app/shared/services/data.service';
import { IUserPermissionGroup } from '../../interfaces/IUserPermissionGroup';
import { UserPermissionGroupService } from '../../services/userpermissiongroup.services';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: "user-groups-page",
    templateUrl: './users-group.component.html',
    styleUrls: [
        './users-group.component.scss'
    ]
})

export class UsersGroupComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['firstName', 'lastName', 'userName', 'emailAddress', 'userStatus', 'delete'];

    displayedColumns2 = ['isAdd', 'firstName', 'lastName', 'userName', 'emailAddress', 'userStatus'];
    @ViewChild('tableOnePaginator', {static: false}) tableOnePaginator: MatPaginator;
    @ViewChild('tableOneSort', {static: false}) tableOneSort: MatSort;

    ELEMENT_DATA: IUserModel[] = [];
    ELEMENT_DATA_2: IUserModel [] = [];

    loading: boolean = false;
    default: boolean = false;
    isLoading: boolean = true;

    dataSource;
    dataSource2;

    groupName: string = "";

    activeId: number;
    currentId: number;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        public toastr: ToastrService,
        public _dataService: DataService,
        private _userService: UsersService,
        private _userPermissionGroupService: UserPermissionGroupService,
        private _route: ActivatedRoute
    ) {
    }
    
    ngOnInit(): void {
        this._route.params.subscribe(params => {
            this.currentId = params['id'];
        });
        console.log(this.currentId)

        this._userPermissionGroupService.getUserPermissionGroupRecordById(this.currentId)
            .subscribe(res => {
                this.groupName = res.groupName;
            })

        this.getDataSource();
        this.getDataSource2();
    }

    getDataSource(): void{
        this._userService.getUsersInGroup(this.currentId)
          .subscribe(res => {
            // console.log(res);
            this.default = false;
            this.loading = false;
            this.ELEMENT_DATA = res;
            this.dataSource = new MatTableDataSource<IUserModel>(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.isLoading = false;
          })
    }

    getDataSource2(): void{
        this._userService.getUsersNotInGroup()
          .subscribe(res => {
            // console.log(res);
            this.default = false;
            this.loading = false;
            this.ELEMENT_DATA_2 = res;
            this.dataSource2 = new MatTableDataSource<IUserModel>(this.ELEMENT_DATA_2);
            this.dataSource2.paginator = this.tableOnePaginator;
            this.dataSource2.sort = this.tableOneSort;
            this.isLoading = false;
          })
    }

    cancel(){
        this.router.navigate(["/main/users-list"])
    }
}