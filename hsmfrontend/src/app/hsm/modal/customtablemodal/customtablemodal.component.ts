import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

@Component({
  selector: 'custom-table-modal',
  templateUrl: './customtablemodal.component.html',
  styleUrls: ['./customtablemodal.component.scss']
})

export class CustomTableModalComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<CustomTableModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();
    }

    close(): void {
        this.dialogRef.close();
    }

}
