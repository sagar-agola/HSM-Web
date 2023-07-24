import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

//SCM COMPONENTS
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { DashboardComponent } from './hsm/dashboard/dashboard.component';
import { StrategyComponent } from './hsm/strategy/strategy.component';
import { AssetHierarchyComponent } from './hsm/assethierarchy/assethierarchy.component';
import { AssetCriticalityComponent } from './hsm/assetcriticality/assetcriticality.component';
import { AssetStrategyComponent } from './hsm/assetstrategy/assetstrategy.component';
import { EAMComponent } from './hsm/eam/eam.component';
import { FMEAComponent } from './hsm/fmea/fmea.component';
import { FMEAFormComponent } from './hsm/fmea/fmea-form/fmea-form.component';
import { ComponentTaskGroupComponent } from './hsm/componenttaskgroup/componenttaskgroup.component';
import { AssetTaskGroupStrategyComponent } from './hsm/assettaskgroupstrategy/assettaskgroupstrategy.component';
import { AssetTaskGroupFormComponent } from './hsm/assettaskgroupstrategy/assettaskgroupform/assettaskgroupform.component';
import { AssetTaskGroupEditComponent } from './hsm/assettaskgroupstrategy/assettaskgroupedit/assettaskgroupedit.component';
import { AssignAssetStrategyGroupComponent } from './hsm/assignassetstrategygroup/assignassetstrategygroup.component';
import { FMEAEditComponent } from './hsm/fmea/fmea-edit/fmea-edit.component';
import { LoginFormComponent } from './hsm/login/login.component';
import { SetupComponent } from './hsm/setup/setup.component';
import { ImportComponent } from './hsm/import/import.component';
import { AssetHierarchyImportFormComponent } from './hsm/import/assethierarchyimport/assethierarchyimportform/assethierarchyimportform.component';
import { ComponentHierarchyImportFormComponent } from './hsm/import/componenthierarchyimport/componenthierarchyimportform/componenthierarchyimportform.component';
import { EAMPlanImportFormComponent } from './hsm/import/eamplanimport/eamplanimportform/eamplanimportform.component';
import { EamDetailsComponent } from './hsm/eam/eam-details/eam-details.component';
import { EAMCreateFormComponent } from './hsm/eam/eam-create/eam-create.component';
import { PublishWorkInstructionComponent } from './hsm/reports/publish-work-instruction/publish-work-instruction.component';
import { PublishEAMDataComponent } from './hsm/reports/publish-eam-masterdata/publish-eam-masterdata.component';
import { WorkInstructionListComponent } from './hsm/reports/work-instruction/work-instruction.component';
import { AssignTaxonomyComponent } from './hsm/assigntaxonomy/assigntaxonomy.component';
import { EAMPlanRouteManagementComponent } from './hsm/eam/eamplan-routemanagement/eamplan-routemanagement.component';
import { SetupTaxonomyComponent } from './hsm/setuptaxonomy/setuptaxonomy.component';
import { AssignComponentTaxonomyComponent } from './hsm/assigncomponenttaxonomy/assigncomponenttaxonomy.component';
import { UsersComponent } from './hsm/users/users.component';
import { UserRolesComponent } from './hsm/users/user-roles/user-roles.component';
import { UsersGroupComponent } from './hsm/users/users-group/users-group.component';
import { ComponentTaskListComponent } from './hsm/component-task-list/component-task-list.component';
import { AssetTaskGroupStrategyHsmComponent } from './hsm/assettaskgroupstrategyhsm/assettaskgroupstrategyhsm.component';
import { AssetTaskGroupStrategyHsmFormComponent } from './hsm/assettaskgroupstrategyhsm/assettaskgroupstrategyhsmform/assettaskgroupstrategyhsmform.component';
import { AssetTaskGroupHsmEditComponent } from './hsm/assettaskgroupstrategyhsm/assettaskgroupstrategyhsmedit/assettaskgroupstrategyhsmedit.component';
import { FMEASiteComponent } from './hsm/fmea-site/fmea-site.component';
import { FMEASiteFormComponent } from './hsm/fmea-site/fmea-site-form/fmea-site-form.component';
import { FMEAViewComponent } from './hsm/fmea/fmea-view/fmea-view.component';
import { FMEASiteViewComponent } from './hsm/fmea-site/fmea-site-view/fmea-site-view.component';
import { UsersProfileComponent } from './hsm/userprofile/userprofile.component';
import { ComponentTaskListSiteComponent } from './hsm/component-task-list-site/component-task-list-site.component';
import { AssetClassSetupComponent } from './hsm/assetclass-setup/assetclass-setup.component';
import { FMEASiteEditComponent } from './hsm/fmea-site/fmea-site-edit/fmea-site-edit.component';
import { AssetTaskGroupStrategySiteFormComponent } from './hsm/assettaskgroupstrategy/assettaskgroupstrategysiteform/assettaskgroupstrategysiteform.component';
import { AssetTaskGroupSiteEditComponent } from './hsm/assettaskgroupstrategy/assettaskgroupstrategysiteedit/assettaskgroupstrategysiteedit.component';
import { ImportSiteComponent } from './hsm/import-site/import-site.component';
import { GenerateReportPocComponent } from './hsm/generate-report-poc/generate-report-poc.component';

