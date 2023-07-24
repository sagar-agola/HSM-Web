
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';



@Injectable()
export class MaintenancePlanImportService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ImportMaintenancePlan`;

    constructor(private http: HttpClientExt) { }

    getImportMaintenancePlan(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const maintenancePlanDetails = res as any || {};
                return maintenancePlanDetails;
            }));
    }

    UploadExcel(formData: FormData) {
        let headers = new HttpHeaders();
    
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
    
        const httpOptions = { headers: headers };
    
        return this.http.post(this.controllerApi, formData)
      }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`MaintenancePlanImportService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
