
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { ISites } from "../interfaces/ISites";


@Injectable()
export class SitesService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/Sites`;
    //private controllerApi = '/api/Users'

    constructor(private http: HttpClientExt) { }

    getSitesRecords(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }
    
    getSitesById(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetail = res as any || {};
                return usersDetail;
            }));
    }

    getSitesByCustomerId(id: number): Observable<any> {
        const url = `${this.controllerApi}/CustomerId/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetail = res as any || {};
                return usersDetail;
            }));
    }

    addSites(siteObject: ISites): Observable<ISites>{
        return this.http.post(this.controllerApi, siteObject).pipe(
            map(res => {
                return res as ISites
            }));
    }

    updateSites(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as ISites
            ));
    }

    deleteSites(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    getSiteLastNumber(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetLastNumberSite`).pipe(
            map(res => {
                const getlastNumber = res as any|| {};
                return getlastNumber;
            }));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`SitesService: ${error}`);
        return observableThrowError(error.message || error);
    }

}