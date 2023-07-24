
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IWorkInstructionTaskType } from '../interfaces/ITaskType';



@Injectable()
export class WorkInstructionTaskTypeService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/WorkInstructionTaskTypes`;

    constructor(private http: HttpClientExt) { }

    getWorkInstructionTaskType(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const taskTypeDetail = res as any || {};
                return taskTypeDetail;
            }));
    }

    getWorkInstructionTaskTypeById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const taskTypeDetails = res as any || {};
                return taskTypeDetails;
            }));
    }

    addWorkInstructionTaskType(taskTypeObject: IWorkInstructionTaskType): Observable<IWorkInstructionTaskType>{
        return this.http.post(this.controllerApi, taskTypeObject).pipe(
            map(res => {
                return res as IWorkInstructionTaskType
            }));
    }

    updateWorkInstructionTaskType(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IWorkInstructionTaskType
            ));
    }

    deleteWorkInstructionTaskType(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }


    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`WorkInstructionTaskTypeService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
