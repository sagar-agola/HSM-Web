
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IComTaxonomyType, ITaxonomyType } from '../interfaces/ITaxonomyType';



@Injectable()
export class ComTaxonomyTypeService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ComponentTaxonomyTypes`;

    constructor(private http: HttpClientExt) { }

    getTaxonomyType(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const typedetail = res as any || {};
                return typedetail;
            }));
    }

    getTaxonomyTypeList(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllComponentTaxonomyType`).pipe(
            map(res => {
                const typeList = res as any || {};
                return typeList;
            }));
    }

    getTaxonomyTypeByClass(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetComTaxonomyTypeByClassId/${id}`).pipe(
            map(res => {
                const typedetails = res as any || {};
                return typedetails;
            }));
    }

    getTaxonomyTypeById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const taxTypeDetail = res as any || {};
                return taxTypeDetail;
            }));
    }

    addTaxonomyType(taxTypeObject: IComTaxonomyType): Observable<IComTaxonomyType>{
        return this.http.post(this.controllerApi, taxTypeObject).pipe(
            map(res => {
                return res as IComTaxonomyType
            }));
    }

    updateTypeTaxonomy(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IComTaxonomyType
            ));
    }

    deleteTypeTaxonomy(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`TaxonomyTypeService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
