
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssetHierarchyComponentFamilyTaxonomy } from '../interfaces/IAssetHierarchyTaxonomy';


@Injectable()
export class AssetHierarchyFamilyService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssetHierarchyComponentFamilyTaxonomies`;

    constructor(private http: HttpClientExt) { }

    getAssetFamilyTaxonomy(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const familyDetail = res as any || {};
                return familyDetail;
            }));
    }

    getAssetFamilyTaxonomyById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const familyDetails = res as any || {};
                return familyDetails;
            }));
    }

    addAssetFamilyTaxonomy(specObject: IAssetHierarchyComponentFamilyTaxonomy): Observable<IAssetHierarchyComponentFamilyTaxonomy>{
        return this.http.post(this.controllerApi, specObject).pipe(
            map(res => {
                return res as IAssetHierarchyComponentFamilyTaxonomy
            }));
    }

    updateAssetFamilyTaxonomy(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssetHierarchyComponentFamilyTaxonomy
            ));
    }

    deleteAssetFamilyTaxonomy(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssetHierarchyFamilyService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
