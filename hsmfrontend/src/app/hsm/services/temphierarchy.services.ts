
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { ITempHierarchy } from '../interfaces/ITempHierarchy';



@Injectable()
export class TempHierarchyService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/TempHierarchy`;

    constructor(private http: HttpClientExt) { }

    getTempHierarchy(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const tempHierarchyDetails = res as any || {};
                return tempHierarchyDetails;
            }));
    }

    getTempHierarchyById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const tempHierarchyDetails = res as any || {};
                return tempHierarchyDetails;
            }));
    }

    getAssetHierarchy(): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/ImportHierarchy`;

        return this.http.get(`${url}/MapHierarchy`).pipe(
            map(res => {
                // return res.json().data;
                const getAssetHierarchyDetails = res as any[] || [];
                return getAssetHierarchyDetails;
            }));
    }

    getAssetHierarchyDataTable(floc: string): Observable<any> {
        const url = `${this.controllerApi}`;
        var data = {
          "FLOC": floc
        }
    
        return this.http.post(`${url}/GetAssetHierarchyDataCode`, data).pipe(
          map(res => {
            const assetHierarchyDataTable = res as any || {};
            return assetHierarchyDataTable;
          }));
      }
    
      getAssetHierarchyDescDataTable(flocdesc: string): Observable<any> {
        const url = `${this.controllerApi}`;
        var data = {
          "Query": flocdesc
        }
    
        return this.http.post(`${url}/GetAssetHierarchyDataDesc`, data).pipe(
          map(res => {
            const assetHierarchyDescDataTable = res as any || {};
            return assetHierarchyDescDataTable;
          }));
      }

    getHierarchyAssignTaxonomy(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetHierarchyAssignTaxonomy`).pipe(
            map(res => {
                const assigntaxonomylist = res as any || {};
                return assigntaxonomylist;
            }));
    }

    updateTaxonomyHierarchy(categoryid: number, classId: number, typeId: number, code: string): Observable<any> {
        const url = `${this.controllerApi}`;

        var data = {
            "CategoryId": categoryid,
            "ClassId": classId,
            "TypeId": typeId,
            "Code": code,
        }
        return this.http.post(`${url}/AssignTaxonomyToHierarchy`, data).pipe(
            map(res => {
                const assigntaxonomyDetails = res as any || {};
                return assigntaxonomyDetails;
            }));
    }

    updateTempHierarchy(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as ITempHierarchy
            ));
    }

    upsertTaxonomy(items: ITempHierarchy[]): Observable<ITempHierarchy[]> {
        const url = `${this.controllerApi}/upsertTaxonomy`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as ITempHierarchy[] || [];
            }))
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`TempHierarchyService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
