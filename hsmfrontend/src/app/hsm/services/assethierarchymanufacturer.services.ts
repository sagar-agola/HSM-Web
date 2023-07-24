
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssetHierarchyManufacturerTaxonomy } from '../interfaces/IAssetHierarchyTaxonomy';


@Injectable()
export class AssetHierarchyManufacturerService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssetHierarchyManufacturerTaxonomies`;

    constructor(private http: HttpClientExt) { }

    getAssetManufacturer(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const manufacturerDetails = res as any || {};
                return manufacturerDetails;
            }));
    }

    getAssetManufacturerById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const manufacturerDetails = res as any || {};
                return manufacturerDetails;
            }));
    }

    getAllManufacturerByCustomerSites(customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllManufacturerByCustomerSites/${customerId}/${siteId}`).pipe(
            map(res => {
                const manufacturerDetails = res as any || {};
                return manufacturerDetails;
            }));
    }

    addAssetManufacturer(specObject: IAssetHierarchyManufacturerTaxonomy): Observable<IAssetHierarchyManufacturerTaxonomy>{
        return this.http.post(this.controllerApi, specObject).pipe(
            map(res => {
                return res as IAssetHierarchyManufacturerTaxonomy
            }));
    }

    updateAssetManufacturer(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssetHierarchyManufacturerTaxonomy
            ));
    }

    deleteAssetManufacturer(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssetHierarchyManufacturerService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
