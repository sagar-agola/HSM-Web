
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { ITaxonomyCategory } from '../interfaces/ITaxonomyCategory';



@Injectable()
export class TaxonomyCategoryService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssetHierarchyCategory`;

    constructor(private http: HttpClientExt) { }

    getTaxonomyCategory(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const categorydetail = res as any || {};
                return categorydetail;
            }));
    }

    getTaxonomyCategoryById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const typedetails = res as any || {};
                return typedetails;
            }));
    }

    addTaxonomyCategory(taxCategoryObject: ITaxonomyCategory): Observable<ITaxonomyCategory>{
        return this.http.post(this.controllerApi, taxCategoryObject).pipe(
            map(res => {
                return res as ITaxonomyCategory
            }));
    }

    updateCategoryTaxonomy(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as ITaxonomyCategory
            ));
    }

    deleteCategoryTaxonomy(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }


    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`TaxonomyCategoryService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
