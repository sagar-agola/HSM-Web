
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssetHierarchySpecTaxonomy } from '../interfaces/IAssetHierarchyTaxonomy';


@Injectable()
export class AssetHierarchySpecService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssetHierarchySpecTaxonomies`;

    constructor(private http: HttpClientExt) { }

    getSpecTaxonomy(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const specDetail = res as any || {};
                return specDetail;
            }));
    }

    getSpecTaxonomyById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const specDetails = res as any || {};
                return specDetails;
            }));
    }

    getAllSpecByCustomerSites(customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllSpecByCustomerSites/${customerId}/${siteId}`).pipe(
            map(res => {
                const specDetails = res as any || {};
                return specDetails;
            }));
    }

    addSpecTaxonomy(specObject: IAssetHierarchySpecTaxonomy): Observable<IAssetHierarchySpecTaxonomy>{
        return this.http.post(this.controllerApi, specObject).pipe(
            map(res => {
                return res as IAssetHierarchySpecTaxonomy
            }));
    }

    updateSpecTaxonomy(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssetHierarchySpecTaxonomy
            ));
    }

    deleteSpecTaxonomy(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssetHierarchySpecService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
