import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AIService, AIAnalysisResponse } from '../ai.service';

@Component({
  selector: 'app-student-analysis-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="p-0 overflow-hidden rounded-xl">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
        <h2 class="text-xl font-bold flex items-center gap-2 m-0">
          <mat-icon>psychology</mat-icon> AI Academic Insights
        </h2>
        <button mat-icon-button (click)="dialogRef.close()" class="text-white">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="p-8 max-h-[70vh] overflow-y-auto bg-slate-50">
        <div *ngIf="loading" class="flex flex-col items-center justify-center py-12 gap-4">
          <mat-progress-spinner mode="indeterminate" color="primary" [diameter]="50"></mat-progress-spinner>
          <p class="text-slate-500 animate-pulse">Analyzing student records...</p>
        </div>

        <div *ngIf="!loading && analysis" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 prose prose-slate max-w-none">
            <div class="whitespace-pre-wrap leading-relaxed text-slate-700">{{ analysis }}</div>
          </div>
        </div>

        <div *ngIf="!loading && !analysis" class="text-center py-12 text-slate-400">
          <mat-icon class="text-5xl mb-2 opacity-10">error_outline</mat-icon>
          <p>Failed to generate analysis. Please try again later.</p>
        </div>
      </div>

      <div class="p-4 bg-white border-t flex justify-end">
        <button mat-raised-button color="primary" (click)="dialogRef.close()">Close Analysis</button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .whitespace-pre-wrap { font-family: 'Inter', sans-serif; }
  `]
})
export class StudentAnalysisDialogComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<StudentAnalysisDialogComponent>);
  private aiService = inject(AIService);
  
  loading = true;
  analysis = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { studentId: string, studentName: string }) {}

  ngOnInit(): void {
    this.aiService.getStudentAnalysis(this.data.studentId).subscribe({
      next: (res) => {
        this.analysis = res.analysis;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
