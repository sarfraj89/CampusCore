import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Attendance {
  id?: string;
  studentId: string;
  studentName?: string;
  rollNumber?: string;
  subjectId: string;
  subjectName?: string;
  facultyId?: string;
  facultyName?: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  date: string;
  lectureSlot: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/attendance`;

  getByFilter(date: string, subjectId: string): Observable<Attendance[]> {
    const params = new HttpParams()
      .set('date', date)
      .set('subjectId', subjectId);
    return this.http.get<Attendance[]>(`${this.apiUrl}/filter`, { params });
  }

  getByStudent(studentId: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/student/${studentId}`);
  }

  markBulk(attendanceList: Attendance[]): Observable<Attendance[]> {
    return this.http.post<Attendance[]>(`${this.apiUrl}/bulk`, attendanceList);
  }
}
