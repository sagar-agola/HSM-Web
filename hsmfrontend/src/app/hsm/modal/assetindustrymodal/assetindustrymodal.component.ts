import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { AssetHierarchyIndustryService } from '../../services/assethierarchyindustry.services';

//interface
import { IAssetHierarchyIndustryTaxonomy } from './../../interfaces/IAssetHierarchyTaxonomy';

@Component({
  selector: 'assetindustry-modal',
  templateUrl: './assetindustrymodal.component.html',
  styleUrls: ['./assetindustrymodal.component.scss']
})

export class AssetIndustryModalComponent implements OnInit {
    mode: string = "";
    industryName: string = "";
    currentId: number;

    assetIndustryObject: IAssetHierarchyIndustryTaxonomy = {
        id: 0,
        industryName: ''
    };

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AssetIndustryModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _assetIndustryService: AssetHierarchyIndustryService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._assetIndustryService.getAssetIndustryById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IAssetHierarchyIndustryTaxonomy): void{
        this.assetIndustryObject = data;

        this.industryName = data.industryName;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.assetIndustryObject.industryName = this.industryName;
    
        this._assetIndustryService.addAssetIndustry(this.assetIndustryObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.assetIndustryObject.industryName = this.industryName;
    
        this._assetIndustryService.updateAssetIndustry(this.currentId, this.assetIndustryObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
