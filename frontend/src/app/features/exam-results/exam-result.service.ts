import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ExamResult {
  id?: string;
  studentId: string;
  studentName?: string;
  rollNumber?: string;
  subjectId: string;
  subjectName?: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  semester: number;
  examDate: string;
  remarks?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExamResultService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/exam-results`;

  getByFilter(subjectId: string, semester: number): Observable<ExamResult[]> {
    const params = new HttpParams()
      .set('subjectId', subjectId)
      .set('semester', semester.toString());
    return this.http.get<ExamResult[]>(`${this.apiUrl}/filter`, { params });
  }

  getByStudent(studentId: string): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/student/${studentId}`);
  }

  saveBulk(results: ExamResult[]): Observable<ExamResult[]> {
    return this.http.post<ExamResult[]>(`${this.apiUrl}/bulk`, results);
  }
}
