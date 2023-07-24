
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IUserPermissionGroup } from "../interfaces/IUserPermissionGroup";


@Injectable()
export class UserPermissionGroupService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/UserPermissionGroup`;
    //private controllerApi = '/api/Users'

    constructor(private http: HttpClientExt) { }

    getUserPermissionGroupRecords(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }

    getAllUserPermissionGroup(): Observable<any> {
        const url = `${this.controllerApi}/AllUserGroups`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }
    
    getUserPermissionGroupRecordById(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetail = res as any || {};
                return usersDetail;
            }));
    }

    addUserPermissionGroup(usersObject: IUserPermissionGroup): Observable<IUserPermissionGroup>{
        return this.http.post(this.controllerApi, usersObject).pipe(
            map(res => {
                return res as IUserPermissionGroup
            }));
    }

    updateUserPermissionGroup(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IUserPermissionGroup
            ));
    }

    deleteUserGroup(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`UserPermissionGroupService: ${error}`);
        return observableThrowError(error.message || error);
    }

}