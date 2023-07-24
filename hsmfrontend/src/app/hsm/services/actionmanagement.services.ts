
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IActionManagement } from "../interfaces/IActionManagement";


@Injectable()
export class ActionManagementService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ActionManagement`;
    //private controllerApi = '/api/Users'

    constructor(private http: HttpClientExt) { }

    getActionManagementRecords(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }
    
    getActionManagementRecordById(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetail = res as any || {};
                return usersDetail;
            }));
    }

    getActionManagementByUserId(id: number): Observable<any> {
        const url = `${this.controllerApi}/GetActionManagementByUser/${id}`;
        return this.http.get(url).pipe(
            map(res => {
                const actionManagementList = res as any || {};
                return actionManagementList;
            }));
    }

    addActionManagement(usersObject: IActionManagement): Observable<IActionManagement>{
        return this.http.post(this.controllerApi, usersObject).pipe(
            map(res => {
                return res as IActionManagement
            }));
    }

    updateActionManagement(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IActionManagement
            ));
    }

    deleteActionManagement(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    getLastNumber(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetLastNumberRequestForm`).pipe(
            map(res => {
                const lastNumberDetails = res as any|| {};
                return lastNumberDetails;
            }));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`ActionManagementService: ${error}`);
        return observableThrowError(error.message || error);
    }

}