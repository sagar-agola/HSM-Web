import { Injectable } from '@angular/core';

@Injectable()
export class PermissionManagerService {

    constructor() { }

    isGranted(permission: string) {
        var loggedUserData = JSON.parse(localStorage.loggedUser);

        const permissions = loggedUserData.permissions || [];

        let isAdmin: boolean = false;

        let permissionGranted: boolean = false;

        // If user is not an admin, check every permission availabe
        permissions.forEach(p => {
            if(p.roleFeatures.roleNameKey === permission) permissionGranted = true
        })
        
        return permissionGranted;
    }
}