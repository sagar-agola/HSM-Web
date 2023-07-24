import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { UserPermissionGroupService } from '../../services/userpermissiongroup.services';

//interface
import { IUserPermissionGroup } from './../../interfaces/IUserPermissionGroup';
import { GroupService } from '../../services/group.service';
import { IGroup } from '../../interfaces/IGroup';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ICustomer } from '../../interfaces/ICustomer';
import { ISites } from '../../interfaces/ISites';
import { CustomerService } from '../../services/customer.services';
import { SitesService } from '../../services/sites.services';

@Component({
  selector: 'user-group-modal',
  templateUrl: './usergroupmodal.component.html',
  styleUrls: ['./usergroupmodal.component.scss']
})

export class UserGroupModalComponent implements OnInit {
    mode: string = "";
    name: string = "";
    isActive: boolean = true;
    currentId: number;
    
    form:FormGroup;

    userObject: IGroup = {
        id: 0,
        name: '',
        isCoreUser: false,
        isActive: false,
    };

    isEdit: boolean= false;

    customerList: ICustomer[];
    siteList: ISites[];

    customerId: number = 0;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<UserGroupModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _service: GroupService,
        private _customerService: CustomerService,
        private _siteService: SitesService,
        private fb: FormBuilder) {

        this.form = this.fb.group({
            name: new FormControl(''),
            isCoreUser: new FormControl(''),
            isActive: new FormControl('')
        });

        const user = JSON.parse(localStorage.currentUser);
        this.customerId = user?.users?.group?.customerId === 0 || user?.users?.group?.customerId === null ? 0 : user?.users?.group?.customerId;
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'Edit'){
            this.isEdit = true;

            this._service.getGroup(this.currentId)
                .subscribe(res => {
                    // console.log(res);

                    this.form.patchValue({
                        name: res.name,
                        isCoreUser: res.isCoreUser,
                        isActive: res.isActive
                    })
                });
        }
        else{
            this.isEdit = false;
        }
    }

    close(): void {
        this.dialogRef.close();
    }

    submitForm() {
        if(this.form.valid) {
            const param : IGroup = {
                id: this.currentId || 0,
                name: this.form.value.name,
                isActive: this.form.value.isActive || false,
                isCoreUser: this.form.value.isCoreUser || false
            }
        
            this._service.upsertGroup(param)
              .subscribe(res => {
                  this.toastr.success("Successfully saved!", 'Success');
                  this.close();
              });
        }
    }
}
