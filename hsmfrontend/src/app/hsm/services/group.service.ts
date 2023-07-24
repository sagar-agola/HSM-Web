import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IGroup } from "../interfaces/IGroup";


@Injectable()
export class GroupService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/Group`;

    constructor(private http: HttpClientExt) { }

    getGroups(): Observable<IGroup[]> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const records = res as IGroup[] || [];
                return records;
            }));
    }

    getGroupsByType(id:number): Observable<IGroup[]> {
        var url = `${this.controllerApi}/ByType/${id}`;
        return this.http.get(url).pipe(
            map(res => {
                const records = res as IGroup[] || [];
                return records;
            }));
    }

    getGroup(id: number): Observable<IGroup> {
        var url = `${this.controllerApi}/${id}`;
        return this.http.get(url).pipe(
            map(res => {
                const record = res as IGroup;
                return record;
            }));
    }

    updateGroup(id:number, data: IGroup): Observable<boolean> {
        const url = `${this.controllerApi}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as boolean
            ));
    }

    createGroup(data: IGroup): Observable<IGroup> {
        const url = `${this.controllerApi}`;

        return this.http.post(url, data).pipe(
            map(res =>
                res as IGroup
            ));
    }

    upsertGroup(data: IGroup): Observable<IGroup> {
        const url = `${this.controllerApi}/upsert`;

        return this.http.post(url, data).pipe(
            map(res =>
                res as IGroup
            ));
    }

    deleteGroup(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }
}