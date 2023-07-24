
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssetCategory } from '../interfaces/IAssetHierarchyTaxonomy';


@Injectable()
export class AssetCategoryService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssetCategories`;

    constructor(private http: HttpClientExt) { }

    getAssetCategory(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const assetCategoryDetail = res as any || {};
                return assetCategoryDetail;
            }));
    }

    getAssetCategoryById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const assetCategoryDetails = res as any || {};
                return assetCategoryDetails;
            }));
    }

    addAssetCategory(specObject: IAssetCategory): Observable<IAssetCategory>{
        return this.http.post(this.controllerApi, specObject).pipe(
            map(res => {
                return res as IAssetCategory
            }));
    }

    updateAssetCategory(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssetCategory
            ));
    }

    deleteAssetCategory(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssetCategoryService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
