import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Http, HttpModule } from '@angular/http';
import { SharedModule } from "./shared/shared.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatNativeDateModule} from '@angular/material/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AgGridModule } from 'ag-grid-angular';
// import Handsontable  from 'handsontable';
// import { registerAllModules } from 'handsontable/registry';
//Font Awesome's Angular Package
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faInfoCircle, faSquare, faStar, faCheck, faQuestionCircle, faExclamation, faThumbtack, faUserCircle, faPaperclip, faAngleLeft, faTrash, faTimes, faFilter, faDownload, faCaretSquareLeft, faCaretSquareRight, faCaretLeft, faCaretRight, faCaretDown, faFileDownload, faClipboardList, faUser, faCogs, faShareAltSquare, faFileAlt, faTrashAlt, faSearch, faChevronCircleLeft, faChevronCircleRight, faEdit, faMinus, faUserMinus, faMinusCircle, faPlusCircle, faUserLock, faUserPlus, faClipboardCheck, faChartArea, faCheckCircle, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

// registerAllModules();

//Material
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatTreeModule } from '@angular/material/tree';

//Components
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { DashboardComponent } from './hsm/dashboard/dashboard.component';
import { StrategyComponent } from './hsm/strategy/strategy.component';
import { AssetHierarchyComponent } from './hsm/assethierarchy/assethierarchy.component';
import { FMEAFormComponent } from './hsm/fmea/fmea-form/fmea-form.component';
import { FMEAEditComponent } from './hsm/fmea/fmea-edit/fmea-edit.component';
import { ComponentTaskGroupComponent } from './hsm/componenttaskgroup/componenttaskgroup.component';
import { AssetTaskGroupStrategyComponent } from './hsm/assettaskgroupstrategy/assettaskgroupstrategy.component';
import { AssetTaskGroupFormComponent } from './hsm/assettaskgroupstrategy/assettaskgroupform/assettaskgroupform.component';
import { AssetTaskGroupEditComponent } from './hsm/assettaskgroupstrategy/assettaskgroupedit/assettaskgroupedit.component';
import { AssignAssetStrategyGroupComponent } from './hsm/assignassetstrategygroup/assignassetstrategygroup.component';
import { AssetCriticalityComponent } from './hsm/assetcriticality/assetcriticality.component';
import { AssetStrategyComponent } from './hsm/assetstrategy/assetstrategy.component';
import { EAMComponent } from './hsm/eam/eam.component';
import { FMEAComponent } from './hsm/fmea/fmea.component';
import { CustomTableModalComponent } from './hsm/modal/customtablemodal/customtablemodal.component';
import { CreateNewFMEAModalComponent } from './hsm/modal/createnewfmeamodal/createnewfmeamodal.component';
import { MultiFilterModalComponent } from './hsm/modal/multifiltermodal/multifiltermodal.component';
import { PlantModalComponent } from './hsm/modal/plantmodal/plantmodal.component';
import { DurationModalComponent } from './hsm/modal/durationmodal/durationmodal.component';
import { TradeTypeModalComponent } from './hsm/modal/tradetypemodal/tradetypemodal.component';
import { FrequencyModalComponent } from './hsm/modal/frequencymodal/frequencymodal.component';
import { TaxonomyModalComponent } from './hsm/modal/taxonomymodal/taxonomymodal.component';
import { TaxonomyCategoryModalComponent } from './hsm/modal/taxonomycategorymodal/taxonomycategorymodal.component';
import { TaxonomyClassModalComponent } from './hsm/modal/taxonomyclassmodal/taxonomyclassmodal.component';
import { TaxonomyTypeModalComponent } from './hsm/modal/taxonomytypemodal/taxonomytypemodal.component';
import { UploadModalComponent } from './hsm/modal/uploadmodal/uploadmodal.component';
import { UploadComponentModalComponent } from './hsm/modal/uploadcomponentmodal/uploadcomponentmodal.component';
import { AssetHierarchyModalComponent } from  './hsm/modal/assethierarchymodal/assethierarchymodal.component';
import { SetupComponent } from './hsm/setup/setup.component';
import { PlantComponent } from './hsm/setup/plant/plant.component';
import { TradeTypeComponent } from './hsm/setup/tradetype/tradetype.component';
import { DurationComponent } from './hsm/setup/duration/duration.component';
import { FrequencyComponent } from './hsm/setup/frequency/frequency.component';
import { TaxonomyCategoryComponent } from './hsm/setuptaxonomy/taxonomycategory/taxonomycategory.component';
import { TaxonomyClassComponent } from './hsm/setuptaxonomy/taxonomyclass/taxonomyclass.component';
import { TaxonomyTypeComponent } from './hsm/setuptaxonomy/taxonomytype/taxonomytype.component';
import { ImportComponent } from './hsm/import/import.component';
import { ImportSiteComponent } from './hsm/import-site/import-site.component';
import { AssetHierarchyImportComponent } from './hsm/import/assethierarchyimport/assethierarchyimport.component';
import { ComponentHierarchyImportComponent} from './hsm/import/componenthierarchyimport/componenthierarchyimport.component';
import { EAMPlanImportComponent } from './hsm/import/eamplanimport/eamplanimport.component';
import { FMEAImportComponent } from './hsm/import/fmeaimport/fmeaimport.component';
import { AssetHierarchyImportFormComponent } from './hsm/import/assethierarchyimport/assethierarchyimportform/assethierarchyimportform.component';
import { ComponentHierarchyImportFormComponent } from './hsm/import/componenthierarchyimport/componenthierarchyimportform/componenthierarchyimportform.component';
import { EAMPlanImportFormComponent } from './hsm/import/eamplanimport/eamplanimportform/eamplanimportform.component';
import { MaintenanceItemComponent } from './hsm/import/maintenanceitem/maintenanceitem.component';
import { MaintenancePlanComponent } from './hsm/import/maintenanceplan/maintenanceplan.component';
import { TaskListComponent } from './hsm/import/tasklistimport/tasklistimport.component';
import { FLOCEAMMaintenanceComponent } from './hsm/eam/funcloceam-maintenancelist/funcloceam-maintenancelist.component';
import { EamDetailsComponent } from './hsm/eam/eam-details/eam-details.component';
import { EAMCreateFormComponent } from './hsm/eam/eam-create/eam-create.component';
import { SpinnerComponent } from './hsm/spinner/spinner.component';
import { AssetHierarchyFilterModalComponent } from './hsm/modal/modal/assethierarchyfiltermodal/assethierarchyfiltermodal.component';
import { UploadModalDetailsComponent } from './hsm/modal/uploadmodaldetails/uploadmodaldetails.component';
import { PublishEAMDataComponent } from './hsm/reports/publish-eam-masterdata/publish-eam-masterdata.component';
import { PublishWorkInstructionComponent } from './hsm/reports/publish-work-instruction/publish-work-instruction.component';
import { WorkInstructionListComponent } from './hsm/reports/work-instruction/work-instruction.component';
import { AssignTaxonomyComponent } from './hsm/assigntaxonomy/assigntaxonomy.component';
import { AssignComponentTaxonomyComponent } from './hsm/assigncomponenttaxonomy/assigncomponenttaxonomy.component';
import { EAMPlanRouteManagementComponent } from './hsm/eam/eamplan-routemanagement/eamplan-routemanagement.component';
import { AssignTaxonomyModalComponent } from './hsm/modal/assigntaxonomymodal/assigntaxonomymodal.component';
import { AssignTaxonomyEditModalComponent } from './hsm/modal/assigntaxonomyeditmodal/assigntaxonomyeditmodal.component';
import { SetupTaxonomyComponent } from './hsm/setuptaxonomy/setuptaxonomy.component';
import { CompTaxonomyCategoryComponent } from './hsm/setup/ctaxonomycategory/ctaxonomycategory.component';
import { CompTaxonomyClassComponent } from './hsm/setup/ctaxonomyclass/ctaxonomyclass.component';
import { CompTaxonomyTypeComponent } from './hsm/setup/ctaxonomytype/ctaxonomytype.component';
import { CTaxonomyCategoryModalComponent } from './hsm/modal/ctaxonomycategorymodal/ctaxonomycategorymodal.component';
import { CTaxonomyClassModalComponent } from './hsm/modal/ctaxonomyclassmodal/ctaxonomyclassmodal.component';
import { CTaxonomyTypeModalComponent } from './hsm/modal/ctaxonomytypemodal/ctaxonomytypemodal.component';
import { CreateComponentModalComponent } from './hsm/modal/createcomponentmodal/createcomponentmodal.component';
import { AssetHierarchyIndustryComponent } from './hsm/setuptaxonomy/assetindustry/assetindustry.component';
import { AssetIndustryModalComponent } from './hsm/modal/assetindustrymodal/assetindustrymodal.component';
import { AssetHierarchyBusinessTypeComponent } from './hsm/setuptaxonomy/assetbusinesstype/assetbusinesstype.component';
import { AssetBusinessTypeModalComponent } from './hsm/modal/assetbusinesstypemodal/assetbusinesstypemodal.component';
import { AssetHierarchyAssetTypeComponent } from './hsm/setuptaxonomy/assettype/assettype.component';
import { AssetTypeModalComponent } from './hsm/modal/assettypemodal/assettypemodal.component';
import { AssetHierarchyProcessFunctionComponent } from './hsm/setuptaxonomy/assetprocessfunction/assetprocessfunction.component';
import { AssetHierarchyProcessFunctionModalComponent } from './hsm/modal/assetprocessfunctionmodal/assetprocessfunctionmodal.component';
import { AssetHierarchyClassTaxonomyComponent } from './hsm/setuptaxonomy/assetclasstaxonomy/assetclasstaxonomy.component';
import { AssetHierarchyClassModalComponent } from './hsm/modal/assetclasstaxonomymodal/assetclasstaxonomymodal.component';
import { AssetHierarchySpecTaxonomyComponent } from './hsm/setuptaxonomy/assetspectaxonomy/assetspectaxonomy.component';
import { AssetHierarchySpecModalComponent } from './hsm/modal/assetspectaxonomymodal/assetspectaxonomymodal.component';
import { AssetHierarchyFamilyTaxonomyComponent } from './hsm/setuptaxonomy/assetfamilytaxonomy/assetfamilytaxonomy.component';
import { AssetHierarchyFamilyModalComponent } from './hsm/modal/assetfamilytaxonomymodal/assetfamilytaxonomymodal.component';
import { AssetHierarchyManufacturerTaxonomyComponent } from './hsm/setuptaxonomy/assetmanufacturertaxonomy/assetmanufacturertaxonomy.component';
import { AssetHierarchyManufacturerModalComponent } from './hsm/modal/assetmanufacturermodal/assetmanufacturermodal.component';
import { ComClassTaxonomyComponent } from './hsm/setup/componentclasstaxonomy/componentclasstaxonomy.component';
import { ComFamilyTaxonomyComponent } from './hsm/setup/componentfamilytaxonomy/componentfamilytaxonomy.component';
import { ComSubClassTaxonomyComponent } from './hsm/setup/componentsubclasstaxonomy/componentsubclasstaxonomy.component';
import { ComBuildSpecTaxonomyComponent } from './hsm/setup/componentbuildspectaxonomy/componentbuildspectaxonomy.component';
import { ComManufacturerTaxonomyComponent} from './hsm/setup/componentmanufacturertaxonomy/componentmanufacturertaxonomy.component';
import { ComponentFamilyModalComponent } from './hsm/modal/componentfamilymodal/componentfamilymodal.component';
import { ComponentClassModalComponent } from './hsm/modal/componentclassmodal/componentclassmodal.component';
import { ComponentSubClassModalComponent } from './hsm/modal/componentsubclassmodal/componentsubclassmodal.component';
import { ComponentBuildSpecModalComponent } from './hsm/modal/componentbuildspecmodal/componentbuildspecmodal.component';
import { ComponentManufacturerModalComponent } from './hsm/modal/componentmanufacturermodal/componentmanufacturermodal.component';
import { AssignHierarchyModalComponent } from './hsm/modal/assignhierarchymodal/assignhierarchymodal.component';
import { CreateFMEAVariantModalComponent } from './hsm/modal/createfmeavariantmodal/createfmeavariantmodal.component';
import { ResetCacheModalComponent } from './hsm/modal/resetcachemodal/resetcachemodal.component';
import { AddFlocModalComponent } from './hsm/modal/addflocmodal/addflocmodal.component';
import { ComponentTaxonomyImportComponent } from './hsm/import/componenttaxonomyimport/componenttaxonomyimport.component';
import { AssetCategoryComponent } from './hsm/setuptaxonomy/assetcategory/assetcategory.component';
import { AssetCategoryModalComponent } from './hsm/modal/assetcategorymodal/assetcategorymodal.component';
import { WorkInstructionTaskTypeComponent } from './hsm/setup/workinstructiontasktype/workinstructiontasktype.component';
import { WorkInstructionTaskTypeModalComponent } from './hsm/modal/workinstructiontasktypemodal/workinstructiontasktypemodal.component';
import { AddWorkInstructionModalComponent } from './hsm/modal/addworkinstructionmodal/addworkinstructionmodal.component';
import { TaskTypeComponent } from './hsm/setup/tasktype/tasktype.component';
import { TaskTypeModalComponent } from './hsm/modal/tasktypemodal/tasktypemodal.component';
import { SelectTemplateComponentModalComponent } from './hsm/modal/selecttemplatemodal/selecttemplatemodal.component';
import { AddFlocToWorkInstructionModalComponent } from './hsm/modal/addfloctoworkinsmodal/addfloctoworkinsmodal.component';
import { UsersComponent } from './hsm/users/users.component';
import { UserModalComponent } from './hsm/modal/usermodal/usermodal.component';
import { UserGroupModalComponent } from './hsm/modal/usergroupmodal/usergroupmodal.component';
import { UserRolesComponent } from './hsm/users/user-roles/user-roles.component';
import { UsersGroupComponent } from './hsm/users/users-group/users-group.component';
import { ComponentTaskComponent } from './hsm/import/componenttask/componenttask.component';
import { ComponentTaskModalComponent } from './hsm/modal/componenttaskmodal/componenttaskmodal.component';
import { ComponentTaskListComponent } from './hsm/component-task-list/component-task-list.component';
import { AssignTaskModalComponent } from './hsm/modal/assigntaskmodal/assigntaskmodal.component';
import { AssetTaskGroupStrategyHsmComponent } from './hsm/assettaskgroupstrategyhsm/assettaskgroupstrategyhsm.component';
import { AssetTaskGroupStrategyHsmFormComponent } from './hsm/assettaskgroupstrategyhsm/assettaskgroupstrategyhsmform/assettaskgroupstrategyhsmform.component';
import { AssetTaskGroupStrategySiteFormComponent } from './hsm/assettaskgroupstrategy/assettaskgroupstrategysiteform/assettaskgroupstrategysiteform.component';
import { AssetTaskGroupStrategyHsmReportComponent } from './hsm/assettaskgroupstrategyhsm/assettaskgroupstrategyhsmreport/assettaskgroupstrategyhsmreport.component';
import { AttachTaskModalComponent } from './hsm/modal/attachtaskmodal/attachtaskmodal.component';
import { AssetTaskGroupHsmEditComponent} from './hsm/assettaskgroupstrategyhsm/assettaskgroupstrategyhsmedit/assettaskgroupstrategyhsmedit.component';
import { AssetTaskGroupSiteEditComponent } from './hsm/assettaskgroupstrategy/assettaskgroupstrategysiteedit/assettaskgroupstrategysiteedit.component';
import { FMEASiteComponent } from './hsm/fmea-site/fmea-site.component';
import { FMEASiteFormComponent } from './hsm/fmea-site/fmea-site-form/fmea-site-form.component';
import { HsmTgsViewModalComponent } from './hsm/modal/hsmtgsviewmodal/hsmtgsviewmodal.component';
import { AssignTaskSiteModalComponent } from './hsm/modal/assigntasksitemodal/assigntasksitemodal.component';
import { CreateNewFMEASiteModalComponent } from './hsm/modal/createnewfmeasitemodal/createnewfmeasitemodal.component';
import { CommentModalComponent } from './hsm/modal/commentmodal/commentmodal.component';
import { FMEAViewComponent } from './hsm/fmea/fmea-view/fmea-view.component';
import { FMEASiteViewComponent } from './hsm/fmea-site/fmea-site-view/fmea-site-view.component';
import { UserSitesComponent } from './hsm/users/user-sites/user-sites.component';
import { UserSiteModalComponent } from './hsm/modal/usersitemodal/usersitemodal.component';
import { UsersProfileComponent } from './hsm/userprofile/userprofile.component';
import { ViewCommentModal } from './hsm/modal/viewcommentmodal/viewcommentmodal.component';
import { RequestModal } from './hsm/modal/requestmodal/requestmodal.component';
import { ComponentTaskListSiteComponent } from './hsm/component-task-list-site/component-task-list-site.component';
import { AssetClassSetupComponent } from './hsm/assetclass-setup/assetclass-setup.component';
import { CategoryHierarchySiteImportComponent } from './hsm/import/categoryhierarchysiteimport/categoryhierarchysiteimport.component';
import { FMEASiteEditComponent } from './hsm/fmea-site/fmea-site-edit/fmea-site-edit.component';
import { ImportFmeaModalComponent } from './hsm/modal/importmodal/importfmeamodal/importfmeamodal.component';
import { ImportmatchModalComponent } from './hsm/modal/importmodal/importmatchmodal/importmatchmodal.component';
import { ImportReviewModalComponent } from './hsm/modal/importmodal/importreviewmodal/importreviewmodal.component';
import { TransferToMaintUnitModalComponent } from './hsm/modal/transfertomaintunitmodal/transfertomaintunitmodal.component';
import { CloneTaskModalComponent } from './hsm/modal/clonetaskmodal/clonetaskmodal.component';
import { CustomerNameComponent } from './hsm/users/customer/customer.component';
import { CustomerModalComponent } from './hsm/modal/customermodal/customermodal.component';
import { AttachTaskSiteModalComponent } from './hsm/modal/attachtasksitemodal/attachtasksitemodal.component';
import { SiteTgsViewModalComponent } from './hsm/modal/sitetgsviewmodal/sitetgsviewmodal.component';
import { ImportMaintainableModalComponent } from './hsm/modal/importmaintainablemodal/importmaintainablemodal.component';
import { CreateComponentSiteModalComponent } from './hsm/modal/createcomponentsitemodal/createcomponentsitemodal.component';
import { MaintainableMatchModalComponent } from './hsm/modal/importmaintainablemodal/maintainablematchmodal/maintainablematchmodal.component';
import { MaintainableReviewModalComponent } from './hsm/modal/importmaintainablemodal/maintainablereviewmodal/maintainablereviewmodal.component';
import { ImportFmeaSiteModalComponent } from './hsm/modal/importsitemodal/importfmeasitemodal/importfmeasitemodal.component';
import { ImportFmeaSiteMatchModalComponent} from './hsm/modal/importsitemodal/importfmeasitematchmodal/importfmeasitematchmodal.component';
import { ImportFmeaSiteReviewModalComponent} from './hsm/modal/importsitemodal/importfmeasitereviewmodal/importfmeasitereviewmodal.component';

