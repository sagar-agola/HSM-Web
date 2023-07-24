
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IImportHierarchy } from '../interfaces/IImportHierarchy';


@Injectable({
    providedIn: 'root'
  })
export class UploadService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/TempHierarchy`;

    constructor(private http: HttpClientExt) { }

    UploadExcel(formData: FormData) {
        let headers = new HttpHeaders();
    
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
    
        const httpOptions = { headers: headers };
    
        return this.http.post(this.controllerApi, formData)
      }

    getDuration(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const durationDetail = res as any || {};
                return durationDetail;
            }));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`UploadService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
