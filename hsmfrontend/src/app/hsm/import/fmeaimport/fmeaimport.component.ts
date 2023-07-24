import { Component, Inject, OnInit, ElementRef, ViewChild, NgModule, Output, EventEmitter } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { AppSettings } from 'src/app/shared/app.settings';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FMEAService } from '../../services/fmea.services';
import { HttpClientExt } from 'src/app/shared/services/httpclient.services';
import { forkJoin, Observable } from 'rxjs';
import { TaskTypeService } from '../../services/tasktype.services';
import { TradeTypeService } from '../../services/tradetype.services';
import { FrequencyService } from '../../services/frequency.services';
import { DurationService } from '../../services/duration.services';
import { ComponentFamilyService } from '../../services/componentfamily.services';
import { ComponentClassService } from '../../services/componentclass.services';
import { ComponentSubClassService } from '../../services/componentsubclass.services';
import { ComponentBuildSpecService } from '../../services/componentbuildspec.services';
import { ComponentManufacturerService } from '../../services/componentmanufacturer.services';
import { OperationalModeService } from '../../services/operationalmode.services';
import { ComponentTaskService } from '../../services/componenttask.services';

const data = [
    { name: "John", city: "Seattle" },
    { name: "Mike", city: "Los Angeles" },
    { name: "Zach", city: "New York" },
  ];

@Component({
    selector: "fmea-import",
    templateUrl: './fmeaimport.component.html',
    styleUrls: [
        './fmeaimport.component.scss'
    ]
})

export class FMEAImportComponent implements OnInit {
    private controllerApi = `${AppSettings.SITE_HOST}/api/FMEA/ImportExcel`;
    @ViewChild('table', { static: false }) table: ElementRef;
    @ViewChild('table1', { static: false }) table1: ElementRef;

    @ViewChild('fileInput') fileInput;
    public progress: number;
    @Output() public onUploadFinished = new EventEmitter();

    myControl = new FormControl();
    @Output() onOptionSelected: EventEmitter<any> = new EventEmitter<any>();


    dataSource;
    inputEl: any;
    message: string = "";
    fileName: string = "";
    user: string = "";
    file: any;
    loading: boolean = false;
    isEmpty: boolean = true;
    data: any = [];

    taskNo: number = 0;
    tempNo: number = 0;
    taskIdentificationNo: string = "";

    taskTypeList: any[] = [];
    tradeTypeList: any[] = [];
    frequencyList: any[] = [];
    durationList: any[] = [];
    maintUnitList: any[] = [];
    maintItemList: any[] = [];
    maintSubItemList: any[] = [];
    buildSpecTaxonomyList: any[] = [];
    manufacturerTaxonomyList: any[]= [];
    operationalModeList: any[] = [];


    constructor(
        private router: Router,
        private _eref: ElementRef,
        public dialog: MatDialog,
        private toastr: ToastrService,
        private _fmeaService: FMEAService,
        private http: HttpClientExt,
        private _taskTypeService: TaskTypeService,
        private _tradeTypeService: TradeTypeService,
        private _frequencyService: FrequencyService,
        private _durationService: DurationService,
        private _maintUnitService: ComponentTaskService,
        private _classTaxonomyService: ComponentClassService,
        private _subClassTaxonomyService: ComponentSubClassService,
        private _buildSpecTaxonomyService: ComponentBuildSpecService,
        private _manufacturerTaxonomyService: ComponentManufacturerService,
        private _operationalModeService: OperationalModeService,
    ) {
    }
    
