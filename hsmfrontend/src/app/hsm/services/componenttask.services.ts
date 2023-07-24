
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IComponentTaskFMMT } from "../interfaces/IFMEA";


@Injectable()
export class ComponentTaskService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ComponentTaskFMMT`;
    //private controllerApi = '/api/Users'

    constructor(private http: HttpClientExt) { }

    getComponentTask(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const componentTaskDetails = res as any || {};
                return componentTaskDetails;
            }));
    }
    
    getComponentTaskById(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const componentTaskDetail = res as any || {};
                return componentTaskDetail;
            }));
    }

    getAllFMMTByCustomerSiteId(customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}/GetAllFMMTByCustomerSiteId/${customerId}/${siteId}`;

        return this.http.get(url).pipe(
            map(res => {
                const componentTaskDetail = res as any || {};
                return componentTaskDetail;
            }));
    }


    addComponentTask(componentTaskObject: IComponentTaskFMMT): Observable<IComponentTaskFMMT>{
        return this.http.post(this.controllerApi, componentTaskObject).pipe(
            map(res => {
                return res as IComponentTaskFMMT
            }));
    }

    updateComponentTask(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IComponentTaskFMMT
            ));
    }

    deleteComponentTask(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`ComponentTaskService: ${error}`);
        return observableThrowError(error.message || error);
    }

}