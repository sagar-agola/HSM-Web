
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IComponentFamilyTaxonomy } from '../interfaces/IComponentTaxonomy';



@Injectable()
export class ComponentFamilyService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ComponentTaxonomyFamilies`;

    constructor(private http: HttpClientExt) { }

    getComponentFamily(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const componentFamilyDetail = res as any || {};
                return componentFamilyDetail;
            }));
    }

    getComponentFamilyById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const componentFamilyDetails = res as any || {};
                return componentFamilyDetails;
            }));
    }

    addComponentFamily(familyObject: IComponentFamilyTaxonomy): Observable<IComponentFamilyTaxonomy>{
        return this.http.post(this.controllerApi, familyObject).pipe(
            map(res => {
                return res as IComponentFamilyTaxonomy
            }));
    }

    updateComponentFamily(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IComponentFamilyTaxonomy
            ));
    }

    deleteComponentFamily(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`ComponentFamilyService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
