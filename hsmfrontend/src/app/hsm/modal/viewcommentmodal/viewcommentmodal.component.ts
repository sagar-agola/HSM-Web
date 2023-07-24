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
import { IFMEA } from '../../interfaces/IFMEA';
import { fmeaDefault } from 'src/app/shared/helpers/default.helpers';
import { FMEAService } from '../../services/fmea.services';
import { IAssetTaskGroupStrategyHsm } from '../../interfaces/IAssetTaskGroupStrategy';
import { AssetTaskGroupStrategyHsmService } from '../../services/assettaskgroupstrategyhsm.services';

@Component({
  selector: 'view-comment-modal',
  templateUrl: './viewcommentmodal.component.html',
  styleUrls: ['./viewcommentmodal.component.scss']
})

export class ViewCommentModal implements OnInit {
    mode: string = "";
    userName: string = "";
    firstName: string = "";
    lastName: string = "";
    password: string = "";
    emailaddress: string = "";
    phoneNo: string = "";
    isActive: boolean = false;
    siteId: number = 0;
    currentId: number;
    userGroupId: number = 0;
    photo: string = "";
    comment: string = "";

    fmeaObject: IFMEA = fmeaDefault();
    tgsObject: IAssetTaskGroupStrategyHsm;

    siteList: any[] = [];
    userGroupList: any[] = [];

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<ViewCommentModal>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _userService: UsersService,
        private _siteService: SitesService,
        private _fmeaService: FMEAService,
        private _assetTGSHsmService: AssetTaskGroupStrategyHsmService,
        private _userGroupService: UserPermissionGroupService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'ViewFmeaStatus'){
            this.isEdit = true;

            forkJoin(
                this._fmeaService.getFMEAById(this.currentId),
                this._siteService.getSitesRecords(),
                this._userGroupService.getUserPermissionGroupRecords(),
            ).subscribe(([ur, sr, upg]) => {
                // console.log(ur);
                this.initializeData(ur);
                this.siteList = sr;
                this.userGroupList = upg;
            });
        }
        
        if(this.mode === 'ViewTGSStatus'){
            this._assetTGSHsmService.getAssetTaskGroupStrategyById(this.currentId)
                .subscribe(res => {
                    // console.log(res)
                    this.initializeTGSData(res);
                });

        }
    }

    initializeData(data: IFMEA): void{
        this.fmeaObject = data;

        this.comment = data.comment;
    }

    initializeTGSData(data: IAssetTaskGroupStrategyHsm): void{
        this.tgsObject = data;

        this.comment = data.comment;
    }

    close(): void {
        this.dialogRef.close();
    }

}
