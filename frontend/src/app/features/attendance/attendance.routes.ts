import { Routes } from '@angular/router';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';

export const attendanceRoutes: Routes = [
  { path: 'mark', component: MarkAttendanceComponent },
  { path: '', redirectTo: 'mark', pathMatch: 'full' }
];
