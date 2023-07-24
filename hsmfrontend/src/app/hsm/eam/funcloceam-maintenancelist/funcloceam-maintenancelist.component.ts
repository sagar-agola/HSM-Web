import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { CustomTableModalComponent } from '../../modal/customtablemodal/customtablemodal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MultiFilterModalComponent } from '../../modal/multifiltermodal/multifiltermodal.component';

//Services
import { FrequencyService } from '../../services/frequency.services';
import { OperationalModeService } from '../../services/operationalmode.services';
import { TradeTypeService } from '../../services/tradetype.services';
import { EAMPlanService } from '../../services/eamplan.services';

//interface
import { IFrequency } from './../../interfaces/IFrequency';
import { IOperationalMode} from './../../interfaces/IOperationalMode';
import { ITradeType} from './../../interfaces/ITradeType';
import { IEAMPlan, IEAMPLanList, IFLOCEAMPLanList } from '../../interfaces/IEAMPlan';
import { forkJoin } from 'rxjs';

@Component({
    selector: "floceam-maintenance",
    templateUrl: './funcloceam-maintenancelist.component.html',
    styleUrls: [
        './funcloceam-maintenancelist.component.scss'
    ]
})

export class FLOCEAMMaintenanceComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('TABLE', {static: true}) table: ElementRef;

  displayedColumns = ['taskId', 'code', 'maintItemText', 'maintItem', 'maintenancePlanName', 'mainWorkCtr', 'plannerGroup'];

  ELEMENT_DATA: IFLOCEAMPLanList[] = [];
  
  dataSource;

  frequencyList: any[] = [];
  operationModeList: any[] = [];
  tradeTypeList: any[] = [];
  functionList: any[] = [];
  descriptionList: any[] = [];
  plantList: any[] = [];

  frequencyObject: IFrequency;
  operationModeObject: IOperationalMode;
  tradeTypeObject: ITradeType;
  eamObject: IEAMPlan;

  isSelectFloc: boolean = false;
  isSelectDesc: boolean = false;

  flocName: string = "";
  description2: string = "";
  plant: number;
  totalCount: number;

  isLoading: boolean = true;

  constructor(
    private router: Router,
    private _eref: ElementRef,
    public dialog: MatDialog,
    private _frequenceService: FrequencyService,
    private _operationModeService: OperationalModeService,
    private _tradeTypeService: TradeTypeService,
    private _eamPlanService: EAMPlanService,
    ) { }
    
    ngOnInit(): void {
        this.getDataSource();
    }

    getDataSource(): void{
      this._eamPlanService.getFLOCEAMPlanList()
        .subscribe(res => {
          this.ELEMENT_DATA = res;
          this.dataSource = new MatTableDataSource<IFLOCEAMPLanList>(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        })
    }

    funcLocOnSelect(event){
      this._eamPlanService.getEAMPlanById(event.target.value)
        .subscribe(res => {
          this.flocName = res.functionalLoc;
        });
    }

    descOnSelect(event){
      this._eamPlanService.getEAMPlanById(event.target.value)
        .subscribe(res => {
          this.description2 = res.description2;
        });

      this.isSelectFloc = true;
    }

    plantOnSelect(event){
      this._eamPlanService.getEAMPlanById(event.target.value)
        .subscribe(res => {
          this.plant = res.plant;
        });

      this.isSelectDesc = true;
    }

    openDialog() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "700px";
      dialogConfig.height = "auto";
      dialogConfig.position = { top: '30px' };
      const dialogRef = this.dialog.open(CustomTableModalComponent, dialogConfig);
  }
  
  openDialogFilter(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "700px";
    dialogConfig.height = "auto";
    dialogConfig.position = { top: '30px' };
    const dialogRef = this.dialog.open(MultiFilterModalComponent, dialogConfig);
  }
}
