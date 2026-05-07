import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Subject {
  id?: string;
  name: string;
  code: string;
  departmentId: string;
  departmentName?: string;
  semester: number;
  credits?: number;
  facultyName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/subjects`;

  getAll(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl);
  }

  getByDepartment(deptId: string): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/department/${deptId}`);
  }

  create(subject: Subject): Observable<Subject> {
    return this.http.post<Subject>(this.apiUrl, subject);
  }

  update(id: string, subject: Subject): Observable<Subject> {
    return this.http.put<Subject>(`${this.apiUrl}/${id}`, subject);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
