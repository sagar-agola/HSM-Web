
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';



@Injectable()
export class OperationalModeService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/OperationalMode`;

    constructor(private http: HttpClientExt) { }

    getOperationalMode(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const operationalModeDetail = res as any || {};
                return operationalModeDetail;
            }));
    }

    getOperationalModeById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const operationalModeDetails = res as any || {};
                return operationalModeDetails;
            }));
    }


    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`OperationalModeService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
