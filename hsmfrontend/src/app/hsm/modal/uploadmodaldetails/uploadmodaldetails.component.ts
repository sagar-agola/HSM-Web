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
  selector: 'upload-modal-details',
  templateUrl: './uploadmodaldetails.component.html',
  styleUrls: ['./uploadmodaldetails.component.scss']
})

export class UploadModalDetailsComponent implements OnInit {
    private controllerApi = `${AppSettings.SITE_HOST}/api/`;

    @ViewChild('fileInput') fileInput;
    public progress: number;
    @Output() public onUploadFinished = new EventEmitter();

    myControl = new FormControl();
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();

    comment: string = "";
    dataSource;
    inputEl: any;
    message: string = "";
    fileName: string = "";
    maintItem: string = "";
    file: any;
    loading: boolean = false;

    existingAttachDisabled: boolean = false;
    removeAttachedDisabled: boolean = true;

    existingAttach: boolean = true;
    removeAttach: boolean = false;

    optionSelect: string = "";

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<UploadModalDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private http: HttpClient,
        public toastr: ToastrService,
        private _eamPlanAttachService: EAMPlanAttachURLService,
        private _dataService: DataService,) {
        
    }

    ngOnInit(): void {
        this.optionSelect = "0";

        this.data = this._dataService.getData();
        // console.log(this.data);

        this._eamPlanAttachService.getGetEAMPlanAttachByMaintId(this.data)
            .subscribe(res => {
                // console.log(res);
                this.maintItem = this.data;
                this.comment = res.comment;
                this.fileName = res.locationURL;
            });
    }
    
    checkRadio1(event: any) {
        console.log(event.target.value);
        this.existingAttachDisabled = false;
        this.removeAttachedDisabled = true;
        this.removeAttach = false;
        this.existingAttach = true;
    }
    
    checkRadio2(event: any) {
        console.log(event.target.value);
        this.existingAttachDisabled = true;
        this.removeAttachedDisabled = false;
        this.removeAttach = true;
        this.existingAttach = false;
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
                    this.toastr.success('File uploaded successfully', 'Success!');
                    this.onUploadFinished.emit(event.body);
                    this.loading = false;
                }
            });
    }

    deleteURL(name: string):void{
        if (confirm("Are you sure to delete MaintItemId " + name + " ?")) {
            this._eamPlanAttachService.deleteEAMPlanURL(name)
            .subscribe(res => {
                console.log(res);
                this._eamPlanAttachService.getGetEAMPlanAttachByMaintId(name)
                .subscribe(res => {
                    // console.log(res);
                    this.maintItem = res.maintItemId;
                });
            });
        }
    }

    saveData(): void{
        this.toastr.success('Attached URL deleted successfully', 'Success!');
        this.close();
    }

    close(): void {
        this.dialogRef.close();
    }

    goToURL(): void{
        window.open(this.fileName, '_blank');
    }

}
