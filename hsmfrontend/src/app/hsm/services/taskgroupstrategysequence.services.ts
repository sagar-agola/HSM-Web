
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssignTaskGroupStrategySequence } from '../interfaces/IAssignTaskGroupStrategySequence';



@Injectable()
export class TaskGroupStrategySequenceService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssignTaskGroupStrategySequence`;

    constructor(private http: HttpClientExt) { }

    getTaskGroupStrategyFinalSequenceById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetTGSPackageFinalSequence/${id}`).pipe(
            map(res => {
                const taskGroupStrategySequence = res as any || {};
                return taskGroupStrategySequence;
            }));
    }

    getTaskAddedByStrategyPackageId(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetTaskStrategyTasksAddedByPackageId/${id}`).pipe(
            map(res => {
                const taskGroupIdList = res as any || {};
                return taskGroupIdList;
            }));
    }

    addTaskGroupStrategySequence(fmeaTaskObject: IAssignTaskGroupStrategySequence): Observable<IAssignTaskGroupStrategySequence>{
        return this.http.post(this.controllerApi, fmeaTaskObject).pipe(
            map(res => {
                return res as IAssignTaskGroupStrategySequence
            }));
    }

    upsertTaskGroupStrategySequence(items: IAssignTaskGroupStrategySequence[]): Observable<IAssignTaskGroupStrategySequence[]> {
        const url = `${this.controllerApi}/upsertTaskGroupStrategySequence`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as IAssignTaskGroupStrategySequence[] || [];
            }))
    }

    upsertStrategySequence(items: any[]): Observable<any[]> {
        const url = `${this.controllerApi}/upsertTaskGroupStrategyFinalSequence`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as any [] || [];
            }))
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`TaskGroupStrategySequenceService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
