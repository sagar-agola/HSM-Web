
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';



@Injectable()
export class ImportComponentHierarchyService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ImportComponentHierarchy`;

    constructor(private http: HttpClientExt) { }

    getImportComponentHierarchy(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const importComponentHierarchyDetails = res as any || {};
                return importComponentHierarchyDetails;
            }));
    }

    importMaintainableData(dataObject: any): Observable<any>{
        const url = `${this.controllerApi}/ImportMaintainableData`;
        
        return this.http.post(url, dataObject).pipe(
            map(res => {
                return res as any
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
        console.error(`ImportComponentHierarchyService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
