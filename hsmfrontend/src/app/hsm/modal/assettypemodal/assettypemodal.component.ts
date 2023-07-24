import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { AssetHierarchyProcessFunctionService } from '../../services/assethierarchyprocessfunction.services';

//interface
import { IAssetHierarchyAssetTypeTaxonomy } from './../../interfaces/IAssetHierarchyTaxonomy';
import { AssetHierarchyAssetTypeService } from '../../services/assethierarchyassettype.services';

@Component({
  selector: 'assettype-modal',
  templateUrl: './assettypemodal.component.html',
  styleUrls: ['./assettypemodal.component.scss']
})

export class AssetTypeModalComponent implements OnInit {
    mode: string = "";
    assetType: string = "";
    currentId: number;

    assetTypeObject: IAssetHierarchyAssetTypeTaxonomy = {
        id: 0,
        assetType: ''
    };

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AssetTypeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _assetTypeService: AssetHierarchyAssetTypeService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._assetTypeService.getAssetTypeById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IAssetHierarchyAssetTypeTaxonomy): void{
        this.assetTypeObject = data;

        this.assetType = data.assetType;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.assetTypeObject.assetType = this.assetType;
    
        this._assetTypeService.addAssetType(this.assetTypeObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.assetTypeObject.assetType = this.assetType;
    
        this._assetTypeService.updateAssetType(this.currentId, this.assetTypeObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
