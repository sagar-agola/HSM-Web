import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    template: ''
})

export class RedirectComponent implements OnInit {
    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
    ) { }

    redirectUrl: string;

    ngOnInit(): void {

        // this._route.queryParams.subscribe(params => {
        //     if(params.hasOwnProperty('returnUrl')) this.redirectUrl = params['returnUrl'];
        // })

        this._router.navigateByUrl('/login');
        // if (localStorage.getItem("loggedUser") !== null) {
        //     let data = JSON.parse(localStorage.loggedUser);
        //     if (data) {
        //         this._router.navigateByUrl('/main/dashboard');
        //     }
        //     else {
        //         this._router.navigateByUrl('/login/staff');
        //     }
        // }
        
        // else {
        //     var navigateTo = (this.redirectUrl === undefined) ? `/login/staff` : `/login/staff?redirectUrl=${this.redirectUrl}`;
        //     this._router.navigateByUrl(navigateTo);
        // }
    }
}
