import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Student {
  id?: string;
  fullName: string;
  email: string;
  rollNumber: string;
  course: string;
  semester: number;
  academicYear: string;
  division: string;
  guardianName?: string;
  guardianPhone?: string;
  dateOfBirth?: string;
  address?: string;
  departmentId: string;
  departmentName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/students`;

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  getByFilter(departmentId: string, semester: number): Observable<Student[]> {
    const params = new HttpParams()
      .set('departmentId', departmentId)
      .set('semester', semester.toString());
    return this.http.get<Student[]>(`${this.apiUrl}/filter`, { params });
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  update(id: string, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
