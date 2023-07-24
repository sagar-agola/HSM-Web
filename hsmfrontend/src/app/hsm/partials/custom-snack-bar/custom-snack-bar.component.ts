import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-custom-snack-bar',
  templateUrl: './custom-snack-bar.component.html',
  styleUrls: ['./custom-snack-bar.component.scss']
})
export class CustomSnackBarComponent implements OnInit {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private clipBoard: Clipboard,
    private _snackRef: MatSnackBarRef<CustomSnackBarComponent>
  ) {}
  public errorMessage = '';
  public operationID;
  public copied = false;
  public buttonText = 'Copy ID';
  public header = "Error";
  ngOnInit(): void {
    this.errorMessage = this.data.error ? this.data.error.ErrorMessage : this.data.statusText;
    this.operationID = this.data.error?.OperationId;

    if(this.errorMessage === undefined && this.data.status === 401)
    {
        this.header = "Unauthorized"
        this.errorMessage = 'If you think this is wrong. Please ask an admin for assistance.'
    } 
  }
  dismiss() {
    this._snackRef.dismiss();
  }
  callServiceToCopy(){
    this.clipBoard.copy(this.operationID);
    this.copied = true;
    this.buttonText = "Copied!";
  }
}
