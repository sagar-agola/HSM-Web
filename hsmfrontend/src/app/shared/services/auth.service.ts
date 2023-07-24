
import {throwError as observableThrowError,  BehaviorSubject, ObservableInput ,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import 'rxjs';
// import { IUser } from './../interfaces/IUser';
// import { IISDStaff, IUserData } from '../interfaces/IISDStaff';
import { HttpClientExt } from "./httpclient.services";
import { AppSettings } from './../app.settings';
import { HttpErrorResponse } from '@angular/common/http';
import { IUserData, IUserDataInfo, IUsers } from 'src/app/hsm/interfaces/IUsers';
// import { ISDTypeEnum } from '../../scm/enum/ISDTypeEnums';

@Injectable()
export class AuthService{
    private currentUserSubject: BehaviorSubject<IUserDataInfo>;
    public currentUser: Observable<IUserDataInfo>;

    private authServiceUrl = `${AppSettings.SITE_HOST}/api/Users/authUsers/`;

    constructor(
        private router: Router,
        private http: HttpClientExt
    ) { 
        this.currentUserSubject = new BehaviorSubject<IUserDataInfo>(JSON.parse(localStorage.getItem("loggedUser")));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    login(user: IUserDataInfo): Observable<IUserDataInfo | any> {
        return this.http.post(this.authServiceUrl, user)
            .pipe(
                map(user => {
                    const data = user as IUserDataInfo;
                    // console.log(data)

                    localStorage.setItem("loggedUser", JSON.stringify(data));

                    this.currentUserSubject.next(data);
                    this.http.setAccessToken(data.token);
                    return data;
                })
            )
    }

    // login(user: IUser): Observable<IUserData | any> {
    //     return this.http.post(this.authServiceUrl, user)
    //         .pipe(
    //             map(user => {
    //                 // this.loggedIn.next(true);
    //                 const data = user as IUserData;

    //                 if(data && data.Token) {
    //                     let userdata: any= null;

    //                     if(data.ISDStaff !== null) {
    //                         userdata = data.ISDStaff;
    //                         userdata.Permission = data.Permissions;
    //                     }
    //                     else if(data.Driver !== null) {
    //                         userdata = data.Driver;
    //                         userdata.Permission = null
    //                     }

    //                     userdata.RedirectUrl = data.RedirectUrl;
    //                     userdata.UserType = data.UserType
    //                     userdata.IsTopLevelAdmin = data.IsTopLevelAdmin

    //                     localStorage.setItem("loggedUser", JSON.stringify(userdata));

    //                     this.currentUserSubject.next(data);
    //                     this.http.setAccessToken(data.Token);
    //                 }
    //                 return data;
    //             })
    //         );
    // }

    // quickLogin(token: string): Observable<IUserData> {
    //     var eztoken = encodeURIComponent(token);
    //     return this.http.get(`${AppSettings.SITE_HOST}/api/ISD/quicklogin/?token=${eztoken}`)
    //         .pipe(
    //             map(res => {
    //                 const data = res as IUserData;
    //                 if(data && data.Token) {
    //                     let userdata: any = null;
    //                     userdata = data.Driver;
    //                     userdata.Permission = null
    //                     userdata.RedirectUrl = data.RedirectUrl;
    //                     userdata.UserType = data.UserType

    //                     localStorage.setItem("loggedUser", JSON.stringify(userdata));

    //                     this.currentUserSubject.next(data);
    //                     this.http.setAccessToken(data.Token);
    //                 }
    //                 return data;
    //             })
    //         );
    // }

    // quickCreate(token: string): Observable<any> {
    //     var eztoken = encodeURIComponent(token);
    //     return this.http.get(`${AppSettings.SITE_HOST}/api/ISD/shortcut/?token=${eztoken}`)
    //         .pipe(
    //             map(res => {
    //                 const data = res as any;
    //                 return data;
    //             })
    //         );
    // }

    // public get currentUserValue(): IUserData {
    //     return this.currentUserSubject.value;
    // }

    // hasAccess(userData: IUserData, moduleId: number): boolean {

    //     if(userData.ISDStaff.ISDId === ISDTypeEnum.SuperAdmin) {
    //         return true
    //     }

    //     if(userData.ISDStaff.ISDId === ISDTypeEnum.BusSupervisor){
    //         return true
    //     }
        
    //     userData.Permissions.forEach(p => {
    //         if(p.RoleFeaturesId === moduleId && p.IsActive === true) return true;
    //     })

    //     return false
    // }

    // private handleErrorObservable(error: HttpErrorResponse) {
    //     return observableThrowError(error.message || error);
    // }

    // logout() {
    //     this.currentUserSubject.next(null);
    //     this.router.navigate(['/login']);
    // }
}
