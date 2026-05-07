import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DepartmentService, Department } from '../../departments/department.service';
import { SubjectService, Subject } from '../../subjects/subject.service';
import { StudentService, Student } from '../../students/student.service';
import { ExamResultService, ExamResult } from '../exam-result.service';

import { NotificationService } from '../../../core/services/notification.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-mark-results',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, 
    MatSelectModule, MatDatepickerModule, MatButtonModule,
    MatTableModule, MatCardModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './mark-results.component.html',
  styleUrls: ['./mark-results.component.scss']
})
export class MarkResultsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private deptService = inject(DepartmentService);
  private subjectService = inject(SubjectService);
  private studentService = inject(StudentService);
  private resultService = inject(ExamResultService);
  private notify = inject(NotificationService);

  departments: Department[] = [];
  subjects: Subject[] = [];
  students: any[] = [];
  loading = false;
  
  filterForm: FormGroup = this.fb.group({
    departmentId: ['', Validators.required],
    semester: ['', Validators.required],
    subjectId: ['', Validators.required],
    examDate: [new Date(), Validators.required],
    totalMarks: [100, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    this.deptService.getAll().subscribe(data => this.departments = data);
    
    this.filterForm.get('departmentId')?.valueChanges.subscribe(deptId => {
      if (deptId) {
        this.subjectService.getByDepartment(deptId).subscribe(data => this.subjects = data);
      }
    });
  }

  loadStudents(): void {
    if (this.filterForm.valid) {
      this.loading = true;
      const { departmentId, semester } = this.filterForm.value;
      this.studentService.getByFilter(departmentId, semester).subscribe({
        next: (data) => {
          this.students = data.map(s => ({
            ...s,
            marksObtained: 0,
            remarks: ''
          }));
          this.loading = false;
        },
        error: () => {
          this.notify.error('Failed to load students for results');
          this.loading = false;
        }
      });
    }
  }

  clearFilter(): void {
    this.filterForm.reset({ totalMarks: 100, examDate: new Date() });
    this.students = [];
  }

  calculateGrade(marks: number, total: number): string {
    if (!total || total === 0) return 'F';
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return 'O';
    if (percentage >= 80) return 'A+';
    if (percentage >= 70) return 'A';
    if (percentage >= 60) return 'B+';
    if (percentage >= 50) return 'B';
    if (percentage >= 40) return 'C';
    return 'F';
  }

  saveResults(): void {
    this.loading = true;
    const { subjectId, semester, examDate, totalMarks } = this.filterForm.value;
    const formattedDate = new Date(examDate).toISOString().split('T')[0];
    
    const results: ExamResult[] = this.students.map(s => ({
      studentId: s.id!,
      subjectId,
      semester,
      examDate: formattedDate,
      marksObtained: s.marksObtained,
      totalMarks,
      grade: this.calculateGrade(s.marksObtained, totalMarks),
      remarks: s.remarks
    }));

    this.resultService.saveBulk(results).subscribe({
      next: () => {
        this.notify.success('Exam results saved successfully!');
        this.students = [];
        this.filterForm.reset({ totalMarks: 100, examDate: new Date() });
        this.loading = false;
      },
      error: () => {
        this.notify.error('Failed to save exam results');
        this.loading = false;
      }
    });
  }
}
