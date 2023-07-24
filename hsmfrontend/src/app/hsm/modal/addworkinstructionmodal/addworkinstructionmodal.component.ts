import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { AssetTaskGroupStrategyService } from '../../services/assettaskgroupstrategy.services';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IAddedFlocTask, IAddFlocList, IAssetTaskGroupStrategy, IAssignAssetTaskGroupStrategyMaterial } from '../../interfaces/IAssetTaskGroupStrategy';
import { MatTableDataSource } from '@angular/material/table';
import { AssignTaskGroupStrategyService } from '../../services/assigntaskgroupstrategy.services';
import { DataService } from 'src/app/shared/services/data.service';
import { IFMEA, IFMEATaskAdded, IFMEATaskAddedList } from '../../interfaces/IFMEA';
import { FMEAService } from '../../services/fmea.services';
import { AssignAssetTaskGroupStrategyMaterialService } from '../../services/assignassettaskgroupstrategymaterial.services';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'addworkinstruction-modal',
  templateUrl: './addworkinstructionmodal.component.html',
  styleUrls: ['./addworkinstructionmodal.component.scss']
})

export class AddWorkInstructionModalComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('TABLE', {static: true}) table: ElementRef;

    displayedColumns = ['isAdd', 'code', 'isAddDesc', 'flocDescription'];
    displayedColumns2 = ['isAddDesc', 'flocDescription'];
    displayedColumns3 = ['isAddTask','taskIdentificationNo', 'familyComponent', 'componentClass', 'subClass', 'buildSpec', 'componentManufacturer', 'failureMode', 'taskDescription', 'failureRiskTotalScore', 'acceptableLimits', 'correctiveActions','taskTypeName', 'frequencyName'];
    displayedColumns4 = [ 'isAddFam', 'familyComponent'];
    displayedColumns5 = [ 'isAddClass', 'componentClass'];
    displayedColumns6 = [ 'isAddSub', 'subClass'];
    containers = [];
    dataList: any[] = [];
    dataSource3;
    selection = new SelectionModel<IFMEATaskAddedList>(true, []);

    containerTask: any[] = [];
    containerComponents: any[] = [];

    ELEMENT_DATA: IAddFlocList[] = [];
    ELEMENT_DATA3: IAddFlocList[] = [];
    ELEMENT_DATA2: IFMEATaskAdded[] = [];
    ELEMENT_DATA_3: IFMEATaskAddedList [] = [];
    checkedIDs = [];
    flocAddTaskList: IAddedFlocTask[] = [];
    assetFlocList: any[] = [];
    fmeaTaskAdded: any[] = [];
    fmeaTaskAddedFamily: any[] = [];
    fmeaTaskAddedClass: any[] = [];
    fmeaTaskAddedSubClass: any[] = [];
    tempListfam: any[] = [];
    tempListclass: any[] = [];
    tempListsubclass: any[] = [];
    fmeaObject: IFMEA;
    assetStrategyObject: IAssetTaskGroupStrategy;
    dataSource;
    dataSource2;
    index: number;

    assetHierarchyObject: IAddFlocList = {
        id: 0,
        code: '',
        flocDescription: ''
    }

    assignAssetTaskGroupMaterial: IAssignAssetTaskGroupStrategyMaterial = {
        id: 0,
        fmeaId: 0,
        taskId: 0,
        batchId: 0,
        componentFamilyId: 0,
        componentClassId: 0,
        componentSubClassId: 0,
        assetHierarchyId: 0,
        fileName: '',
        sequenceNo: 0,
        isMultiple: false,
        isInclude: true
      }

    assignAssetTaskGroupMaterialList: IAssignAssetTaskGroupStrategyMaterial[] = [];

    loading: boolean = false;
    default: boolean = false;

    isAdd: boolean = false;
    isAddDesc: boolean = false;
    isAddFamily: boolean = false;
    isAddClass: boolean = false;
    isAddSubClass: boolean = false;
    isAddTask: boolean = false;
    isChecked: boolean = false;

    disabledTab1: boolean = false;
    disabledTab2: boolean = false;
    disabledTab3: boolean = false;

    isMulti: boolean = false;
    isInclude: boolean = true;
    selectAll: boolean = false;
    isMinFloc: boolean = false;
    isMaxFloc: boolean = true;
    isMinDesc: boolean = false;
    isMaxDesc: boolean = true;
    
    mode: string = "";
    fmeaId: number;
    taskId: number;
    selectedIndex: number = 0;
    activeId: number = 0;

    flocId: number = 0;
    familyId: number = 0;
    classId: number = 0;
    subClassId: number = 0;
    taskListId: number = 0;
    batchId: number;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<AddWorkInstructionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,
        private _dataService: DataService,
        private _fmeaService: FMEAService,
        private _assetTaskGroupStrategyService: AssetTaskGroupStrategyService,
        private _assignAssetTaskGroupService: AssignTaskGroupStrategyService,
        private _assignAssetTaskGroupMaterialService: AssignAssetTaskGroupStrategyMaterialService) {
        
    }
    ngOnInit(): void {
        this.loading = true;
        this.data = this._dataService.getData();

        this.mode = this.data.mode;

        // localStorage.getItem("fmeataskadded");

        // var storedTask = JSON.parse(localStorage.fmeataskadded);
        console.log(this.data.item)
        this.batchId = this.data.item;

        // localStorage.removeItem("modalcomponentList");
        // localStorage.removeItem("modaltaskList");

        // console.log(storedTask, storedTaskSequence);

        forkJoin(
            this._assetTaskGroupStrategyService.getTaskGroupStrategyById(this.data.item),
            this._assignAssetTaskGroupService.getFlocAddedTasks(this.data.item),
            ).subscribe(([tgs, fat]) => {
                this.initializeStrategyData(tgs);
                this.flocAddTaskList = fat;
                // console.log(this.flocAddTaskList);
                // console.log(tgs)
            });

        this.getAddFlocData();
        this.getTaskAddedData();
        this.getAddFlocDescData();
        this.getTaskAddedFamilyData();
        this.getTaskAddedClassData();
        this.getTaskAddedSubClassData();
    }

    toggleMinFloc(){
        this.isMinFloc = true;
        this.isMaxFloc = false;
    }

    toggleMaxFloc(){
        this.isMinFloc = false;
        this.isMaxFloc = true;
    }

    toggleMinDesc(){
        this.isMinDesc = true;
        this.isMaxDesc = false;
    }

    toggleMaxDesc(){
        this.isMinDesc = false;
        this.isMaxDesc = true;
    }

    getAddFlocData(){
        this._assignAssetTaskGroupService.getAddFlocList()
            .subscribe(res => {
                // console.log(res)
                this.assetFlocList = res;
                this.loading = false;
                this.default = false;
                this.ELEMENT_DATA = res;
                this.dataSource = new MatTableDataSource<IAddFlocList>(this.ELEMENT_DATA);
                // this.assetFlocList = this.dataSource;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                // this.dataSource = this.assetFlocList;
            });
    }

    getAddFlocDescData(){
        this._assignAssetTaskGroupService.getAddFlocList()
            .subscribe(res => {
                // console.log(res)
                this.assetFlocList = res;
                this.loading = false;
                this.default = false;
                this.ELEMENT_DATA3 = res;
                this.dataSource2 = new MatTableDataSource<IAddFlocList>(this.ELEMENT_DATA3);
                // this.assetFlocList = this.dataSource;
                this.dataSource2.paginator = this.paginator;
                this.dataSource2.sort = this.sort;
                // this.dataSource = this.assetFlocList;
            });
    }

    getTaskAddedData(){
        var storedTaskSequence = JSON.parse(localStorage.fmeataskadded);

        // console.log(storedTaskSequence)
        this.fmeaTaskAdded = storedTaskSequence;
        this.ELEMENT_DATA_3 = this.fmeaTaskAdded;
        this.dataSource3 = new MatTableDataSource<IFMEATaskAddedList>(this.ELEMENT_DATA_3);
    }

    getTaskAddedFamilyData(){
        // var storedTaskSequence = JSON.parse(localStorage.fmeataskfinalsequence);

        // storedTaskSequence.forEach(x => {
        //     let fmeaid = x.id;

        //     this._fmeaService.getComponentFamilyByTask(fmeaid)
        //         .subscribe(res => {
        //             console.log(res);
        //             if(res !== null)
        //             {
        //                 res.forEach(y => {
        //                     let id = y.id;
        //                     let name = y.componentName;
    
        //                     this.tempListfam.push({
        //                         id: id,
        //                         componentName: name
        //                     });
        //                 });
        //             }
        //             else{
        //                 return false;
        //             }
        //         });

        // });

        // this.fmeaTaskAddedFamily.push(this.tempListfam);
        
        var storedTaskSequence = JSON.parse(localStorage.fmeataskadded);

        // console.log(storedTaskSequence)
        this.fmeaTaskAdded = storedTaskSequence;
        this.ELEMENT_DATA_3 = this.fmeaTaskAdded;
        this.dataSource3 = new MatTableDataSource<IFMEATaskAddedList>(this.ELEMENT_DATA_3);
    }

    getTaskAddedClassData(){
        var storedTaskSequence = JSON.parse(localStorage.fmeataskadded);

        // console.log(storedTaskSequence)
        // storedTaskSequence.forEach(x => {
        //     let fmeaid = x.id;

        //     this._fmeaService.getComponentClassByTask(fmeaid)
        //         .subscribe(res => {
        //             res.forEach(y => {
        //                 let id = y.id;
        //                 let name = y.componentName;

        //                 this.tempListclass.push({
        //                     id: id,
        //                     componentName: name
        //                 });
        //             });
        //         })
        // });

        // this.fmeaTaskAddedClass.push(this.tempListclass);

        // console.log(storedTaskSequence)
        this.fmeaTaskAdded = storedTaskSequence;
        this.ELEMENT_DATA_3 = this.fmeaTaskAdded;
        this.dataSource3 = new MatTableDataSource<IFMEATaskAddedList>(this.ELEMENT_DATA_3);
    }

    getTaskAddedSubClassData(){
        var storedTaskSequence = JSON.parse(localStorage.fmeataskadded);

        // // console.log(storedTaskSequence)
        // // this.fmeaTaskAdded = storedTaskSequence;
        // storedTaskSequence.forEach(x => {
        //     let fmeaid = x.id;

        //     this._fmeaService.getComponentSubClassByTask(fmeaid)
        //         .subscribe(res => {
        //             res.forEach(y => {
        //                 let id = y.id;
        //                 let name = y.componentName;

        //                 this.tempListsubclass.push({
        //                     id: id,
        //                     componentName: name
        //                 });
        //             });
        //         })
        // });

        // this.fmeaTaskAddedSubClass.push(this.tempListsubclass);
        // console.log(storedTaskSequence)
        this.fmeaTaskAdded = storedTaskSequence;
        this.ELEMENT_DATA_3 = this.fmeaTaskAdded;
        this.dataSource3 = new MatTableDataSource<IFMEATaskAddedList>(this.ELEMENT_DATA_3);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    applyFilterDesc(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource2.filter = filterValue.trim().toLowerCase();
    }

    initializeFieldData(data: IFMEA): void {
        this.fmeaObject = data;
        
        this.fmeaId = this.fmeaObject.id;
    }

    initializeStrategyData(data: IAssetTaskGroupStrategy){
        this.assetStrategyObject = data;

        this.taskId = this.assetStrategyObject.id;
    }

    addThis(event: any, flocId: any, item: any): void{
        // fmeaId = this.fmeaId;
        // console.log(event)
        console.log(flocId)

        // this.addThisDesc(event, flocId);
    
        if(event.target.checked === true)
        {
            this.flocId = flocId;
            this.isSelected(true)

            item.isAddDesc = true;
            
            this.containerComponents.push({
                id: this.flocId
            });

            if(this.containerComponents.length > 1){
                this.isMulti = true;
            }else{
                this.isMulti = false;
            }
        }else{
            item.isAddDesc = false;
            this.containerComponents.pop();

            if(this.containerComponents.length > 1){
                this.isMulti = true;
            }else{
                this.isMulti = false;
            }
        }
    }

    isSelected(selected: boolean){
        this.isAddDesc = selected;

        console.log(this.isAddDesc)
    }

    addThisDesc(event: any, flocDesc: any): void{
        // fmeaId = this.fmeaId;
        console.log(flocDesc)
    
        if(event.target.checked === true)
        {
            this.flocId = flocDesc
            this.isAddDesc = true;
            this.isInclude = true;
            console.log(this.isInclude)
            // this.containers.push(flocDesc);
            // console.log(this.containers);
        }else{
            // this.containers.pop();
            this.isAddDesc = false;
            this.isInclude = false;
            console.log(this.isInclude)
        }
    }

    addThisFam(event: any, ComFam: any): void{
        // fmeaId = this.fmeaId;

        console.log(ComFam)

        // this._fmeaService.getFMEAById(ComFam)
        //     .subscribe(res => {
        //         // console.log(res)
        //         ComFam = res.familyTaxonomyId;
        //     })
    
        if(event.target.checked === true)
        {
            this.familyId = ComFam;
            this.isAddFamily = true;
            
            this.disabledTab2 = true;
            this.disabledTab3 = true;

            // this.containerComponents.push({
            //     id: this.familyId,
            //     name: famName
            // });

        }else{
            // this.containers.pop();
            this.disabledTab2 = false;
            this.disabledTab3 = false;
            this.isAddFamily = false;
            // this.containerComponents.pop();
        }
    }

    addThisClass(event: any, className: any): void{
        // fmeaId = this.fmeaId;
        console.log(className)

        // this._fmeaService.getFMEAById(className)
        //     .subscribe(res => {
        //         // console.log(res)
        //         className = res.classTaxonomyId;
        //     });
    
        if(event.target.checked === true)
        {
            this.classId = className;
            // console.log(this.classId)
            this.disabledTab1 = true;
            this.disabledTab3 = true;
            this.isAddClass = true;
            // this.containers.push(flocDesc);
            // console.log(this.containers);

            // this.containerComponents.push({
            //     id: this.classId,
            //     name: classes
            // });
        }else{
            this.disabledTab1 = false;
            this.disabledTab3 = false;
            this.isAddClass = false;
            // this.containerComponents.pop();
            // this.containers.pop();
        }
    }

    addThisSubClass(event: any, subClass: any): void{
        // fmeaId = this.fmeaId;
        console.log(subClass)
        // this._fmeaService.getFMEAById(subClass)
        //     .subscribe(res => {
        //         // console.log(res)
        //         subClass = res.subClassTaxonomyId;
        //     });
    
        if(event.target.checked === true)
        {
            this.subClassId = subClass;
            // console.log(this.subClassId)
            this.disabledTab1 = true;
            this.disabledTab2 = true;
            this.isAddSubClass = true;
            // this.containers.push(flocDesc);
            // console.log(this.containers);
            // this.containerComponents.push({
            //     id: this.subClassId,
            //     name: subclassname
            // });
        }else{
            this.isAddSubClass = false;
            this.disabledTab1 = false;
            this.disabledTab2 = false;
            // this.containers.pop();
            // this.containerComponents.pop();
        }
    }

    onSelectAll(e: any, item: any): void {
    
        if(e.target.checked === true){
            // item.isAddTask = true;
            // this.fmeaTaskAdded.forEach(x => x.isAddTask === e.event.target.checked)
            this.fmeaTaskAdded.forEach(x => {
                let taskid = x.id
                // x.id === e.event.target.checked

                item.isAddTask = true;

                this.containerTask.push({
                    id: taskid
                });
            });
        }else{
            this.isAddTask = false;
            // item.isAddTask = true;
            this.fmeaTaskAdded.forEach(x => {
                let taskid = x.id
    
                this.containerTask = [];
            });
        }
        // console.log(this.fmeaTaskAdded)
        // console.log(this.containerTask)
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource3.data.length; 
        this.selectAll = true;
        return numSelected === numRows;
      }
    
      /** Selects all rows if they are not all selected; otherwise clear selection. */
      masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource3.data.forEach(row => {
                this.selection.select(row)

                // console.log(row)

                if(row !== '' || row .length !== 0 || row !== null || row !== undefined)
                {
                    this.containerTask.push({
                        id: row.id
                    })
                }
                else{
                    this.containerTask = [];
                }
                
            })

        // console.log(this.containerTask)
      }

      unToggle(){
         if(!this.isAllSelected()){
            this.dataSource3.data.forEach(row => this.selection.select(row))
            this.containerTask = []
         }

        //  console.log(this.isAllSelected())
      }

      checkAll(event: any){
          if(event.target.checked === true){
              this.masterToggle();
          }else{
              this.unToggle();
          }
      }

    addThisTasks(event: any, taskId: any): void{
        // fmeaId = this.fmeaId;
        console.log(taskId)
    
        if(event.target.checked === true)
        {
            this.taskListId = taskId;
            this.isAddTask = true;
            
            this.containerTask.push({
                id: this.taskListId
            });
        }else{
            // this.containers.pop();
            this.isAddTask = false;
            this.selectAll = false;
            this.containerTask.pop();
        }

        // console.log(this.containerTask)
    }

    fetchCheckedIDs(event: any, id: number) {
        this.checkedIDs = []
        if (event.target.checked === true) {
            this.checkedIDs.push(id);
            // console.log(this.checkedIDs)
        }
        else{
            let index = this.checkedIDs.indexOf(event.target.value);
            this.checkedIDs.splice(index, 1);
            // console.log(this.checkedIDs)
        }
    }

    addThisFloc(event: any, id: number): void{
        // fmeaId = this.fmeaId;
    
        if(event.target.checked === true)
        {
            // this.containers.push(flocId);
            // console.log(this.containers);
            this.flocAddTaskList.forEach(
                x => {
                // console.log(x);
                let fmeaid = x.fmeaId;
                let taskid = x.taskId;

                // this.assignAssetTaskGroupMaterialList.push({
                //     id: 0,
                //     fmeaId: fmeaid,
                //     taskId: taskid,
                //     assetHierarchyId: id,
                //     fileName: ''
                // });
                this.assignAssetTaskGroupMaterial ={
                    id: 0,
                    fmeaId: fmeaid,
                    taskId: taskid,
                    batchId: 0,
                    componentFamilyId: 0,
                    componentClassId: 0,
                    componentSubClassId: 0,
                    assetHierarchyId: id,
                    fileName: '',
                    sequenceNo: 0,
                    isMultiple: false,
                    isInclude: true
                };

                this.save();
            });
            
        }else
        {
            this.assignAssetTaskGroupMaterial = {
                id: id,
                fmeaId: 0,
                taskId: 0,
                batchId: 0,
                componentFamilyId: 0,
                componentClassId: 0,
                componentSubClassId: 0,
                assetHierarchyId: 0,
                fileName: '',
                sequenceNo: 0,
                isMultiple: false,
                isInclude: true
            }
        }
    }

    save(): void{
        if(this.flocId !== 0 || this.flocId !== undefined)
        {
            if(this.containerComponents.length > 1)
            {
                if(this.isInclude === true){
                    this.containerComponents.forEach(x => {
                        let componentid = x.id
    
                        this.assignAssetTaskGroupMaterialList.push({
                            id: 0,
                            fmeaId: this.taskListId,
                            taskId: this.taskListId,
                            batchId: this.batchId,
                            componentFamilyId: this.familyId,
                            componentClassId: this.classId,
                            componentSubClassId: this.subClassId,
                            assetHierarchyId: componentid,
                            fileName: '',
                            sequenceNo: this.assignAssetTaskGroupMaterialList.length+1,
                            isMultiple: true,
                            isInclude: true
                        });
                    });
                }else{
                    this.containerComponents.forEach(x => {
                        let componentid = x.id
    
                        this.assignAssetTaskGroupMaterialList.push({
                            id: 0,
                            fmeaId: this.taskListId,
                            taskId: this.taskListId,
                            batchId: this.batchId,
                            componentFamilyId: this.familyId,
                            componentClassId: this.classId,
                            componentSubClassId: this.subClassId,
                            assetHierarchyId: componentid,
                            fileName: '',
                            sequenceNo: this.assignAssetTaskGroupMaterialList.length+1,
                            isMultiple: true,
                            isInclude: false
                        });
                    });
                }
                
            }

            if(this.containerTask.length > 0 )
            {
                if(this.isInclude === true){
                    this.containerTask.forEach(y => {
                        let taskid = y.id
    
                        this.assignAssetTaskGroupMaterialList.push({
                            id: 0,
                            fmeaId: taskid,
                            taskId: taskid,
                            batchId: this.batchId,
                            componentFamilyId: this.familyId,
                            componentClassId: this.classId,
                            componentSubClassId: this.subClassId,
                            assetHierarchyId: this.flocId,
                            fileName: '',
                            sequenceNo: this.assignAssetTaskGroupMaterialList.length+1,
                            isMultiple: false,
                            isInclude: true
                        });
                    })
                }else{
                    this.containerTask.forEach(y => {
                        let taskid = y.id
    
                        this.assignAssetTaskGroupMaterialList.push({
                            id: 0,
                            fmeaId: taskid,
                            taskId: taskid,
                            batchId: this.batchId,
                            componentFamilyId: this.familyId,
                            componentClassId: this.classId,
                            componentSubClassId: this.subClassId,
                            assetHierarchyId: this.flocId,
                            fileName: '',
                            sequenceNo: this.assignAssetTaskGroupMaterialList.length+1,
                            isMultiple: false,
                            isInclude: false
                        });
                    })
                }
                
            }

        this._assignAssetTaskGroupMaterialService.upsertAssignAssetMaterial(this.assignAssetTaskGroupMaterialList)
            .subscribe(res => {
                res.forEach(x => {
                    let Id = x.id;
                    let FmeaId = x.fmeaId;
                    let TaskId = x.taskId;
                    let Batch = x.batchId;
                    let famId = x.componentFamilyId;
                    let classId = x.componentClassId;
                    let subClass = x.componentSubClassId;
                    let assetId = x.assetHierarchyId;
                    let files = x.fileName;
                    let sequence = x.sequenceNo;

                    this.dataList.push({
                        id: Id,
                        fmeaId: FmeaId,
                        taskId: TaskId,
                        batchId: Batch,
                        componentFamilyId: famId,
                        componentClassId: classId,
                        componentSubClassId: subClass,
                        assetHierarchyId: assetId,
                        fileName: files,
                        sequenceNo: sequence
                    });
                });

                // console.log(res);
                localStorage.setItem("modalcomponentList", JSON.stringify(this.containerComponents));
                localStorage.setItem("modaltaskList", JSON.stringify(this.containerTask));
                localStorage.setItem("hierarchyid", this.flocId.toString());
                localStorage.setItem("familyid", this.familyId.toString());
                localStorage.setItem("classid", this.classId.toString());
                localStorage.setItem("subclassid", this.subClassId.toString());
                
                this.close();
            });
        }
        else{
            this.toastr.warning('FLOC number is required.', 'Warning');
        }

        

        // this._assignAssetTaskGroupMaterialService.addAssignAssetTaskGroupStrategyMaterial(this.assignAssetTaskGroupMaterial)
        //     .subscribe(res => {
        //         // this.assignAssetTaskGroupMaterial.assetHierarchyId = res.assetHierarchyId;
        //         console.log("success");
        //         // console.log(res);
        //         this.assignAssetTaskGroupMaterial.id = res.id;
        //         this.dataList.push(this.assignAssetTaskGroupMaterial);
        //         // this.assignAssetTaskGroupMaterial = res;
        //         // this.close();
        //     });
    }

    cancel(): void{
        this.dialogRef.close();
    }

    close(): void {
        // this.toastr.success('added successfully.', 'Success');
        // localStorage.setItem("containers", JSON.stringify(this.containers));
        this.dialogRef.close(this.dataList);
    }

}
