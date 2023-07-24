import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../../shared/services/data.service';
import { FMEAService } from 'src/app/hsm/services/fmea.services';
import { groupBy } from 'rxjs/operators';
import { IImportForm } from 'src/app/hsm/interfaces/IImportMatch';
import { MaintainableReviewModalComponent } from '../maintainablereviewmodal/maintainablereviewmodal.component';

//Services


@Component({
  selector: 'maintainablematch-modal',
  templateUrl: './maintainablematchmodal.component.html',
  styleUrls: ['./maintainablematchmodal.component.scss']
})

export class MaintainableMatchModalComponent implements OnInit {

    arrayBuffer:any;
    file:File;
    tblname: string = "";
    columnId: number = 0;
    optionName: string = "";

    optionList: any[] = [];
    headerList: any[] = [];
    ignoreList: any[] = [];
    confirmList: any[] = [];
    optConfirmList: any[] = [];
    datacolumnList: any[] = [];
    gridData: any[];

    dbColumns: any = [
        { "value": 'ComponentTaskName' , "name": 'Maintainable Unit'},
        { "value": 'ComponentClass' , "name": 'Maintainable Item'},
        { "value": 'SubClass' , "name": 'Maintainable Sub Item'}
    ];

    columnOptions: IImportForm[] = [];

    tableArray: any;
    tableArrayRows: any[] = [];
    tableHeader: any;
    tableRows: any[] = [];

    isConfirmDisabled: boolean = true;
    isConfirm: boolean = false;
    isIgnore: boolean = false;
    isEdit: boolean = false;
    loading: boolean = false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<MaintainableMatchModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,   
        private fmeaService: FMEAService,
        private _dataService: DataService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();
        // console.log(this.data.item)
        this.tblname = this.data.opt;

        
        
        this.headerList = Object.keys(this.data.item[0]);
        
        this.headerList.forEach(e => { 
            let columnOption: IImportForm = { name: e, mappedName: "", displayName: "", disabled: false, buttonDisabled: true, buttonState: "Confirm", isSelected: false, ignoreDisabled: false, ignorebuttonDisabled: false, ignorebuttonState: "Ignore", data: []};
            this.columnOptions.push(columnOption);
        });

        this.dbColumns = this.dbColumns.sort((a, b) => (a.name < b.name ? -1 : 1));
        // this.headerList.pop();

        // console.log(this.headerList)
        // this.datacolumnList.push(this.data.item)

        // this.datacolumnList =  Object.values(this.datacolumnList).shift();
        // this.gridData = Object.values(this.datacolumnList)[1];

        // this.datacolumnList = __.groupBy(this.data.item, this.headerList);
        
        // console.log(this.dbColumns)
    }

    getSampleData(column: string) {
        var sample = this.data.item.slice(0,2).map(r => r[column]);
        return sample
    }

    columnOnSelect(event: any, index: number){
        this.columnId = parseInt(event);
        this.optionName = event.target.value;
        const cname = this.dbColumns.find(el => el.value === this.optionName);
        // console.log(cname.name)

        this.columnOptions[index].displayName = cname.name;
        this.columnOptions[index].buttonDisabled = false;
        this.columnOptions[index].mappedName = event.target.value;
    }

    confirmColumn(msg:string, opt: string, columnIndex: number, type: string){
        this.isConfirm = true;

        if(type.toLowerCase() === "confirm")
        {
            this.columnOptions[columnIndex].disabled = true;
            this.columnOptions[columnIndex].buttonState  = "Edit";
            this.columnOptions[columnIndex].buttonDisabled = false;
            this.columnOptions[columnIndex].isSelected = true;
        }
        else {
            this.columnOptions[columnIndex].disabled = false;
            this.columnOptions[columnIndex].buttonState = "Confirm";
            this.columnOptions[columnIndex].isSelected = false;
        }
        // console.log(this.columnOptions);
        
    }

    ignoreColumn(msg:string, opt: string, columnIndex: number, type: string){
        this.isIgnore = true;

        if(type.toLowerCase() === "ignore")
        {
            this.columnOptions[columnIndex].ignoreDisabled = true;
            this.columnOptions[columnIndex].ignorebuttonState  = "Edit";
            this.columnOptions[columnIndex].buttonDisabled = false;
            this.columnOptions[columnIndex].isSelected = false;
            this.columnOptions[columnIndex].ignorebuttonDisabled = true;
            this.columnOptions[columnIndex].disabled = true;
        }
        else {
            this.columnOptions[columnIndex].ignoreDisabled = false;
            this.columnOptions[columnIndex].disabled = false;
            this.columnOptions[columnIndex].ignorebuttonState = "Ignore";
            this.columnOptions[columnIndex].ignorebuttonDisabled = false;
            this.columnOptions[columnIndex].isSelected = false;
        }
        // console.log(this.columnOptions);
    }

    editConfirm(msg: string){
        this.isConfirm = false;

        const index: number = this.confirmList.indexOf(msg);
        if (index !== -1) {
            this.confirmList.splice(index, 1);
        }

        this.headerList.push(msg);
    }

    editIgnore(msg: string){
        this.isIgnore = false;

        const index: number = this.ignoreList.indexOf(msg);
        if (index !== -1) {
            this.ignoreList.splice(index, 1);
        }

        this.headerList.push(msg);
    }

    close(): void {
        this.dialogRef.close();
    }

    review(): void{
        let selectedColumns = this.columnOptions.filter(e => e.isSelected);

        selectedColumns.forEach(e => {
            e.data = this.data.item.map(function(i) { return i[e.name]; });
        });

        // console.log(selectedColumns);
        this.loading = true;
        this.openDialogReview('MaintainableData', selectedColumns);
        this.loading = false;
    }

    openDialogReview(data: any, val: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.maxWidth = "80vw";
        dialogConfig.minWidth = "80vw";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        dialogConfig.data = { item: data, opt: val};
        this._dataService.setData(dialogConfig.data);
        const dialogRef = this.dialog.open(MaintainableReviewModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
            // console.log(res)
            if(res === 'saved')
            {
                this.close();
            }
            
        });
    }

    saveChanges(): void{
    }

}
