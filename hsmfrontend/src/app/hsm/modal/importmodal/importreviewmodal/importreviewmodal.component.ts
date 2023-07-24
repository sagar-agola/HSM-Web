import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../../shared/services/data.service';
import { FMEAService } from 'src/app/hsm/services/fmea.services';
import { IFMEAImport } from 'src/app/hsm/interfaces/IFMEA';
import { fmeaImportDefault } from 'src/app/shared/helpers/default.helpers';
// import Handsontable from "handsontable";

//Services


@Component({
  selector: 'importreview-modal',
  templateUrl: './importreviewmodal.component.html',
  styleUrls: ['./importreviewmodal.component.scss']
})

export class ImportReviewModalComponent implements OnInit {
    dataset: any[] = [
        {id: 1, name: 'Ted Right', address: 'Wall Street'},
        {id: 2, name: 'Frank Honest', address: 'Pennsylvania Avenue'},
        {id: 3, name: 'Joan Well', address: 'Broadway'},
        {id: 4, name: 'Gail Polite', address: 'Bourbon Street'},
        {id: 5, name: 'Michael Fair', address: 'Lombard Street'},
        {id: 6, name: 'Mia Fair', address: 'Rodeo Drive'},
        {id: 7, name: 'Cora Fair', address: 'Sunset Boulevard'},
        {id: 8, name: 'Jack Right', address: 'Michigan Avenue'},
      ];

    arrayBuffer:any;
    file:File;
    tblname: string = "";
    jsonObject: {};

    optionList: any[] = [];
    headerList: any[] = [];
    tableList: any[] = [];
    dataList: any[] = [];
    datavalList: any[] = [];
    dataFinalList: any[] = [];

    loading: boolean = false;

    fmeaImportObj: IFMEAImport = fmeaImportDefault();

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<ImportReviewModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,   
        private fmeaService: FMEAService,
        private _dataService: DataService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();
        console.log(this.data)

        this.formatData(this.data.opt);

        this.headerList = this.data.opt;
        this.dataList = this.data.opt;
        // this.tableList = this.data.opt;
        // console.log(this.dataList["data"])
    }

    formatData(data: any[]){
        let arrItems = [];
        let finalItems = [];

        for(var i = 0; i < data[0].data.length; i++)
        {
            let item = {};
            let newitem = {};

            data.forEach(e => 
                {
                    item[e.displayName] = String(e.data[i]);
                    newitem[e.mappedName] = String(e.data[i]);
                })
            // data.forEach(x => {
            //     console.log(x)
            // })
            arrItems.push(item);
            finalItems.push(newitem);
        }
        // console.log(arrItems);
        // console.log(finalItems);

        this.tableList = arrItems;
        this.dataFinalList = finalItems;

        
    }

    goBack(): void{
        this.dialogRef.close('goback');
    }

    close(): void {
        this.dialogRef.close('saved');
    }

    saveChanges(): void{
        this.loading = true;
        this.fmeaService.upsertImportExcel(this.dataFinalList)
            .subscribe(res => {
                this.loading = false;
                this.toastr.success("Successfully imported!", 'Success');
                // console.log(res)
                this.close();
            });
    }

}
