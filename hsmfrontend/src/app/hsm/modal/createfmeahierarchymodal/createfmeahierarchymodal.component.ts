import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DataService } from './../../../shared/services/data.service';
import { NestedTreeControl } from '@angular/cdk/tree';

interface Employee {
    name: string;
    position: string;  
    reports?: Employee[];
  }
  
  const TREE_DATA: Employee[] = [
    {
      name: '1004-03-1-050',
      position: 'Crushing',
      reports: [{
          name: '1004-02-3-050-020-401',
          position:'Crushing Station CR3001 PC1' ,
          reports: [
            {
              name: '10042DS001',
              position: 'Fogger System Tipple CR3001',
              reports: [
                {
                  name: '10042DS001-CP01',
                  position: 'Compressor Fogger System',
                  reports: [
                    {
                      name: '10042DS001-CP01-PV01',
                      position: 'Pressure Vessel Compressor',
                      reports: [
                        {
                          name: '10042DS001-CP01-PV01-VV01',
                          position: 'PSV Pressure Vessel Compressor',
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: '10042BN001',
              position: 'Bin ROM Coarse Ore CR3001',
              reports: [
                {
                  name: '10042BN001-CH01',
                  position: 'Chute ROM Bin CR3001',
                }
              ]
            },
          ] 
        },
        ]
    },{
      name: '1004-03-1-010',
      position: 'Description Test',
      reports: [
        {
          name: 'Hierarchy test',
          position: 'Description Test',
        }
      ]
    },
  ];

@Component({
  selector: 'create-new-fmea-hierarchy-modal',
  templateUrl: './createfmeahierarchymodal.component.html',
  styleUrls: ['./createfmeahierarchymodal.component.scss']
})

export class CreateNewFMEAHierarchyModalComponent implements OnInit {
    public dataObject: Object[];

    treeControl = new NestedTreeControl<Employee>(node => node.reports);
    dataSource = new MatTreeNestedDataSource<Employee>();

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<CreateNewFMEAHierarchyModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,) {
            this.dataSource.data = TREE_DATA;
    }

    hasChild = (_: number, node: Employee) => !!node.reports && node.reports.length > 0;

    ngOnInit(): void {
        this.data = this._dataService.getData();
    }

    close(): void {
        this.dialogRef.close();
    }

    goToFMEAForm(): void{
        this.close();
        this.router.navigate(["/main/fmea-form"]);
    }

}
