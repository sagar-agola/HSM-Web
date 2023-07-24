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
import { AssetTaskGroupStrategyHsmService } from '../../services/assettaskgroupstrategyhsm.services';

@Component({
  selector: 'hsmtgsview-modal',
  templateUrl: './hsmtgsviewmodal.component.html',
  styleUrls: ['./hsmtgsviewmodal.component.scss']
})

export class HsmTgsViewModalComponent implements OnInit {
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
    assetClass: string = "";
    assetType: string = "";
    manufacturer: string = "";
    assetSpec: string = "";
    taskGroupDescription: string = "";
    hierarchyData: [] = [];
    taskTempList : any[] = [];
    taskList: any[]=[];

    userObject: IUsers = {
        id: 0,
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        emailAddress: '',
        phoneNo: '',
        isActive: false,
        isAdmin: false,
        groupId: 0,
        photo: '',
        customer: null,
        group: null,
        site: null
    };

    siteList: any[] = [];

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<HsmTgsViewModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _assetTaskGroupStrategyHsmService: AssetTaskGroupStrategyHsmService,
        private _siteService: SitesService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        // console.log(this.data.value);
        // console.log(this.data.item);

        this.currentId = this.data.value;
        this.getTGSDetails();
        this.getTGSTasks();
    }

    siteOnselect(event){
        this.siteId = event.target.value;
        
    }
    
    getTGSDetails(): void{
        this._assetTaskGroupStrategyHsmService.getAssetTaskGroupStrategyHsmById(this.currentId)
        .subscribe(res => {
          // console.log(res);

          this.taskGroupDescription = res.taskGroupDescription;
          this.assetClass = res.className;

          if(res.assetManufacturer === '' || res.assetManufacturer === undefined){
            this.manufacturer = '';
            this.assetType = res.specification;
          }else if(res.specification === '' || res.specification === undefined){
              this.assetSpec = '';
              this.assetType = res.assetManufacturer;
          }
          else if(res.specification === '' || res.specification === undefined && res.assetManufacturer === '' || res.assetManufacturer === undefined)
          {
            this.assetType = '';
          }
          else{
            this.assetType = res.assetManufacturer +' -'+ res.specification;
          }
        });
    }

    getTGSTasks(){
        this._assetTaskGroupStrategyHsmService.getTaskGroupStrategyDetails(this.currentId)
          .subscribe(res => {
            this.hierarchyData = JSON.parse(res['hierarchy']);
            // console.log(this.hierarchyData);
            this.taskTempList = this.hierarchyData['PRTData'];
            this.taskList = this.taskTempList[0]['MultipleTask'];
            // console.log(this.taskList)
          });
      }

    initializeData(data: IUsers): void{
        this.userObject = data;

        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.userName = data.userName;
        this.password = data.password;
        this.emailaddress = data.emailAddress;
        this.phoneNo = data.phoneNo;
        this.isActive = data.isActive;

    }

    close(): void {
        this.dialogRef.close();
    }

}
