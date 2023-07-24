
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IComponentManufacturerTaxonomy } from '../interfaces/IComponentTaxonomy';


@Injectable()
export class ComponentManufacturerService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ComponentTaxonomyManufacturers`;

    constructor(private http: HttpClientExt) { }

    getComponentManufacturer(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const componentManufacturerDetail = res as any || {};
                return componentManufacturerDetail;
            }));
    }

    getComponentManufacturerById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const componentManufacturerDetails = res as any || {};
                return componentManufacturerDetails;
            }));
    }

    getAllManufacturerByCustomerSites(customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllManufacturerByCustomerSites/${customerId}/${siteId}`).pipe(
            map(res => {
                const componentManufacturerDetails = res as any || {};
                return componentManufacturerDetails;
            }));
    }

    addComponentManufacturer(classObject: IComponentManufacturerTaxonomy): Observable<IComponentManufacturerTaxonomy>{
        return this.http.post(this.controllerApi, classObject).pipe(
            map(res => {
                return res as IComponentManufacturerTaxonomy
            }));
    }

    updateComponentManufacturer(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IComponentManufacturerTaxonomy
            ));
    }

    deleteComponentManufacturer(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`ComponentManufacturerService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
