import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';
import { FrequencyService } from '../../services/frequency.services';
import { DurationService } from '../../services/duration.services';
import { OperationalModeService } from '../../services/operationalmode.services';
import { TradeTypeService } from '../../services/tradetype.services';

//interface
import { IFrequency } from './../../interfaces/IFrequency';
import { IDuration} from './../../interfaces/IDuration';
import { IOperationalMode} from './../../interfaces/IOperationalMode';
import { ITradeType} from './../../interfaces/ITradeType';

@Component({
  selector: 'multi-filter-modal',
  templateUrl: './multifiltermodal.component.html',
  styleUrls: ['./multifiltermodal.component.scss']
})

export class MultiFilterModalComponent implements OnInit {

    durationList: any[] = [];
    frequencyList: any[] = [];
    operationModeList: any[] = [];
    tradeTypeList: any[] = [];

    frequencyObject: IFrequency;
    durationObject: IDuration;
    operationModeObject: IOperationalMode;
    tradeTypeObject: ITradeType;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<MultiFilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _frequenceService: FrequencyService,
        private _durationService: DurationService,
        private _operationModeService: OperationalModeService,
        private _tradeTypeService: TradeTypeService,
        private _dataService: DataService,) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        forkJoin(
            this._frequenceService.getFrequency(),
            this._durationService.getDuration(),
            this._tradeTypeService.getTradeType(),
        ).subscribe(([fr, dr, tt]) => {
            this.frequencyList = fr;
            this.durationList = dr;
            this.tradeTypeList = tt;
        })

        // this._frequenceService.getFrequency()
        //     .subscribe(res => {
        //         console.log(res);
        //         this.frequencyList = res;
        //     });


    }

    close(): void {
        this.dialogRef.close();
    }

    goToFMEAForm(): void{
        this.close();
        this.router.navigate(["/main/fmea-form"]);
    }

}
