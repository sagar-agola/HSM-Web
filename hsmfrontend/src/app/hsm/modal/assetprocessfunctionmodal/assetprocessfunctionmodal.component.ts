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
import { IAssetHierarchyProcessFunctionTaxonomy } from './../../interfaces/IAssetHierarchyTaxonomy';

@Component({
  selector: 'processfunction-modal',
  templateUrl: './assetprocessfunctionmodal.component.html',
  styleUrls: ['./assetprocessfunctionmodal.component.scss']
})

export class AssetHierarchyProcessFunctionModalComponent implements OnInit {
    mode: string = "";
    processFunction: string = "";
    currentId: number;

    processFunctionObject: IAssetHierarchyProcessFunctionTaxonomy = {
        id: 0,
        processFunction: ''
    };

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AssetHierarchyProcessFunctionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _assetProcessFunctionService: AssetHierarchyProcessFunctionService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._assetProcessFunctionService.getProcessFunctionById(this.currentId)
                .subscribe(res => {
                    // console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: IAssetHierarchyProcessFunctionTaxonomy): void{
        this.processFunctionObject = data;

        this.processFunction = data.processFunction;

    }

    close(): void {
        this.dialogRef.close();
    }

    saveChanges(): void{
        this.processFunctionObject.processFunction = this.processFunction;
    
        this._assetProcessFunctionService.addProcessFunction(this.processFunctionObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.processFunctionObject.processFunction = this.processFunction;
    
        this._assetProcessFunctionService.updateProcessFunction(this.currentId, this.processFunctionObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
