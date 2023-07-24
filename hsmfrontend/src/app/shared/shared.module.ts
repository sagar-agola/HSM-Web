// Core Modules
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { CommonModule } from '@angular/common';

// Shared Services
import { BrowserModule } from '@angular/platform-browser';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { LoadingDirective } from './directives/loading-indicator.directives';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
    declarations: [
        //RedirectComponent,
        LoadingIndicatorComponent,
        LoadingDirective
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        NgxPageScrollModule,
        BrowserModule,
        MatProgressSpinnerModule
    ],
    exports: [
        LoadingIndicatorComponent,
        LoadingDirective,
        MatProgressSpinnerModule
    ],
    providers: [
    ]
})

export class SharedModule {
    constructor() { }
} 