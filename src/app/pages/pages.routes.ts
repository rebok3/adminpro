import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromisesComponent } from './promises/promises.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { LoginGuardGuard } from '../services/service.index';
import { AdminGuard } from '../services/service.index';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { HospitalsComponent } from './hospitals/hospitals.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { DoctorComponent } from './doctors/doctor.component';
import { SearchComponent } from './search/search.component';
import { CheckTokenGuard } from '../services/service.index';

const pagesRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [ CheckTokenGuard ],
        data: { title: 'Dashboard' }
    },
    { path: 'progress', component: ProgressComponent, data: { title: 'Progress' } },
    { path: 'graficas1', component: Graficas1Component, data: { title: 'Graphics' } },
    { path: 'promises', component: PromisesComponent, data: { title: 'Promises' } },
    { path: 'rxjs', component: RxjsComponent, data: { title: 'RxJS' } },
    { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Account Settings' } },
    { path: 'profile', component: ProfileComponent, data: { title: 'User Profile' } },
    { path: 'search/:term', component: SearchComponent, data: { title: 'Searcher' } },
    // Admin
    { 
        path: 'users',
        component: UsersComponent,
        canActivate: [ AdminGuard ],
        data: { title: 'User Control' }
    },
    { path: 'hospitals', component: HospitalsComponent, data: { title: 'Hospital Control' } },
    { path: 'doctors', component: DoctorsComponent, data: { title: 'Doctor Control' } },
    { path: 'doctor/:id', component: DoctorComponent, data: { title: 'Doctor Profile' } },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );