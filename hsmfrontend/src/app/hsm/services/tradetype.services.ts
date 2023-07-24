
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { ITradeType } from '../interfaces/ITradeType';

@Injectable()
export class TradeTypeService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/TradeTypes`;

    constructor(private http: HttpClientExt) { }

    getTradeType(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const tradeTypeDetail = res as any || {};
                return tradeTypeDetail;
            }));
    }

    getTradeTypeById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const tradeTypeDetails = res as any || {};
                return tradeTypeDetails;
            }));
    }

    GetAllTradeTypeByCustomerSites(customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllTradeTypeByCustomerSites/${customerId}/${siteId}`).pipe(
            map(res => {
                const tradeTypeDetails = res as any || {};
                return tradeTypeDetails;
            }));
    }

    addTradeType(tradeTypeObject: ITradeType): Observable<ITradeType>{
        return this.http.post(this.controllerApi, tradeTypeObject).pipe(
            map(res => {
                return res as ITradeType
            }));
    }

    updateTradeType(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as ITradeType
            ));
    }

    deleteTradeType(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }


    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`TradeTypeService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
