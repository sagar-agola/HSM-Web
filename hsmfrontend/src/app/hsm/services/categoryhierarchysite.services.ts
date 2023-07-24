
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { ICategoryHierarchySite } from "../interfaces/ICategoryHierarchySite";


@Injectable()
export class CategoryHierarchySiteService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/CategoryHierarchySite`;
    //private controllerApi = '/api/Users'

    constructor(private http: HttpClientExt) { }

    getCategoryHierarchySiteRecords(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const categoryDetails = res as any || {};
                return categoryDetails;
            }));
    }
    
    getCategoryHierarchySiteRecordById(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const categoryDetail = res as any || {};
                return categoryDetail;
            }));
    }

    getCategoryHierarchySiteTree(): Observable<any[]> {
        const url = this.controllerApi;

        return this.http.get(`${url}/MapHierarchy`).pipe(
            map(res => {
                // return res.json().data;
                const getcategoryHierarchySiteTree = res as any[] || [];
                return getcategoryHierarchySiteTree;
            }));
    }

    getCategoryHierarchySiteAssetClassTree(id: number): Observable<any[]> {
        const url = this.controllerApi;

        return this.http.get(`${url}/MapCategoryHierarchy/${id}`).pipe(
            map(res => {
                // return res.json().data;
                const getcategoryHierarchySiteTree = res as any[] || [];
                return getcategoryHierarchySiteTree;
            }));
    }

    getComponentCategoryHierarchyLevel1(customerId: number, siteId: number): Observable<any> {
        const url = this.controllerApi;

        return this.http.get(`${url}/GetAssetClassLevel1/${customerId}/${siteId}`).pipe(
            map(res => {
                const getcomponentHierarchyDetails = res as any|| {};
                return getcomponentHierarchyDetails;
            }));
    }

    getCategoryHierarchyChildSite(categorycode: string): Observable<any[]> {
        const url = this.controllerApi;

        return this.http.get(`${url}/GetCategoryHierarchyChildSite/${categorycode}`).pipe(
            map(res => {
                // return res.json().data;
                const getcategoryHierarchySite= res as any[] || [];
                return getcategoryHierarchySite;
            }));
    }

    addCategoryHierarchySite(categoryHierarchyObject: ICategoryHierarchySite): Observable<ICategoryHierarchySite>{
        return this.http.post(this.controllerApi, categoryHierarchyObject).pipe(
            map(res => {
                return res as ICategoryHierarchySite
            }));
    }

    updateCategoryHierarchySite(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as ICategoryHierarchySite
            ));
    }

    upsertAssetClass(items: ICategoryHierarchySite[]): Observable<ICategoryHierarchySite[]> {
        const url = `${this.controllerApi}/upsertTask`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as ICategoryHierarchySite[] || [];
            }));
    }

    getComponentCategoryHierarchySiteLastCode(): Observable<any> {
        const url = this.controllerApi;

        return this.http.get(`${url}/GetLastSiteCategoryCode`).pipe(
            map(res => {
                const getcomponentHierarchyDetails = res as any|| {};
                return getcomponentHierarchyDetails;
            }));
    }

    getCategorySiteByCategoryId(id: number): Observable<any> {
        const url = `${this.controllerApi}/GetCategorySiteByCategoryId/${id}`;

        return this.http.get(`${url}`).pipe(
          map(res => {
            const categoryHierarchyDetails = res as any || {};
            return categoryHierarchyDetails;
          }));
    }

    getCheckComponentHierarchySiteAttach(id: number): Observable<any> {
        const url = this.controllerApi;

        return this.http.get(`${url}/CheckComponentHierarchySiteAttach/${id}`).pipe(
            map(res => {
                const componentHierarchyDetails = res as any || {};
                return componentHierarchyDetails;
            }));
    }

    deleteCategoryHierarchySite(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`CategoryHierarchySiteService: ${error}`);
        return observableThrowError(error.message || error);
    }

}