import {ResizeColumnDirective} from './hsm/component-task-list/resize-column.directive';
import { ResizableDirective } from './hsm/directives/resizeable/resizeable.directive';
// import { DraggableDialogDirective } from './hsm/directives/movable-modal/movable-modal.directive';

//Customized Column
import { ColumnSorterComponent } from './hsm/assethierarchy/va-mat-table/actions/column-sorter/column-sorter.component';
import { VaMatTableComponent } from './hsm/assethierarchy/va-mat-table/va-mat-table.component';
import { ColumnSorterService } from './hsm/assethierarchy/va-mat-table/actions/column-sorter/column-sorter.service';

//Services
import { AssetTaskGroupStrategyService } from './hsm/services/assettaskgroupstrategy.services';
import { DurationService } from './hsm/services/duration.services';
import { FrequencyService } from './hsm/services/frequency.services';
import { OperationalModeService } from './hsm/services/operationalmode.services';
import { TradeTypeService } from './hsm/services/tradetype.services';
import { TaxonomyCategoryService } from './hsm/services/taxonomycategory.services';
import { TaxonomyClassService } from './hsm/services/taxonomyclass.services';
import { TaxonomyTypeService } from './hsm/services/taxonomytype.services';
import { TaskTypeService } from './hsm/services/tasktype.services';
import { EAMPlanService } from './hsm/services/eamplan.services';
import { EAMPlanAttachURLService } from './hsm/services/eamplanattachurl.services';
import { PlantService } from './hsm/services/plant.services';
import { ImportHierarchyService } from './hsm/services/importhierarchy.services';
import { ImportComponentHierarchyService } from './hsm/services/importcomponenthierarchy.services';
import { TempHierarchyService } from './hsm/services/temphierarchy.services';
import { CategoryHierarchyService } from './hsm/services/categoryhierarchy.services';
import { MaintenanceItemImportService } from './hsm/services/maintenanceitemimport.services';
import { MaintenancePlanImportService } from './hsm/services/maintenanceplanimport.services';
import { TaskListImportService } from './hsm/services/tasklistimport.services';
import { AssetHierarchyService } from './hsm/services/assethierarchy.services';
import { FMEAService } from './hsm/services/fmea.services';
import { FMEATaskAddedService } from './hsm/services/fmeataskadded.services';
import { AssetTaskGroupStrategySequenceService } from './hsm/services/assettaskgroupstrategysequence.services';
import { AssignTaskGroupStrategyService } from './hsm/services/assigntaskgroupstrategy.services';
import { TaskGroupStrategyAddedService } from './hsm/services/taskgroupstrategyadded.services';
import { TaskGroupStrategySequenceService} from './hsm/services/taskgroupstrategysequence.services';
import { ComTaxonomyCategoryService } from './hsm/services/comtaxonomycategory.services';
import { ComTaxonomyClassService } from './hsm/services/comtaxonomyclass.services';
import { ComTaxonomyTypeService } from './hsm/services/comtaxonomytype.services';
import { AssetHierarchyIndustryService } from './hsm/services/assethierarchyindustry.services';
import { AssetHierarchyBusinessTypeService } from './hsm/services/assethierarchybusinesstype.services';
import { AssetHierarchyAssetTypeService } from './hsm/services/assethierarchyassettype.services';
import { AssetHierarchyProcessFunctionService } from './hsm/services/assethierarchyprocessfunction.services';
import { AssetHierarchyClassTaxonomyService } from './hsm/services/assethierarchyclasstaxonomy.services';
import { AssetHierarchySpecService } from './hsm/services/assethierarchyspec.services';
import { AssetHierarchyFamilyService } from './hsm/services/assethierarchyfamily.services';
import { AssetHierarchyManufacturerService } from './hsm/services/assethierarchymanufacturer.services';
import { ComponentClassService } from './hsm/services/componentclass.services';
import { ComponentFamilyService } from './hsm/services/componentfamily.services';
import { ComponentSubClassService } from './hsm/services/componentsubclass.services';
import { ComponentBuildSpecService} from './hsm/services/componentbuildspec.services';
import { ComponentManufacturerService } from './hsm/services/componentmanufacturer.services';
import { ComponentVariantService } from './hsm/services/componentvariant.services';
import { AssignAssetTaskGroupStrategyHierarchyService } from './hsm/services/assignassettaskgroupstrategyhierarchy.services';
import { AssignAssetTaskGroupStrategyMaterialService } from './hsm/services/assignassettaskgroupstrategymaterial.services';
import { AssignAssetTaskGroupStrategyMaterialSiteService } from './hsm/services/assignassettaskgroupstrategymaterialsite.services';
import { AssetCategoryService } from './hsm/services/assetcategory.services';
import { WorkInstructionTaskTypeService } from './hsm/services/workinstructiontasktype.services';
import { UsersService } from './hsm/services/users.services';
import { UserPermissionGroupService } from './hsm/services/userpermissiongroup.services';
import { SitesService } from './hsm/services/sites.services';
import { ComponentTaskService } from './hsm/services/componenttask.services';
import { FmeaAssemblyService} from './hsm/services/fmeaassembly.services';
import { AssetTaskGroupStrategyHsmService } from './hsm/services/assettaskgroupstrategyhsm.services';
import { AssignAssetTaskGroupStrategyMaterialHsmService } from './hsm/services/assignassettaskgroupstrategymaterialhsm.services';
import { FmeaSiteService } from './hsm/services/fmeasite.services';
import { UserManagementGroupService } from './hsm/services/usermanagementgroup.services';
import { UserPermissionService } from './hsm/services/userpermission.services';
import { RoleFeatureService } from './hsm/services/rolefeature.services';
import { ActionManagementService } from './hsm/services/actionmanagement.services';
import { FMaintainableUnitService } from './hsm/services/fmaintainableunitsite.services';
import { AssignGroupToUserService } from './hsm/services/assigngrouptouser.services';
import { CategoryHierarchySiteService } from './hsm/services/categoryhierarchysite.services';
import { CustomerService } from './hsm/services/customer.services';

