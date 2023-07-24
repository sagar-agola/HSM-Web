import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
    providedIn: 'root'
})
export class MainAuthGuardService implements CanActivate {

    constructor(public auth: AuthService, public router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // const currentUser = this.auth.currentUserValue;
        // if (currentUser) {
        //     // check if route is restricted by role
        //     if (route.data.roles && route.data.roles.indexOf(currentUser.UserType) === -1) {
        //         // not authorized, redirect to previous url (opposite of staff)
        //         this.router.navigate(['/driver-main']);
        //         return false;
        //     }
        //     // Can access to current route
        //     return true;
        // }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}