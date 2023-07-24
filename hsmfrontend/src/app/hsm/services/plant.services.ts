
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IPlant } from '../interfaces/IPlant';



@Injectable()
export class PlantService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/Plants`;

    constructor(private http: HttpClientExt) { }

    getPlants(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const plantDetail = res as any || {};
                return plantDetail;
            }));
    }

    addPlant(plantObject: IPlant): Observable<IPlant>{
        return this.http.post(this.controllerApi, plantObject).pipe(
            map(res => {
                return res as IPlant
            }));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`DurationService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
