
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssetHierarchyBusinessTypeTaxonomy } from '../interfaces/IAssetHierarchyTaxonomy';



@Injectable()
export class AssetHierarchyBusinessTypeService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssetHierarchyBusinessTypeTaxonomies`;

    constructor(private http: HttpClientExt) { }

    getAssetBusinessType(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const businessTypeDetail = res as any || {};
                return businessTypeDetail;
            }));
    }

    getAssetBusinessTypeyById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const businessTypeDetails = res as any || {};
                return businessTypeDetails;
            }));
    }

    getAllBusinessTypeByCustomerSites(customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllBusinessTypeByCustomerSites/${customerId}/${siteId}`).pipe(
            map(res => {
                const businessTypeDetails = res as any || {};
                return businessTypeDetails;
            }));
    }

    addAssetBusinessType(businessTypeObject: IAssetHierarchyBusinessTypeTaxonomy): Observable<IAssetHierarchyBusinessTypeTaxonomy>{
        return this.http.post(this.controllerApi, businessTypeObject).pipe(
            map(res => {
                return res as IAssetHierarchyBusinessTypeTaxonomy
            }));
    }

    updateAssetBusinessType(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssetHierarchyBusinessTypeTaxonomy
            ));
    }

    deleteAssetBusinessType(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssetHierarchyBusinessTypeService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
