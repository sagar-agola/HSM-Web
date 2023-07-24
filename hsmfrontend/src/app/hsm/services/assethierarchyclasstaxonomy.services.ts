
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssetHierarchyClassTaxonomy } from '../interfaces/IAssetHierarchyTaxonomy';



@Injectable()
export class AssetHierarchyClassTaxonomyService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssetHierarchyClassTaxonomies`;

    constructor(private http: HttpClientExt) { }

    getAssetClassTaxonomy(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const classDetail = res as any || {};
                return classDetail;
            }));
    }

    getAssetClassTaxonomyById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const classDetails = res as any || {};
                return classDetails;
            }));
    }

    addAssetClassTaxonomy(assetClassObject: IAssetHierarchyClassTaxonomy): Observable<IAssetHierarchyClassTaxonomy>{
        return this.http.post(this.controllerApi, assetClassObject).pipe(
            map(res => {
                return res as IAssetHierarchyClassTaxonomy
            }));
    }

    updateAssetClassTaxonomy(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssetHierarchyClassTaxonomy
            ));
    }

    deleteAssetClassTaxonomy(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssetHierarchyClassTaxonomyService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
