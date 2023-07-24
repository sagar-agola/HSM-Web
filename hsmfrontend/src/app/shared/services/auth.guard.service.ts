import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { PermissionManagerService } from './permission.manager.service';
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router, private userPermissionService: PermissionManagerService) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    var loggedUser = localStorage.getItem("loggedUser");
    var url = route.url[0].path;
    if (loggedUser === null) {
        this.router.navigate(['login']);
        return false;
    } else if(!this.canAccess(url.toString())) {
        this.router.navigate(['/401']);
    }
    return true;
  }
  canAccess(url: string): boolean {
      let access: boolean = false;
      let roleKey = this.stripModify(url);
      access = this.userPermissionService.isGranted(roleKey);
      return access;
  }
  stripModify(url: string): string {
    let retUrl = "";
    switch(url) {
        // case "referral":
        //   return "ListReferrals";
        // case "dashboard":
        //   return "ViewDashboard";
        // case "student":
        //   return "ListStudents";
        // case "campus":
        //   return "ListCampuses";
        // case "driver":
        //   return "ListDrivers";
        // case "conductstaff":
        //   return "ViewUsers";
        // case "setup":
        //   return "ViewSetupPage";
    }
    return retUrl;
  }
}