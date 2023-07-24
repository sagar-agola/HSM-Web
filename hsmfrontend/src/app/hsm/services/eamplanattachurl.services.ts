
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IEAMPlanAttachURL } from '../interfaces/IEAMPlan';



@Injectable()
export class EAMPlanAttachURLService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/EAMPlanAttachURLs`;

    constructor(private http: HttpClientExt) { }

    getEAMPlanURLAttach(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const attachURLDetail = res as any || {};
                return attachURLDetail;
            }));
    }

    getEAMPlanURLAttachById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const attachURLDetails = res as any || {};
                return attachURLDetails;
            }));
    }

    addEAMPlanURLAttach(attachURLObject: IEAMPlanAttachURL): Observable<IEAMPlanAttachURL>{
        return this.http.post(this.controllerApi, attachURLObject).pipe(
            map(res => {
                return res as IEAMPlanAttachURL
            }));
    }

    getGetEAMPlanAttachByMaintId(id: string): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetEAMPlanAttachByMaintId/${id}`).pipe(
            map(res => {
                const eamPlanAttachDetails = res as any || {};
                return eamPlanAttachDetails;
            }));
    }

    deleteEAMPlanURL(maintItem: string): Observable<any> {
        const url = `${this.controllerApi}`;

        var data = {
            "MaintItem": maintItem,
        }
        return this.http.post(`${url}/DeleteAttachEAMPlanURL`, data).pipe(
            map(res => {
                const eamPlanUrl = res as any || {};
                return eamPlanUrl;
            }));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`EAMPlanAttachURLService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
