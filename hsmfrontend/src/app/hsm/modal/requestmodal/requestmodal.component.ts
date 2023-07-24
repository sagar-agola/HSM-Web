import { Component, OnInit, Inject, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import {NgbDateStruct, NgbCalendar, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
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
import { HttpClientExt } from 'src/app/shared/services/httpclient.services';
import { AppSettings } from 'src/app/shared/app.settings';
import { ActionManagementService } from '../../services/actionmanagement.services';
import { IActionManagement } from '../../interfaces/IActionManagement';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

const CURRENTDAY = {
    day: new Date().getUTCDate(),
    month: new Date().getUTCMonth() + 1,
    year: new Date().getUTCFullYear()
};

@Component({
  selector: 'request-modal',
  templateUrl: './requestmodal.component.html',
  styleUrls: ['./requestmodal.component.scss']
})

export class RequestModal implements OnInit {
    private controllerApi = `${AppSettings.SITE_HOST}/api/`;

    @ViewChild('fileInput') fileInput;
    // @Output() selectDay = new EventEmitter();
    // @Input() min: NgbDateStruct = {day: 1, month: 1, year: 1900};
    // @Input() max: NgbDateStruct = {day: CURRENTDAY.day, month: CURRENTDAY.month, year: CURRENTDAY.year };
    // model: NgbDateStruct;
    
    mode: string = "";    

    fmeaObject: IFMEA = fmeaDefault();
    tgsObject: IAssetTaskGroupStrategyHsm;

    actionManagementObject: IActionManagement = {
        id: 0,
        requestCode: '',
        requestTypeId: 0,
        requestInfo: '',
        dueDate: undefined,
        fileName: '',
        assigned: 0,
        requested: 0,
        dtCreated: undefined,
        actionStatus: 0
    };

    siteList: any[] = [];
    userGroupList: any[] = [];
    userList: any[] = [];

    isEdit: boolean= false;
    isView: boolean = false;
    loading: boolean = false;
    isLocked: boolean = false;

    userId: number;
    requestTypeId: number;
    requestInfo: string = "";
    requestedBy: number;
    fileName: string = "";
    duedate: any;
    dtCreated: any;
    requestCode: string = "";
    actionStatusId: number;
    currentId: number;

    reqNo: number = 0;
    tempNo: number = 0;

    customerId: number = 0;

    pipe = new DatePipe('en-US'); // Use your own locale

    form: FormGroup;

    requestType: any = [
      {
          "name": "Master Data Request",
          "value": 1
      },
      {
        "name": "Other Request",
        "value": 2
      },
    ];

    actionStatus: any = [
        {
            "name": "Open",
            "value": 1
        },
        {
          "name": "Completed",
          "value": 2
        },
    ];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private http: HttpClientExt,
        public dialogRef: MatDialogRef<RequestModal>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _userService: UsersService,
        private _siteService: SitesService,
        private _fmeaService: FMEAService,
        private _actionManagementService: ActionManagementService) {
        
            this.form = this.fb.group({
                requestCode: new FormControl(''),
                status: new FormControl(''),
                type: new FormControl(''),
                dueDate: new FormControl(''),
                information: new FormControl(''),
                fileName: new FormControl(''),
                requestedPerson: new FormControl('')
            });

            this.customerId = +localStorage.getItem('customerId');

            forkJoin(
                this._userService.getUsersInCustomer(this.customerId),
                this._actionManagementService.getLastNumber()
            ).subscribe(([users, actionm]) => {
                this.userList = users;
                this.requestCodeProcessor(actionm.lastId);
                this.form.patchValue({
                    requestCode: this.requestCode
                })
            })
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        var currentDate = new Date();
        var first = currentDate.getDate() - currentDate.getDay() + 1;
        var ngbDateStruct = { day: currentDate.getUTCDate(), month: currentDate.getUTCMonth()+1, year: currentDate.getUTCFullYear()};

        this.mode = this.data.mode;

        console.log(this.data)

        this.currentId = this.data.item;

        if(this.mode === 'View'){
            this.isView = true;
            this.isLocked = true;
            
            forkJoin(
                this._userService.getUsersInCustomer(this.customerId),
                this._actionManagementService.getActionManagementRecordById(this.currentId)
            ).subscribe(([user,res]) => {
                this.userList = user;
                this.form.patchValue({
                    requestCode: res.requestCode,
                    status: res.actionStatus,
                    assigned: res.assigned,
                    dueDate: new Date(res.dueDate),
                    fileName: res.fileName,
                    information: res.requestInfo,
                    type: res.requestTypeId,
                    requestedPerson: res.requested
                })
            })

            
                
        }else{
            this.isView = false;
            let myDate = formatDate((ngbDateStruct.day, ngbDateStruct.month, ngbDateStruct.year), 'dd-MM-yyyy', 'en');
            // console.log(myDate)

            // let currentDate = new Date();
            let cDate = new Date(currentDate.setDate(currentDate.getDate()));

            // console.log(this.mode);
            // console.log(this.data.item);
            // this.duedate = new Date(cDate);
            // this.duedate = formatDate(ngbDateStruct, 'dd-MM-yyyy', 'en');
            this.requestedBy = +localStorage.getItem("loggUserId");

            let nDate = new Date(currentDate.setDate(currentDate.getDate()));

            this.duedate = new Date();
            // this.duedate = new Date(ngbDateStruct).toISOString();
            // console.log(this.duedate)
            this.actionStatusId = 1;
        }
    }

    requestCodeProcessor(request): void {
        var code = +request + 1;

        if(+request === 9){
            this.requestCode = "HUR.0000000" + code;
        }

        if(+request >= 99){
            this.requestCode = "HUR.000000" + code;
        }

        if(+request >= 999){
            this.requestCode = "HUR.00000" + code;
        }

        if(+request >= 9999){
            this.requestCode = "HUR.0000" + code;
        }

        if(+request >= 99999){
            this.requestCode = "HUR.000" + code; 
        }

        if(+request >= 999999){
            this.requestCode = "HUR.00"  + code;
        }
        if(+request>= 9999999){
            this.requestCode = "HUR.0"  + code;
        }
        if(+request >= 99999999){
            this.requestCode = "HUR."  + code;
        }
        if(+request < 9){
            this.requestCode = "HUR.00000000"   + code;
        }
    }

    onUserSelect(event: any){
        this.userId = parseInt(event.target.value);
        console.log(this.userId)
    }

    initializeData(data: IActionManagement){
        this.actionManagementObject = data;

        this.userId = data.assigned;
        this.duedate = new Date(data.dueDate);
        this.requestedBy = data.requested;
        this.requestCode = data.requestCode;
        this.requestTypeId = data.requestTypeId;
        this.fileName = data.fileName;
        this.requestInfo = data.requestInfo;
        this.actionStatusId = data.actionStatus;
        this.dtCreated = data.dtCreated;

    }

    onChangeDate(event: any) {
        let nDate = new Date(event.setDate(event.getDate()));
        // this.duedate = formatDate(nDate, 'dd-mm-yyyy', 'en');
        this.duedate = nDate;
        console.log(this.duedate)
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
                console.log(res)
                this.loading = false;
                // this.actionManagementObject.assigned = this.userId;
                // this.actionManagementObject.dueDate = this.duedate;
                // this.actionManagementObject.requested = this.requestedBy;
                // this.actionManagementObject.requestCode = 'HUR000000001';
                // this.actionManagementObject.requestTypeId = this.requestTypeId;
                // this.actionManagementObject.fileName = this.fileName;
                // this.actionManagementObject.requestInfo = this.requestInfo;
        
                // this._actionManagementService.addActionManagement(this.actionManagementObject)
                //     .subscribe(res => {
                //         console.log(res);
                //         this.toastr.success('Saved successfully', 'Success!');
                //         this.close();
                //     });
            });
    }

    submitForm(){

        if(this.form.valid) {
            const param = {
                id: this.currentId || 0,
                assigned: +this.userId,
                dueDate: this.form.value.dueDate,
                requested: +this.requestedBy,
                requestCode: this.form.value.requestCode,
                requestTypeId: +this.form.value.type,
                fileName: this.form.value.fileName,
                requestInfo: this.form.value.information,
                actionStatus: +this.form.value.status
            }
    
            this._actionManagementService.addActionManagement(param)
                .subscribe((res) => {
                    this.toastr.success('Saved successfully', 'Success!');
                    this.close();
                })
        }
        
    }

    close(): void {
        this.dialogRef.close();
    }

}
