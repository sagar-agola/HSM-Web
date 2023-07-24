import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { AssetHierarchyManufacturerService } from '../../services/assethierarchymanufacturer.services';

//interface
import { IAssetHierarchyManufacturerTaxonomy } from './../../interfaces/IAssetHierarchyTaxonomy';

@Component({
  selector: 'assetmanufacturer-modal',
  templateUrl: './assetmanufacturermodal.component.html',
  styleUrls: ['./assetmanufacturermodal.component.scss']
})

export class AssetHierarchyManufacturerModalComponent implements OnInit {
    mode: string = "";
    assetManufacturer: string = "";
    currentId: number;

    manufacturerObject: IAssetHierarchyManufacturerTaxonomy = {
        id: 0,
        assetManufacturer: ''
    };

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AssetHierarchyManufacturerModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _assetHierarchyManufacturerService: AssetHierarchyManufacturerService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._assetHierarchyManufacturerService.getAssetManufacturerById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IAssetHierarchyManufacturerTaxonomy): void{
        this.manufacturerObject = data;

        this.assetManufacturer = data.assetManufacturer;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.manufacturerObject.assetManufacturer = this.assetManufacturer;
    
        this._assetHierarchyManufacturerService.addAssetManufacturer(this.manufacturerObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.manufacturerObject.assetManufacturer = this.assetManufacturer;
    
        this._assetHierarchyManufacturerService.updateAssetManufacturer(this.currentId, this.manufacturerObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
