import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';

//Services
import { UsersService } from '../../services/users.services';

//interface
import { IUsers } from './../../interfaces/IUsers';
import { SitesService } from '../../services/sites.services';
import { AssetTaskGroupStrategyService } from '../../services/assettaskgroupstrategy.services';
import { ComponentClassService } from '../../services/componentclass.services';
import { ComponentBuildSpecService } from '../../services/componentbuildspec.services';
import { ComponentManufacturerService } from '../../services/componentmanufacturer.services';
import { ComponentSubClassService } from '../../services/componentsubclass.services';
import { CategoryHierarchySiteService } from '../../services/categoryhierarchysite.services';
import { AssetHierarchySpecService } from '../../services/assethierarchyspec.services';
import { AssetHierarchyManufacturerService } from '../../services/assethierarchymanufacturer.services';

@Component({
  selector: 'sitetgsview-modal',
  templateUrl: './sitetgsviewmodal.component.html',
  styleUrls: ['./sitetgsviewmodal.component.scss']
})

export class SiteTgsViewModalComponent implements OnInit {
    mode: string = "";
    userName: string = "";
    firstName: string = "";
    lastName: string = "";
    password: string = "";
    emailaddress: string = "";
    phoneNo: string = "";
    isActive: boolean = false;
    siteId: number = 0;
    currentId: number;
    assetClass: string = "";
    assetType: string = "";
    manufacturer: string = "";
    assetSpec: string = "";
    taskGroupDescription: string = "";
    hierarchyData: [] = [];
    taskTempList : any[] = [];
    taskList: any[]=[];
    assetClassId: number;
    specId: number;
    manufacturerId: number;

    userObject: IUsers = {
        id: 0,
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        emailAddress: '',
        phoneNo: '',
        isActive: false,
        isAdmin: false,
        groupId: 0,
        photo: '',
        customer: null,
        group: null,
        site: null
    };

    siteList: any[] = [];
    taxonomyClassList: any[] = [];
    taxonomySubClassList: any[] = [];
    taxonomyBuildSpecList: any[] = [];
    taxonomyManufacturerList: any[] = [];

    isEdit: boolean= false;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<SiteTgsViewModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _assetTaskGroupStrategyService: AssetTaskGroupStrategyService,
        private _classTaxonomyService: CategoryHierarchySiteService,
        private _SpecTaxonomyService: AssetHierarchySpecService,
        private _manufacturerTaxonomyService: AssetHierarchyManufacturerService,
        private _siteService: SitesService) {
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();

        // console.log(this.data.value);
        // console.log(this.data.item);

        forkJoin(
          this._classTaxonomyService.getCategoryHierarchySiteRecords(),
          this._SpecTaxonomyService.getSpecTaxonomy(),
          this._manufacturerTaxonomyService.getAssetManufacturer(),
          ).subscribe(([cl, th, mt]) => {
              this.taxonomyClassList = cl;
              this.taxonomyBuildSpecList = th;
              this.taxonomyManufacturerList = mt;
              // console.log(mt)
              
      });

        this.currentId = this.data.value;
        this.getTGSDetails();
        this.getTGSTasks();
    }

    siteOnselect(event){
        this.siteId = event.target.value;
        
    }

    mapMaintItem(id: number): string {
      let retData = "";
      retData = this.taxonomyClassList.find(e => e.id === id);
      return retData;
    }

    mapSubMaintItem(id: number): string {
        let retData = "";
        retData = this.taxonomySubClassList.find(e => e.id === id);
        return retData;
    }

    mapBuildSpec(id: number): string {
        let retData = "";
        retData = this.taxonomyBuildSpecList.find(e => e.id === id);
        return retData;
    }

    mapManufacturer(id: number): string {
        let retData = "";
        retData = this.taxonomyManufacturerList.find(e => e.id === id);
        return retData;
    }
    
    getTGSDetails(): void{
        this._assetTaskGroupStrategyService.getAssetTaskGroupStrategyById(this.currentId)
        .subscribe(res => {
          // console.log(res);
          this.assetClassId = res.assetClassTaxonomyId;
          this.taskGroupDescription = res.taskGroupDescription;
          this.assetClass = res.className;
          this.specId = res.assetSpecTaxonomyId;
          this.manufacturerId = res.assetManufacturerTaxonomyId;

          if(res.assetManufacturer === '' || res.assetManufacturer === undefined){
            this.manufacturer = '';
            this.assetType = res.specification;
          }else if(res.specification === '' || res.specification === undefined){
              this.assetSpec = '';
              this.assetType = res.assetManufacturer;
          }
          else if(res.specification === '' || res.specification === undefined && res.assetManufacturer === '' || res.assetManufacturer === undefined)
          {
            this.assetType = '';
          }
          else{
            this.assetType = res.assetManufacturer +' -'+ res.specification;
          }
        });
    }

    getTGSTasks(){
        this._assetTaskGroupStrategyService.getTaskGroupStrategyDetails(this.currentId)
          .subscribe(res => {
            this.hierarchyData = JSON.parse(res['hierarchy']);
            // console.log(this.hierarchyData);
            this.taskTempList = this.hierarchyData['PRTData'];
            this.taskList = this.taskTempList[0]['MultipleTask'];
            // console.log(this.hierarchyData)
          });
      }

    initializeData(data: IUsers): void{
        this.userObject = data;

        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.userName = data.userName;
        this.password = data.password;
        this.emailaddress = data.emailAddress;
        this.phoneNo = data.phoneNo;
        this.isActive = data.isActive;
    }

    close(): void {
        this.dialogRef.close();
    }

}
