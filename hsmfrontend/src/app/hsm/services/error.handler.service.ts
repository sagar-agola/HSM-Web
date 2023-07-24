import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from '../partials/custom-snack-bar/custom-snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  public errorMessage = '';
  public operationID = '';
  public appear = false;
  constructor(public snackbar: MatSnackBar) {}

  public handleError = (error: HttpErrorResponse) => {
    if (error.status === 500) {
      this.handle500Error(error);
    } else if (error.status === 404) {
      this.handle404Error(error);
    } else if (error.status === 401) {
      this.handle401Error(error);
    } else if (error.status === 403) {
      this.handle403Error(error);
    } else if (error.status === 400) {
      this.handle400Error(error);
    } else if (error.status === 0) {
      this.handle0Error(error);
    } else {
      this.handleOtherError(error);
    }
  };

  private handle500Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
  };

  private handle404Error = (error: HttpErrorResponse) => {
    this.snackbar.openFromComponent(CustomSnackBarComponent, {
      data: error,
      panelClass: 'error-snackbar-component'
    });
  };

  private handle401Error = (error: HttpErrorResponse) => {
    this.snackbar.openFromComponent(CustomSnackBarComponent, {
      data: error,
      panelClass: 'error-snackbar-component'
    });
  };

  private handle403Error = (error: HttpErrorResponse) => {
    this.errorMessage = error.error ? error.error.ErrorMessage : error.statusText;
    this.snackbar.openFromComponent(CustomSnackBarComponent, {
      data: error,
      panelClass: 'error-snackbar-component'
    });
  };

  private handle400Error = (error: HttpErrorResponse) => {
    this.errorMessage = error.error.title;
    console.log(error);
    console.log(error.error.title);
    this.snackbar.openFromComponent(CustomSnackBarComponent, {
      data: error,
      panelClass: 'error-snackbar-component'
    });
  };

  private handle0Error = (error: HttpErrorResponse) => {
    this.snackbar.open('Oops. Something went wrong with the service. We are looking at it now', 'Close', {
      panelClass: 'error-snackbar'
    });
    // this.snackbar.openFromComponent(CustomSnackBarComponent, {
    //   data: error,
    //   panelClass: 'error-snackbar-component'
    // });
  };

  private handleOtherError = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
  };

  private createErrorMessage = (error: HttpErrorResponse) => {
    console.log(error);
    this.errorMessage = error.error ? error.error.ErrorMessage : error.statusText;
    this.operationID = error.error?.OperationId;
    this.snackbar.openFromComponent(CustomSnackBarComponent, {
      data: error,
      panelClass: 'error-snackbar-component'
    });
    // if (error.error?.Data.SqlResuming) {
    //   this.appFacade.dbResume('resume');
    //    this.appFacade.loadNotifications();
    // } else {
    /*     this.snackbar.open('Error: ' + this.errorMessage + ' Operation ID: ' + this.operationID, 'Close', {
      panelClass: 'error-snackbar'
    }); */
    ///  }
  };
}
