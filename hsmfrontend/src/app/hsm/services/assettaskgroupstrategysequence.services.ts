
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssetTaskGroupStrategySequence } from '../interfaces/IAssetTaskGroupStrategySequence';
import { ITaskGroupStrategyPackageFinalSequence } from '../interfaces/ITaskGroupStrategy';



@Injectable()
export class AssetTaskGroupStrategySequenceService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssetTaskGroupStrategySequences`;

    constructor(private http: HttpClientExt) { }

    getFmeaTaskSequence(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const fmeaTaskAdded = res as any || {};
                return fmeaTaskAdded;
            }));
    }

    getFmeaTaskSequenceById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const fmeaTaskAddedDetails = res as any || {};
                return fmeaTaskAddedDetails;
            }));
    }

    getFMEATaskAddedFinalSequenceById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetFMEATaskAddedFinalSequence/${id}`).pipe(
            map(res => {
                const fmeaTaskFinalSequenceList = res as any || {};
                return fmeaTaskFinalSequenceList;
            }));
    }

    getTaskAddedByStrategyTaskGroupId(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetTaskAddedByStrategyTaskGroupId/${id}`).pipe(
            map(res => {
                const taskGroupIdList = res as any || {};
                return taskGroupIdList;
            }));
    }

    addFMEATasksSequence(fmeaTaskObject: IAssetTaskGroupStrategySequence): Observable<IAssetTaskGroupStrategySequence>{
        return this.http.post(this.controllerApi, fmeaTaskObject).pipe(
            map(res => {
                return res as IAssetTaskGroupStrategySequence
            }));
    }

    upsertfmeaTaskSequence(items: IAssetTaskGroupStrategySequence[]): Observable<IAssetTaskGroupStrategySequence[]> {
        const url = `${this.controllerApi}/upsertFMEATaskSequence`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as IAssetTaskGroupStrategySequence[] || [];
            }))
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssetTaskGroupStrategySequenceService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
