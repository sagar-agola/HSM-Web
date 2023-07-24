
import { throwError as observableThrowError, Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClientExt } from "../../shared/services/httpclient.services";
import { AppSettings } from '../../shared/app.settings';
import { IDuration } from '../interfaces/IDuration';



@Injectable()
export class AssetHierarchyService {
  private controllerApi = `${AppSettings.SITE_HOST}/api/AssetHierarchies`;

  constructor(private http: HttpClientExt) { }

  getAssetHierarchyDataTable(floc: string): Observable<any> {
    const url = `${this.controllerApi}`;
    var data = {
      "FLOC": floc
    }

    return this.http.post(`${url}/GetAssetHierarchyDataTableList`, data).pipe(
      map(res => {
        const assetHierarchyDataTable = res as any || {};
        return assetHierarchyDataTable;
      }));
  }

  getAssetHierarchyDescDataTable(flocdesc: string): Observable<any> {
    const url = `${this.controllerApi}`;
    var data = {
      "Query": flocdesc
    }

    return this.http.post(`${url}/GetAssetHierarchyDescTableData`, data).pipe(
      map(res => {
        const assetHierarchyDescDataTable = res as any || {};
        return assetHierarchyDescDataTable;
      }));
  }
  getAssetHierarchyNoFilter(floc: string, flocdesc: string, pmdesc: string): Observable<any> {
    const url = `${this.controllerApi}`;
    var data = {
      "Floc": floc,
      "FlocDesc": flocdesc,
      "PMDesc": pmdesc
    }

    return this.http.post(`${url}/GetAssetHierarchyNoFilter`, data).pipe(
      map(res => {
        const assetHierarchyFilterDataLists = res as any || {};
        return assetHierarchyFilterDataLists;
      }));
  }

  getAssetHierarchyMultiFilter(floc: string, flocdesc: string, pmdesc: string): Observable<any> {
    const url = `${this.controllerApi}`;
    var data = {
      "Floc": floc,
      "FlocDesc": flocdesc,
      "PMDesc": pmdesc
    }

    return this.http.post(`${url}/GetAssetHierarchyMultiFilter`, data).pipe(
      map(res => {
        const assetHierarchyDataLists = res as any || {};
        return assetHierarchyDataLists;
      }));
  }

  getAssetHierarchyMultiFilterIndic(floc: string, flocdesc: string, pmdesc: string, a: string, b: string, c: string, d: string, e: string, f: string, g: string, crtdStatus: string, crtdInacStatus: string): Observable<any> {
    const url = `${this.controllerApi}`;
    var data = {
      "Floc": floc,
      "FlocDesc": flocdesc,
      "PMDesc": pmdesc,
      "A": a,
      "B": b,
      "C": c,
      "D": d,
      "E": e,
      "F": f,
      "G": g,
      "CrtdStatus": crtdStatus,
      "CrtdInacStatus": crtdInacStatus,
    }

    return this.http.post(`${url}/GetAssetHierarchyMultiFilterIndic`, data).pipe(
      map(res => {
        const assetHierarchyDataFilterLists = res as any || {};
        return assetHierarchyDataFilterLists;
      }));
  }

  getAssetHierarchyMultiFilterIndicUndefined(floc: string, flocdesc: string, pmdesc: string, a: string, b: string, c: string, d: string, e: string, f: string, g: string): Observable<any> {
    const url = `${this.controllerApi}`;
    var data = {
      "Floc": floc,
      "FlocDesc": flocdesc,
      "PMDesc": pmdesc,
      "A": a,
      "B": b,
      "C": c,
      "D": d,
      "E": e,
      "F": f,
      "G": g
    }

    return this.http.post(`${url}/GetAssetHierarchyMultiFilterIndicUndefined`, data).pipe(
      map(res => {
        const assetHierarchyDataIndicFilterLists = res as any || {};
        return assetHierarchyDataIndicFilterLists;
      }));
  }

