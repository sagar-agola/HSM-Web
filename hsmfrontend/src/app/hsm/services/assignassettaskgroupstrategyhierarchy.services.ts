
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssignAssetTaskGroupStrategyHierarchy } from '../interfaces/IAssetTaskGroupStrategy';


@Injectable()
export class AssignAssetTaskGroupStrategyHierarchyService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssignAssetTaskGroupStrategyHierarchies`;

    constructor(private http: HttpClientExt) { }

    getAssignAssetTaskGroupStrategyHierarchy(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const assignHierarchyDetail = res as any || {};
                return assignHierarchyDetail;
            }));
    }

    getAssignAssetTaskGroupStrategyHierarchyById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const assignHierarchyDetails = res as any || {};
                return assignHierarchyDetails;
            }));
    }

    addAssignAssetTaskGroupStrategyHierarchy(specObject: IAssignAssetTaskGroupStrategyHierarchy): Observable<IAssignAssetTaskGroupStrategyHierarchy>{
        return this.http.post(this.controllerApi, specObject).pipe(
            map(res => {
                return res as IAssignAssetTaskGroupStrategyHierarchy
            }));
    }

    updateAssignAssetTaskGroupStrategyHierarchy(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssignAssetTaskGroupStrategyHierarchy
            ));
    }

    deleteAssignAssetTaskGroupStrategyHierarchy(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    upsertAssignAssetHierarchy(items: IAssignAssetTaskGroupStrategyHierarchy[]): Observable<IAssignAssetTaskGroupStrategyHierarchy[]> {
        const url = `${this.controllerApi}/upsertHierarchytoTask`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as IAssignAssetTaskGroupStrategyHierarchy[] || [];
            }))
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssignAssetTaskGroupStrategyHierarchyService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
