import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SitesService } from '../services/sites.services';

@Component({
    selector: "login-form",
    templateUrl: './login.component.html',
    styleUrls: [
        './login.component.scss'
    ]
})

export class LoginFormComponent implements OnInit{

    idText: string = "Username";
    pwText: string = "Password"
    username: string ="";
    password: string ="";
    type: string = "";
    loading: boolean = false;

    form: FormGroup;
    private formSubmitAttempt: boolean;
    error: string = "";
    fullname: string = "";
    userId: number;
    invalid: boolean = false;
    isInvalid: boolean = false;
    submitted: boolean = false;

    siteList: any[] = [];
    siteId: number = 0;

    redirectUrl: string;

    constructor(
        private fb: FormBuilder,
        public toastr: ToastrService,
        private router: Router,
        private _route: ActivatedRoute,
        private authService: AuthService,
        private siteService: SitesService,
    ) { 
        
    }

    ngOnInit(): void {

        this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            type: [this.type]
        });
    }

    siteOnselect(event){
        console.log(event.target.value)
        this.siteId = parseInt(event.target.value);
    }

    get f() { return this.form.controls; }

    isFieldInvalid(field: string) {
        return (
            (!this.form.get(field).valid && this.form.get(field).touched) ||
            (this.form.get(field).untouched && this.formSubmitAttempt)
        );
    }

    onKeydown(event) {
        this.onLogin();
    }

    onLogin(){
        this.submitted = true;

        if(this.form.invalid) return;

        this.loading = true;
        if (this.form.valid) {
            this.authService.login(this.form.value).subscribe(
                res => {
                // console.log(res.users["firstName"])
                let loggedUserData = JSON.parse(localStorage.loggedUser);

                let hasPermission = (loggedUserData.Permission === undefined || loggedUserData.Permission === null) ? false: true;

                // console.log(loggedUserData.users)

                this.fullname = res.users["firstName"] + ' ' + res.users["lastName"];
                this.userId = res.users["id"];

                let customerId = res?.users?.customerId || 0;

                localStorage.setItem("currentUser", JSON.stringify(res));
                localStorage.setItem("customerId", customerId)
                localStorage.setItem("loggUser", this.fullname);
                localStorage.setItem("loggUserId", this.userId.toString());
                this.router.navigate([res.redirectUrl]);
                this.loading = false;
                }, error => {
                    this.error = "Username or Password is incorrect";
                    this.invalid = true;
                    this.loading = false;
                });
        }
        this.formSubmitAttempt = true;
    }
}