import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AIAnalysisResponse {
  analysis: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/ai`;

  getStudentAnalysis(studentId: string): Observable<AIAnalysisResponse> {
    return this.http.get<AIAnalysisResponse>(`${this.apiUrl}/analyze-student/${studentId}`);
  }

  chat(question: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/chat`, question, { responseType: 'text' });
  }
}
