
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssignAssetTaskGroupStrategyMaterialSite } from '../interfaces/IAssetTaskGroupStrategy';


@Injectable()
export class AssignAssetTaskGroupStrategyMaterialSiteService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssignAssetTaskGroupStrategyMaterialSites`;

    constructor(private http: HttpClientExt,
        private httpClient: HttpClient) { }

    getAssignAssetTaskGroupStrategyMaterial(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const assignHierarchyDetail = res as any || {};
                return assignHierarchyDetail;
            }));
    }

    geAssignAssetTaskGroupStrategyMaterialById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const assignHierarchyDetails = res as any || {};
                return assignHierarchyDetails;
            }));
    }

    addAssignAssetTaskGroupStrategyMaterial(specObject: IAssignAssetTaskGroupStrategyMaterialSite): Observable<IAssignAssetTaskGroupStrategyMaterialSite>{
        return this.http.post(this.controllerApi, specObject).pipe(
            map(res => {
                return res as IAssignAssetTaskGroupStrategyMaterialSite
            }));
    }

    updateAssignAssetTaskGroupStrategyMaterial(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssignAssetTaskGroupStrategyMaterialSite
            ));
    }

    upsertAssignAssetMaterialSite(items: IAssignAssetTaskGroupStrategyMaterialSite[]): Observable<any[]> {
        const url = `${this.controllerApi}/UpsertTask`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as IAssignAssetTaskGroupStrategyMaterialSite[] || [];
            }))
    }

    deleteAssignAssetTaskGroupStrategyMaterial(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    downloadHSM(id : number, hierarchy: number): Observable<any> {
        const url = `${this.controllerApi}`;
                
            return this.http.get(`${url}/GetSitePRT/${id}/${hierarchy}`).pipe(
                map(res => {
                    const hsmFiles = res as any || {}
                    return hsmFiles;
                }));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssignAssetTaskGroupStrategyMaterialSiteService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
