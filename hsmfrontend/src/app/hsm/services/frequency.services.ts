
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IFrequency } from '../interfaces/IFrequency';



@Injectable()
export class FrequencyService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/Frequency`;

    constructor(private http: HttpClientExt) { }

    getFrequency(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const frequencydetail = res as any || {};
                return frequencydetail;
            }));
    }

    getFrequencyById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const frequencydetails = res as any || {};
                return frequencydetails;
            }));
    }

    getAllFrequencyByCustomerSites(customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllFrequencyByCustomerSites/${customerId}/${siteId}`).pipe(
            map(res => {
                const frequencydetails = res as any || {};
                return frequencydetails;
            }));
    }

    addFrequency(frequencyObject: IFrequency): Observable<IFrequency>{
        return this.http.post(this.controllerApi, frequencyObject).pipe(
            map(res => {
                return res as IFrequency
            }));
    }

    updateFrequency(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IFrequency
            ));
    }

    deleteFrequency(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }


    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`FrequencyService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
