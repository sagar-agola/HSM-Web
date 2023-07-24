
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';



@Injectable()
export class AssignTaskGroupStrategyService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssignAssetTaskGroupStrategy`;

    constructor(private http: HttpClientExt) { }

    getAssignTaskGroupStrategy(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const assigntaskgroupdetail = res as any || {};
                return assigntaskgroupdetail;
            }));
    }

    getAssignTaskGroupStrategyById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const assigntaskgroupdetails = res as any || {};
                return assigntaskgroupdetails;
            }));
    }

    getTaskGroupStrategyPackage(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetTaskGroupStrategyPackage`).pipe(
            map(res => {
                const assigntaskgroupPackagedetails = res as any || {};
                return assigntaskgroupPackagedetails;
            }));
    }

    getAddFlocList(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAddFlocList`).pipe(
            map(res => {
                const tgsDetails = res as any || {};
                return tgsDetails;
            }));
    }

    getAssignTaskToEquipment(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAssignTaskToEquipmentList/${id}`).pipe(
            map(res => {
                const assignTaskDetails = res as any || {};
                return assignTaskDetails;
            }));
    }

    getFlocAddedEquipment(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetFLOCAddedEquipments/${id}`).pipe(
            map(res => {
                const assignTaskDetails = res as any || {};
                return assignTaskDetails;
            }));
    }

    getFlocAddedTasks(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetFLOCAddedTasks/${id}`).pipe(
            map(res => {
                const assignTaskDetail = res as any || {};
                return assignTaskDetail;
            }));
    }

    getTaskEquipmentAssetHierarchy(hierarchyid:number, taskid:number): Observable<any[]> {
        const url = `${this.controllerApi}`;

        var data = {
            "HierarchyId": hierarchyid,
            "TaskId": taskid,
        }

        return this.http.post(`${url}/MapTaskEquipmentHierarchy`, data).pipe(
            map(res => {
                // return res.json().data;
                const getAssetHierarchyDetails = res as any[] || [];
                return getAssetHierarchyDetails;
            }));
    }

    getMaterialId(fmeaid: number, taskid: number, hierarchyid: number): Observable<any> {
        const url = `${this.controllerApi}`;
        var data = {
            "TaskId": fmeaid,
            "FmeaId": taskid,
            "HierarchyId": hierarchyid
        }

        return this.http.post(`${url}/GetMaterialId`, data).pipe(
            map(res => {
                const materialDetails = res as any || {};
                return materialDetails;
            }));
    }

    getTaskGroupStrategyPackageFilter(taskGroupId: string, taskGroupDesc: string, taskTypeId: number, frequencyId: number, tradeTypeId: number, operationalModeId: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "TaskGroupId": taskGroupId,
            "TaskGroupDesc": taskGroupDesc,
            "TaskTypeId": taskTypeId,
            "FrequencyId": frequencyId,
            "TradeTypeId": tradeTypeId,
            "OperationalModeId": operationalModeId

        }
        return this.http.post(`${url}/GetTaskGroupStrategyPackageFilters`, data).pipe(
            map(res => {
                const taskGroupStrategyList = res as any[] || [];
                return taskGroupStrategyList;
            }));
    }

    getEAMPlanPackage(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetEAMPlanPackage`).pipe(
            map(res => {
                const eamPlanPackagedetails = res as any || {};
                return eamPlanPackagedetails;
            }));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssignTaskGroupStrategyService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
