import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { TaxonomyCategoryService } from '../../services/taxonomycategory.services';

//interface
import { IComTaxonomyCategory, ITaxonomyCategory } from './../../interfaces/ITaxonomyCategory';
import { ComTaxonomyCategoryService } from '../../services/comtaxonomycategory.services';

@Component({
  selector: 'taxonomycategory-modal',
  templateUrl: './taxonomycategorymodal.component.html',
  styleUrls: ['./taxonomycategorymodal.component.scss']
})

export class TaxonomyCategoryModalComponent implements OnInit {
    mode: string = "";
    category: string = "";
    currentId: number;

    taxCategoryObject: ITaxonomyCategory = {
        id: 0,
        categoryName: ''
    };

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<TaxonomyCategoryModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _categoryService: TaxonomyCategoryService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // console.log(this.mode);
        // console.log(this.data.item);

        this.currentId = this.data.item;

        if(this.mode === 'edit'){
            this.isEdit = true;

            this._categoryService.getTaxonomyCategoryById(this.currentId)
                .subscribe(res => {
                    console.log(res);
                    this.initializeData(res);
                });
        }
        else{
            this.isEdit = false;
        }
    }

    initializeData(data: ITaxonomyCategory): void{
        this.taxCategoryObject = data;

        this.category = data.categoryName;

    }

    close(): void {
        this.dialogRef.close();
    }

    onKeyUp(event){
        this.category = event.target.value;
    }

    saveChanges(): void{
        this.taxCategoryObject.categoryName = this.category;
    
        this._categoryService.addTaxonomyCategory(this.taxCategoryObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
    }

    updateChanges(): void{
        this.taxCategoryObject.categoryName = this.category;
    
        this._categoryService.updateCategoryTaxonomy(this.currentId, this.taxCategoryObject)
          .subscribe(res => {
              this.toastr.success("Successfully updated!", 'Success');
              this.close();
          });
    }

}
