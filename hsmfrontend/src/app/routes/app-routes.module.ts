import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

// Routes model for application. Some of the pages are loaded lazily to increase startup time.
const APP_ROUTES: Routes = [
  {
    // path: 'main', component: NavMenuComponent, children: [
    //   {path: 'dashboard', component: DashboardComponent}
    //   {path: 'referraltransaction/:id/:action', component: ReferralTransactionFormComponent},
    //   {path: 'referraltransaction/q/:startDate/:endDate', component: ReferralTransactionComponent},
    // ]
  },
//   {path: 'login', component: LoginFormComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' }),
  ],
  exports: [RouterModule]
})
export class AppRoutesModule {
}
