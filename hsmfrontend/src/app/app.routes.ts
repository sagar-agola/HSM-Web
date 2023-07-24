import { Routes, RouterModule } from '@angular/router';
import { RedirectComponent } from './shared/components/redirect/redirect.component';

export const rootRouterConfig: Routes = [
    { path: '**', component: RedirectComponent },

]
