
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssetTaskGroupStrategy, IAssetTaskGroupStrategyDisplay } from '../interfaces/IAssetTaskGroupStrategy';



@Injectable({ providedIn: 'root'})
export class AssetTaskGroupStrategyService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssetTaskGroupStrategy`;

    constructor(private http: HttpClientExt) { }

    getAssetTaskGroupStrategyById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const strategyDetails = res as any || {};
                return strategyDetails;
            }));
    }

    getTaskGroupStrategyDetails(id:number): Observable<any[]> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetSiteTGSDetails/${id}`).pipe(
            map(res => {
                const getTaskGroupStrategyDetails = res as any[] || [];
                return getTaskGroupStrategyDetails;
            }));
    }

    getAssetClassHierarchy(code: string): Observable<any[]> {
        const url = this.controllerApi;

        return this.http.get(`${url}/MapAssetClass/${code}`).pipe(
            map(res => {
                // return res.json().data;
                const getcomponentHierarchyDetails = res as any[] || [];
                return getcomponentHierarchyDetails;
            }));
    }

    getTaskGroupStrategyById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAssetTaskGroupStrategyDetails/${id}`).pipe(
            map(res => {
                const taskGpStrategyDetails = res as any || {};
                return taskGpStrategyDetails;
            }));
    }

    getTaskGroupStrategyMaxFailureScore(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetTaskGroupStrategyDetailsMaxFailureScore/${id}`).pipe(
            map(res => {
                const taskGpStrategyScoreDetails = res as any || {};
                return taskGpStrategyScoreDetails;
            }));
    }

    getAssetTaskGroupStrategy(customerId:number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllAssetTaskGroupStrategy/${customerId}/${siteId}`).pipe(
            map(res => {
                const assetTaskGroupDetail = res as any || {};
                return assetTaskGroupDetail;
            }));
    }

    getAssetTaskGroupStrategyFilters(categoryid: number, assetmanuf: string, taskid: string, taskdesc: string, tasktype: number, frequency: number, 
        tradetype: number, operationalmode: number, industry: number, businesstype: number, assetclass: number, processfunction: number, assetSpec: number, assetManufacturer: number,
        customerId: number, siteId: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        var data = {
            "Id": categoryid,
            "Manufac": assetmanuf,
            "TaskGroupId": taskid,
            "TaskGroupDesc": taskdesc,
            "TaskTypeId": tasktype,
            "FrequencyId": frequency,
            "TradeTypeId": tradetype,
            "OperationalModeId": operationalmode,
            "IndustryId": industry,
            "BusinessTypeId": businesstype,
            "AssetClassId": assetclass,
            "ProcessFunctionId": processfunction,
            "AssetSpecId": assetSpec,
            "AssetManufacturerId": assetManufacturer,
            "CustomerId": customerId,
            "SiteId": siteId
        }

        return this.http.post(`${url}/GetAllAssetTaskGroupStrategyFilters`, data).pipe(
            map(res => {
                const atgListFilterResults = res as any[] || [];
                return atgListFilterResults;
            }));
    }

    getSiteTaskGroupStrategyHierarchy(customerId: number, siteId: number): Observable<any[]> {
        const url = this.controllerApi;

        return this.http.get(`${url}/GetSiteTaskGroupStrategyHierarchy/${customerId}/${siteId}`).pipe(
            map(res => {
                // return res.json().data;
                const getcomponentHierarchyDetails = res as any || {};
                return getcomponentHierarchyDetails;
            }));
    }

    addStrategyGroup(assetTaskGroup: IAssetTaskGroupStrategy): Observable<IAssetTaskGroupStrategy>{
        return this.http.post(this.controllerApi, assetTaskGroup).pipe(
            map(res => {
                return res as IAssetTaskGroupStrategy
            }));
    }

    updateStrategyGroup(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssetTaskGroupStrategy
            ));
    }

    updateTGSBatchId(tgsid: number, batchid: number): Observable<any> {
        const url = `${this.controllerApi}`;

        var data = {
            "TaskId": tgsid,
            "FmeaId": batchid
        }

        return this.http.post(url, data).pipe(
            map(res =>{
                const materialTaskItems = res as any || {}
                return materialTaskItems;
            }));
    }

    //Dropdown multi filter
    getDropdownTGSSiteIdno(id: number, taskid: string): Observable<any[]> {
        const url = `${this.controllerApi}`;

        var data = {
            "Id": id,
            "TaskId": taskid
        }
        
        return this.http.post(`${url}/GetDropdownTGSSiteIdno`, data).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownTGSSiteFrequency(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSSiteFrequency/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSSiteOperationalMode(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSSiteOperationalMode/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSSiteTaskType(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSSiteTaskType/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSSiteTradeType(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSSiteTradeType/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSSiteAssetBusiness(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSSiteAssetBusiness/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSSiteAssetIndustry(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSSiteAssetIndustry/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSSiteAssetManufacturer(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSSiteAssetManufacturer/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSSiteAssetProcessFunction(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSSiteAssetProcessFunction/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSSiteAssetSpec(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSSiteAssetSpec/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    deleteTGSId(id: number): Observable<any> {
        const url = `${this.controllerApi}/DeleteTGSData/${id}`;

        return this.http.delete(url).pipe(
            map(res => {
                const materialTaskItems = res as any || {}
                return materialTaskItems;
            }));
    }

    getAssetTaskGroupStrategyByCategory(id: number, customerId:number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllAssetTaskGroupStrategiesByCategory/${id}/${customerId}/${siteId}`).pipe(
            map(res => {
                const categoryDetails = res as any || {};
                return categoryDetails;
            }));
    }

    getAssetTaskGroupStrategyByClass(id: number, customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllAssetTaskGroupStrategiesByClass/${id}/${customerId}/${siteId}`).pipe(
            map(res => {
                const classDetails = res as any || {};
                return classDetails;
            }));
    }

    getAssetTaskGroupStrategyByType(id: number, customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllAssetTaskGroupStrategiesByType/${id}/${customerId}/${siteId}`).pipe(
            map(res => {
                const typeDetails = res as any || {};
                return typeDetails;
            }));
    }

    getTotalAssetTaskGroupStrategy(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetTotalAssetTaskGroupStrategy`).pipe(
            map(res => {
                const strategyCountDetails = res as any || {};
                return strategyCountDetails;
            }));
    }

    getTotalAssetTaskGroupStrategyByCategory(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetTotalAssetTaskGroupStrategiesByCategory/${id}`).pipe(
            map(res => {
                const strategyCounCategorytDetails = res as any || {};
                return strategyCounCategorytDetails;
            }));
    }

    getTotalAssetTaskGroupStrategyByClass(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetTotalAssetTaskGroupStrategiesByClass/${id}`).pipe(
            map(res => {
                const strategyCounClassDetails = res as any || {};
                return strategyCounClassDetails;
            }));
    }

    getTotalAssetTaskGroupStrategyByType(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetTotalAssetTaskGroupStrategiesByType/${id}`).pipe(
            map(res => {
                const strategyCountTypeDetails = res as any || {};
                return strategyCountTypeDetails;
            }));
    }

    getAssetTaskGroupStrategyLastRow(): Observable<any> {
        const url = this.controllerApi;

        return this.http.get(`${url}/GetAssetTaskGroupStrategyLastRow`).pipe(
            map(res => {
                const getcomponentHierarchyDetails = res as any|| {};
                return getcomponentHierarchyDetails;
            }));
    }

    getAssetTaskGroupStrategyLastNumber(): Observable<any> {
        const url = this.controllerApi;

        return this.http.get(`${url}/GetLastNumberTGS`).pipe(
            map(res => {
                const getcomponentHierarchyDetails = res as any|| {};
                return getcomponentHierarchyDetails;
            }));
    }

    deleteAssetTaskGroupStrategy(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }


    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssetTaskGroupStrategyService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
