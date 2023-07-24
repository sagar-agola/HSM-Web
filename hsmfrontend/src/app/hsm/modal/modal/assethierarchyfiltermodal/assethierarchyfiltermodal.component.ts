import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../../shared/services/data.service';
import { AssetHierarchyService } from 'src/app/hsm/services/assethierarchy.services';
import { IAssetHierarchyParam } from 'src/app/hsm/interfaces/IAssetHierarchy';

@Component({
   selector: 'assethierarchyfilter-modal',
   templateUrl: './assethierarchyfiltermodal.component.html',
   styleUrls: ['./assethierarchyfiltermodal.component.scss']
})

export class AssetHierarchyFilterModalComponent implements OnInit {
   floc: string = "";
   flocDesc: string = "";
   pmDesc: string = "";
   systemStatus: string = "";

   extreme: string = "";
   veryHigh: string = "";
   high: string = "";
   medium: string = "";
   low: string = "";
   veryLow: string = "";
   undefinedStatus: string = "";
   crtdStatus: string = "";
   crtdInactStatus: string = "";

   isCheckExtreme: boolean = false;
   systemStatusActive: boolean = false;
   systemStatusInActive: boolean = false;
   systemStatusId: number;

   assetHierarchyData: [] = [];
   assetHierarchyParam: IAssetHierarchyParam;

   constructor(
      private router: Router,
      public dialogRef: MatDialogRef<AssetHierarchyFilterModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialog: MatDialog,
      public toastr: ToastrService,
      private _assetHierarchyService: AssetHierarchyService,
      private _dataService: DataService) {

   }

   ngOnInit(): void {
      this.data = this._dataService.getData();
      console.log(this.data);

      this.assetHierarchyParam = this.data;
      localStorage.removeItem("floc");
      localStorage.removeItem("flocDesc");
      localStorage.removeItem("pmDesc");
      localStorage.removeItem("extreme");
      localStorage.removeItem("veryHigh");
      localStorage.removeItem("high");
      localStorage.removeItem("medium");
      localStorage.removeItem("low");
      localStorage.removeItem("veryLow");
      localStorage.removeItem("undefined");
      localStorage.removeItem("systemStatus")
   }

   close(): void {
      this.dialogRef.close();
   }

   checkValue1(event: any) {
      console.log(event);
      this.extreme = event;
   }

   checkValue2(event: any) {
      this.veryHigh = event;
   }

   checkValue3(event: any) {
      this.high = event;
   }

   checkValue4(event: any) {
      this.medium = event;
   }

   checkValue5(event: any) {
      this.low = event;
   }

   checkValue6(event: any) {
      this.veryLow = event;
   }

   checkValue7(event: any) {
      this.undefinedStatus = event;
   }

   checkValue8(event: any){
      // console.log(event);
      this.crtdStatus = event;
   }

   checkValue9(event: any){
      // console.log(event);
      this.crtdInactStatus = event;
   }

   checkRadio1(event: any) {
      console.log(event.target.value);
      this.systemStatusId = event.target.value;

      this.systemStatus = 'CRTD';
   }

   checkRadio2(event: any) {
      console.log(event.target.value);
      this.systemStatusId = event.target.value;
      this.systemStatus = 'CRTD INAC';
   }

   filter(): void {
      this.data = this._dataService.getData();

      localStorage.setItem("floc", this.floc);
      localStorage.setItem("flocDesc", this.flocDesc);
      localStorage.setItem("pmDesc", this.pmDesc);
      localStorage.setItem("extreme", this.extreme);
      localStorage.setItem("veryHigh", this.veryHigh);
      localStorage.setItem("high", this.high);
      localStorage.setItem("medium", this.medium);
      localStorage.setItem("low", this.low);
      localStorage.setItem("veryLow", this.veryLow);
      localStorage.setItem("undefined", this.undefinedStatus);
      localStorage.setItem("crtdStatus", this.crtdStatus)
      localStorage.setItem("crtdInactStatus", this.crtdInactStatus)

      this.close();
      // this._assetHierarchyService.getAssetHierarchyMultiFilter(this.floc, this.flocDesc, this.pmDesc)
      //     .subscribe(res => {
      //         console.log(res);
      //         this.assetHierarchyData = res;
      //     });
   }
}
