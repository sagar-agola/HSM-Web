
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';

import { IFMEA } from '../interfaces/IFMEA';
import { StringifyOptions } from 'querystring';



@Injectable()
export class FMEAService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/ComponentTasks`;
    private controllerOptApi = `${AppSettings.SITE_HOST}/api/Options`;

    statusList: any[] = [
        {
            id: 1,
            name: "Created",
        },
        {
            id: 2,
            name: "Active",
        },
        {
            id: 3,
            name: "Inactive",
        },
        ,
        {
            id: 4,
            name: "Approved",
        },
        {
            id: 5,
            name: "Rejected",
        },
    ];

    constructor(private http: HttpClientExt) { }

    getSystemStatus(): Observable<any> {
        const url = `${AppSettings.SITE_HOST}/api/SystemStatus`;

        return this.http.get(url).pipe(
            map(res => {
                const systemStatus = res as any || {};
                return systemStatus;
            }));
    }

    getOptions(tblname: string): Observable<any> {
        const url = `${this.controllerOptApi}/${tblname}`
        return this.http.get(url).pipe(
            map(res => {
                const optiondetails = res as any || {};
                return optiondetails;
            }));
    }
    
    addFMEA(fmea: IFMEA): Observable<IFMEA>{
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        return this.http.post(url, fmea).pipe(
            map(res => {
                return res as IFMEA
            }));
    }

    updateFMEARecords(id: number, data: any): Observable<any> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IFMEA
            ));
    }

    upsertImportExcel(items: any[]): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA/upsertImportFMEA`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as any|| [];
            }))
    }

    updateFMEAVariant(taskno: string, data: any): Observable<any> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA/UpdateVariant/${taskno}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IFMEA
            ));
    }

    getFMEA(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const fmeaDetail = res as any || {};
                return fmeaDetail;
            }));
    }

    getFMEAById(id: number): Observable<any> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA/${id}`;
        return this.http.get(url).pipe(
            map(res => {
                const fmeaDetails = res as IFMEA || {};
                return fmeaDetails;
            }));
    }

    getFMEATaskByCategoryId(id: number): Observable<any> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA/GetFMEATaskByCategoryId/${id}`;

        return this.http.get(url).pipe(
            map(res => {
                const fmeaDetails = res as any || {};
                return fmeaDetails;
            }));
    }

    getFMEATaskById(id: number): Observable<any> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA/GetAllFmeaTasks/${id}`;
        return this.http.get(url).pipe(
            map(res => {
                const fmeaDetails = res as IFMEA || {};
                return fmeaDetails;
            }));
    }

    getAllFMEAForDashboardReview(id: number): Observable<any> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA/GetAllFMEAforReviewDashboard/${id}`;
        return this.http.get(url).pipe(
            map(res => {
                const fmeaDetails = res as any || {};
                return fmeaDetails;
            }));
    }

    getAllFMEAForReview(): Observable<any> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA/GetAllFMEAForReview`;
        return this.http.get(url).pipe(
            map(res => {
                const fmeaDetails = res as any || {};
                return fmeaDetails;
            }));
    }

    //Multi Filter Dropdown
    getDropdownTaskIdList(taskid: string, id: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;

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

    getDropdownFailureModeList(fmode: string): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        
        return this.http.get(`${url}/GetDropdownFailureMode/${fmode}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownDurationList(id: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        
        return this.http.get(`${url}/GetDropdownDuration/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownFrequencyList(id: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        
        return this.http.get(`${url}/GetDropdownFrequency/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownTradeTypeList(id: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        
        return this.http.get(`${url}/GetDropdownTradeType/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownTaskTypeList(id: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        
        return this.http.get(`${url}/GetDropdownTaskType/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownManufacturerList(id: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        
        return this.http.get(`${url}/GetDropdownManufacturer/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownBuildSpecList(id: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        
        return this.http.get(`${url}/GetDropdownBuildSpec/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownSubMaintItemByItemIdList(id: number, itemId: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        
        return this.http.get(`${url}/GetDropdownSubMaintItemByItemId/${id}/${itemId}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownSubMaintItemList(id: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        
        return this.http.get(`${url}/GetDropdownSubMaintItem/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownMaintItemList(id: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        
        return this.http.get(`${url}/GetDropdownMaintItem/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getClassMaintUnitList(id: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        
        return this.http.get(`${url}/GetClassMaintUnit/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    //Display List of FMEA Task by Maint Unit
    getFailureModeTaskList(id: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        
        return this.http.get(`${url}/GetFailureModeTaskList/${id}`).pipe(
            map(res => {
                const fmeaVariants = res as any|| {};
                return fmeaVariants;
            }));
    }

    getMaintUnitTaskListFilters(id: number, maintUnit: number, classid: number, subclassid: number, buildspec: number, manufactureId: number, tradetype: number, tasktype: number, freq: number, duration: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        var data = {
            "CategoryId": id,
            "FamilyId": maintUnit,
            "ClassId": classid,
            "SubClassId": subclassid,
            "BuildSpecId": buildspec,
            "ManufacturerId": manufactureId,
            "TradeTypeId": tradetype,
            "TaskTypeId": tasktype,
            "IntervalId": freq,
            "DurationId": duration
        }
        
        return this.http.post(`${url}/GetMaintUnitTaskListFilters`, data).pipe(
            map(res => {
                const fmeaTasks = res as any|| {};
                return fmeaTasks;
            }));
    }

    getFMEAVariant(queryString: string): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        var data = {
            "Query": queryString
        }
        return this.http.post(`${url}/GetFMEAVariant`, data).pipe(
            map(res => {
                const fmeaVariants = res as any[] || [];
                return fmeaVariants;
            }));
    }

    getFMEAByComponentCode(queryString: string): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "Query": queryString
        }
        return this.http.post(`${url}/GetComponentTaskByCode`, data).pipe(
            map(res => {
                const fmeaDetailResults = res as any[] || [];
                return fmeaDetailResults;
            }));
    }

    getFMEAListByCategoryName(queryString: string): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        var data = {
            "Query": queryString
        }
        return this.http.post(`${url}/GetFMEATaskListByComponent`, data).pipe(
            map(res => {
                const fmeaListResults = res as any[] || [];
                return fmeaListResults;
            }));
    }

    getAllFMEAListByCategoryName(code: string): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        var data = {
            "Query": code
        }
        return this.http.post(`${url}/GetAllFMEATaskListByComponent`, data).pipe(
            map(res => {
                const allfmeaListResults = res as any[] || [];
                return allfmeaListResults;
            }));
    }

    getFMEAListFilters(taskid: string, failuremode: string, tasktype: number, tradetype: number, intervalid: number, duration: number, variant: number, family: number, classid: number, subclass: number, buildspec: number, manufacturer: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
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
            "ManufacturerId": manufacturer
            
        }
        return this.http.post(`${url}/GetAllFMEATaskListFilters`, data).pipe(
            map(res => {
                const fmeaListFilterResults = res as any[] || [];
                return fmeaListFilterResults;
            }));
    }

    getAllFMEATaskListAssignFilters(taskid: string, failuremode: string, tasktype: number, tradetype: number, intervalid: number, duration: number, variant: number, family: number, classid: number, subclass: number, buildspec: number, manufacturer: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
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
            "ManufacturerId": manufacturer
            
        }
        return this.http.post(`${url}/GetAllFMEATaskListAssignFilters`, data).pipe(
            map(res => {
                const fmeaListFilterResults = res as any[] || [];
                return fmeaListFilterResults;
            }));
    }

    getAllFMEAListByComponentTaxonomy(queryString: string, familyId: number, classId: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        var data = {
            "Query": queryString,
            "CategoryId": familyId,
            "ClassId": classId,
        }
        return this.http.post(`${url}/GetFMEATaskListByComponentTaxonomy`, data).pipe(
            map(res => {
                const allfmeaListResult = res as any[] || [];
                return allfmeaListResult;
            }));
    }

    GetFMEATaskListByComponentName(queryString: string): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        var data = {
            "Query": queryString
        }
        return this.http.post(`${url}/GetFMEATaskListByComponentName`, data).pipe(
            map(res => {
                const allfmeaListResult = res as any[] || [];
                return allfmeaListResult;
            }));
    }

    getFMEATaskListFilters(queryString: string, familyId: number, classId: number, subClassId: number, buildSpecId: number, manufactureId:number,tradetypeId: number, taskTypeid: number, modeId: number, intervalId: number, durationId:number, riskscore: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        var data = {
            "Query": queryString,
            "FamilyId": familyId,
            "ClassId": classId,
            "SubClassId": subClassId,
            "BuildSpecId": buildSpecId,
            "ManufacturerId": manufactureId,
            "TradeTypeId": tradetypeId,
            "TaskTypeId": taskTypeid,
            "OperationalModeId": modeId,
            "FrequencyId": intervalId,
            "DurationId": durationId,
            "TypeId": riskscore
        }
        return this.http.post(`${url}/GetFMEATaskListFilters`, data).pipe(
            map(res => {
                const allfmeaListResult = res as any[] || [];
                return allfmeaListResult;
            }));
    }

    getFMEATaskListLevel1Filters(queryString: string, familyId: number, classId: number, subClassId: number, buildSpecId: number, manufactureId:number,tradetypeId: number, taskTypeid: number, modeId: number, intervalId: number, durationId:number, riskscore: number): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        var data = {
            "Query": queryString,
            "FamilyId": familyId,
            "ClassId": classId,
            "SubClassId": subClassId,
            "BuildSpecId": buildSpecId,
            "ManufacturerId": manufactureId,
            "TradeTypeId": tradetypeId,
            "TaskTypeId": taskTypeid,
            "OperationalModeId": modeId,
            "FrequencyId": intervalId,
            "DurationId": durationId,
            "TypeId": riskscore
        }
        return this.http.post(`${url}/GetFMEATaskListLevel1Filters`, data).pipe(
            map(res => {
                const allfmeaListResult = res as any[] || [];
                return allfmeaListResult;
            }));
    }

    getFMEAByComponentName(queryString: string): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "Query": queryString
        }
        return this.http.post(`${url}/GetComponentTaskByName`, data).pipe(
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

    getFMEAByComponentById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetComponentTaskById/${id}`).pipe(
            map(res => {
                const componentByIdResults = res as any || {};
                return componentByIdResults;
            }));
    }

    getComponentTaskLevel1(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetComponentTaskLevel1`).pipe(
            map(res => {
                const componentTaskLevel = res as any || {};
                return componentTaskLevel;
            }));
    }

    getComponentTaskLevel2(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetComponentTaskLevel2`).pipe(
            map(res => {
                const componentTaskLevel2 = res as any || {};
                return componentTaskLevel2;
            }));
    }

    getComponentTaskLevel3(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetComponentTaskLevel3`).pipe(
            map(res => {
                const componentTaskLevel3 = res as any || {};
                return componentTaskLevel3;
            }));
    }

    getFMEALastNumber(): Observable<any> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;

        return this.http.get(`${url}/GetLastNumberFMEA`).pipe(
            map(res => {
                const getcomponentHierarchyDetails = res as any|| {};
                return getcomponentHierarchyDetails;
            }));
    }

    getComponentFamilyByTask(id: number): Observable<any> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;

        return this.http.get(`${url}/GetComponentFamilyByTask/${id}`).pipe(
            map(res => {
                const getComponentList = res as any|| {};
                return getComponentList;
            }));
    }

    getComponentClassByTask(id: number): Observable<any> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;

        return this.http.get(`${url}/GetComponentClassByTask/${id}`).pipe(
            map(res => {
                const getComponentList = res as any|| {};
                return getComponentList;
            }));
    }

    getComponentSubClassByTask(id: number): Observable<any> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;

        return this.http.get(`${url}/GetComponentSubClassByTask/${id}`).pipe(
            map(res => {
                const getComponentList = res as any|| {};
                return getComponentList;
            }));
    }


    getAllFmeaByTaskNo(taskno: string): Observable<any[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA`;
        
        return this.http.get(`${url}/GetAllFmeaByTaskNo/${taskno}`).pipe(
            map(res => {
                const fmeaListResults = res as any[] || [];
                return fmeaListResults;
            }));
    }
    
    upsertTasktoMaintUnit(items: any[]): Observable<IFMEA[]> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA/upsertTaskToMaintUnit`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as any[] || [];
            }));
    }

    deleteFMEA(id: number): Observable<any> {
        const url = `${AppSettings.SITE_HOST}/api/FMEA/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    UploadExcel(formData: FormData) {
        const url = `${AppSettings.SITE_HOST}/api/FMEA/ImportExcel`;
        let headers = new HttpHeaders();
    
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
    
        const httpOptions = { headers: headers };
    
        return this.http.post(url, formData)
      }


    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`FMEAService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
