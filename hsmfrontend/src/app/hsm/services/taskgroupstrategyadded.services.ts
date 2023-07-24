
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { ITaskGroupStrategyAdded } from '../interfaces/IAssignAssetTaskGroupStrategy';
import { ITaskGroupStrategy, ITaskGroupStrategyPackageAdded, ITaskGroupStrategyPackageSequenceAdded } from '../interfaces/ITaskGroupStrategy';



@Injectable()
export class TaskGroupStrategyAddedService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/TaskGroupStrategyAdded`;

    constructor(private http: HttpClientExt) { }

    // getFmeaTaskSequenceById(id: number): Observable<any> {
    //     const url = `${this.controllerApi}`;

    //     return this.http.get(`${url}/${id}`).pipe(
    //         map(res => {
    //             const fmeaTaskAddedDetails = res as any || {};
    //             return fmeaTaskAddedDetails;
    //         }));
    // }

    // getFMEATaskAddedFinalSequenceById(id: number): Observable<any> {
    //     const url = `${this.controllerApi}`;

    //     return this.http.get(`${url}/GetFMEATaskAddedFinalSequence/${id}`).pipe(
    //         map(res => {
    //             const fmeaTaskFinalSequenceList = res as any || {};
    //             return fmeaTaskFinalSequenceList;
    //         }));
    // }

    getTaskGroupStrategySequenceById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetTaskGroupStrategyPackageSequence/${id}`).pipe(
            map(res => {
                const taskGroupStrategySequence = res as any || {};
                return taskGroupStrategySequence;
            }));
    }

    addTaskGroupStrategyAdded(fmeaTaskObject: ITaskGroupStrategyPackageAdded): Observable<ITaskGroupStrategyPackageAdded>{
        return this.http.post(this.controllerApi, fmeaTaskObject).pipe(
            map(res => {
                return res as ITaskGroupStrategyPackageAdded
            }));
    }

    upsertTaskGroupStrategyAdded(items: ITaskGroupStrategyPackageAdded[]): Observable<any[]> {
        const url = `${this.controllerApi}/upsertTaskGroupStrategy`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as any|| {};
            }))
    }

    upsertTaskGroupStrategyPackage(items: ITaskGroupStrategy[]): Observable<any> {
        const url = `${this.controllerApi}/upsertTaskGroupStrategyPackage`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as any || {};
            }))
    }

    upsertTaskGroupStrategySequence(items: ITaskGroupStrategyPackageSequenceAdded[]): Observable<ITaskGroupStrategyPackageSequenceAdded[]> {
        const url = `${this.controllerApi}/upsertTaskGroupStrategyPackageSequence`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as ITaskGroupStrategyPackageSequenceAdded[] || [];
            }))
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`TaskGroupStrategyAddedService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
