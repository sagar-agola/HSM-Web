import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { FrequencyService } from '../../services/frequency.services';

//interface
import { IFrequency } from './../../interfaces/IFrequency';

@Component({
  selector: 'frequency-modal',
  templateUrl: './frequencymodal.component.html',
  styleUrls: ['./frequencymodal.component.scss']
})

export class FrequencyModalComponent implements OnInit {
    frequency: string = "";
    customerId: number = 0;
    siteId : number = 0;
    currentId: number;

    frequencyObject: IFrequency = {
        id: 0,
        frequencyName: '',
        customerId: 0,
        siteId: 0
    };

    isHSMUser: boolean = false;
    isAdmin: boolean = false;
    isEdit: boolean = false;
    mode: string = "";

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<FrequencyModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _frequencyService: FrequencyService) {
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

            this._frequencyService.getFrequencyById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    close(): void {
        this.dialogRef.close();
    }

    onKeyUp(event){
        this.frequency = event.target.value;
    }

    initializeData(data: IFrequency): void{
        this.frequencyObject = data;

        this.frequency = data.frequencyName;
        this.customerId = data.customerId;
        this.siteId = data.siteId;

    }

    saveChanges(): void{
        this.frequencyObject.frequencyName = this.frequency;
        this.frequencyObject.customerId = this.customerId;
        this.frequencyObject.siteId = this.siteId;
    
        this._frequencyService.addFrequency(this.frequencyObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
      }

      updateChanges(): void{
        this.frequencyObject.frequencyName = this.frequency;
        this.frequencyObject.customerId = this.customerId;
        this.frequencyObject.siteId = this.siteId;
    
        this._frequencyService.updateFrequency(this.currentId, this.frequencyObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

}
