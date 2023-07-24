
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { ITaskType } from '../interfaces/ITaskType';



@Injectable()
export class TaskTypeService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/TaskTypes`;

    constructor(private http: HttpClientExt) { }

    addTaskType(taskTypeObject: ITaskType): Observable<ITaskType>{
        return this.http.post(this.controllerApi, taskTypeObject).pipe(
            map(res => {
                return res as ITaskType
            }));
    }

    getTaskType(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const taskTypeDetail = res as any || {};
                return taskTypeDetail;
            }));
    }

    getTaskTypeById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const taskTypeDetails = res as any || {};
                return taskTypeDetails;
            }));
    }

    getAllTaskTypeByCustomerSites(customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllTaskTypeByCustomerSites/${customerId}/${siteId}`).pipe(
            map(res => {
                const taskTypeDetails = res as any || {};
                return taskTypeDetails;
            }));
    }

    updateTaskType(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as ITaskType
            ));
    }

    deleteTaskType(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }


    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`TaskTypeService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
