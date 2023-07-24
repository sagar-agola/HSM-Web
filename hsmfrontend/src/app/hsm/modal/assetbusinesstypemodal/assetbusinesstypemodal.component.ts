import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { AssetHierarchyBusinessTypeService } from '../../services/assethierarchybusinesstype.services';

//interface
import { IAssetHierarchyBusinessTypeTaxonomy } from './../../interfaces/IAssetHierarchyTaxonomy';

@Component({
  selector: 'assetbusinesstype-modal',
  templateUrl: './assetbusinesstypemodal.component.html',
  styleUrls: ['./assetbusinesstypemodal.component.scss']
})

export class AssetBusinessTypeModalComponent implements OnInit {
    mode: string = "";
    businessType: string = "";
    currentId: number;

    assetBusinessTypeObject: IAssetHierarchyBusinessTypeTaxonomy = {
        id: 0,
        businessType: ''
    };

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AssetBusinessTypeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _assetBusinessTypeService: AssetHierarchyBusinessTypeService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._assetBusinessTypeService.getAssetBusinessTypeyById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IAssetHierarchyBusinessTypeTaxonomy): void{
        this.assetBusinessTypeObject = data;

        this.businessType = data.businessType;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.assetBusinessTypeObject.businessType = this.businessType;
    
        this._assetBusinessTypeService.addAssetBusinessType(this.assetBusinessTypeObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.assetBusinessTypeObject.businessType = this.businessType;
    
        this._assetBusinessTypeService.updateAssetBusinessType(this.currentId, this.assetBusinessTypeObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
