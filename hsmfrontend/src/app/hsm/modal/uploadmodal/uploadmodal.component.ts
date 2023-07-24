import { Component, OnInit, Inject, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { TradeTypeService } from '../../services/tradetype.services';

//interface
import { ITradeType } from './../../interfaces/ITradeType';
import { IEAMPlanAttachURL } from './../../interfaces/IEAMPlan';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AppSettings } from 'src/app/shared/app.settings';
import { FormControl } from '@angular/forms';
import { EAMPlanAttachURLService } from '../../services/eamplanattachurl.services';

@Component({
  selector: 'upload-modal',
  templateUrl: './uploadmodal.component.html',
  styleUrls: ['./uploadmodal.component.scss']
})

export class UploadModalComponent implements OnInit {
    private controllerApi = `${AppSettings.SITE_HOST}/api/EAMPlanAttachURLs/UploadFile`;

    @ViewChild('fileInput') fileInput;
    public progress: number;
    @Output() public onUploadFinished = new EventEmitter();

    myControl = new FormControl();
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

    comment: string = "";
    attachComment: string = "";
    maintItemId: string = "";
    maintItemSearch: string = "";
    dataSource;
    inputEl: any;
    message: string = "";
    fileName: string = "";
    locationURL: string = "";
    file: any;
    loading: boolean = false;
    fileURL: string = "";

    attachNew: boolean = true;
    attachExisting: boolean = false;

    attachNewDisabled: boolean = false;
    attachExistingDisabled: boolean = true;
    processDisabled: boolean = false;

    eamPlanAttachObject: IEAMPlanAttachURL = {
        id: 0,
        maintItemId: '',
        locationURL: '',
        comment: ''
    };


    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<UploadModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private http: HttpClient,
        public toastr: ToastrService,
        private _eamPlanattachService: EAMPlanAttachURLService,
        private _dataService: DataService,) {
        
    }

    ngOnInit(): void {

        this.data = this._dataService.getData();

        console.log(this.data);
        this.maintItemId = this.data;

        this.attachNew = true;
    }

    checkRadio1(event: any) {
        // console.log(event.target.value);
        this.attachExistingDisabled = true;
        this.attachNewDisabled = false;
        this.attachExisting = false;
        this.attachNew = true;
    }

    checkRadio2(event: any) {
        // console.log(event.target.value);
        if(event.target.checked === true){
            this.attachExistingDisabled = false;
            this.attachNewDisabled = true;
            this.attachNew = false;
            this.attachExisting = true;
        }
    }

    searchMaintItem(data: string){
        this._eamPlanattachService.getGetEAMPlanAttachByMaintId(data)
        .subscribe(res => {
            // console.log(res);
            this.attachComment = res.comment;
            this.fileURL = res.locationURL;
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

        this.http.post(this.controllerApi, formData, { reportProgress: true, observe: 'events' })
            .subscribe(event => {
                if (event.type === HttpEventType.Response) {
                    this.message = 'Upload success.';
                    this.onUploadFinished.emit(event.body);
                    this.loading = false;
                    // this.toastr.success('File uploaded successfully', 'Success!');
                    this.saveData();

                    this.eamPlanAttachObject.maintItemId = this.maintItemId;
                    this.eamPlanAttachObject.comment = this.comment
                    this.eamPlanAttachObject.locationURL = "https://drive.google.com/drive/u/0/folders/1lChbGmZydYtlggWC83HKA-ovLdESTcvT";
        
                    this._eamPlanattachService.addEAMPlanURLAttach(this.eamPlanAttachObject)
                    .subscribe(res => {
                        this.toastr.success('File uploaded successfully', 'Success!');
                    });
        
                    this.attachNewDisabled = true;
        
                    this.processDisabled = true;        
                }
            });

        
    }

    saveData(): void{
        // if(this.attachExistingDisabled === true){
           
        //     console.log(1);
        // }
        
        if(this.attachNewDisabled === true){
            this.eamPlanAttachObject.maintItemId = this.maintItemId;
            this.eamPlanAttachObject.comment = this.attachComment
            this.eamPlanAttachObject.locationURL = this.fileURL; 

            this._eamPlanattachService.addEAMPlanURLAttach(this.eamPlanAttachObject)
            .subscribe(res => {
                this.toastr.success('Existing file attached successfully', 'Success!');
            });

            this.attachExistingDisabled = true;
            this.processDisabled = true;

            console.log(2);   
        }
        
    }

    close(): void {
        this.dialogRef.close();
    }

    goToURL(): void{
        window.open(this.fileURL, '_blank');
    }
    

}
