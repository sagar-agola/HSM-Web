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
import { UserManagementGroupService } from '../../services/usermanagementgroup.services';
import { IUserManagementGroup } from '../../interfaces/IUserManagementGroup';
import { GroupService } from '../../services/group.service';
import { IGroup } from '../../interfaces/IGroup';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ISites } from '../../interfaces/ISites';
import { CustomerService } from '../../services/customer.services';
import { ICustomer } from '../../interfaces/ICustomer';

@Component({
  selector: 'user-modal',
  templateUrl: './usermodal.component.html',
  styleUrls: ['./usermodal.component.scss']
})

export class UserModalComponent implements OnInit {
    mode: string = "";
    currentId: number;
    photo: string = "";

    form:FormGroup;

    userManagementObject: IUserManagementGroup = {
        id: 0,
        userPermissionGroupId: 0,
        userId: 0,
        isActive: false
    }

    usersObject: IUsers = {
        id: 0,
        userName: '',
        password: '',
        firstName: '',
        lastName: '',
        emailAddress: '',
        isAdmin: false,
        phoneNo: '',
        isActive: false,
        photo: '',
        groupId: 0,
        customerId: 0,
        siteId: 0,
        group: null,
        customer: null,
        site: null
    }

    groups: IGroup[] = [];
    sites: any[] = [];
    customers: ICustomer[] = [];
    isCoreUser: number = 0;
    isSelectedGroupCore: boolean = false;

    //NGMODEL
    firstName: string = "";
    lastName: string = "";
    userName: string = "";
    password: string = "";
    emailAddress: string = "";
    phoneNo: string = "";
    groupId: number = 0;
    customerId: number = 0;
    siteId: number = 0;
    isActive: boolean= true;
    isAdmin: boolean= false;

