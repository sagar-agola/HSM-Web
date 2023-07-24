import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
import { HttpClientExt } from 'src/app/shared/services/httpclient.services';
import { AppSettings } from 'src/app/shared/app.settings';

@Component({
    selector: "user-profile",
    templateUrl: './userprofile.component.html',
    styleUrls: [
        './userprofile.component.scss'
    ]
})

export class UsersProfileComponent implements OnInit {
    private controllerApi = `${AppSettings.SITE_HOST}/api/`;

    ELEMENT_DATA_3: ISites[] = [];
    ELEMENT_DATA: IUserModel[] = [];
    ELEMENT_DATA_2: IUserPermissionGroup [] = [];

    loading: boolean = false;
    default: boolean = false;
    
    dataSource;
    dataSource2;
    dataSource3;

    activeId: number;
    currentId: number;
    userId: number;

    firstName: string = "";
    lastName: string = "";
    emailAddress: string = "";
    userName: string = "";
    password: string = "";
    phoneNo: string = "";

    isLoading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        public toastr: ToastrService,
        public _dataService: DataService,
        private _userService: UsersService,
        private http: HttpClientExt
    ) {
    }
    
    ngOnInit(): void {
        var userId = +localStorage.getItem("loggUserId");
        this.route.params.subscribe(params => {
            this.currentId = params['id'];
            
        });

        this.getDataSource(userId);
    }

    getDataSource(id: number): void{
        this._userService.getUsersRecordById(id)
          .subscribe(res => {
            console.log(res);
            this.firstName = res.firstName;
            this.lastName = res.lastName;
            this.userName = res.userName;
            this.password = res.password;
            this.emailAddress = res.emailAddress;
            this.phoneNo = res.phoneNo;
            this.isLoading = false;
          });
    }

    public uploadFile = (files) => {
        this.loading = true;
        if (files.length === 0) {
            return;
        }

        let fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        this.http.post(this.controllerApi, formData)
            .subscribe(res => {
                this.loading = false;
                this.toastr.success('FMEA Upload File successfully uploaded', 'Success!');
            });
    }
}



