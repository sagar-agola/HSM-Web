import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from "rxjs";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'resetcache-modal',
  templateUrl: './resetcachemodal.component.html',
  styleUrls: ['./resetcachemodal.component.scss']
})

export class ResetCacheModalComponent implements OnInit {

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<ResetCacheModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public toastr: ToastrService,) {
        
    }
    ngOnInit(): void {
    }

    onLogOut(){
        this.router.navigate(["/login"]);
        localStorage.removeItem("loggUser");
        // localStorage.removeItem("hierarchyData");
      }

    clearCache(){
        localStorage.removeItem("hierarchyData");
        localStorage.removeItem("assethierarchyData");
        localStorage.removeItem('activeCols');
        localStorage.removeItem('taskidNo');
        localStorage.removeItem('parent');
        localStorage.removeItem('fmode');
        localStorage.removeItem('desc');
        localStorage.removeItem('fscore');
        localStorage.removeItem('limits');
        localStorage.removeItem('corrective');
        localStorage.removeItem('tasktype');
        localStorage.removeItem('interval');
        localStorage.removeItem('mainunit');
        localStorage.removeItem('maintitem');
        localStorage.removeItem('maintsubitem');
        localStorage.removeItem('buildspec');
        localStorage.removeItem('manufacture');

        localStorage.removeItem('activeColshsm');
        localStorage.removeItem('taskidNohsm');
        localStorage.removeItem('parenthsm');
        localStorage.removeItem('fmodehsm');
        localStorage.removeItem('deschsm');
        localStorage.removeItem('fscorehsm');
        localStorage.removeItem('limitshsm');
        localStorage.removeItem('correctivehsm');
        localStorage.removeItem('tasktypehsm');
        localStorage.removeItem('intervalhsm');
        localStorage.removeItem('mainunithsm');
        localStorage.removeItem('maintitemhsm');
        localStorage.removeItem('maintsubitemhsm');
        localStorage.removeItem('buildspechsm');
        localStorage.removeItem('manufacturehsm');
        this.toastr.success("Successfully clear cache!", 'Success');
        this.onLogOut();
        this.close();
      }

    close(): void {
        this.dialogRef.close();
    }

}