//Shared Services
import { AuthService} from './shared/services/auth.service';
import { AuthGuardService} from './shared/services/auth.guard.service';
import { MainAuthGuardService } from './shared/services/main.auth.guard.service';
import { PermissionManagerService } from './shared/services/permission.manager.service';
import { ExpandMenu } from './shared/expand-menu.directive';

//Modal
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

//Authguards
import { ErrorInterceptor } from './shared/helpers/http.interceptor';
import { BasicAuthInterceptor } from './shared/helpers/auth.interceptor';

//Shared Components
import { AppRoutingModule } from './app-routing.module';
import { rootRouterConfig } from './app.routes';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule, NgbAlertModule, NgbModalModule  } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from './shared/services/modal.service';
import { ModalComponent } from './hsm/modal/modal/modal.component';
import { MaterialModule } from './material.module';
import { ToastrModule } from 'ngx-toastr';
import { FadeInOutDirective } from './hsm/directives/interaction/fade-in-out.directive';
import { DataService } from './shared/services/data.service';
import { CreateNewFMEAHierarchyModalComponent } from './hsm/modal/createfmeahierarchymodal/createfmeahierarchymodal.component';
import { LoginFormComponent } from './hsm/login/login.component';
import { RevisionReportModalComponent } from './hsm/modal/revisionreportmodal/revisionreportmodal.component';
import { HttpClientExt } from './shared/services/httpclient.services';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
	ResizableModule
} from 'angular-resizable-element';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service
import { CustomSnackBarComponent } from './hsm/partials/custom-snack-bar/custom-snack-bar.component';
import { GroupService } from './hsm/services/group.service';
import { GenerateReportPocComponent } from './hsm/generate-report-poc/generate-report-poc.component';
import { DocumentEditorContainerAllModule } from '@syncfusion/ej2-angular-documenteditor';
import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
// import { ResizableModule } from './hsm/directives/resizeable/resizeable.module';