    ngOnInit(): void {
        this.user = localStorage.getItem("loggUser");
        this._fmeaService.getFMEALastNumber()
          .subscribe(out => {
            this.taskNo = Number(out.lastId);

            console.log(this.taskNo)
            this.tempNo = this.taskNo+1;
            
            if(this.taskNo === 9){
                this.taskIdentificationNo = "FFT.0000000" + this.tempNo;
            }

            if(this.taskNo >= 99){
                this.taskIdentificationNo = "FFT.000000" + this.tempNo;
            }

            if(this.taskNo >= 999){
                this.taskIdentificationNo = "FFT.00000" + this.tempNo;
            }

            if(this.taskNo >= 9999){
                this.taskIdentificationNo = "FFT.0000" + this.tempNo;
            }

            if(this.taskNo >= 99999){
                this.taskIdentificationNo = "FFT.000" + this.tempNo; 
            }

            if(this.taskNo >= 999999){
                this.taskIdentificationNo = "FFT.00"  + this.tempNo;
            }
            if(this.taskNo >= 9999999){
                this.taskIdentificationNo = "FFT.0"  + this.tempNo;
            }
            if(this.taskNo >= 99999999){
                this.taskIdentificationNo = "FFT."  + this.tempNo;
            }
            if(this.taskNo < 9){
                this.taskIdentificationNo = "FFT.00000000"   + this.tempNo;
            }
        });

        forkJoin(
            this._taskTypeService.getTaskType(),
            this._tradeTypeService.getTradeType(),
            this._frequencyService.getFrequency(),
            this._durationService.getDuration(),
            this._operationalModeService.getOperationalMode(),
            this._maintUnitService.getComponentTask(),
            this._classTaxonomyService.getComponentClass(),
            this._subClassTaxonomyService.getComponentSubClass(),
            this._buildSpecTaxonomyService.getComponentBuildSpec(),
            this._manufacturerTaxonomyService.getComponentManufacturer(),
            ).subscribe(([tt, ty, fr, dr, om, ft, ct, st, bs, mf]) => {
                // console.log(mf)
                this.taskTypeList = tt;
                this.tradeTypeList = ty;
                this.frequencyList = fr;
                this.durationList = dr;
                this.operationalModeList = om;
                this.maintUnitList = ft;
                this.maintItemList = ct;
                this.maintSubItemList = st;
                this.buildSpecTaxonomyList = bs;
                this.manufacturerTaxonomyList = mf;
            });

            if(this.fileName === '' || this.fileName === undefined || this.fileName === null)
            {
                this.isEmpty = true;
            }else{
                this.isEmpty = false;
            }
        
    }

    onFileSelect(event){
        if(this.fileName === '' || this.fileName === undefined || this.fileName === null)
            {
                this.isEmpty = true;
            }else{
                this.isEmpty = false;
            }
    }

    uploadFile(files: any){
        this.loading = true;
        if (files.length === 0) {
            return;
        }

        let fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        this.http.post(this.controllerApi, formData)
            .subscribe(res => {
                this.loading = false;
                this.toastr.success('FMEA Upload File successfully uploaded', 'Success!');
            });
    }

    exportToExcel(): void {
    
        let fileName = 'FMEAUpload' + '.xlsx';

        /* table id is passed over here */   
        let fmea = document.getElementById('import-table'); 
        let maintUnit = document.getElementById('import-maintUnit');
        let maintItem = document.getElementById('import-maintItem');
        let maintSubItem = document.getElementById('import-maintSubItem');
        let taskType = document.getElementById('import-taskType');
        let operationalmode = document.getElementById('import-operationalmode');
        let frequency = document.getElementById('import-frequency');
        let duration = document.getElementById('import-duration');
        let tradetype = document.getElementById('import-tradetype');
        let buildspec = document.getElementById('import-buildspec');
        let manufacturer = document.getElementById('import-manufacturer');

        const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(fmea);
        const mu: XLSX.WorkSheet =XLSX.utils.table_to_sheet(maintUnit);
        const mi: XLSX.WorkSheet =XLSX.utils.table_to_sheet(maintItem);
        const ms: XLSX.WorkSheet =XLSX.utils.table_to_sheet(maintSubItem);
        const tt: XLSX.WorkSheet =XLSX.utils.table_to_sheet(taskType);
        const om: XLSX.WorkSheet =XLSX.utils.table_to_sheet(operationalmode);
        const fr: XLSX.WorkSheet =XLSX.utils.table_to_sheet(frequency);
        const dr: XLSX.WorkSheet =XLSX.utils.table_to_sheet(duration);
        const ty: XLSX.WorkSheet =XLSX.utils.table_to_sheet(tradetype);
        const bs: XLSX.WorkSheet =XLSX.utils.table_to_sheet(buildspec);
        const mf: XLSX.WorkSheet =XLSX.utils.table_to_sheet(manufacturer);
        // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'FmeaImport');
        XLSX.utils.book_append_sheet(wb, mu, 'MaintainableUnit');
        XLSX.utils.book_append_sheet(wb, mi, 'MaintainableItem');
        XLSX.utils.book_append_sheet(wb, ms, 'MaintainableSubItem');
        XLSX.utils.book_append_sheet(wb, tt, 'TaskType');
        XLSX.utils.book_append_sheet(wb, om, 'OperationalMode');
        XLSX.utils.book_append_sheet(wb, fr, 'Frequency');
        XLSX.utils.book_append_sheet(wb, dr, 'Duration');
        XLSX.utils.book_append_sheet(wb, ty, 'TradeType');
        XLSX.utils.book_append_sheet(wb, bs, 'BuildSpec');
        XLSX.utils.book_append_sheet(wb, mf, 'Manufacturer');
        XLSX.writeFile(wb, fileName);
    }

    exportSheetExcel(): void{
        let fileName = 'FMEAUpload' + '.xlsx';
        const sheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, "People1");
        XLSX.utils.book_append_sheet(workbook, sheet, "People2");

        const result = XLSX.write(workbook);

        XLSX.writeFile(result, fileName);
    }
}