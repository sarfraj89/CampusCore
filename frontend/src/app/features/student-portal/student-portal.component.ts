import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';
import { StudentService, Student } from '../students/student.service';
import { Attendance, AttendanceService } from '../attendance/attendance.service';
import { ExamResult, ExamResultService } from '../exam-results/exam-result.service';
import { Department, DepartmentService } from '../departments/department.service';

@Component({
  selector: 'app-student-portal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './student-portal.component.html',
  styleUrls: ['./student-portal.component.scss']
})
export class StudentPortalComponent implements OnInit {
  private readonly storageKey = 'campuscore.studentPortalId';

  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private attendanceService = inject(AttendanceService);
  private examResultService = inject(ExamResultService);
  private departmentService = inject(DepartmentService);

  departments: Department[] = [];
  attendanceRecords: Attendance[] = [];
  examResults: ExamResult[] = [];
  currentStudent: Student | null = null;
  loading = false;
  submitting = false;
  message = '';
  error = '';

  studentForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    rollNumber: ['', [Validators.required]],
    course: ['', [Validators.required]],
    semester: [1, [Validators.required, Validators.min(1)]],
    academicYear: ['2025-2026', [Validators.required]],
    division: ['', [Validators.required]],
    guardianName: [''],
    guardianPhone: [''],
    dateOfBirth: [''],
    address: [''],
    departmentId: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadDepartments();

    const storedStudentId = localStorage.getItem(this.storageKey);
    if (storedStudentId) {
      this.loadStudentPortal(storedStudentId);
    }
  }

  registerStudent(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = '';
    this.message = '';

    const payload = {
      ...this.studentForm.getRawValue(),
      dateOfBirth: this.studentForm.value.dateOfBirth || null
    } as Student;

    this.studentService.create(payload).subscribe({
      next: student => {
        if (!student.id) {
          this.submitting = false;
          this.error = 'Registration completed, but no student ID was returned.';
          return;
        }

        localStorage.setItem(this.storageKey, student.id);
        this.currentStudent = student;
        this.message = 'Registration completed successfully.';
        this.loadStudentPortal(student.id);
        this.submitting = false;
      },
      error: () => {
        this.error = 'Unable to complete registration. Please review the form and try again.';
        this.submitting = false;
      }
    });
  }

  loadStudentPortal(studentId: string): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      student: this.studentService.getById(studentId),
      attendance: this.attendanceService.getByStudent(studentId),
      results: this.examResultService.getByStudent(studentId)
    }).subscribe({
      next: ({ student, attendance, results }) => {
        this.currentStudent = student;
        this.attendanceRecords = attendance;
        this.examResults = results;
        this.loading = false;
      },
      error: () => {
        this.error = 'Student profile was found, but attendance or exam results could not be loaded yet.';
        this.attendanceRecords = [];
        this.examResults = [];
        this.loading = false;
      }
    });
  }

  clearSavedSession(): void {
    localStorage.removeItem(this.storageKey);
    this.currentStudent = null;
    this.attendanceRecords = [];
    this.examResults = [];
    this.message = '';
  }

  get attendanceRate(): number {
    if (!this.attendanceRecords.length) {
      return 0;
    }

    const attended = this.attendanceRecords.filter(record => record.status !== 'ABSENT').length;
    return Math.round((attended / this.attendanceRecords.length) * 100);
  }

  get averageMarks(): number {
    if (!this.examResults.length) {
      return 0;
    }

    const totalPercentage = this.examResults.reduce((sum, result) => sum + (result.marksObtained / result.totalMarks) * 100, 0);
    return Math.round(totalPercentage / this.examResults.length);
  }

  get attendancePresentCount(): number {
    return this.attendanceRecords.filter(record => record.status === 'PRESENT' || record.status === 'LATE' || record.status === 'EXCUSED').length;
  }

  get attendanceAbsentCount(): number {
    return this.attendanceRecords.filter(record => record.status === 'ABSENT').length;
  }

  private loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: departments => (this.departments = departments),
      error: () => {
        this.error = 'Unable to load departments right now.';
      }
    });
  }
}