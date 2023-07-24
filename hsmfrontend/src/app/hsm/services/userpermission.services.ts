
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IUserPermission, IUserPermissionCustomPost } from "../interfaces/IUserPermission";


@Injectable()
export class UserPermissionService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/GroupPermission`;
    //private controllerApi = '/api/Users'

    constructor(private http: HttpClientExt) { }

    getUserPermissionRecords(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }
    
    getUserPermissionRecordById(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetail = res as any || {};
                return usersDetail;
            }));
    }

    upsertUserPermissions(items: IUserPermission[]): Observable<IUserPermission[]> {
        const url = `${this.controllerApi}/upsertGroupPermission`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as IUserPermission[] || [];
            }))
    }

    updateUserPermissions(userPermissionGroupId: number , data: IUserPermissionCustomPost): Observable<IUserPermission[]> {
        const url = `${this.controllerApi}/UpdatePermissions/${userPermissionGroupId}`;

        return this.http.post(`${url}`, data).pipe(
            map(res => {
                return res as IUserPermission[];
            })
        )
    }

    getUserPermissionGroupByGroupId(id: number): Observable<any> {
        const url = `${this.controllerApi}/GetPermissionByUserGroup/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }

    addUserPermission(usersObject: IUserPermission): Observable<IUserPermission>{
        return this.http.post(this.controllerApi, usersObject).pipe(
            map(res => {
                return res as IUserPermission
            }));
    }

    updateUserPermission(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IUserPermission
            ));
    }

    deleteUserPermission(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`UserPermissionService: ${error}`);
        return observableThrowError(error.message || error);
    }

}