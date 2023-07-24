import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../../shared/services/data.service';
import { FMEAService } from 'src/app/hsm/services/fmea.services';
import { IFMEAImport } from 'src/app/hsm/interfaces/IFMEA';
import { fmeaImportDefault } from 'src/app/shared/helpers/default.helpers';
import { ImportComponentHierarchyService } from 'src/app/hsm/services/importcomponenthierarchy.services';
import { MaintainableData } from 'src/app/hsm/interfaces/IImportComponentHierarchy';
// import Handsontable from "handsontable";

//Services


@Component({
  selector: 'maintainablereview-modal',
  templateUrl: './maintainablereviewmodal.component.html',
  styleUrls: ['./maintainablereviewmodal.component.scss']
})

export class MaintainableReviewModalComponent implements OnInit {

    arrayBuffer:any;
    file:File;
    tblname: string = "";
    jsonObject: {};

    optionList: any[] = [];
    headerList: any[] = [];
    tableList: any[] = [];
    dataList: any[] = [];
    datavalList: any[] = [];
    dataFinalList: any[] = [];

    loading: boolean = false;
    isHSMUser: boolean = false;
    isAdmin: boolean = false;
    siteId: number = 0;
    customerId: number = 0;

    importObject: MaintainableData[] = [];

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<MaintainableReviewModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,   
        private fmeaService: FMEAService,
        private _dataService: DataService,
        private _importComponentService: ImportComponentHierarchyService) {
            const user = JSON.parse(localStorage.currentUser);
            this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
            // console.log(user);
            this.isAdmin = user?.users?.isAdmin;
            this.siteId = user?.users?.siteId === 0 || user?.users?.siteId === null ? 0 : user?.users?.siteId;
            this.customerId = user?.users?.customerId === 0 || user?.users?.customerId === null ? 0 : user?.users?.customerId;
        
    }

    ngOnInit(): void {
        this.data = this._dataService.getData();
        // console.log(this.data)
        this.loading = true;
        this.formatData(this.data.opt);

        this.headerList = this.data.opt;
        this.dataList = this.data.opt;
        this.loading = false;

        // console.log(grouped)
        // this.tableList = this.data.opt;
        // console.log(this.dataList["data"])
        
    }

    formatData(data: any[]){
        let arrItems = [];
        let finalItems = [];

        for(var i = 0; i < data[0].data.length; i++)
        {
            let item = {};
            let newitem = {};

            data.forEach(e => 
                {
                    item[e.displayName] = String(e.data[i]);
                    newitem[e.mappedName] = String(e.data[i]);
                })
            // data.forEach(x => {
            //     console.log(x)
            // })
            arrItems.push(item);
            finalItems.push(newitem);
        }
        // console.log(arrItems);
        // console.log(finalItems);

        this.tableList = arrItems;
        this.dataFinalList = finalItems;

        
    }

    groupBy(objects, property) {
        return objects.reduce((a, o) => {
          let key = o[property];
        if(!a[key]) {
            a[key] = [];
        }
        a[key].push(o);
        return a;
      }, {});
    }
    
    nestedGroupsBy(item, properties) {
      properties = Array.from(properties);
      if (properties.length === 1) {
        return this.groupBy(item, properties[0]);
      }
      const property = properties.shift();
      var grouped = this.groupBy(item, property);
      for (let key in grouped) {
        grouped[key] = this.nestedGroupsBy(grouped[key], Array.from(properties));
      }
      return grouped;
    }

    goBack(): void{
        this.dialogRef.close('goback');
    }

    close(): void {
        this.dialogRef.close('saved');
    }

    saveChanges(): void{
        const grouped = this.nestedGroupsBy(this.dataFinalList, ['ComponentTaskName', 'ComponentClass', 'SubClass']);

        const parent = Object.keys(grouped);

        // console.log(parent)

        var importDataObject = {
            siteId :0,
            customerId:0,
            maintainableData: []
        } 

        var fullObjectImport = [];

        parent.forEach(e => {
            var singlet = { maintainableUnitName: e, maintainableItems: [] }
            var sLevel = [];

            var secondLevelItems = Object.keys(grouped[e])

            secondLevelItems.forEach(s => {
      
                var thirdLevelItems = Object.keys(grouped[e][s])
            
                sLevel.push({ maintainableItemName: s, subMaintainableItems: thirdLevelItems })
            })

            singlet.maintainableItems = sLevel;
            fullObjectImport.push(singlet);
        })

        importDataObject.maintainableData = fullObjectImport

        // console.log(importDataObject);

        this.loading = true;
        this._importComponentService.importMaintainableData(importDataObject)
            .subscribe(res => {
                this.loading = false;
                this.toastr.success("Successfully imported!", 'Success');
                // console.log(res)
                this.close();
            });
    }

}
