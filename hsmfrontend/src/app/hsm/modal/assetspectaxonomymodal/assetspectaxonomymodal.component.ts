import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { AssetHierarchySpecService } from '../../services/assethierarchyspec.services';

//interface
import { IAssetHierarchySpecTaxonomy } from './../../interfaces/IAssetHierarchyTaxonomy';

@Component({
  selector: 'assetspec-modal',
  templateUrl: './assetspectaxonomymodal.component.html',
  styleUrls: ['./assetspectaxonomymodal.component.scss']
})

export class AssetHierarchySpecModalComponent implements OnInit {
    mode: string = "";
    specification: string = "";
    currentId: number;

    specObject: IAssetHierarchySpecTaxonomy = {
        id: 0,
        specification: ''
    };

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AssetHierarchySpecModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _assetHierarchySpecService: AssetHierarchySpecService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._assetHierarchySpecService.getSpecTaxonomyById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IAssetHierarchySpecTaxonomy): void{
        this.specObject = data;

        this.specification = data.specification;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.specObject.specification = this.specification;
    
        this._assetHierarchySpecService.addSpecTaxonomy(this.specObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.specObject.specification = this.specification;
    
        this._assetHierarchySpecService.updateSpecTaxonomy(this.currentId, this.specObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
