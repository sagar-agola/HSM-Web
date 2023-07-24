
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';



@Injectable()
export class EAMPlanService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/EAMPlans`;

    constructor(private http: HttpClientExt) { }

    getEAMPlan(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const eamplanDetail = res as any || {};
                return eamplanDetail;
            }));
    }

    getEAMPlanById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const eamplanDetails = res as any || {};
                return eamplanDetails;
            }));
    }

    getAllEAMPlanList(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetAllEAMPlanList`).pipe(
            map(res => {
                const allEAMPlanList = res as any || {};
                return allEAMPlanList;
            }));
    }

    getFLOCEAMPlanList(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetFLOCEAMPlanList`).pipe(
            map(res => {
                const flocEAMPlanList = res as any || {};
                return flocEAMPlanList;
            }));
    }

    getFLOCEAMPlanListById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetFLOCEAMPlanListById/${id}`).pipe(
            map(res => {
                const flocEAMPlanListById = res as any || {};
                return flocEAMPlanListById;
            }));
    }

    getEAMPlanListDetailById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetEAMPlanListDetails/${id}`).pipe(
            map(res => {
                const eamPlanDetailById = res as any || {};
                return eamPlanDetailById;
            }));
    }

    getEAMPlanDetailById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetEAMPlanDetails/${id}`).pipe(
            map(res => {
                const eamPlanDetailById = res as any || {};
                return eamPlanDetailById;
            }));
    }

    getEAMDropdown(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetEAMDropdownList`).pipe(
            map(res => {
                const eamDropdownList = res as any || {};
                return eamDropdownList;
            }));
    }

    getEAMDropdownById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetEAMDropdownListById/${id}`).pipe(
            map(res => {
                const eamDropdownByIdList = res as any || {};
                return eamDropdownByIdList;
            }));
    }

    getEAMPlanList(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetEAMPlanList`).pipe(
            map(res => {
                const eamPlanDetails = res as any || {};
                return eamPlanDetails;
            }));
    }

    getEAMFunctionLoc(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetEamFunctionLocation`).pipe(
            map(res => {
                const functionLocDetails = res as any || {};
                return functionLocDetails;
            }));
    }

    getEAMDescription(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetEamDescription`).pipe(
            map(res => {
                const descriptionDetails = res as any || {};
                return descriptionDetails;
            }));
    }

    getEAMPlant(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetEamPlant`).pipe(
            map(res => {
                const plantDetails = res as any || {};
                return plantDetails;
            }));
    }

    getEAMFlocDescPlant(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetEamFLOCDescPlant`).pipe(
            map(res => {
                const flocDescplantDetails = res as any || {};
                return flocDescplantDetails;
            }));
    }

    getTotalEAMPlanList(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/GetEAMPlanListTotal`).pipe(
            map(res => {
                const getEamCountDetails = res as any || {};
                return getEamCountDetails;
            }));
    }

    getEAMPlanFilterLookUp(floc: string, flocdesc: string, planningPlant: string): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "FLOC": floc,
            "FLOCDesc": flocdesc,
            "PlanningPlant": planningPlant
        }
        return this.http.post(`${url}/GetEAMPlanListFilter`, data).pipe(
            map(res => {
                const eamPlanResults = res as any[] || [];
                return eamPlanResults;
            }));
    }

    getEAMPlanLookUp(floc: string, flocdesc: string, plant: string, planningPlant: string, maintItemText: string, maintPlanText: string, taskStrategy: string, plannerGP: string, workCenter: string): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "FLOC": floc,
            "FLOCDesc": flocdesc,
            "Plant": plant,
            "PlanningPlant": planningPlant,
            "MaintItemText": maintItemText,
            "MaintPlanText": maintPlanText,
            "TaskStrategy": taskStrategy,
            "PlannerGP": plannerGP,
            "WorkCenter": workCenter
        }
        return this.http.post(`${url}/EAMPlanFlocFilters`, data).pipe(
            map(res => {
                const eamPlanResults = res as any[] || [];
                return eamPlanResults;
            }));
    }

    getEAMPlanWithStatus(floc: string, flocdesc: string, plant: string, planningPlant: string, maintItemText: string, maintPlanText: string, taskStrategy: string, plannerGP: string, workCenter: string, crtd: string, crtdinac: string): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "FLOC": floc,
            "FLOCDesc": flocdesc,
            "Plant": plant,
            "PlanningPlant": planningPlant,
            "MaintItemText": maintItemText,
            "MaintPlanText": maintPlanText,
            "TaskStrategy": taskStrategy,
            "PlannerGP": plannerGP,
            "WorkCenter": workCenter,
            "StatusCRTD": crtd,
            "StatusCRTDINAC": crtdinac
        }
        return this.http.post(`${url}/GetEAMPlanListFilterSystemStatus`, data).pipe(
            map(res => {
                const eamPlanResults = res as any[] || [];
                return eamPlanResults;
            }));
    }

    getEAMPlanBlankStatus(floc: string, flocdesc: string, plant: string, planningPlant: string, maintItemText: string, maintPlanText: string, taskStrategy: string, plannerGP: string, workCenter: string): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "FLOC": floc,
            "FLOCDesc": flocdesc,
            "Plant": plant,
            "PlanningPlant": planningPlant,
            "MaintItemText": maintItemText,
            "MaintPlanText": maintPlanText,
            "TaskStrategy": taskStrategy,
            "PlannerGP": plannerGP,
            "WorkCenter": workCenter
        }
        return this.http.post(`${url}/GetEAMPlanListFilterBlankStatus`, data).pipe(
            map(res => {
                const eamPlanResults = res as any[] || [];
                return eamPlanResults;
            }));
    }

    getEAMPlanDescLookUp(queryString: string): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "FLOCDesc": queryString
        }
        return this.http.post(`${url}/EAMPlanFlocDescFilters`, data).pipe(
            map(res => {
                const eamPlanDescResults = res as any[] || [];
                return eamPlanDescResults;
            }));
    }

    getEAMPlanPlantLookUp(queryString: string): Observable<any[]> {
        const url = `${this.controllerApi}`;
        var data = {
            "Plant": queryString
        }
        return this.http.post(`${url}/EAMPlanPlantFilters`, data).pipe(
            map(res => {
                const eamPlanPlantResults = res as any[] || [];
                return eamPlanPlantResults;
            }));
    }


    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`EAMPlanService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
