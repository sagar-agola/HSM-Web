
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IUserManagementGroup } from "../interfaces/IUserManagementGroup";


@Injectable()
export class UserManagementGroupService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/UserManagementGroup`;
    //private controllerApi = '/api/Users'

    constructor(private http: HttpClientExt) { }

    getUserManagementGroupRecords(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }

    getAllUserManagementGroup(): Observable<any> {
        const url = `${this.controllerApi}/AllUserGroups`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }
    
    getUserManagementGroupRecordById(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetail = res as any || {};
                return usersDetail;
            }));
    }

    getUserManagementGroupByUserId(id: number): Observable<any> {
        const url = `${this.controllerApi}/UserId/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }

    addUserManagementGroup(usersObject: IUserManagementGroup): Observable<IUserManagementGroup>{
        return this.http.post(this.controllerApi, usersObject).pipe(
            map(res => {
                return res as IUserManagementGroup
            }));
    }

    addUserManagementGroupSingle(usersObject: IUserManagementGroup): Observable<IUserManagementGroup>{
        const url = `${this.controllerApi}/single`;
        return this.http.post(url, usersObject).pipe(
            map(res => {
                return res as IUserManagementGroup
            }));
    }

    upsertUserManagementGroup(items: IUserManagementGroup[]): Observable<IUserManagementGroup[]> {
        const url = `${this.controllerApi}/upsertUserManagementGroup`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as IUserManagementGroup[] || [];
            }))
    }

    updateUserManagementGroup(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IUserManagementGroup
            ));
    }

    deleteUserManagementGroup(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`UserManagementGroupService: ${error}`);
        return observableThrowError(error.message || error);
    }

}