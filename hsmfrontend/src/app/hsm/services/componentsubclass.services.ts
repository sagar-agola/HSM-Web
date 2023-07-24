
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IComponentSubClassTaxonomy } from '../interfaces/IComponentTaxonomy';



@Injectable()
export class ComponentSubClassService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ComponentTaxonomySubClasses`;

    constructor(private http: HttpClientExt) { }

    getComponentSubClass(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const componentSubClassDetail = res as any || {};
                return componentSubClassDetail;
            }));
    }

    getComponentSubClassById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const componentSubClassDetails = res as any || {};
                return componentSubClassDetails;
            }));
    }

    getComponentTaxonomySubClassByIds(id: number, customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetComponentTaxonomySubClassByIds/${id}/${customerId}/${siteId}`).pipe(
            map(res => {
                const componentSubClassDetails = res as any || {};
                return componentSubClassDetails;
            }));
    }

    getAllSubClassByCustomerSites(customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllSubClassByCustomerSites/${customerId}/${siteId}`).pipe(
            map(res => {
                const componentSubClassDetails = res as any || {};
                return componentSubClassDetails;
            }));
    }

    addComponentSubClass(subClassObject: IComponentSubClassTaxonomy): Observable<IComponentSubClassTaxonomy>{
        return this.http.post(this.controllerApi, subClassObject).pipe(
            map(res => {
                return res as IComponentSubClassTaxonomy
            }));
    }

    updateComponentSubClass(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IComponentSubClassTaxonomy
            ));
    }

    deleteComponentSubClass(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`ComponentSubClassService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
