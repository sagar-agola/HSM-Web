
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IRoleFeature} from "../interfaces/IRoleFeature";


@Injectable()
export class RoleFeatureService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/RoleFeatures`;

    constructor(private http: HttpClientExt) { }

    addRoleFeature(userPermission: IRoleFeature): Observable<IRoleFeature>{
        return this.http.post(this.controllerApi, userPermission).pipe(
            map(res => {
                return res as IRoleFeature
            }));
    }

    getRoleFeatureById(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const roleFeatureDetail = res as any || {};
                return roleFeatureDetail;
            }));
    }

    getRoleFeatureRecords(): Observable<IRoleFeature[]> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const roleFeatureDetails = res as IRoleFeature[] || [];
                return roleFeatureDetails;
            }));
    }

    updateRoleFeature(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`RoleFeatureService: ${error}`);
        return observableThrowError(error.message || error);
    }

}