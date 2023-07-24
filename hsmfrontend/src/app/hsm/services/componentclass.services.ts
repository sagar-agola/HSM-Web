
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IComponentClassTaxonomy } from '../interfaces/IComponentTaxonomy';



@Injectable()
export class ComponentClassService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ComponentTaxonomyClasseses`;

    constructor(private http: HttpClientExt) { }

    getComponentClass(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const componentClassDetail = res as any || {};
                return componentClassDetail;
            }));
    }

    getComponentClassById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const componentClassDetails = res as any || {};
                return componentClassDetails;
            }));
    }

    getComponentTaxonomyClassesByIds(id: number, customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetComponentTaxonomyClassesByIds/${id}/${customerId}/${siteId}`).pipe(
            map(res => {
                const componentClassDetails = res as any || {};
                return componentClassDetails;
            }));
    }

    getAllClassesByCustomerSites(customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllClassesByCustomerSites/${customerId}/${siteId}`).pipe(
            map(res => {
                const componentClassDetails = res as any || {};
                return componentClassDetails;
            }));
    }

    addComponentClass(classObject: IComponentClassTaxonomy): Observable<IComponentClassTaxonomy>{
        return this.http.post(this.controllerApi, classObject).pipe(
            map(res => {
                return res as IComponentClassTaxonomy
            }));
    }

    updateComponentClass(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IComponentClassTaxonomy
            ));
    }

    deleteComponentClass(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`ComponentClassService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
