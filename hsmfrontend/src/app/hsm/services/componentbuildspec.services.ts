
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IComponentBuildSpecTaxonomy } from '../interfaces/IComponentTaxonomy';



@Injectable()
export class ComponentBuildSpecService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ComponentTaxonomyBuildSpecs`;

    constructor(private http: HttpClientExt) { }

    getComponentBuildSpec(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const componentBuildSpecs = res as any || {};
                return componentBuildSpecs;
            }));
    }

    getComponentBuildSpecById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const componentBuildSpec = res as any || {};
                return componentBuildSpec;
            }));
    }

    getAllBuildSpecByCustomerSites(customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllBuildSpecByCustomerSites/${customerId}/${siteId}`).pipe(
            map(res => {
                const componentBuildSpec = res as any || {};
                return componentBuildSpec;
            }));
    }

    addComponentBuildSpec(buildSpecObject: IComponentBuildSpecTaxonomy): Observable<IComponentBuildSpecTaxonomy>{
        return this.http.post(this.controllerApi, buildSpecObject).pipe(
            map(res => {
                return res as IComponentBuildSpecTaxonomy
            }));
    }

    updateComponentBuildSpec(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IComponentBuildSpecTaxonomy
            ));
    }

    deleteComponentBuildSpec(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`ComponentBuildSpecService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
