
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssetTaskGroupStrategyHsm, IAssetTaskGroupStrategyDisplay } from '../interfaces/IAssetTaskGroupStrategy';



@Injectable({ providedIn: 'root'})
export class AssetTaskGroupStrategyHsmService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssetTaskGroupStrategyHsm`;

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

        return this.http.get(`${url}/GetTGSHsmDetails/${id}`).pipe(
            map(res => {
                const getTaskGroupStrategyDetails = res as any[] || [];
                return getTaskGroupStrategyDetails;
            }));
    }

    getAllTGSForDashboardReview(id: number): Observable<any> {
        const url = `${this.controllerApi}/GetAllTGSforReviewDashboard/${id}`;
        return this.http.get(url).pipe(
            map(res => {
                const tgsReviewlist = res as any || {};
                return tgsReviewlist;
            }));
    }

    getAllTaskGroupStrategyHsmForReview(): Observable<any[]> {
        const url = `${this.controllerApi}/GetAllTaskGroupStrategyHsmForReview`;
        return this.http.get(url).pipe(
            map(res => {
                const getTaskGroupStrategyDetails = res as any[] || [];
                return getTaskGroupStrategyDetails;
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

    getAssetClassHierarchy(code: string): Observable<any[]> {
        const url = this.controllerApi;

        return this.http.get(`${url}/MapAssetClass/${code}`).pipe(
            map(res => {
                // return res.json().data;
                const getcomponentHierarchyDetails = res as any[] || [];
                return getcomponentHierarchyDetails;
            }));
    }

    getHsmTaskGroupStrategyHierarchy(): Observable<any[]> {
        const url = this.controllerApi;

        return this.http.get(`${url}/GetHsmTaskGroupStrategyHierarchy/`).pipe(
            map(res => {
                // return res.json().data;
                const getcomponentHierarchyDetails = res as any[] || [];
                return getcomponentHierarchyDetails;
            }));
    }

    getHsmTaskGroupStrategyHierarchyClone(): Observable<any[]> {
        const url = this.controllerApi;

        return this.http.get(`${url}/GetHsmTaskGroupStrategyHierarchyClone/`).pipe(
            map(res => {
                // return res.json().data;
                const getcomponentHierarchyDetails = res as any[] || [];
                return getcomponentHierarchyDetails;
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

    getAssetTaskGroupStrategy(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllAssetTaskGroupStrategyHsm`).pipe(
            map(res => {
                const assetTaskGroupDetail = res as any || {};
                return assetTaskGroupDetail;
            }));
    }

    getAssetTaskGroupStrategyHsmById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllAssetTaskGroupStrategyHsmById/${id}`).pipe(
            map(res => {
                const assetTaskGroupDetail = res as any || {};
                return assetTaskGroupDetail;
            }));
    }

    getAssetTaskGroupStrategyFilters(categoryid: number, assetmanuf: string, taskid: string, taskdesc: string, tasktype: number, frequency: number, tradetype: number, operationalmode: number, industry: number, businesstype: number, assetclass: number, processfunction: number, assetSpec: number, assetManufacturer: number): Observable<any[]> {
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
            "AssetManufacturerId": assetManufacturer
        }

        return this.http.post(`${url}/GetAllAssetTaskGroupStrategyFilters`, data).pipe(
            map(res => {
                const atgListFilterResults = res as any[] || [];
                return atgListFilterResults;
            }));
    }

    addStrategyGroup(assetTaskGroup: IAssetTaskGroupStrategyHsm): Observable<IAssetTaskGroupStrategyHsm>{
        return this.http.post(this.controllerApi, assetTaskGroup).pipe(
            map(res => {
                return res as IAssetTaskGroupStrategyHsm
            }));
    }

    updateStrategyGroup(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssetTaskGroupStrategyHsm
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
    getDropdownTGSIdno(id: number, taskid: string): Observable<any[]> {
        const url = `${this.controllerApi}`;

        var data = {
            "Id": id,
            "TaskId": taskid
        }
        
        return this.http.post(`${url}/GetDropdownTGSIdno`, data).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownTGSFrequency(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSFrequency/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSOperationalMode(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSOperationalMode/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSTaskType(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSTaskType/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSTradeType(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSTradeType/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSAssetBusiness(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSAssetBusiness/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSAssetIndustry(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSAssetIndustry/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSAssetManufacturer(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSAssetManufacturer/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSAssetProcessFunction(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSAssetProcessFunction/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }
    getDropdownTGSAssetSpec(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTGSAssetSpec/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
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

    getAssetTaskGroupStrategyLastRow(): Observable<any> {
        const url = this.controllerApi;

        return this.http.get(`${url}/GetAssetTaskGroupStrategyHsmLastRow`).pipe(
            map(res => {
                const getcomponentHierarchyDetails = res as any|| {};
                return getcomponentHierarchyDetails;
            }));
    }

    getAssetTaskGroupStrategyLastNumber(): Observable<any> {
        const url = this.controllerApi;

        return this.http.get(`${url}/GetLastNumberTGSHsm`).pipe(
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

    deleteTGSId(id: number): Observable<any> {
        const url = `${this.controllerApi}/DeleteTGSHsmData/${id}`;

        return this.http.delete(url).pipe(
            map(res => {
                const materialTaskItems = res as any || {}
                return materialTaskItems;
            }));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssetTaskGroupStrategyHsmService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
