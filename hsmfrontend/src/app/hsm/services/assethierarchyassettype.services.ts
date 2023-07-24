
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssetHierarchyAssetTypeTaxonomy } from '../interfaces/IAssetHierarchyTaxonomy';



@Injectable()
export class AssetHierarchyAssetTypeService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssetHierarchyAssetTypeTaxonomies`;

    constructor(private http: HttpClientExt) { }

    getAssetType(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const assetTypeDetail = res as any || {};
                return assetTypeDetail;
            }));
    }

    getAssetTypeById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const assetTypeDetails = res as any || {};
                return assetTypeDetails;
            }));
    }

    addAssetType(assetTypeObject: IAssetHierarchyAssetTypeTaxonomy): Observable<IAssetHierarchyAssetTypeTaxonomy>{
        return this.http.post(this.controllerApi, assetTypeObject).pipe(
            map(res => {
                return res as IAssetHierarchyAssetTypeTaxonomy
            }));
    }

    updateAssetType(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssetHierarchyAssetTypeTaxonomy
            ));
    }

    deleteAssetType(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssetHierarchyAssetTypeService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
