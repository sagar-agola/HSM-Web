
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IFMUFTSite } from "../interfaces/IFMEA";


@Injectable()
export class FMaintainableUnitService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/FMUFTSite`;

    constructor(private http: HttpClientExt) { }

    getFMUFTSiteRecords(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const siteRecords = res as any || {};
                return siteRecords;
            }));
    }
    
    getFMUFTSiteById(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const sitesDetail = res as any || {};
                return sitesDetail;
            }));
    }

    addFMUFTSite(siteObject: IFMUFTSite): Observable<IFMUFTSite>{
        return this.http.post(this.controllerApi, siteObject).pipe(
            map(res => {
                return res as IFMUFTSite
            }));
    }

    upsertImportExcel(items: any[], customerId: number, siteId: number): Observable<any[]> {
        const url = `${this.controllerApi}/UpsertImportFMUFTSite/${customerId}/${siteId}`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as any|| [];
            }))
    }

    getFailureModeTaskList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetFailureModeTaskListSite/${id}`).pipe(
            map(res => {
                const fmmtSites = res as any|| {};
                return fmmtSites;
            }));
    }

    getFMUFTSiteTaskCustomerSiteList(id: number, customerId: number, siteId: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetFailureModeTaskListSiteByCustomerSite/${id}/${customerId}/${siteId}`).pipe(
            map(res => {
                const fmmtSites = res as any|| {};
                return fmmtSites;
            }));
    }

    getFMUFTSiteTaskById(id: number): Observable<any> {
        const url = `${this.controllerApi}/GetAllFmufTasks/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const fmeaDetails = res as any || {};
                return fmeaDetails;
            }));
    }

    getFMUFTSiteTaskByCategoryId(id: number, customerId: number, siteId: number): Observable<any> {
        const url = `${this.controllerApi}/GetFMUFTSiteTaskByCategoryId/${id}/${customerId}/${siteId}`;

        return this.http.get(url).pipe(
            map(res => {
                const fmeaDetails = res as any || {};
                return fmeaDetails;
            }));
    }

    getFMUFTSiteListFilters(categoryid: number, taskid: string, failuremode: string, tasktype: number, tradetype: number, intervalid: number, duration: number, variant: number, family: number, classid: number, subclass: number, buildspec: number, manufacturer: number, customerid: number, siteid: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "CategoryId": categoryid,
            "TaskId": taskid,
            "FailureMode": failuremode,
            "TaskTypeId": tasktype,
            "TradeTypeId": tradetype,
            "IntervalId": intervalid,
            "DurationId": duration,
            "VariantId": variant,
            "FamilyId": family,
            "ClassId": classid,
            "SubClassId": subclass,
            "BuildSpecId": buildspec,
            "ManufacturerId": manufacturer,
            "CustomerId": customerid,
            "SiteId": siteid,
            
        }
        return this.http.post(`${url}/GetAllFMUFTSiteTaskListFilters`, data).pipe(
            map(res => {
                const fmeaListFilterResults = res as any[] || [];
                return fmeaListFilterResults;
            }));
    }

    getAllFMUFTsiteTaskListAssignFilters(taskid: string, failuremode: string, tasktype: number, tradetype: number, intervalid: number, duration: number, variant: number, family: number, classid: number, subclass: number, buildspec: number, manufacturer: number, customerId: number, siteId: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "TaskId": taskid,
            "FailureMode": failuremode,
            "TaskTypeId": tasktype,
            "TradeTypeId": tradetype,
            "IntervalId": intervalid,
            "DurationId": duration,
            "VariantId": variant,
            "FamilyId": family,
            "ClassId": classid,
            "SubClassId": subclass,
            "BuildSpecId": buildspec,
            "ManufacturerId": manufacturer,
            "CustomerId": customerId,
            "SiteId": siteId
            
        }
        return this.http.post(`${url}/GetAllFMUFTSiteTaskListAssignFilters`, data).pipe(
            map(res => {
                const fmeaListFilterResults = res as any[] || [];
                return fmeaListFilterResults;
            }));
    }

    getFailureModeTaskListFilter(id: number, classid: number, subclassid: number, buildspec: number, manufactureId: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "CategoryId": id,
            "ClassId": classid,
            "SubClassId": subclassid,
            "BuildSpecId": buildspec,
            "ManufacturerId": manufactureId
        }
        
        return this.http.post(`${url}/GetFailureModeTaskAssignSiteFilters`, data).pipe(
            map(res => {
                const fmeaTasks = res as any|| {};
                return fmeaTasks;
            }));
    }

    getFMUFTByComponentId(id: number, siteId: number, customerId: number): Observable<any[]> {
        const url = `${this.controllerApi}/GetComponentTaskById`;
        var data = {
            "CategoryId": id,
            "SiteId": siteId,
            "CustomerId": customerId
        }
        return this.http.post(url, data).pipe(
            map(res => {
                const componentNameResults = res as any[] || [];
                return componentNameResults;
            }));
    }

    getFMEAByComponentId(id: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        var data = {
            "CategoryId": id
        }
        return this.http.post(`${url}/GetComponentTaskById`, data).pipe(
            map(res => {
                const componentNameResults = res as any[] || [];
                return componentNameResults;
            }));
    }

    upsertTasktoMaintUnit(items: any[]): Observable<IFMUFTSite[]> {
        const url = `${this.controllerApi}`;

        return this.http.post(`${url}/upsertTaskToSiteMaintUnit`, items).pipe(
            map(res => {
                return res as any[] || [];
            }));
    }

    updateFMUFTSite(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IFMUFTSite
            ));
    }

    deleteFMUFTSite(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    getFMUFTSiteLastNumber(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetLastNumberFMUFTSite`).pipe(
            map(res => {
                const getlastNumber = res as any|| {};
                return getlastNumber;
            }));
    }

    //Dropdown list
    getDropdownManufacturerList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownManufacturer/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownBuildSpecList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownBuildSpec/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownSubMaintItemList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownSubMaintItem/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownMaintItemList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownMaintItem/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdowMaintUnitList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownMaintUnit/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownTaskIdList(taskid: string, id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;

        var data = {
            "Id": id,
            "TaskId": taskid
        }
        
        return this.http.post(`${url}/GetDropdownTaskId`, data).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownDurationList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownDuration/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownFrequencyList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownFrequency/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownTradeTypeList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTradeType/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownTaskTypeList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownTaskType/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`FMaintainableUnitService: ${error}`);
        return observableThrowError(error.message || error);
    }

}