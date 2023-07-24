
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssetHierarchyIndustryTaxonomy } from '../interfaces/IAssetHierarchyTaxonomy';



@Injectable()
export class AssetHierarchyIndustryService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssetHierarchyIndustryTaxonomies`;

    constructor(private http: HttpClientExt) { }

    getAssetIndustry(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const industryDetail = res as any || {};
                return industryDetail;
            }));
    }

    getAssetIndustryById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const industryDetails = res as any || {};
                return industryDetails;
            }));
    }

    getAllIndustryByCustomerSites(customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllIndustryByCustomerSites/${customerId}/${siteId}`).pipe(
            map(res => {
                const industryDetails = res as any || {};
                return industryDetails;
            }));
    }

    addAssetIndustry(industryObject: IAssetHierarchyIndustryTaxonomy): Observable<IAssetHierarchyIndustryTaxonomy>{
        return this.http.post(this.controllerApi, industryObject).pipe(
            map(res => {
                return res as IAssetHierarchyIndustryTaxonomy
            }));
    }

    updateAssetIndustry(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssetHierarchyIndustryTaxonomy
            ));
    }

    deleteAssetIndustry(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssetHierarchyIndustryService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