    isEdit: boolean= false;
    isGroupSelected: boolean = false;
    isCustomerSelected: boolean = false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<UserModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _userService: UsersService,
        private _groupService: GroupService,
        private _siteService: SitesService,
        private _customerService: CustomerService,
        private _usergroupmanagementService: UserManagementGroupService,
        private fb: FormBuilder) {

        const user = JSON.parse(localStorage.currentUser);
        this.isCoreUser = user?.users?.group?.isCoreUser ? 0 : 1;
        this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
        this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;

        this._groupService.getGroupsByType(this.isCoreUser)
            .subscribe((res) => {
                this.groups = res;
            })
        
        this._customerService.getCustomerByType(this.customerId)
            .subscribe((res) => {
                this.customers = res;
            });
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'Edit'){
            this.isEdit = true;
            this._userService.getUsersRecordById(this.currentId)
                .subscribe((res) => {
                    // console.log(res)
                    this.initializeData(res);
                    this.customerId = res.customerId === 0 || res.customerId === null ? 0 : res.customerId;

                    this._siteService.getSitesByCustomerId(this.customerId)
                        .subscribe(res => {
                            console.log(res)
                            this.isCustomerSelected = false;
                            this.sites = res;
                            
                        })
                });
        }
        else{
            this.isEdit = false;
            this._siteService.getSitesByCustomerId(this.customerId)
            .subscribe(res => {
                // console.log(res)
                this.sites = res;
                this.isCustomerSelected = false;
                
            })
        }
    }

    initializeData(data: IUsers)
    {
        this.customerId = data.customerId;
        this.emailAddress = data.emailAddress;
        this.firstName = data.firstName;
        this.groupId = data.groupId;
        this.currentId = data.id;
        this.isActive = data.isActive;
        this.isAdmin = data.isAdmin;
        this.lastName = data.lastName;
        this.password = data.password;
        this.phoneNo = data.phoneNo;
        this.siteId = data.siteId;
        this.userName = data.userName;
    }

    close(): void {
        this.dialogRef.close();
    }

    onGroupChange($event): void {
        var group = this.groups.find(e => e.id === +$event.target.value);
        this.groupId = parseInt($event.target.value);
        if(!group?.isCoreUser && this.customerId === 0) {
            this.isSelectedGroupCore = group?.isCoreUser;
            this.isGroupSelected = true;
            this.customerId = null;
        }else if(group?.isCoreUser){
            this.isSelectedGroupCore = group?.isCoreUser;
            this.isGroupSelected = true;
            this.isCustomerSelected = false;
        } 
        else {
            this.isGroupSelected = false;
            this._siteService.getSitesByCustomerId(this.customerId)
            .subscribe(res => {
                this.isCustomerSelected = true;
                this.sites = res;
            });
        }
        //if(+this.form.value.groupId)
    }

    onCustomerChange(): void {
        if(this.customerId !== 0 || this.customerId !== undefined)
        {
            this._siteService.getSitesByCustomerId(this.customerId)
            .subscribe(res => {
                console.log(res)
                this.isCustomerSelected = true;
                this.sites = res;
            })
        }else{
            this.isCustomerSelected = false;
            this.siteId = 0;
        }
    }

    siteOnSelect(event){
        this.siteId = parseInt(event.target.value);
    }

    submitForm(): void{
        if(this.groupId <= 5 || this.isSelectedGroupCore){
            this.customerId = null;
            this.siteId = null;
        }
        this.usersObject.customerId = this.customerId;
        this.usersObject.emailAddress = this.emailAddress;
        this.usersObject.firstName = this.firstName;
        this.usersObject.groupId = this.groupId;
        this.usersObject.isActive = this.isActive;
        this.usersObject.isAdmin = this.isAdmin;
        this.usersObject.lastName = this.lastName;
        this.usersObject.password = this.password;
        this.usersObject.phoneNo = this.phoneNo;
        this.usersObject.siteId = this.siteId;
        this.usersObject.userName = this.userName;
        this.usersObject.group = null;
        this.usersObject.customer = null;
        this.usersObject.site = null;

        this._userService.addUsers(this.usersObject)
            .subscribe(res => {
                this.userManagementObject.isActive = true;
                this.userManagementObject.userId = res.id;
                this.userManagementObject.userPermissionGroupId = this.groupId;
                this._usergroupmanagementService.addUserManagementGroup(this.userManagementObject)
                    .subscribe(out => {
                        this.toastr.success("Successfully added user!", 'Success');
                        this.close();
                    });
            });
        
    }

    updateForm(): void{
        if(this.groupId <= 5 || this.isSelectedGroupCore){
            this.customerId = null;
            this.siteId = null;
        }

        this.usersObject.id = this.currentId;
        this.usersObject.userName = this.userName;
        this.usersObject.password = this.password;
        this.usersObject.emailAddress = this.emailAddress;
        this.usersObject.isAdmin = this.isAdmin;
        this.usersObject.firstName = this.firstName;
        this.usersObject.lastName = this.lastName;
        this.usersObject.phoneNo = this.phoneNo;
        this.usersObject.isActive = this.isActive;
        this.usersObject.groupId = this.groupId;
        this.usersObject.customerId = this.customerId;
        this.usersObject.siteId = this.siteId;
        this.usersObject.photo = this.photo;
        this.usersObject.group = null;
        this.usersObject.customer = null;
        this.usersObject.site = null;    
        
        this._userService.updateUsers(this.currentId, this.usersObject)
            .subscribe(res => {

                this._usergroupmanagementService.getUserManagementGroupByUserId(this.currentId)
                    .subscribe(out => {
                        // console.log(out)
                        this.userManagementObject.id = out.id;
                        this.userManagementObject.isActive = true;
                        this.userManagementObject.userId = this.currentId;
                        this.userManagementObject.userPermissionGroupId = this.groupId;

                        this._usergroupmanagementService.updateUserManagementGroup(this.userManagementObject.id, this.userManagementObject)
                            .subscribe(foo => {
                                this.toastr.success("Successfully updated user!", 'Success');
                                this.close();
                            });

                        // if(out === "Empty"){
                        //     console.log("update")
                        //     // this.userManagementObject.id = out.id;
                        //     // this.userManagementObject.isActive = true;
                        //     // this.userManagementObject.userId = this.currentId;
                        //     // this.userManagementObject.userPermissionGroupId = this.groupId;

                        //     // this._usergroupmanagementService.updateUserManagementGroup(this.userManagementObject.id, this.userManagementObject)
                        //     //     .subscribe(foo => {
                        //     //         this.toastr.success("Successfully updated user!", 'Success');
                        //     //         this.close();
                        //     //     });
                        // }else{
                        //     console.log("add new")
                        //     // this.userManagementObject.isActive = true;
                        //     // this.userManagementObject.userId = res.id;
                        //     // this.userManagementObject.userPermissionGroupId = this.groupId;
                        //     // this._usergroupmanagementService.addUserManagementGroup(this.userManagementObject)
                        //     //     .subscribe(out => {
                        //     //         this.toastr.success("Successfully updated user!", 'Success');
                        //     //         this.close();
                        //     //     });
                        // }
                        
                    });
            });
    }
}
