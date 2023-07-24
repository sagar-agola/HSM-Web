
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IComponentVariant } from '../interfaces/IComponentHierarchy';



@Injectable()
export class ComponentVariantService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ComponentVariants`;

    constructor(private http: HttpClientExt) { }

    getComponentVariants(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const componentVariantDetail = res as any || {};
                return componentVariantDetail;
            }));
    }

    getComponentVariantsById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const componentVariantDetails = res as any || {};
                return componentVariantDetails;
            }));
    }

    addComponentVariants(componentVariantObject: IComponentVariant): Observable<IComponentVariant>{
        return this.http.post(this.controllerApi, componentVariantObject).pipe(
            map(res => {
                return res as IComponentVariant
            }));
    }

    updateComponentVariants(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IComponentVariant
            ));
    }

    deleteComponentVariants(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`ComponentVariantService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
