
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssetHierarchyProcessFunctionTaxonomy } from '../interfaces/IAssetHierarchyTaxonomy';


@Injectable()
export class AssetHierarchyProcessFunctionService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssetHierarchyProcessTaxonomies`;

    constructor(private http: HttpClientExt) { }

    getProcessFunction(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const processFunctionDetail = res as any || {};
                return processFunctionDetail;
            }));
    }

    getProcessFunctionById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const processFunctionDetails = res as any || {};
                return processFunctionDetails;
            }));
    }

    getAllProcessByCustomerSites(customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllProcessByCustomerSites/${customerId}/${siteId}`).pipe(
            map(res => {
                const processFunctionDetails = res as any || {};
                return processFunctionDetails;
            }));
    }

    addProcessFunction(processObject: IAssetHierarchyProcessFunctionTaxonomy): Observable<IAssetHierarchyProcessFunctionTaxonomy>{
        return this.http.post(this.controllerApi, processObject).pipe(
            map(res => {
                return res as IAssetHierarchyProcessFunctionTaxonomy
            }));
    }

    updateProcessFunction(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssetHierarchyProcessFunctionTaxonomy
            ));
    }

    deleteProcessFunction(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssetHierarchyProcessFunctionService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
