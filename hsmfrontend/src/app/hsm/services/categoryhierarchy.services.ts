
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { ITempHierarchy } from '../interfaces/ITempHierarchy';
import { IComponentHierarchy } from '../interfaces/IComponentHierarchy';



@Injectable()
export class CategoryHierarchyService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/CategoryHierarchy`;

    constructor(private http: HttpClientExt) { }

    addCategoryHierarchy(categoryHierarchy: IComponentHierarchy): Observable<IComponentHierarchy>{
        return this.http.post(this.controllerApi, categoryHierarchy).pipe(
            map(res => {
                return res as IComponentHierarchy
            }));
    }

    getComponentHierarchy(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const componentHierarchyDetails = res as any || {};
                return componentHierarchyDetails;
            }));
    }

    getComponentById(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const componentHierarchyDetails = res as any || {};
                return componentHierarchyDetails;
            }));
    }

    getComponentCategoryHierarchy(): Observable<any[]> {
        const url = this.controllerApi;

        return this.http.get(`${url}/MapHierarchy`).pipe(
            map(res => {
                // return res.json().data;
                const getcomponentHierarchyDetails = res as any[] || [];
                return getcomponentHierarchyDetails;
            }));
    }

    getComponentByCategoryName(node: string): Observable<any> {
        const url = `${this.controllerApi}`;
        var data = {
          "Query": node
        }
    
        return this.http.post(`${url}/GetCategoryByCategoryName`, data).pipe(
          map(res => {
            const categoryHierarchyDetails = res as any || {};
            return categoryHierarchyDetails;
          }));
    }

    getComponentByCategoryId(id: number): Observable<any> {
        const url = `${this.controllerApi}/GetCategoryByCategoryId/${id}`;

        return this.http.get(`${url}`).pipe(
          map(res => {
            const categoryHierarchyDetails = res as any || {};
            return categoryHierarchyDetails;
          }));
    }

    updateCategoryHierarchyTaxonomy(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as any
            ));
    }

    getCheckComponentHierarchyAttached(id: number): Observable<any> {
        const url = this.controllerApi;

        return this.http.get(`${url}/CheckComponentHierarchyAttached/${id}`).pipe(
            map(res => {
                const componentHierarchyDetails = res as any || {};
                return componentHierarchyDetails;
            }));
    }

    getComponentCategoryHierarchyLastCode(): Observable<any> {
        const url = this.controllerApi;

        return this.http.get(`${url}/GetCateogryLastCode`).pipe(
            map(res => {
                const getcomponentHierarchyDetails = res as any|| {};
                return getcomponentHierarchyDetails;
            }));
    }

    getComponentCategoryHierarchyLastRow(): Observable<any> {
        const url = this.controllerApi;

        return this.http.get(`${url}/GetCateogryLastCode`).pipe(
            map(res => {
                const getcomponentHierarchyDetails = res as any|| {};
                return getcomponentHierarchyDetails;
            }));
    }

    getComponentCategoryHierarchyLevel1(): Observable<any> {
        const url = this.controllerApi;

        return this.http.get(`${url}/GetAssetClassTaxonomyLevel`).pipe(
            map(res => {
                const getcomponentHierarchyDetails = res as any|| {};
                return getcomponentHierarchyDetails;
            }));
    }

    getComponentCategoryHierarchyLevel2(queryString: string): Observable<any> {
        const url = this.controllerApi;

        var data = {
            "Query": queryString
        }

        return this.http.post(`${url}/GetAssetClassTaxonomyLevelTwo`, data).pipe(
            map(res => {
                const getcomponentHierarchyDetails = res as any|| {};
                return getcomponentHierarchyDetails;
            }));
    }

    getComponentCategoryHierarchyLevel3(queryString: string): Observable<any> {
        const url = this.controllerApi;

        var data = {
            "Query": queryString
        }

        return this.http.post(`${url}/GetAssetClassTaxonomyLevelThree`, data).pipe(
            map(res => {
                const getcomponentHierarchyDetails = res as any|| {};
                return getcomponentHierarchyDetails;
            }));
    }

    deleteComponentHierarchyById(id: number): Observable<any> {
        const url = `${this.controllerApi}/DeleteComponentHierarchy`;

        var data = {
            "HierarchyId": id
        }

        return this.http.post(url, data).pipe(
            map(res =>
                res as any || {}
            ));
    }

    deleteComponentHierarchy(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`CategoryHierarchyService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
