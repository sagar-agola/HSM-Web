
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IDuration } from '../interfaces/IDuration';



@Injectable()
export class DurationService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/Duration`;

    constructor(private http: HttpClientExt) { }

    getDuration(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const durationDetail = res as any || {};
                return durationDetail;
            }));
    }

    getDurationById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const durationDetails = res as any || {};
                return durationDetails;
            }));
    }

    getAllDurationByCustomerSites(customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllDurationByCustomerSites/${customerId}/${siteId}`).pipe(
            map(res => {
                const durationDetails = res as any || {};
                return durationDetails;
            }));
    }

    addDuration(durationObject: IDuration): Observable<IDuration>{
        return this.http.post(this.controllerApi, durationObject).pipe(
            map(res => {
                return res as IDuration
            }));
    }

    updateDuration(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IDuration
            ));
    }

    deleteDuration(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`DurationService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
