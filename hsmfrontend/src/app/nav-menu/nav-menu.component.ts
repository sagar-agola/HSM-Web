import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import { routerTransition } from './../shared/router.animation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/compiler/src/core';
import { ToastrService } from 'ngx-toastr';

//modal
import { ResetCacheModalComponent } from './../hsm/modal/resetcachemodal/resetcachemodal.component';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestModal } from '../hsm/modal/requestmodal/requestmodal.component';
import { HttpClientExt } from '../shared/services/httpclient.services';
import { AppSettings } from '../shared/app.settings';
import { PermissionManagerService } from '../shared/services/permission.manager.service';

declare const preloadImage: any;

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss'],
    animations: [routerTransition()],
    host: {
        '(document:click)': 'onClickDocument($event)',
    },
})

export class NavMenuComponent implements OnInit {
    private controllerApi = `${AppSettings.SITE_HOST}/api/`;
    @ViewChild('userMenu') public userMenu: ElementRef;
    @ViewChild('hsmMenu') public hsmMenu: ElementRef;
    @ViewChild('strategyMenu') public strategyMenu: ElementRef;
    @ViewChild('eamMenu') public eamMenu: ElementRef;
    @ViewChild('toolsMenu') public toolsMenu: ElementRef;
    @ViewChild('adminMenu') public adminMenu: ElementRef;
    @ViewChild('allMenu') public allMenu: ElementRef;
    @ViewChild('reportMenu') public reportMenu: ElementRef;
    @ViewChild('fileInput') fileInput;

    navMenuModel: any = [];

    user: string="";
    tempId: number = 0;
    userId: number;

    menuModel = [
        {
          title: 'Dashboard',
          routerUrl: '/main/dashboard',
        },
        {
          title: 'Test icon',
          routerUrl: '/main/home',
        },
        {
          title: 'Test icon',
          routerUrl: '/main/home',
        },
        {
          title: 'Test icon',
          routerUrl: '/main/home',
        },
        {
          title: 'Test icon',
          routerUrl: '/main/home',
        },
        {
          title: 'Test icon',
          routerUrl: '/main/home',
        },
        {
          title: 'Test icon',
          routerUrl: '/main/home',
        },
        {
          title: 'Test icon',
          routerUrl: '/main/home',
        },
        {
          title: 'Test icon',
          routerUrl: '/main/home',
        },
      ];

    displayUserMenu: boolean = false;
    displayNavMenu: boolean = false;
    displaySubNavMenu: boolean = false;
    displaySubNavMenu2:boolean = false;
    displaySubNavMenu3:boolean = false;
    displaySubNavMenu4:boolean = false;
    displaySubNavMenu5:boolean = false;
    displaySubNavMenu6:boolean = false;
    displayAllAppMenu: boolean = false;

    isMax: boolean = true;
    isMin: boolean = false;
    isMobile: boolean = false;
    isHidden: boolean = true;

    isAdmin: boolean = false;
    myDate: Date = new Date();

    loading: boolean = false;

    isHSMUser: boolean = false;

    constructor(
      public dialog: MatDialog,
      private router: Router,
      private _eref: ElementRef,
      private toastr: ToastrService,
      private http: HttpClientExt,
      private permissionService: PermissionManagerService
      ) { 
        const user = JSON.parse(localStorage.currentUser);
        this.isHSMUser = user?.users?.group?.isCoreUser ? true : false;
        console.log(user);
        this.isAdmin = user?.users?.isAdmin;
      }

    canAccess(roleKey: string): boolean {
        let access: boolean = false;
        access = this.permissionService.isGranted(roleKey);
        return access;
    }

    getState(outlet) {
        return this.router.url;
      }
    
    ngOnInit(): void { 
      this.user = localStorage.getItem("loggUser");
      var userId = +localStorage.getItem("loggUserId");
      let loggedUserData = JSON.parse(localStorage.loggedUser);
      // this.userId = Number(this.tempId)
      this.userId = userId;
      // console.log(loggedUserData);
      
    }

