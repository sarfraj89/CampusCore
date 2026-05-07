import { Routes } from '@angular/router';
import { MarkResultsComponent } from './mark-results/mark-results.component';

export const examResultRoutes: Routes = [
  { path: 'entry', component: MarkResultsComponent },
  { path: '', redirectTo: 'entry', pathMatch: 'full' }
];
