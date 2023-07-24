
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IUsers } from "../interfaces/IUsers";
import { IUserManagementGroup } from '../interfaces/IUserManagementGroup';


@Injectable()
export class UsersService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/Users`;
    //private controllerApi = '/api/Users'

    constructor(private http: HttpClientExt) { }

    getUsersRecords(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }
    
    getUsersRecordById(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetail = res as any || {};
                return usersDetail;
            }));
    }

    getAllUsers(): Observable<any> {
        const url = `${this.controllerApi}/AllUsers`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }

    getUsersNotInGroup(): Observable<any> {
        const url = `${this.controllerApi}/GetUsersNotInGroup`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }

    getUsersInGroup(id: number): Observable<any> {
        const url = `${this.controllerApi}/GetUsersInGroup/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }

    getUsersInCustomer(id: number): Observable<any> {
        const url = `${this.controllerApi}/GetUsersInCustomer/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }

    getUsersDetails(username: string, password: string): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "Username": username,
            "Password": password
        }
        return this.http.post(`${url}/authUsers`, data).pipe(
            map(res => {
                const userResults = res as any|| {};
                return userResults;
            }));
    }

    addUsers(usersObject: IUsers): Observable<IUsers>{
        return this.http.post(this.controllerApi, usersObject).pipe(
            map(res => {
                return res as IUsers
            }));
    }

    upsertUser(data: any): Observable<any> {
        const url = `${this.controllerApi}/upsert`;

        return this.http.post(url, data).pipe(
            map(res =>
                res as IUsers
            ));
    }

    updateUsers(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IUsers
            ));
    }

    deleteUser(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    addUserManagementGroupSingle(usersObject: IUserManagementGroup): Observable<IUserManagementGroup>{
        const url = `${this.controllerApi}/single`;
        return this.http.post(url, usersObject).pipe(
            map(res => {
                return res as IUserManagementGroup
            }));
    }

    getUserManagementId(id: number): Observable<any> {
        const url = `${this.controllerApi}/GetUserManagementId/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const usersDetails = res as any || {};
                return usersDetails;
            }));
    }

    updateUserManagement(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/UpdateuserManagement/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IUserManagementGroup
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`UsersService: ${error}`);
        return observableThrowError(error.message || error);
    }

}