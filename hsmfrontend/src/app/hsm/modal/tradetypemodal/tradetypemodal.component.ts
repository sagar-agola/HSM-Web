import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { TradeTypeService } from '../../services/tradetype.services';

//interface
import { ITradeType } from './../../interfaces/ITradeType';

@Component({
  selector: 'tradetype-modal',
  templateUrl: './tradetypemodal.component.html',
  styleUrls: ['./tradetypemodal.component.scss']
})

export class TradeTypeModalComponent implements OnInit {
    tradeType: string = "";
    customerId: number = 0;
    siteId: number = 0;
    currentId: number;

    tradeTypeObject: ITradeType = {
        id: 0,
        tradeTypeName: '',
        customerId: 0,
        siteId: 0
    };

    isHSMUser: boolean = false;
    isAdmin: boolean = false;
    isEdit: boolean = false
    mode: string = "";

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<TradeTypeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _tradeTypeService: TradeTypeService) {
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

            this._tradeTypeService.getTradeTypeById(this.currentId)
                .subscribe(res => {
                    console.log(res);
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

    initializeData(data: ITradeType): void{
        this.tradeTypeObject = data;

        this.tradeType = data.tradeTypeName;
        this.customerId = data.customerId;
        this.siteId = data.siteId;

    }

    saveChanges(): void{
        this.tradeTypeObject.tradeTypeName = this.tradeType;
        this.tradeTypeObject.customerId = this.customerId;
        this.tradeTypeObject.siteId = this.siteId;
    
        this._tradeTypeService.addTradeType(this.tradeTypeObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
      }

    updateChanges(): void{
        this.tradeTypeObject.tradeTypeName = this.tradeType;
        this.tradeTypeObject.customerId = this.customerId;
        this.tradeTypeObject.siteId = this.siteId;
    
        this._tradeTypeService.updateTradeType(this.currentId, this.tradeTypeObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

}
