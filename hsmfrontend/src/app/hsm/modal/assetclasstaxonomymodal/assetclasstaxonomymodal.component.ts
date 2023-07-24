import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { AssetHierarchyClassTaxonomyService } from '../../services/assethierarchyclasstaxonomy.services';

//interface
import { IAssetHierarchyClassTaxonomy } from './../../interfaces/IAssetHierarchyTaxonomy';

@Component({
  selector: 'assetclass-modal',
  templateUrl: './assetclasstaxonomymodal.component.html',
  styleUrls: ['./assetclasstaxonomymodal.component.scss']
})

export class AssetHierarchyClassModalComponent implements OnInit {
    mode: string = "";
    className: string = "";
    currentId: number;

    assetClassObject: IAssetHierarchyClassTaxonomy = {
        id: 0,
        className: ''
    };

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AssetHierarchyClassModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _assetHierarchyClassService: AssetHierarchyClassTaxonomyService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._assetHierarchyClassService.getAssetClassTaxonomyById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IAssetHierarchyClassTaxonomy): void{
        this.assetClassObject = data;

        this.className = data.className;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.assetClassObject.className = this.className;
    
        this._assetHierarchyClassService.addAssetClassTaxonomy(this.assetClassObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.assetClassObject.className = this.className;
    
        this._assetHierarchyClassService.updateAssetClassTaxonomy(this.currentId, this.assetClassObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