//Font Awesome's Angular Package
// import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
// import { faInfoCircle, faStar, faCheck, faQuestionCircle, faExclamation, faThumbtack, faUserCircle, faPaperclip, faAngleLeft, faTrash, faTimes, faFilter, faDownload, faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    GenerateReportPocComponent,
    CustomSnackBarComponent,
    AppComponent,
    NavMenuComponent,
    LoginFormComponent,
    DashboardComponent,
    StrategyComponent,
    AssetHierarchyComponent,
    AssetCriticalityComponent,
    AssetStrategyComponent,
    EAMComponent,
    FMEAComponent,
    FMEAFormComponent,
    FMEAEditComponent,
    ComponentTaskGroupComponent,
    AssetTaskGroupStrategyComponent,
    AssetTaskGroupFormComponent,
    AssetTaskGroupEditComponent,
    AssignAssetStrategyGroupComponent,
    SetupComponent,
    PlantComponent,
    TradeTypeComponent,
    DurationComponent,
    FrequencyComponent,
    TaxonomyCategoryComponent,
    TaxonomyClassComponent,
    TaxonomyTypeComponent,
    ImportComponent,
    AssetHierarchyImportComponent,
    ComponentHierarchyImportComponent,
    EAMPlanImportComponent,
    FMEAImportComponent,
    AssetHierarchyImportFormComponent,
    ComponentHierarchyImportFormComponent,
    EAMPlanImportFormComponent,
    MaintenanceItemComponent,
    MaintenancePlanComponent,
    FLOCEAMMaintenanceComponent,
    EAMCreateFormComponent,
    EamDetailsComponent,
    TaskListComponent,
    SpinnerComponent,
    AssetHierarchyModalComponent,
    AssetHierarchyFilterModalComponent,
    PublishEAMDataComponent,
    PublishWorkInstructionComponent,
    WorkInstructionListComponent,
    AssignTaxonomyComponent,
    AssignComponentTaxonomyComponent,
    EAMPlanRouteManagementComponent,
    SetupTaxonomyComponent,
    CompTaxonomyCategoryComponent,
    CompTaxonomyClassComponent,
    CompTaxonomyTypeComponent,
    CTaxonomyCategoryModalComponent,
    CTaxonomyClassModalComponent,
    CTaxonomyTypeModalComponent,
    AssetHierarchyIndustryComponent,
    AssetHierarchyBusinessTypeComponent,
    AssetHierarchyAssetTypeComponent,
    AssetHierarchyProcessFunctionComponent,
    AssetHierarchyClassTaxonomyComponent,
    AssetHierarchySpecTaxonomyComponent,
    AssetHierarchyFamilyTaxonomyComponent,
    AssetHierarchyManufacturerTaxonomyComponent,
    ComClassTaxonomyComponent,
    ComFamilyTaxonomyComponent,
    ComSubClassTaxonomyComponent,
    ComBuildSpecTaxonomyComponent,
    ComManufacturerTaxonomyComponent,
    ComponentTaxonomyImportComponent,
    AssetCategoryComponent,
    WorkInstructionTaskTypeComponent,
    AddWorkInstructionModalComponent,
    UsersComponent,
    UserRolesComponent,
    UsersGroupComponent,
    TaskTypeComponent,
    ComponentTaskComponent,
    ComponentTaskListComponent,
    AssetTaskGroupStrategyHsmComponent,
    AssetTaskGroupStrategyHsmFormComponent,
    AssetTaskGroupStrategySiteFormComponent,
    AssetTaskGroupStrategyHsmReportComponent,
    AssetTaskGroupHsmEditComponent,
    AssetTaskGroupSiteEditComponent,
    FMEASiteComponent,
    FMEASiteFormComponent,
    FMEAViewComponent,
    FMEASiteViewComponent,
    UserSitesComponent,
    UsersProfileComponent,
    ComponentTaskListSiteComponent,
    AssetClassSetupComponent,
    CategoryHierarchySiteImportComponent,
    FMEASiteEditComponent,
    CustomerNameComponent,
    ImportSiteComponent,
    FadeInOutDirective,
    ResizeColumnDirective,
    ResizableDirective,
    // DraggableDialogDirective,
    ExpandMenu,

    //Modals
    CustomTableModalComponent,
    CreateNewFMEAModalComponent,
    CreateNewFMEAHierarchyModalComponent,
    MultiFilterModalComponent,
    RevisionReportModalComponent,
    PlantModalComponent,
    DurationModalComponent,
    TradeTypeModalComponent,
    FrequencyModalComponent,
    TaxonomyCategoryModalComponent,
    TaxonomyClassModalComponent,
    TaxonomyTypeModalComponent,
    UploadModalComponent,
    UploadComponentModalComponent,
    AssetHierarchyModalComponent,
    TaxonomyModalComponent,
    UploadModalDetailsComponent,
    AssignTaxonomyModalComponent,
    AssignTaxonomyEditModalComponent,
    ModalComponent,
    CreateComponentModalComponent,
    AssetIndustryModalComponent,
    AssetBusinessTypeModalComponent,
    AssetTypeModalComponent,
    AssetHierarchyProcessFunctionModalComponent,
    AssetHierarchyClassModalComponent,
    AssetHierarchySpecModalComponent,
    AssetHierarchyFamilyModalComponent,
    AssetHierarchyManufacturerModalComponent,
    ComponentFamilyModalComponent,
    ComponentClassModalComponent,
    ComponentSubClassModalComponent,
    ComponentBuildSpecModalComponent,
    ComponentManufacturerModalComponent,
    AssignHierarchyModalComponent,
    CreateFMEAVariantModalComponent,
    ResetCacheModalComponent,
    AddFlocModalComponent,
    AssetCategoryModalComponent,
    WorkInstructionTaskTypeModalComponent,
    TaskTypeModalComponent,
    SelectTemplateComponentModalComponent,
    AddFlocToWorkInstructionModalComponent,
    UserModalComponent,
    UserGroupModalComponent,
    ComponentTaskModalComponent,
    AssignTaskModalComponent,
    AttachTaskModalComponent,
    HsmTgsViewModalComponent,
    AssignTaskSiteModalComponent,
    CreateNewFMEASiteModalComponent,
    CommentModalComponent,
    UserSiteModalComponent,
    ViewCommentModal,
    RequestModal,
    ImportFmeaModalComponent,
    ImportmatchModalComponent,
    ImportReviewModalComponent,
    TransferToMaintUnitModalComponent,
    CloneTaskModalComponent,
    CustomerModalComponent,
    AttachTaskSiteModalComponent,
    SiteTgsViewModalComponent,
    ImportMaintainableModalComponent,
    CreateComponentSiteModalComponent,
    MaintainableMatchModalComponent,
    MaintainableReviewModalComponent,
    ImportFmeaSiteModalComponent,
    ImportFmeaSiteMatchModalComponent,
    ImportFmeaSiteReviewModalComponent,
    ColumnSorterComponent,
    VaMatTableComponent,
  ],
  imports: [
    // BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    MaterialModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    CdkTreeModule,
    MatTreeModule,
    MatIconModule,
    MatTabsModule,
    NgbPaginationModule,
    NgbAlertModule,
    TreeGridModule,
    MatDialogModule,
    NgbModalModule,
    NgxChartsModule,
    DragDropModule,
    ResizableModule,
    FontAwesomeModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    // FontAwesomeModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    // RouterModule.forRoot([
    //   { path: 'main', component: NavMenuComponent, pathMatch: 'full' },
    //   { path: 'dashboard', component: DashboardComponent },
    // ], { relativeLinkResolution: 'legacy' }),
    BrowserAnimationsModule,
    NgbModule,
    AgGridModule,
    DocumentEditorContainerAllModule,
    ListViewAllModule,
    ButtonModule,
    DialogModule,
    UploaderModule
    // BsDatepickerModule.forRoot()
  ],  
  providers: [
    HttpClientExt,
    AssetTaskGroupStrategyService,
    DurationService,
    FrequencyService,
    OperationalModeService,
    TradeTypeService,
    TaxonomyCategoryService,
    TaxonomyClassService,
    TaxonomyTypeService,
    TaskTypeService,
    EAMPlanService,
    EAMPlanAttachURLService,
    PlantService,
    ImportHierarchyService,
    ImportComponentHierarchyService,
    TempHierarchyService,
    CategoryHierarchyService,
    MaintenanceItemImportService,
    MaintenancePlanImportService,
    TaskListImportService,
    AssetHierarchyService,
    FMEAService,
    FMEATaskAddedService,
    AssetTaskGroupStrategySequenceService,
    AssignTaskGroupStrategyService,
    TaskGroupStrategyAddedService,
    TaskGroupStrategySequenceService,
    ComTaxonomyCategoryService,
    ComTaxonomyClassService,
    ComTaxonomyTypeService,
    AssetHierarchyIndustryService,
    AssetHierarchyBusinessTypeService,
    AssetHierarchyAssetTypeService,
    AssetHierarchyProcessFunctionService,
    AssetHierarchyClassTaxonomyService,
    AssetHierarchySpecService,
    AssetHierarchyFamilyService,
    AssetHierarchyManufacturerService,
    ComponentClassService,
    ComponentFamilyService,
    ComponentSubClassService,
    ComponentBuildSpecService,
    ComponentManufacturerService,
    ComponentVariantService,
    AssignAssetTaskGroupStrategyHierarchyService,
    AssignAssetTaskGroupStrategyMaterialService,
    AssetCategoryService,
    WorkInstructionTaskTypeService,
    AuthService,
    AuthGuardService,
    MainAuthGuardService,
    PermissionManagerService,
    UsersService,
    UserPermissionGroupService,
    SitesService,
    ComponentTaskService,
    FmeaAssemblyService,
    AssetTaskGroupStrategyHsmService,
    AssignAssetTaskGroupStrategyMaterialHsmService,
    AssignAssetTaskGroupStrategyMaterialSiteService,
    FmeaSiteService,
    UserManagementGroupService,
    UserPermissionService,
    RoleFeatureService,
    ActionManagementService,
    FMaintainableUnitService,
    AssignGroupToUserService,
    GroupService,
    CategoryHierarchySiteService,
    CustomerService,
    DataService,
    ModalService,
    ColumnSorterService,
    BnNgIdleService,
    NgbActiveModal,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass:BasicAuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalComponent,
    CustomTableModalComponent,
    CreateNewFMEAModalComponent,
    CreateNewFMEAHierarchyModalComponent,
    MultiFilterModalComponent,
    RevisionReportModalComponent,
    PlantModalComponent,
    DurationModalComponent,
    TradeTypeModalComponent,
    FrequencyModalComponent,
    TaxonomyCategoryModalComponent,
    TaxonomyClassModalComponent,
    TaxonomyTypeModalComponent,
    UploadModalComponent,
    UploadComponentModalComponent,
    AssetHierarchyModalComponent,
    AssetHierarchyFilterModalComponent,
    TaxonomyModalComponent,
    UploadModalDetailsComponent,
    AssignTaxonomyModalComponent,
    AssignTaxonomyEditModalComponent,
    CTaxonomyCategoryModalComponent,
    CTaxonomyClassModalComponent,
    CTaxonomyTypeModalComponent,
    CreateComponentModalComponent,
    AssetIndustryModalComponent,
    AssetBusinessTypeModalComponent,
    AssetTypeModalComponent,
    AssetHierarchyProcessFunctionModalComponent,
    AssetHierarchyClassModalComponent,
    AssetHierarchySpecModalComponent,
    AssetHierarchyFamilyModalComponent,
    AssetHierarchyManufacturerModalComponent,
    ComponentFamilyModalComponent,
    ComponentClassModalComponent,
    ComponentSubClassModalComponent,
    ComponentBuildSpecModalComponent,
    ComponentManufacturerModalComponent,
    AssignHierarchyModalComponent,
    CreateFMEAVariantModalComponent,
    ResetCacheModalComponent,
    AddFlocModalComponent,
    AssetCategoryModalComponent,
    WorkInstructionTaskTypeModalComponent,
    AddWorkInstructionModalComponent,
    TaskTypeModalComponent,
    SelectTemplateComponentModalComponent,
    AddFlocToWorkInstructionModalComponent,
    UserModalComponent,
    UserGroupModalComponent,
    ComponentTaskModalComponent,
    AssignTaskModalComponent,
    AttachTaskModalComponent,
    HsmTgsViewModalComponent,
    AssignTaskSiteModalComponent,
    CreateNewFMEASiteModalComponent,
    CommentModalComponent,
    UserSiteModalComponent,
    ViewCommentModal,
    RequestModal,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faInfoCircle, faSquare, faStar, faCheck, faQuestionCircle, faExclamation, faThumbtack, faUserCircle, faPaperclip, faAngleLeft, faTrash, faTimes, faFilter, faDownload, faCaretSquareLeft, faCaretSquareRight, faCaretLeft, faCaretRight, faCaretDown, faFileDownload, faClipboardList, faUser, faCogs, faShareAltSquare, faFileAlt, faTrashAlt, faSearch, faChevronCircleLeft, faChevronCircleRight, faEdit, faMinus, faUserMinus, faMinusCircle, faPlusCircle, faUserLock, faUserPlus, faClipboardCheck, faChartArea, faCheckCircle, faEyeSlash);
  }
}
