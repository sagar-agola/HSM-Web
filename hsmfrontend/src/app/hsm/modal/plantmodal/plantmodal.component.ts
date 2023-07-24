import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { PlantService } from '../../services/plant.services';

//interface
import { IPlant } from './../../interfaces/IPlant';

@Component({
  selector: 'plant-modal',
  templateUrl: './plantmodal.component.html',
  styleUrls: ['./plantmodal.component.scss']
})

export class PlantModalComponent implements OnInit {
    plantName: string = "";
    plantCode: any;

    plantObject: IPlant = {
        Id: 0,
        PlantCode: 0,
        PlantName: ''
    };

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<PlantModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _plantService: PlantService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();
    }

    close(): void {
        this.dialogRef.close();
    }

    onKeyUp(event){
        this.plantCode = parseInt(event.target.value);
    }

    onKeyUpText(event){
        this.plantName = event.target.value;
    }

    saveChanges(): void{
        this.plantObject.PlantCode = this.plantCode;
        this.plantObject.PlantName = this.plantName;
    
        this._plantService.addPlant(this.plantObject)
          .subscribe(res => {
              this.toastr.success("Successfully saved!", 'Success');
              this.close();
          });
      }

}
