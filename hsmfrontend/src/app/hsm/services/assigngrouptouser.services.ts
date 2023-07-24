
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssignGroupToUser } from "../interfaces/IAssignGroupToUser";


@Injectable()
export class AssignGroupToUserService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssignGroupToUser`;
    //private controllerApi = '/api/Users'

    constructor(private http: HttpClientExt) { }

    getAssignGroupToUserRecords(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }
    
    getAssignGroupToUserById(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetail = res as any || {};
                return usersDetail;
            }));
    }

    getAssignGroupToUserByTransactionId(id: number): Observable<any> {
        const url = `${this.controllerApi}/TransactionId/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetail = res as any || {};
                return usersDetail;
            }));
    }

    addAssignGroupToUser(usersObject: IAssignGroupToUser): Observable<IAssignGroupToUser>{
        return this.http.post(this.controllerApi, usersObject).pipe(
            map(res => {
                return res as IAssignGroupToUser
            }));
    }

    updateAssignGroupToUser(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssignGroupToUser
            ));
    }

    deleteAssignGroupToUser(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssignGroupToUserService: ${error}`);
        return observableThrowError(error.message || error);
    }

}