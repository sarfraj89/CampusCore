import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'student-portal',
    loadComponent: () => import('./features/student-portal/student-portal.component').then(m => m.StudentPortalComponent)
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes) 
  },
  { 
    path: '', 
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'departments',
        loadChildren: () => import('./features/departments/department.routes').then(m => m.departmentRoutes)
      },
      {
        path: 'faculty',
        loadChildren: () => import('./features/faculty/faculty.routes').then(m => m.facultyRoutes)
      },
      {
        path: 'students',
        loadChildren: () => import('./features/students/student.routes').then(m => m.studentRoutes)
      },
      {
        path: 'subjects',
        loadChildren: () => import('./features/subjects/subject.routes').then(m => m.subjectRoutes)
      },
      {
        path: 'attendance',
        loadChildren: () => import('./features/attendance/attendance.routes').then(m => m.attendanceRoutes)
      },
      {
        path: 'exam-results',
        loadChildren: () => import('./features/exam-results/exam-result.routes').then(m => m.examResultRoutes)
      },
      { 
        path: 'ai-chat', 
        loadComponent: () => import('./features/ai-insights/ai-chat/ai-chat.component').then(m => m.AIChatComponent) 
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
