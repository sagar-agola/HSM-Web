import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { AssetHierarchyFamilyService } from '../../services/assethierarchyfamily.services';

//interface
import { IAssetHierarchyComponentFamilyTaxonomy } from './../../interfaces/IAssetHierarchyTaxonomy';

@Component({
  selector: 'assetfamily-modal',
  templateUrl: './assetfamilytaxonomymodal.component.html',
  styleUrls: ['./assetfamilytaxonomymodal.component.scss']
})

export class AssetHierarchyFamilyModalComponent implements OnInit {
    mode: string = "";
    componentFamilies: string = "";
    currentId: number;

    assetFamilyObject: IAssetHierarchyComponentFamilyTaxonomy = {
        id: 0,
        componentFamilies: ''
    };

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AssetHierarchyFamilyModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _assetHierarchyFamilyService: AssetHierarchyFamilyService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._assetHierarchyFamilyService.getAssetFamilyTaxonomyById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IAssetHierarchyComponentFamilyTaxonomy): void{
        this.assetFamilyObject = data;

        this.componentFamilies = data.componentFamilies;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.assetFamilyObject.componentFamilies = this.componentFamilies;
    
        this._assetHierarchyFamilyService.addAssetFamilyTaxonomy(this.assetFamilyObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.assetFamilyObject.componentFamilies = this.componentFamilies;
    
        this._assetHierarchyFamilyService.updateAssetFamilyTaxonomy(this.currentId, this.assetFamilyObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
