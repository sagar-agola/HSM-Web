import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { AssetCategoryService } from '../../services/assetcategory.services';

//interface
import { IAssetCategory, IAssetHierarchyClassTaxonomy } from './../../interfaces/IAssetHierarchyTaxonomy';

@Component({
  selector: 'assetcategory-modal',
  templateUrl: './assetcategorymodal.component.html',
  styleUrls: ['./assetcategorymodal.component.scss']
})

export class AssetCategoryModalComponent implements OnInit {
    mode: string = "";
    assetCategory: string = "";
    currentId: number;

    assetCategoryObject: IAssetCategory = {
        id: 0,
        assetCategoryName: ''
    };

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AssetCategoryModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _assetCategoryService: AssetCategoryService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._assetCategoryService.getAssetCategoryById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IAssetCategory): void{
        this.assetCategoryObject = data;

        this.assetCategory = data.assetCategoryName;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.assetCategoryObject.assetCategoryName = this.assetCategory;
    
        this._assetCategoryService.addAssetCategory(this.assetCategoryObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.assetCategoryObject.assetCategoryName = this.assetCategory;
    
        this._assetCategoryService.updateAssetCategory(this.currentId, this.assetCategoryObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
