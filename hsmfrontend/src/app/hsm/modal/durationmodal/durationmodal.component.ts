import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { DurationService } from '../../services/duration.services';

//interface
import { IDuration } from './../../interfaces/IDuration';

@Component({
  selector: 'duration-modal',
  templateUrl: './durationmodal.component.html',
  styleUrls: ['./durationmodal.component.scss']
})

export class DurationModalComponent implements OnInit {
    durationName: string = "";
    customerId: number = 0;
    siteId: number = 0;
    currentId: number;

    durationObject: IDuration = {
        id: 0,
        durationName: '',
        customerId: 0,
        siteId: 0
    };

    isHSMUser: boolean = false;
    isAdmin: boolean = false;
    isEdit: boolean = false
    mode: string = "";

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<DurationModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _durationService: DurationService) {
            const user = JSON.parse(localStorage.currentUser);
            this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
            // console.log(user);
            this.isAdmin = user?.users?.isAdmin;
            this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
            this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        this.currentId = this.data.item;

        if(this.mode === 'Edit'){
            this.isEdit = true;

            this._durationService.getDurationById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IDuration): void{
        this.durationObject = data;

        this.durationName = data.durationName;
        this.customerId = data.customerId;
        this.siteId = data.siteId;

    }

    close(): void {
        this.dialogRef.close();
    }

    onKeyUp(event){
        this.durationName = event.target.value;
    }

    saveChanges(): void{
        this.durationObject.durationName = this.durationName;
        this.durationObject.customerId = this.customerId;
        this.durationObject.siteId = this.siteId;
    
        this._durationService.addDuration(this.durationObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
      }

      updateChanges(): void{
        this.durationObject.durationName = this.durationName;
        this.durationObject.customerId = this.customerId;
        this.durationObject.siteId = this.siteId;
    
        this._durationService.updateDuration(this.currentId, this.durationObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

}