    openRequestModal() {
      if(this.canAccess('RequestUser')) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "600px";
        dialogConfig.height = "auto";
        dialogConfig.position = { top: '30px' };
        const dialogRef = this.dialog.open(RequestModal, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
          // console.log(res);
        });
      }else {
        this.toastr.warning('You do not have permission to perform this action.', '');
      }
    }

    public uploadFile = (files) => {
      this.loading = true;
      if (files.length === 0) {
          return;
      }

      let fileToUpload = <File>files[0];
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);

      this.http.post(this.controllerApi, formData)
          .subscribe(res => {
              this.loading = false;
              this.toastr.success('FMEA Upload File successfully uploaded', 'Success!');
          });
    }

    onLogOut(){
      this.router.navigate(["/login"]);
      localStorage.removeItem("loggUser");
      localStorage.removeItem("loggUserId");
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
      localStorage.removeItem("loggedUserData");
      localStorage.removeItem("modalcomponentList");
      localStorage.removeItem("modaltaskList");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
      // localStorage.removeItem("hierarchyData");
    }

    clearCache(){
      localStorage.removeItem("hierarchyData");
      localStorage.removeItem("assethierarchyData");
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
      localStorage.removeItem("loggedUserData");
      this.toastr.success("Successfully clear cache!", 'Success');
      this.onLogOut();
    }

    gotoUserProfile(){
      this.router.navigate(["/main/user-profile", this.userId]);
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
    }

    gotoAssetHierarchy(){
      this.router.navigate(["/main/asset-hierarchy"]);
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoAssetCriticality(){
      this.router.navigate(["/main/asset-criticality"]);
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoAssetStrategy(){
      this.router.navigate(["/main/asset-strategy"]);
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoEAM(){
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      this.router.navigate(["/main/eam-maintenance"]);
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoEAMCreate(){
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      this.router.navigate(["/main/create-eamplan"]);
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoFMEA(){
      this.router.navigate(["/main/fmea"]);
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoAssetTaskGP(){
      this.router.navigate(["/main/asset-task-group-strategy"]);
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      localStorage.removeItem("source");
      localStorage.removeItem("componentname");
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoCreateAssetTaskGP(){
      this.router.navigate(["/main/asset-task-group-form"]);
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      localStorage.removeItem("source");
      localStorage.removeItem("componentname");
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoAssignAssetStrategyGP(){
      this.router.navigate(["/main/assign-asset-strategygroup"]);
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoDashboard(){
      this.router.navigate(["/main/dashboard"]);
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoSetupTaxonomy(){
      this.router.navigate(["/main/setup-taxonomy"]);
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoSetup(){
      this.router.navigate(["/main/setup-page"]);
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoImport(){
      this.router.navigate(["/main/import-page"]);
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoWorkInstructionList(){
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      this.router.navigate(["/main/work-instruction-list"]);
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoPublishWorkInstruction(){
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      this.router.navigate(["/main/publish-work-instruction"]);
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoPublishEAMData(){
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      this.router.navigate(["/main/publish-eam-masterdata"]);
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoAssignTaxonomy(){
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      this.router.navigate(["/main/assign-taxonomy"]);
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoAssignComponentTaxonomy(){
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      this.router.navigate(["/main/assign-component-taxonomy"]);
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    gotoEAMPlanRouteManagement(){
      this.displaySubNavMenu = false;
      this.displaySubNavMenu2 = false;
      this.displaySubNavMenu3 = false;
      this.displaySubNavMenu4 = false;
      this.displaySubNavMenu5 = false;
      this.displaySubNavMenu6 = false;
      this.displayAllAppMenu = false;
      this.router.navigate(["/main/eamplan-route-management"]);
      localStorage.removeItem("fmeataskadded");
      localStorage.removeItem("fmeataskfinalsequence");
      localStorage.removeItem("containers");
      localStorage.removeItem("addedtasks");
      localStorage.removeItem("containersTask");
    }

    onClickMin(){
        this.isMax = false;
        this.isMobile = true;
        this.isHidden = false;
    }

    onClickMax(){
        this.isMax = true;
        this.isMobile = false;
        this.isHidden = true;
    }

    toggleUserMenu() {
      if (this.displayUserMenu)
        this.displayUserMenu = false;
      else
        this.displayUserMenu = true;
    }

    untoggleUserMenu(){
      this.displayUserMenu = false;
    }

    toggleSubNavMenu() {
      if(this.displaySubNavMenu)
      {
        this.displaySubNavMenu = false;
        this.displaySubNavMenu2 = false;
        this.displaySubNavMenu3 = false;
        this.displaySubNavMenu4 = false;
        this.displaySubNavMenu5 = false;
        this.displaySubNavMenu6 = false;
        this.displayAllAppMenu = false;
      }
      else{this.displaySubNavMenu = true;}
        
    }

    untoggleSubNavMenu() {
      this.displaySubNavMenu = false;
    }

    toggleSubNavMenu2() {
      if(this.displaySubNavMenu2){
        this.displaySubNavMenu2 = false;
        this.displaySubNavMenu = false;
        this.displaySubNavMenu3 = false;
        this.displaySubNavMenu4 = false;
        this.displaySubNavMenu5 = false;
        this.displaySubNavMenu6 = false;
        this.displayAllAppMenu = false;
      }else{
        this.displaySubNavMenu2 = true;
      }
      
    }

    untoggleSubNavMenu2() {
      this.displaySubNavMenu2 = false;
    }

    toggleSubNavMenu3() {
      if(this.displaySubNavMenu3){
        this.displaySubNavMenu3 = false;
        this.displaySubNavMenu2 = false;
        this.displaySubNavMenu = false;
        this.displaySubNavMenu4 = false;
        this.displaySubNavMenu5 = false;
        this.displaySubNavMenu6 = false;
        this.displayAllAppMenu = false;
      }else{
        this.displaySubNavMenu3 = true;
      }
    }

    untoggleSubNavMenu3() {
      this.displaySubNavMenu3 = false;
    }

    toggleSubNavMenu4() {
      if(this.displaySubNavMenu4){
        this.displaySubNavMenu4 = false;
        this.displaySubNavMenu2 = false;
        this.displaySubNavMenu3 = false;
        this.displaySubNavMenu = false;
        this.displaySubNavMenu5 = false;
        this.displaySubNavMenu6 = false;
        this.displayAllAppMenu = false;
      }else{
        this.displaySubNavMenu4 = true
      }
    }

    untoggleSubNavMenu4() {
      this.displaySubNavMenu4 = false;
    }

    toggleSubNavMenu5() {
      if(this.displaySubNavMenu5){
        this.displaySubNavMenu5 = false;
        this.displaySubNavMenu2 = false;
        this.displaySubNavMenu3 = false;
        this.displaySubNavMenu4 = false;
        this.displaySubNavMenu6 = false;
        this.displaySubNavMenu = false;
        this.displayAllAppMenu = false;
      }else{
        this.displaySubNavMenu5 = true;
      }
    }

    untoggleSubNavMenu5() {
      this.displaySubNavMenu5 = false;
    }

    toggleSubNavMenu6() {
      if(this.displaySubNavMenu6){
        this.displaySubNavMenu6 = false;
        this.displaySubNavMenu5 = false;
        this.displaySubNavMenu2 = false;
        this.displaySubNavMenu3 = false;
        this.displaySubNavMenu4 = false;
        this.displaySubNavMenu = false;
        this.displayAllAppMenu = false;
      }else{
        this.displaySubNavMenu6 = true;
      }
    }

    untoggleSubNavMenu6() {
      this.displaySubNavMenu6 = false;
    }

    toggleSubAllNavMenu() {
      if(this.displayAllAppMenu){
        this.displayAllAppMenu = false;
        this.displaySubNavMenu5 = false;
        this.displaySubNavMenu2 = false;
        this.displaySubNavMenu3 = false;
        this.displaySubNavMenu4 = false;
        this.displaySubNavMenu6 = false;
        this.displaySubNavMenu = false;
      }else{
        this.displayAllAppMenu = true;
      }
    }

    untoggleSubAllNavMenu() {
      this.displayAllAppMenu = false;
    }

    // this function checks to see if the user menu is open. if it is, see if the click was on the user menu or somewhere else. close if user clicked outside of menu
    onClickDocument(event) {
        if (this.displayUserMenu) {
          if (!this.userMenu.nativeElement.contains(event.target)) // or some similar check
            this.toggleUserMenu();
        }

        if(this.displaySubNavMenu){
          if(!this.hsmMenu.nativeElement.contains(event.target))
            this.toggleSubNavMenu();
        }

        if(this.displaySubNavMenu2){
          if(!this.strategyMenu.nativeElement.contains(event.target))
            this.toggleSubNavMenu2();
        }

        if(this.displaySubNavMenu3){
          if(!this.eamMenu.nativeElement.contains(event.target))
            this.toggleSubNavMenu3();
        }

        if(this.displaySubNavMenu4){
          if(!this.toolsMenu.nativeElement.contains(event.target))
            this.toggleSubNavMenu4();
        }

        if(this.displaySubNavMenu5){
          if(!this.adminMenu.nativeElement.contains(event.target))
            this.toggleSubNavMenu5();
        }

        if(this.displaySubNavMenu6){
          if(!this.reportMenu.nativeElement.contains(event.target))
            this.toggleSubNavMenu6();
        }

        if(this.displayAllAppMenu){
          if(!this.allMenu.nativeElement.contains(event.target))
            this.toggleSubAllNavMenu();
        }
    }

    openDialog() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "500px";
      dialogConfig.height = "auto";
      dialogConfig.position = { top: '30px' };
      const dialogRef = this.dialog.open(ResetCacheModalComponent, dialogConfig);
    }
}



