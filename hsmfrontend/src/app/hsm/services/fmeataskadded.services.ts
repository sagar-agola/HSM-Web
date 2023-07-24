
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IFMEATaskAdded } from '../interfaces/IFMEA';



@Injectable()
export class FMEATaskAddedService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/FMEATaskAdded`;

    constructor(private http: HttpClientExt) { }

    getFmeaTaskAdded(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const fmeaTaskAdded = res as any || {};
                return fmeaTaskAdded;
            }));
    }

    getFmeaTaskAddedById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const fmeaTaskAddedDetails = res as any || {};
                return fmeaTaskAddedDetails;
            }));
    }

    getFMEATaskAddedById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetFMEATaskAdded/${id}`).pipe(
            map(res => {
                const fmeaTaskList = res as any || {};
                return fmeaTaskList;
            }));
    }

    getFMEATaskAddedByFmeaId(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetFMEATaskAddedByFMEAId/${id}`).pipe(
            map(res => {
                const fmeaTaskList = res as any || {};
                return fmeaTaskList;
            }));
    }

    getFMEATaskAddedSequenceById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetFMEATaskAddedSequence/${id}`).pipe(
            map(res => {
                const fmeaTaskSequenceList = res as any || {};
                return fmeaTaskSequenceList;
            }));
    }

    addFMEATasks(fmeaTaskObject: IFMEATaskAdded): Observable<IFMEATaskAdded>{
        return this.http.post(this.controllerApi, fmeaTaskObject).pipe(
            map(res => {
                return res as IFMEATaskAdded
            }));
    }

    upsertfmeaTaskAdded(items: IFMEATaskAdded[]): Observable<IFMEATaskAdded[]> {
        const url = `${this.controllerApi}/upsertFMEATask`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as IFMEATaskAdded[] || [];
            }))
    }

    addfmeaTaskAdded(items: IFMEATaskAdded): Observable<IFMEATaskAdded> {
        const url = `${this.controllerApi}/single`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as IFMEATaskAdded;
            }));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`FMEATaskAddedService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
