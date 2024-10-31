// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { SearchFormComponent } from './search-form/search-form.component';
import { SummaryComponent } from './summary/summary.component';



export const routes: Routes = [
  { path: 'search', component: SearchFormComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'summary', component: SummaryComponent },
  { path: '', redirectTo: '/summary', pathMatch: 'full' }
];
