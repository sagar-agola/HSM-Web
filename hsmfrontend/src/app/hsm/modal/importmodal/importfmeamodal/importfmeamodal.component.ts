import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../../shared/services/data.service';
import { ImportmatchModalComponent } from '../importmatchmodal/importmatchmodal.component';
import { FMEAService } from 'src/app/hsm/services/fmea.services';

//Services


@Component({
  selector: 'importfmea-modal',
  templateUrl: './importfmeamodal.component.html',
  styleUrls: ['./importfmeamodal.component.scss']
})

export class ImportFmeaModalComponent implements OnInit {

    arrayBuffer:any;
    file:File;
    tblname: string = "";

    optionList: any[] = [];
    results: any[] = [];
    convertedJson: string = "";

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<ImportFmeaModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _fmeaService: FMEAService,
        private _dataService: DataService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();
        // console.log(this.data)
        this.tblname = this.data.data;

        this._fmeaService.getOptions(this.tblname)
            .subscribe(res => { 
                // console.log(res)
                this.optionList = res; 
        });

    }

    incomingfile(event) 
    {
        this.file= event.target.files[0]; 
    }

    onFileChange(event: any) {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(event.target);
        if (target.files.length !== 1) {
          throw new Error('Cannot use multiple files');
        }
        const reader: FileReader = new FileReader();
        reader.readAsBinaryString(target.files[0]);
        reader.onload = (e: any) => {
          /* create workbook */
          const binarystr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
    
          /* selected the first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    
          /* save data */
          const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
        //   console.log(data); // Data will be logged in array format containing objects
          this.close();
          // console.log(data)
          this.results = this.optionList.concat(data);
          this.openDialogMatch(data, this.tblname);
        };
     }

     onUpload(event: any) {
      const selectedFile = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(selectedFile);
      fileReader.onload = (event) => {
        // console.log(event)
        let binaryData = event.target.result;
        let workbooks = XLSX.read(binaryData, {type: 'binary'});
        workbooks.SheetNames.forEach(sheet => {
          const datasheet = XLSX.utils.sheet_to_json(workbooks.Sheets[sheet], {defval:""});
          // console.log(datasheet)
          this.convertedJson = JSON.stringify(datasheet, undefined, 4);
          // console.log(this.convertedJson)
          this.results = datasheet;
        })
        // console.log(this.results)
        this.openDialogMatch(this.results, this.tblname);
      }
     }

     openDialogMatch(data: any, val: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "1200px";
        dialogConfig.minHeight = "auto";
        dialogConfig.position = { top: '30px' };
        dialogConfig.data = { item: data, opt: val };
        this._dataService.setData(dialogConfig.data);
        const dialogRef = this.dialog.open(ImportmatchModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
            this.ngOnInit();
            this.close();
        });
    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
    }

}
