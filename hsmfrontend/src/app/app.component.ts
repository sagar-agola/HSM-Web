import { Component } from '@angular/core';
import {Title} from "@angular/platform-browser";
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component

declare var preloadImage: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {

  constructor(private titleService:Title,
      private router: Router,
      private bnIdle: BnNgIdleService
    ) {
    this.titleService.setTitle("Holistic Strategy Management");
  }

  ngOnInit(): void {
    this.bnIdle.startWatching(900).subscribe((res) => {
      if(res) {
          // console.log("session expired");
          this.onLogout();
      }
    })
  }

  onLogout(){
    this.router.navigate(["/login"]);

    localStorage.removeItem("loggUser");
}

}
