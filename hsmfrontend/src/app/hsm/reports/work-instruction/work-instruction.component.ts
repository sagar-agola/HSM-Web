import { Component, OnInit, Inject, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services

//interface
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AppSettings } from 'src/app/shared/app.settings';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'work-instruction-list',
  templateUrl: './work-instruction.component.html',
  styleUrls: ['./work-instruction.component.scss']
})

export class WorkInstructionListComponent implements OnInit {
    loading: boolean = false;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private http: HttpClient,
        public toastr: ToastrService,
        private _dataService: DataService,) {
        
    }

    ngOnInit(): void {
    }

}
