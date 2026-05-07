import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Faculty {
  id?: string;
  fullName: string;
  email: string;
  designation: string;
  departmentId: string;
  departmentName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/faculty`;

  getAll(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(this.apiUrl);
  }

  getById(id: string): Observable<Faculty> {
    return this.http.get<Faculty>(`${this.apiUrl}/${id}`);
  }

  create(faculty: Faculty): Observable<Faculty> {
    return this.http.post<Faculty>(this.apiUrl, faculty);
  }

  update(id: string, faculty: Faculty): Observable<Faculty> {
    return this.http.put<Faculty>(`${this.apiUrl}/${id}`, faculty);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
