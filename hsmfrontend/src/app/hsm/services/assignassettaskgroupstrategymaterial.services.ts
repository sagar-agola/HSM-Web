
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IAssignAssetTaskGroupStrategyMaterial } from '../interfaces/IAssetTaskGroupStrategy';


@Injectable()
export class AssignAssetTaskGroupStrategyMaterialService {
    private controllerApi = `${AppSettings.SITE_HOST}/api/AssignAssetTaskGroupStrategyMaterials`;

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

    getProcessImageMaterialById(id: number): Observable<any> {
        const url = `${this.controllerApi}/byMaterialId`;

        return this.http.get(`${url}/${id}`).pipe(
            map(res => {
                const imageDetails = res as any || {};
                return imageDetails;
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

    getTasksEquipmentbyBatch(batchid: number, hierarchyid: number, familyid: number, classid: number, subclassid: number): Observable<any> {
        const url = `${this.controllerApi}/GetTasksEquipmentbyBatch`;
        var data = {
            "TaskId": batchid,
            "HierarchyId": hierarchyid,
            "FamilyId": familyid,
            "ClassId": classid,
            "SubClassId": subclassid
        }

        return this.http.post(`${url}`, data).pipe(
            map(res => {
                const taskDetails = res as any || {};
                return taskDetails;
            }));
    }

    getTaskEquipmentComponents(fmeaid:number, taskid:number): Observable<any[]> {
        const url = `${this.controllerApi}`;

        var data = {
            "FmeaId": fmeaid,
            "TaskId": taskid,
        }

        return this.http.post(`${url}/MapComponentTaskEquipment`, data).pipe(
            map(res => {
                // return res.json().data;
                const componentTaskDetails = res as any[] || [];
                return componentTaskDetails;
            }));
    }

    addAssignAssetTaskGroupStrategyMaterial(specObject: IAssignAssetTaskGroupStrategyMaterial): Observable<IAssignAssetTaskGroupStrategyMaterial>{
        return this.http.post(this.controllerApi, specObject).pipe(
            map(res => {
                return res as IAssignAssetTaskGroupStrategyMaterial
            }));
    }

    updateAssignAssetTaskGroupStrategyMaterial(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as IAssignAssetTaskGroupStrategyMaterial
            ));
    }

    deleteImageMaterialById(id: number, data: any): Observable<any> {
        const url = `${this.controllerApi}/DeleteFileImage/${id}`;

        return this.http.put(url, data).pipe(
            map(res =>
                res as any || {}
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

    upsertAssignAssetMaterial(items: IAssignAssetTaskGroupStrategyMaterial[]): Observable<IAssignAssetTaskGroupStrategyMaterial[]> {
        const url = `${this.controllerApi}/upsertHierarchytoTask`;

        return this.http.post(`${url}`, items).pipe(
            map(res => {
                return res as IAssignAssetTaskGroupStrategyMaterial[] || [];
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

    testDownloadFile(): Observable<any> {
        const url = `${this.controllerApi}`;
        
            return this.http.get(`${url}/TestDownload`).pipe(
                map(res => {
                    const materialTaskItems = res as any || {}
                    return materialTaskItems;
                }));
    }

    getWINdata(id: number): Observable<any> {
        const url = `${this.controllerApi}`;
        
            return this.http.get(`${url}/GetWINData/${id}`).pipe(
                map(res => {
                    const materialTaskItems = res as any || {}
                    return materialTaskItems;
                }));
    }

    getGenerateWINdata(id: number): Observable<any> {
        const url = `${this.controllerApi}`;
        
            return this.http.get(`${url}/GenerateWIN/${id}`).pipe(
                map(res => {
                    const materialTaskItems = res as any || {}
                    return materialTaskItems;
                }));
    }

    downloadHSM(id : number): Observable<any> {
        const url = `${this.controllerApi}`;
                
            return this.http.get(`${url}/GetHSMPRT/${id}`).pipe(
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

        // return this.httpClient.request(new HttpRequest(
        //     'POST',
        //     `${this.controllerApi}/DownloadPRT`,
        //     data,
        //     {
        //       reportProgress: true,
        //     }));
    }

    updateSequenceMaterial(seqNum:number, tgsid:number): Observable<any[]> {
        const url = `${this.controllerApi}`;

        var data = {
            "TaskId": seqNum,
            "HierarchyId": tgsid,
        }

        return this.http.post(`${url}/UpdateSequenceMaterial`, data).pipe(
            map(res => {
                // return res.json().data;
                const componentTaskDetails = res as any[] || [];
                return componentTaskDetails;
            }));
    }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(`AssignAssetTaskGroupStrategyMaterialService: ${error}`);
        return observableThrowError(error.message || error);
    }

}
