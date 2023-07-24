import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';

//Services
import { TradeTypeService } from '../../services/tradetype.services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ITradeType } from '../../interfaces/ITradeType';
import { WorkInstructionTaskTypeModalComponent } from '../../modal/workinstructiontasktypemodal/workinstructiontasktypemodal.component';
import { UploadModalComponent } from '../../modal/uploadmodal/uploadmodal.component';
import { IWorkInstructionTaskType } from '../../interfaces/ITaskType';
import { WorkInstructionTaskTypeService } from '../../services/workinstructiontasktype.services';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

@Component({
    selector: "wintasktype-table",
    templateUrl: './workinstructiontasktype.component.html',
    styleUrls: [
        './workinstructiontasktype.component.scss'
    ]
})

export class WorkInstructionTaskTypeComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['id', 'taskTypeName', 'edit', 'delete'];

    ELEMENT_DATA: IWorkInstructionTaskType[] = [];
    jsonData: any[]=[];

    loading: boolean = false;
    default: boolean = false;
    
    dataSource;
    fileName = 'WorkInstructionTaskType.xlsx';

    constructor(
        private router: Router,
        private _eref: ElementRef,
        public toastr: ToastrService,
        public dialog: MatDialog,
        private _dataService: DataService,
        private _taskTypeService: WorkInstructionTaskTypeService
    ) {
    }
    
    ngOnInit(): void {
        this.getDataSource();
        this.default = true;
    }

    getDataSource(): void{
        this._taskTypeService.getWorkInstructionTaskType()
          .subscribe(res => {
            this.default = false;
            this.loading = false;
            this.ELEMENT_DATA = res;
            this.jsonData = res;
            this.dataSource = new MatTableDataSource<IWorkInstructionTaskType>(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          })
      }

    openDialogTasktype(opt: string, data: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "450px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        dialogConfig.data = { mode: opt, item: data };
        this._dataService.setData(dialogConfig.data);
        const dialogRef = this.dialog.open(WorkInstructionTaskTypeModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
            this.ngOnInit();
        });
    }

    deleteAction(id: number, name: string): void {
        if (confirm("Are you sure to delete " + name + " ? This cannot be undone.")) {
            this._taskTypeService.deleteWorkInstructionTaskType(id)
            .subscribe(res => {    
                this.toastr.success("Deleted Successfully!", 'Success'); 
                this.ngOnInit();           
            });
        }
    }

    openDialogUpload(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "500px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        const dialogRef = this.dialog.open(UploadModalComponent, dialogConfig);
    }

    exportExcel(): void {
        /* table id is passed over here */
        let element = document.getElementById('excel-table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }
}