// Authguards

// Enum

// Routes model for application.
const APP_ROUTES: Routes = [
  {
      path: 'main', component: NavMenuComponent, children: [
          {path: 'dashboard', component: DashboardComponent},
          {path: 'strategy', component: StrategyComponent},
          {path: 'asset-hierarchy', component: AssetHierarchyComponent},
          {path: 'asset-criticality', component: AssetCriticalityComponent},
          {path: 'asset-strategy', component: AssetStrategyComponent},
          {path: 'eam-maintenance', component: EAMComponent},
          {path: 'eam-maintenance-details/:id', component: EamDetailsComponent},
          {path: 'fmea', component: FMEAComponent},
          {path: 'fmea-site', component: FMEASiteComponent},
          {path: 'fmea-form', component: FMEAFormComponent},
          {path: 'fmea-site-form', component: FMEASiteFormComponent},
          {path: 'fmea-site-edit/:id', component: FMEASiteEditComponent},
          {path: 'fmea-edit/:id', component: FMEAEditComponent},
          {path: 'fmea-view/:id', component: FMEAViewComponent},
          {path: 'fmea-site-view/:id', component: FMEASiteViewComponent},
          {path: 'asset-task-group-strategy', component: AssetTaskGroupStrategyComponent},
          {path: 'hsm-task-group-strategy', component: AssetTaskGroupStrategyHsmComponent},
          {path: 'asset-task-group-form', component: AssetTaskGroupFormComponent},
          {path: 'site-task-group-form', component: AssetTaskGroupStrategySiteFormComponent},
          {path: 'site-task-group-edit/:id', component: AssetTaskGroupSiteEditComponent},
          {path: 'hsm-task-group-form', component: AssetTaskGroupStrategyHsmFormComponent},
          {path: 'hsm-task-group-edit/:id', component: AssetTaskGroupHsmEditComponent},
          {path: 'asset-task-group-edit/:id', component: AssetTaskGroupEditComponent},
          {path: 'assign-asset-strategygroup', component: AssignAssetStrategyGroupComponent},
          {path: 'setup-page', component: SetupComponent},
          {path: 'setup-taxonomy', component: SetupTaxonomyComponent},     
          {path: 'import-page', component: ImportComponent},
          {path: 'import-site-page', component: ImportSiteComponent},
          {path: 'create-assethierarchy', component: AssetHierarchyImportFormComponent},
          {path: 'create-componenthierarchy', component: ComponentHierarchyImportFormComponent},
          {path: 'import-eamplan', component: EAMPlanImportFormComponent},
          {path: 'create-eamplan', component: EAMCreateFormComponent},
          {path: 'publish-work-instruction', component: PublishWorkInstructionComponent},
          {path: 'publish-eam-masterdata', component: PublishEAMDataComponent},
          {path: 'work-instruction-list', component: WorkInstructionListComponent},
          {path: 'assign-taxonomy', component: AssignTaxonomyComponent},
          {path: 'assign-component-taxonomy', component: AssignComponentTaxonomyComponent},
          {path: 'eamplan-route-management', component: EAMPlanRouteManagementComponent},
          {path: 'users-list', component: UsersComponent},
          {path: 'user-roles/:id', component: UserRolesComponent},
          {path: 'user-groups/:id', component: UsersGroupComponent},
          {path: 'user-profile/:id', component: UsersProfileComponent},
          {path: 'component-task-list', component: ComponentTaskListComponent},
          {path: 'site-component-task-list', component: ComponentTaskListSiteComponent},
          {path: 'asset-class-setup', component: AssetClassSetupComponent},
          {path: 'reports-poc', component: GenerateReportPocComponent}
      ]
    },
    {path: 'login', component: LoginFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES, { preloadingStrategy: PreloadAllModules, enableTracing: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
