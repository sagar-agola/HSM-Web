
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { ICloneTaskSite, ICustomer } from '../interfaces/ICustomer';



@Injectable()
export class CustomerService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/Customers`;

    constructor(private http: HttpClientExt) { }

    getCustomer(): Observable<any[]> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const customerDetail = res as any || [];
                return customerDetail;
            }));
    }

    getCustomerByType(id: number): Observable<ICustomer[]> {
        const url = `${this.controllerApi}/ByType/${id}`;
        return this.http.get(url).pipe(
            map((res) => {
                const data = res as ICustomer[] || [];
                return data;
            })
        )
    }

    getCustomerById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const customerDetails = res as any || {};
                return customerDetails;
            }));
    }

    getCloneTaskAsseClassId(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetCloneTaskAssetClassId/${id}`).pipe(
            map(res => {
                const clonedetails = res as any || {};
                return clonedetails;
            }));
    }

    getCloneTaskFmeaId(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetCloneTaskFmeaId/${id}`).pipe(
            map(res => {
                const clonedetails = res as any || {};
                return clonedetails;
            }));
    }

    addCustomer(customerObject: ICustomer): Observable<ICustomer>{
        return this.http.post(this.controllerApi, customerObject).pipe(
            map(res => {
                return res as ICustomer
            }));
    }

    updateCustomerRecords(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as ICustomer
            ));
    }

    cloneTasksByTaskId(cloneObject: ICloneTaskSite): Observable<any[]> {
        const url = `${this.controllerApi}`;

        return this.http.post(`${url}/Clone`, cloneObject).pipe(
            map(res => {
                const cloneTasks = res as any[] || [];
                return cloneTasks;
            }));
    }

    delete(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`CustomerService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
