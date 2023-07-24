import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import * as FileSaver from 'file-saver';

import { DataService } from './../../../shared/services/data.service';

//Services
import { TradeTypeService } from '../../services/tradetype.services';

//interface
import { ProgressStatus, ProgressStatusEnum } from './../../interfaces/IAssetTaskGroupStrategy';
import { AssignAssetTaskGroupStrategyMaterialService } from '../../services/assignassettaskgroupstrategymaterial.services';
import { buffer } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'select-template-modal',
  templateUrl: './selecttemplatemodal.component.html',
  styleUrls: ['./selecttemplatemodal.component.scss']
})

export class SelectTemplateComponentModalComponent implements OnInit {
    @Input() public disabled: boolean;
    @Input() public fileName: string;
    @Output() public downloadStatus: EventEmitter<ProgressStatus>;

    tgsId: number;
    workInstTitle: string = "";
    templateId: number;
    blob: any;

    loading: boolean = false;
    isDisable: boolean = false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<SelectTemplateComponentModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _assignTGSMaterialService: AssignAssetTaskGroupStrategyMaterialService,
        private _dataService: DataService,) {
            this.downloadStatus = new EventEmitter<ProgressStatus>();
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        console.log(this.data.item);
        // console.log(this.data.name);

        this.tgsId = this.data.item;
        this.workInstTitle = this.data.name;
    }

    templateOnclick(event): void{
        this.templateId = parseInt(event.target.value);
        // console.log(this.templateId)
    }

    // private saveAsExcelFile(buffer: any, fileName: string): void {
    //     const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    //     FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    // }

    deleteTemp():void{
        this._assignTGSMaterialService.deleteFile()
            .subscribe(foo => {
        });
    }

    selectTemplateBtn(): void{
        console.log(this.templateId)
        // const data: Blob = new Blob([buffer];
        if(this.templateId === 1){
            this.loading = true;
            this._assignTGSMaterialService.getGenerateWINdata(this.tgsId)
                .subscribe(res => {
                    const byteCharacters = atob(res);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], {type: 'application/docx'});
        
                        // this.blob = new Blob([data], {type: 'docx'});
                        
                        const a = document.createElement('a');
                        a.setAttribute('style', 'display:none;');
                        document.body.appendChild(a);
                        a.download = this.workInstTitle + ".docx";
                        a.href = URL.createObjectURL(blob);
                        a.target = '_blank';
                        a.click();
                        document.body.removeChild(a);
                        this.loading = false;
                        this.toastr.success("Template Generated Successfully!", 'Success');
                        this.close();
                })
            
            
            // this._assignTGSMaterialService.getByteData()
            //     .subscribe(res => {
            //         this.fileName = "test.docx";
            //         this.blob = new Blob([res.fileName], {type: res.fileContent});
            //         // const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
            //         FileSaver.saveAs(this.blob, this.fileName);
            //         // console.log(data)
            //     });
            
            // this._assignTGSMaterialService.testDownloadFile(this.tgsId)
            //     .subscribe(res => {
            //         console.log(res);
                    // this.fileName = this.workInstTitle;
                    // switch (res.type) {
                    //     case HttpEventType.DownloadProgress:
                    //         this.downloadStatus.emit( {status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((res.loaded / res.total) * 100)});
                    //         break;
                    //     case HttpEventType.Response:
                    //         this.downloadStatus.emit( {status: ProgressStatusEnum.COMPLETE});
                    //         const downloadedFile = new Blob([res.body], { type: res.body.type });
                    //         const a = document.createElement('a');
                    //         a.setAttribute('style', 'display:none;');
                    //         document.body.appendChild(a);
                    //         a.download = this.fileName + ".docx";
                    //         a.href = URL.createObjectURL(downloadedFile);
                    //         a.target = '_blank';
                    //         a.click();
                    //         document.body.removeChild(a);
                    //         break;
                    // }
        }
        else if(this.templateId === 2){
            this.loading = true;
            this._assignTGSMaterialService.downloadHSM(this.tgsId)
                .subscribe(res => {
                    const byteCharacters = atob(res);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], {type: 'application/docx'});
        
                        // this.blob = new Blob([data], {type: 'docx'});
                        
                        const a = document.createElement('a');
                        a.setAttribute('style', 'display:none;');
                        document.body.appendChild(a);
                        a.download = this.workInstTitle + ".docx";
                        a.href = URL.createObjectURL(blob);
                        a.target = '_blank';
                        a.click();
                        document.body.removeChild(a);
                        this.loading = false;
                        this.toastr.success("Template Generated Successfully!", 'Success');
                        this.close();
                });
            
        }else if(this.templateId === 3){
            this.toastr.warning("No template Available!", 'Warning'); 
        }
    }

    close(): void {
        this.dialogRef.close();
    }

}
