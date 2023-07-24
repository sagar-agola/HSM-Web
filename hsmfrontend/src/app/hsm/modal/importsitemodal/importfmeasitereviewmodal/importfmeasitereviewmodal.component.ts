import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../../shared/services/data.service';
import { FMEAService } from 'src/app/hsm/services/fmea.services';
import { IFMUFTSiteImport } from 'src/app/hsm/interfaces/IFMEA';
import { fmuftSiteImportDefault } from 'src/app/shared/helpers/default.helpers';
import { FMaintainableUnitService } from 'src/app/hsm/services/fmaintainableunitsite.services';
// import Handsontable from "handsontable";

//Services


@Component({
  selector: 'importfmeasitereview-modal',
  templateUrl: './importfmeasitereviewmodal.component.html',
  styleUrls: ['./importfmeasitereviewmodal.component.scss']
})

export class ImportFmeaSiteReviewModalComponent implements OnInit {

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
    isHSMUser: boolean = false;
    isAdmin: boolean = false;

    customerId: number = 0;
    siteId: number = 0;

    fmeaImportObj: IFMUFTSiteImport = fmuftSiteImportDefault();

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<ImportFmeaSiteReviewModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,   
        private fmeaService: FMaintainableUnitService,
        private _dataService: DataService) {
            const user = JSON.parse(localStorage.currentUser);
            this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
            // console.log(user);
            this.isAdmin = user?.users?.isAdmin;
            this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
            this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();
        // console.log(this.data)

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
        this.fmeaService.upsertImportExcel(this.dataFinalList, this.customerId, this.siteId)
            .subscribe(res => {
                this.loading = false;
                this.toastr.success("Successfully imported!", 'Success');
                // console.log(res)
                this.close();
            });
    }

}
