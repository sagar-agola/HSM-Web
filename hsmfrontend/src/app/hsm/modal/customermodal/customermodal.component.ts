import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { CustomerService } from '../../services/customer.services';

//interface
import { ICustomer } from './../../interfaces/ICustomer';

@Component({
  selector: 'customer-modal',
  templateUrl: './customermodal.component.html',
  styleUrls: ['./customermodal.component.scss']
})

export class CustomerModalComponent implements OnInit {
    customerName: string = "";
    emailAddress: string = "";
    location: string = "";
    contactNumber: string = "";
    mode: string = "";

    custObject: ICustomer = {
        id: 0,
        customerName: '',
        emailAddress: '',
        location: '',
        contactNumber: ''
    };

    isEdit: boolean = false;
    currentId: number;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<CustomerModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _customerService: CustomerService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();
        // console.log(this.data)
        this.mode = this.data.mode;
        this.currentId = this.data.item;

        if(this.mode === 'Edit')
        {
            this.isEdit = true;
            this._customerService.getCustomerById(this.currentId)
                .subscribe(res => {
                    console.log(res)
                    this.initializeData(res);
                })
        }else{
            this.isEdit = false;
        }
    }

    initializeData(data: ICustomer): void{
        this.custObject = data;

        this.customerName = data.customerName;
        this.emailAddress = data.emailAddress;
        this.contactNumber = data.contactNumber;
        this.location = data.location;

    }

    close(): void {
        this.dialogRef.close();
    }

    onKeyUp(event){
        this.customerName = event.target.value;
    }

    saveChanges(): void{
        this.custObject.customerName = this.customerName;
        this.custObject.emailAddress = this.emailAddress;
        this.custObject.contactNumber = this.contactNumber;
        this.custObject.location = this.location;
    
        this._customerService.addCustomer(this.custObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
      }

      updateChanges(): void{
        this.custObject.customerName = this.customerName;
        this.custObject.emailAddress = this.emailAddress;
        this.custObject.contactNumber = this.contactNumber;
        this.custObject.location = this.location;

        this._customerService.updateCustomerRecords(this.currentId, this.custObject)
            .subscribe(res => {
                this.toastr.success("Successfully updated!", 'Success');
                this.close();
            })
      }

}
