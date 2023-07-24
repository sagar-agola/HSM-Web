
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';

import { IFmeaAssembly } from '../interfaces/IFMEA';
import { StringifyOptions } from 'querystring';



@Injectable()
export class FmeaAssemblyService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/FmeaAssemblies`;

    constructor(private http: HttpClientExt) { }

    addFmeaAssembly(fmea: IFmeaAssembly): Observable<IFmeaAssembly>{
        const url = this.controllerApi;
        return this.http.post(url, fmea).pipe(
            map(res => {
                return res as IFmeaAssembly
            }));
    }

    updateFmeaAssemblyRecords(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IFmeaAssembly
            ));
    }

    getFailureModeTaskList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetFailureModeTaskList/${id}`).pipe(
            map(res => {
                const fmeaVariants = res as any|| {};
                return fmeaVariants;
            }));
    }

    getFmeaAssemblyTaskByCategoryId(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetFmeaAssemblyTaskByCategoryId/${id}`).pipe(
            map(res => {
                const fmeaDetails = res as any || {};
                return fmeaDetails;
            }));
    }

    getAllFmeaAssemblyTaskList(): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetAllFmeaAssemblyTaskList`).pipe(
            map(res => {
                const assemblyTaskList = res as any|| {};
                return assemblyTaskList;
            }));
    }

    getFmeaAssemblyTaskList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetFmeaAssemblyTaskList/${id}`).pipe(
            map(res => {
                const assemblyTaskList = res as any|| {};
                return assemblyTaskList;
            }));
    }

    getAllFmeaAssemblyTasksById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetAllFmeaAssemblyTasks/${id}`).pipe(
            map(res => {
                const assemblyTaskList = res as IFmeaAssembly|| {};
                return assemblyTaskList;
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
        
        return this.http.post(`${url}/GetFailureModeTaskAssignFilters`, data).pipe(
            map(res => {
                const fmeaTasks = res as any|| {};
                return fmeaTasks;
            }));
    }

    getFmeaAssemblyTaskListFilter(id: number, maintUnit: number, classid: number, subclassid: number, buildspec: number, manufactureId: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "CategoryId": id,
            "FamilyId":maintUnit,
            "ClassId": classid,
            "SubClassId": subclassid,
            "BuildSpecId": buildspec,
            "ManufacturerId": manufactureId
        }
        
        return this.http.post(`${url}/GetFmeaAssemblyTaskListFilters`, data).pipe(
            map(res => {
                const fmeaTasks = res as any|| {};
                return fmeaTasks;
            }));
    }

    getAllFmeaAssemblyTaskListAttachFilters(id: number, taskid: string, failuremode: string, tasktype: number, tradetype: number, intervalid: number, duration: number, variant: number, family: number, classid: number, subclass: number, buildspec: number, manufacturer: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "Id": id,
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
        return this.http.post(`${url}/GetAllFmeaAssemblyTaskListAttachFilters`, data).pipe(
            map(res => {
                const fmeaListFilterResults = res as any[] || [];
                return fmeaListFilterResults;
            }));
    }

    //Dropdown values
    getDropdownMaintUnitList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownAssetClassMaintUnit/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownMaintItemList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownAssetClassMaintItem/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownSubItemList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownAssetClassSubItem/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownBuildSpecList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownAssetClassBuildSpec/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownManufacturerList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownAssetClassManufacturer/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownTaskTypeList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownAssetClassTaskType/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownTradeTypeList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownAssetClassTradeType/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownFrequencyList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownAssetClassFrequency/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownDurationList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownAssetClassDuration/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownStatusList(id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownAssetClassStatus/${id}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownTaskIdList(name: string, id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;

        var data = {
            "TaskId": name,
            "Id": id
        }
        
        return this.http.post(`${url}/GetDropdownAssetClassTaskId`, data).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    getDropdownFailureList(name: string , id: number): Observable<any[]> {
        const url = `${this.controllerApi}`;

        var data = {
            "Code": name,
            "Id": id
        }
        
        return this.http.post(`${url}/GetDropdownAssetClassFailureMode`, data).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }


    getDropdownSubMaintItemByItemIdList(id: number, itemId: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
        
        return this.http.get(`${url}/GetDropdownAssetClassSubItemByMaintItemId/${id}/${itemId}`).pipe(
            map(res => {
                const dropdownlist = res as any|| {};
                return dropdownlist;
            }));
    }

    //Update FMMT
    updateFmmt(fmmtId: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/UpdateFmmt/${fmmtId}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IFmeaAssembly
            ));
    }

    upsertTaskAdded(items: IFmeaAssembly[]): Observable<IFmeaAssembly[]> {
        const url = `${this.controllerApi}/upsertTask`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as IFmeaAssembly[] || [];
            }));
    }

    getFmeaAssembly(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const fmeaDetail = res as any || {};
                return fmeaDetail;
            }));
    }

    getFmeaAssemblyById(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;
        return this.http.get(url).pipe(
            map(res => {
                const fmeaDetails = res as IFmeaAssembly || {};
                return fmeaDetails;
            }));
    }

    getFmeaAsseblyTaskById(id: number): Observable<any> {
        const url = `${this.controllerApi}/GetFmeaAssemblyTask/${id}`;
        return this.http.get(url).pipe(
            map(res => {
                const fmeaDetails = res as IFmeaAssembly || {};
                return fmeaDetails;
            }));
    }

    getFMEAVariant(queryString: string): Observable<any[]> {
        const url = this.controllerApi;
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
        const url = `${this.controllerApi}`;
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
        const url = `${this.controllerApi}`;
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
            "ManufacturerId": manufacturer
            
        }
        return this.http.post(`${url}/GetAllFMEATaskListFilters`, data).pipe(
            map(res => {
                const fmeaListFilterResults = res as any[] || [];
                return fmeaListFilterResults;
            }));
    }

    getFmeaAssemblyListFilters(taskid: string, failuremode: string, tasktype: number, tradetype: number, intervalid: number, duration: number, variant: number, family: number, classid: number, subclass: number, buildspec: number, manufacturer: number): Observable<any[]> {
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
            "ManufacturerId": manufacturer
            
        }
        return this.http.post(`${url}/GetAllFmeaAssemblyTaskListFilters`, data).pipe(
            map(res => {
                const fmeaListFilterResults = res as any[] || [];
                return fmeaListFilterResults;
            }));
    }

    getAllFMEAListByComponentTaxonomy(queryString: string, familyId: number, classId: number): Observable<any[]> {
        const url = `${this.controllerApi}`;
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
        const url = `${this.controllerApi}`;
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
        const url = `${this.controllerApi}`;
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
        const url = `${this.controllerApi}`;
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
        const url = `${this.controllerApi}`;
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
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetLastNumberFMEA`).pipe(
            map(res => {
                const getcomponentHierarchyDetails = res as any|| {};
                return getcomponentHierarchyDetails;
            }));
    }

    getComponentFamilyByTask(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetComponentFamilyByTask/${id}`).pipe(
            map(res => {
                const getComponentList = res as any|| {};
                return getComponentList;
            }));
    }

    getComponentClassByTask(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetComponentClassByTask/${id}`).pipe(
            map(res => {
                const getComponentList = res as any|| {};
                return getComponentList;
            }));
    }

    getComponentSubClassByTask(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetComponentSubClassByTask/${id}`).pipe(
            map(res => {
                const getComponentList = res as any|| {};
                return getComponentList;
            }));
    }

    getAllFmeaAssemblyByFMMTId(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllFmeaAssemblyByFMMTId/${id}`).pipe(
            map(res => {
                const fmeaAssemblyList = res as any || {};
                return fmeaAssemblyList;
            }));
    }

    getAllAssetClassAttachByTaskId(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllAssetClassAttachByTaskId/${id}`).pipe(
            map(res => {
                const fmeaAssemblyList = res as any || {};
                return fmeaAssemblyList;
            }));
    }

    deleteFMEA(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    UploadExcel(formData: FormData) {
        const url = `${this.controllerApi}/ImportExcel`;
        let headers = new HttpHeaders();
    
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
    
        const httpOptions = { headers: headers };
    
        return this.http.post(url, formData)
      }


    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`FmeaAssemblyService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
