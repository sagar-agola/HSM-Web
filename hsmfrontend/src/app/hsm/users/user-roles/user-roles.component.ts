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
import { ICustomRoleFeature, IRoleFeature } from '../../interfaces/IRoleFeature';
import { forkJoin } from 'rxjs';
import { RoleFeatureService } from '../../services/rolefeature.services';
import { UserPermissionService } from '../../services/userpermission.services';
import { IUserPermission, IUserPermissionCustomPost } from '../../interfaces/IUserPermission';
import { PermissionManagerService } from 'src/app/shared/services/permission.manager.service';
import * as _ from 'lodash';
import { GroupService } from '../../services/group.service';

@Component({
    selector: "user-roles",
    templateUrl: './user-roles.component.html',
    styleUrls: [
        './user-roles.component.scss'
    ]
})

export class UserRolesComponent implements OnInit {

    loading: boolean = false;
    default: boolean = false;
    
    dataSource;

    activeId: number;
    currentId: number;
    groupName: string = "";
    userId: number;

    roleFeatures: IRoleFeature[] = [];
    customRoleFeature: ICustomRoleFeature[] = [];
    roleFeatureSet:  number[] = [];

    rolePermissions: any [] = [];

    isLoading: boolean = true;

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        public toastr: ToastrService,
        public _dataService: DataService,
        private _userService: UsersService,
        private _groupService: GroupService,
        private _roleFeatureService: RoleFeatureService,
        private _userPermissionService: UserPermissionService,
        private _permissionManagerService: PermissionManagerService,
        private _route: ActivatedRoute
    ) {
    }
    
    ngOnInit(): void {
        this._route.params.subscribe(params => {
            this.currentId = params['id'];
        });
        console.log(this.currentId);

        let data = JSON.parse(localStorage.loggedUser);
        // console.log(data);
        this.userId = data.users.id;
        // console.log(this.userId)

        forkJoin(
            this._roleFeatureService.getRoleFeatureRecords(),
            this._groupService.getGroup(this.currentId),
            this._userPermissionService.getUserPermissionGroupByGroupId(this.currentId),
        ).subscribe(([rf, gs, ug]) => {
            
            this.groupName = gs.name;
            this.roleFeatures = rf;
            this.roleFeatureMaps(ug);
            this.isLoading = false;
            // if(ug !== null || ug !== ''|| ug !== 0)
            // {
            //     this.roleFeatureMaps(ug);
            // }
            // var x = _.values(_.groupBy(rf, 'CategoryId'))
            this.customRoleFeature = _.chain(rf).groupBy("category.enumValue").map((v,k) => ({ category: k, items: v })).value();
            // console.log(this.customRoleFeature)
            this.loading = false;
        });
    }

    addRoles(event: any, roleId: number): void{
        var index = this.rolePermissions.map(x => {
          return x.id;
        }).indexOf(roleId);
    
        if (event.target.checked === true) {
            this.rolePermissions.push({
                userPermissionGroupId: this.currentId,
                roleFeaturesId: roleId
            });
        }

        // console.log(this.rolePermissions)
    }

    roleFeatureMaps(data: IUserPermission[]): void {
        if(data.length > 0)
        {
            this.roleFeatureSet = data.map(e => e.roleId)
        }
    }

    canAccess(roleKey: string): boolean {
        let access: boolean = false;
        access = this._permissionManagerService.isGranted(roleKey);
        return access;
    }

    updatePermissions(): void{
        let data: IUserPermissionCustomPost = {
            userId: this.userId,
            roleFeatureIds: this.roleFeatureSet
        }

        // console.log(data)

        this.loading = true;

        this._userPermissionService.updateUserPermissions(this.currentId, data)
            .subscribe(res => {
                this.loading = false;
                // let data = JSON.parse(localStorage.loggedUser);
                // data.Permission = res;
                // localStorage.setItem("loggedUser", JSON.stringify(data));
                this.toastr.success("User permissions saved successfully.","Success");
                // this.close();
            });
    }

    isIncludedOnCurrentItem(rfId: number) : boolean{
        // console.log(rfId)
        let inArr: boolean = false;
        let doWeFindIt = this.roleFeatureSet.find(e => e == rfId);
        inArr = doWeFindIt == rfId ? true: false;
        return inArr;
    }

    updateRoleFeature(rfId: number) : void {
        // console.log(rfId)
        let doIExist = this.roleFeatureSet.find(e => e == rfId);
        if(!doIExist) {
            this.roleFeatureSet.push(rfId);
        } else {
            var index = this.roleFeatureSet.indexOf(rfId);
            if(index != -1) {
                this.roleFeatureSet.splice(index, 1);
            }
        }
    }

    close(): void{
        this.router.navigate(["/main/users-list"]);
        localStorage.setItem('source', '2');
    }
}



