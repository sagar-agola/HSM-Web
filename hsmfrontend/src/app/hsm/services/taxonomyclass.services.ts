
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { ITaxonomyClass } from '../interfaces/ITaxonomyClass';



@Injectable()
export class TaxonomyClassService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssetHierarchyClasses`;

    constructor(private http: HttpClientExt) { }

    getTaxonomyClass(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const classdetail = res as any || {};
                return classdetail;
            }));
    }

    getTaxonomyClassList(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllTaxonomyClass`).pipe(
            map(res => {
                const classList = res as any || {};
                return classList;
            }));
    }

    getTaxonomyClassByCategory(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetTaxonomyClassByCategory/${id}`).pipe(
            map(res => {
                const classdetails = res as any || {};
                return classdetails;
            }));
    }

    getTaxonomyClassById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const taxClassDetail = res as any || {};
                return taxClassDetail;
            }));
    }

    addTaxonomyClass(taxClassObject: ITaxonomyClass): Observable<ITaxonomyClass>{
        return this.http.post(this.controllerApi, taxClassObject).pipe(
            map(res => {
                return res as ITaxonomyClass
            }));
    }

    updateClassTaxonomy(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as ITaxonomyClass
            ));
    }

    deleteClassTaxonomy(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }


    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`TaxonomyClassService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
