import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { UsersService } from '../../services/users.services';

//interface
import { IUsers } from './../../interfaces/IUsers';
import { SitesService } from '../../services/sites.services';
import { UserPermissionGroupService } from '../../services/userpermissiongroup.services';
import { ISites } from '../../interfaces/ISites';
import { CustomerService } from '../../services/customer.services';

@Component({
  selector: 'user-site-modal',
  templateUrl: './usersitemodal.component.html',
  styleUrls: ['./usersitemodal.component.scss']
})

export class UserSiteModalComponent implements OnInit {
    mode: string = "";
    siteName: string = "";
    isActive: boolean = false;
    currentId: number;
    siteCode: number = 0;
    customerId: number = 0;

    siteObject: ISites = {
        id: 0,
        siteName: '',
        // siteCode: 0,
        customerId: 0
    };

    siteList: any[] = [];
    userGroupList: any[] = [];
    customerList: any[] = [];

    isEdit: boolean= false;
    taskNo: number = 0;
    tempNo: number = 0;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<UserSiteModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _userService: UsersService,
        private _siteService: SitesService,
        private _customerService: CustomerService,
        private _userGroupService: UserPermissionGroupService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data);

        this.currentId = this.data.item;

        this._customerService.getCustomer().subscribe(res => {this.customerList = res; })

        if(this.mode === 'Edit'){
            this.isEdit = true;

            forkJoin(
                this._siteService.getSitesById(this.currentId),
            ).subscribe(([ur]) => {
                this.initializeData(ur);
            });
        }
        else{
            this.isEdit = false;

            // forkJoin(
            //     this._siteService.getSitesRecords(),
            //     this._userGroupService.getUserPermissionGroupRecords(),
            // ).subscribe(([sr, upg]) => {
            //     this.siteList = sr;
            //     this.userGroupList = upg;
            // });
        }
    }

    initializeData(data: ISites): void{
        this.siteObject = data;

        this.siteName = data.siteName;
        this.customerId = data.customerId;
    }

    customerOnselect(event){
        this.customerId = parseInt(event.target.value);
        console.log(this.customerId)
    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.siteObject.siteName = this.siteName;
        this.siteObject.customerId = this.customerId;
    
        this._siteService.addSites(this.siteObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{    
        this.siteObject.siteName = this.siteName;
        this.siteObject.customerId = this.customerId;

        this._siteService.updateSites(this.currentId, this.siteObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