  getAssetHierarchyIndicSystemStatus(floc: string, flocdesc: string, pmdesc: string, a: string, b: string, c: string, d: string, e: string, f: string, g: string, crtdStatus: string, crtdInacStatus: string): Observable<any> {
    const url = `${this.controllerApi}`;
    var data = {
      "Floc": floc,
      "FlocDesc": flocdesc,
      "PMDesc": pmdesc,
      "A": a,
      "B": b,
      "C": c,
      "D": d,
      "E": e,
      "F": f,
      "G": g,
      "CrtdStatus": crtdStatus,
      "CrtdInacStatus": crtdInacStatus
    }

    return this.http.post(`${url}/GetAssetHierarchyIndicSystemStatus`, data).pipe(
      map(res => {
        const assetHierarchyDataFilterLists = res as any || {};
        return assetHierarchyDataFilterLists;
      }));
  }

  GetAssetHierarchySystemStatus(floc: string, flocdesc: string, pmdesc: string, crtdStatus: string, crtdInacStatus: string): Observable<any> {
    const url = `${this.controllerApi}`;
    var data = { 
      "Floc": floc,
      "FlocDesc": flocdesc,
      "PMDesc": pmdesc,
      "CrtdStatus": crtdStatus,
      "CrtdInacStatus": crtdInacStatus
    }

    return this.http.post(`${url}/GetAssetHierarchySystemStatus`, data).pipe(
      map(res => {
        const assetHierarchySystemStatus = res as any || {};
        return assetHierarchySystemStatus;
      }));
  }

  GetAssetHierarchyBlankStatus(floc: string, flocdesc: string, pmdesc: string, crtdStatus: string, crtdInacStatus: string): Observable<any> {
    const url = `${this.controllerApi}`;
    var data = { 
      "Floc": floc,
      "FlocDesc": flocdesc,
      "PMDesc": pmdesc,
      "CrtdStatus": crtdStatus,
      "CrtdInacStatus": crtdInacStatus
    }

    return this.http.post(`${url}/GetAssetHierarchyBlankStatus`, data).pipe(
      map(res => {
        const assetHierarchySystemStatus = res as any || {};
        return assetHierarchySystemStatus;
      }));
  }

  getAssetHierarchyMultifilterIndicStatus(floc: string, flocdesc: string, pmdesc: string, a: string, b: string, c: string, d: string, e: string, f: string, g: string, crtdStatus: string, crtdInacStatus: string): Observable<any> {
    const url = `${this.controllerApi}`;
    var data = {
      "Floc": floc,
      "FlocDesc": flocdesc,
      "PMDesc": pmdesc,
      "A": a,
      "B": b,
      "C": c,
      "D": d,
      "E": e,
      "F": f,
      "G": g,
      "CrtdStatus": crtdStatus,
      "CrtdInacStatus": crtdInacStatus
    }

    return this.http.post(`${url}/GetAssetHierarchyMultifilterIndicStatus`, data).pipe(
      map(res => {
        const assetHierarchyDataFilterLists = res as any || {};
        return assetHierarchyDataFilterLists;
      }));
  }

  GetAssetHierarchySystemStatusInCRTD(crtdStatus: string, crtdStatusInac: string): Observable<any> {
    const url = `${this.controllerApi}`;
    var data = { 
      "CrtdStatus": crtdStatus,
      "CrtdInacStatus": crtdStatusInac
    }

    return this.http.post(`${url}/GetAssetHierarchySystemStatusAcInac`, data).pipe(
      map(res => {
        const assetHierarchySystemStatus = res as any || {};
        return assetHierarchySystemStatus;
      }));
  }

  getAssetHierarchyDataTaxonomy(code: string): Observable<any> {
    const url = `${this.controllerApi}`;
    var data = {
      "Query": code
    }

    return this.http.post(`${url}/GetAssetHierarchyDataTaxonomy`, data).pipe(
      map(res => {
        const assetHierarchyDataTaxonomy = res as any || {};
        return assetHierarchyDataTaxonomy;
      }));
  }

  private handleErrorObservable(error: HttpErrorResponse | any) {
    console.error(`AssetHierarchyService: ${error}`);
    return observableThrowError(error.message || error);
  }

}
