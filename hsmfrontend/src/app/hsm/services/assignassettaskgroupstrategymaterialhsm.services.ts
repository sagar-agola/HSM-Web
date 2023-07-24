
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssignAssetTaskGroupStrategyMaterialHsm } from '../interfaces/IAssetTaskGroupStrategy';


@Injectable()
export class AssignAssetTaskGroupStrategyMaterialHsmService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssignAssetTaskGroupStrategyMaterialHsm`;

    constructor(private http: HttpClientExt,
        private httpClient: HttpClient) { }

    getAssignAssetTaskGroupStrategyMaterial(): Observable<any> {
        return this.http.get(this.controllerApi).pipe(
            map(res => {
                const assignHierarchyDetail = res as any || {};
                return assignHierarchyDetail;
            }));
    }

    geAssignAssetTaskGroupStrategyMaterialById(id: number): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const assignHierarchyDetails = res as any || {};
                return assignHierarchyDetails;
            }));
    }

    getTaskMaterialByBatch(id: number): Observable<any> {
        const url = `${this.controllerApi}/byBatch`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const taskDetails = res as any || {};
                return taskDetails;
            }));
    }

    addAssignAssetTaskGroupStrategyMaterial(specObject: IAssignAssetTaskGroupStrategyMaterialHsm): Observable<IAssignAssetTaskGroupStrategyMaterialHsm>{
        return this.http.post(this.controllerApi, specObject).pipe(
            map(res => {
                return res as IAssignAssetTaskGroupStrategyMaterialHsm
            }));
    }

    updateAssignAssetTaskGroupStrategyMaterial(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssignAssetTaskGroupStrategyMaterialHsm
            ));
    }

    deleteAssignAssetTaskGroupStrategyMaterial(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    deleteTaskItemsByHierarchy(taskId: number, hierarchyId: number): Observable<any> {
        const url = `${this.controllerApi}`;
        var data = {
            "TaskId": taskId,
            "HierarchyId": hierarchyId

        }
        return this.http.post(`${url}/DeleteTaskItemsByHierarchy`, data).pipe(
            map(res => {
                const materialTaskItems = res as any || {}
                return materialTaskItems;
            }));
    }

    deleteComponentByTask(taskId: number, fmeaid: number): Observable<any> {
        const url = `${this.controllerApi}`;
        var data = {
            "TaskId": taskId,
            "HierarchyId": fmeaid

        }
        return this.http.post(`${url}/DeleteComponentsByTask`, data).pipe(
            map(res => {
                const materialTaskItems = res as any || {}
                return materialTaskItems;
            }));
    }

    upsertAssignAssetMaterial(items: IAssignAssetTaskGroupStrategyMaterialHsm[]): Observable<IAssignAssetTaskGroupStrategyMaterialHsm[]> {
        const url = `${this.controllerApi}/upserTaskToTGS`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as IAssignAssetTaskGroupStrategyMaterialHsm[] || [];
            }))
    }

    downloadFile(id: number): Observable<HttpEvent<Blob>> {

        return this.httpClient.request(new HttpRequest(
          'GET',
          `${this.controllerApi}/GetDataPRT/${id}`,
          {
            reportProgress: true,
            responseType: 'blob'
          }));
    }

    downloadHSMFile(id: number): Observable<HttpEvent<Blob>> {

        return this.httpClient.request(new HttpRequest(
          'GET',
          `${this.controllerApi}/GetHSMPRT/${id}`,
          {
            reportProgress: true,
            responseType: 'blob'
          }));
    }

    downloadHSM(id : number, hierarchy: number): Observable<any> {
        const url = `${this.controllerApi}`;
                
            return this.http.get(`${url}/GetHSMPRT/${id}/${hierarchy}`).pipe(
                map(res => {
                    const hsmFiles = res as any || {}
                    return hsmFiles;
                }));
    }

    getByteData(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/TestDb`).pipe(
            map(res => {
                const materialTaskItems = res as any || {}
                return materialTaskItems;
            }));
    }

    deleteFile(): Observable<any> {
        const url = `${this.controllerApi}`;

        return this.http.get(`${url}/DeleteFileJson`).pipe(
            map(res => {
                const prtDetails = res as any || {};
                return prtDetails;
            }));
    }

    getDataPRTById(id: number): Observable<any> {
        const url = `${this.controllerApi}/GetDataPRT`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const prtDetails = res as any || {};
                return prtDetails;
            }));
    }

    getDownloadPRT(): Observable<any> {
        const url = `${this.controllerApi}/DownloadPRT`;

        return this.http.get(`${url}`).pipe(
            map(res => {
                const prtDetails = res as any || {};
                return prtDetails;
            }));
    }

    deleteAssignTGS(id: number): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.delete(url).pipe(
            map(res =>
                res as any || {}
            ));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssignAssetTaskGroupStrategyMaterialHsmService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
