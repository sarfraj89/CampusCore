import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DepartmentService, Department } from '../../departments/department.service';
import { SubjectService, Subject } from '../../subjects/subject.service';
import { StudentService, Student } from '../../students/student.service';
import { AttendanceService, Attendance } from '../attendance.service';

import { NotificationService } from '../../../core/services/notification.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-mark-attendance',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, 
    MatSelectModule, MatDatepickerModule, MatButtonModule, MatCheckboxModule,
    MatTableModule, MatCardModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.scss']
})
export class MarkAttendanceComponent implements OnInit {
  private fb = inject(FormBuilder);
  private deptService = inject(DepartmentService);
  private subjectService = inject(SubjectService);
  private studentService = inject(StudentService);
  private attendanceService = inject(AttendanceService);
  private notify = inject(NotificationService);

  departments: Department[] = [];
  subjects: Subject[] = [];
  students: any[] = [];
  loading = false;
  
  filterForm: FormGroup = this.fb.group({
    departmentId: ['', Validators.required],
    semester: ['', Validators.required],
    subjectId: ['', Validators.required],
    date: [new Date(), Validators.required],
    lectureSlot: ['', Validators.required]
  });

  slots = ['09:00 - 10:00', '10:00 - 11:00', '11:15 - 12:15', '12:15 - 01:15', '02:00 - 03:00', '03:00 - 04:00'];

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
            status: 'PRESENT'
          }));
          this.loading = false;
        },
        error: () => {
          this.notify.error('Failed to load students for attendance');
          this.loading = false;
        }
      });
    }
  }

  toggleStatus(student: any): void {
    student.status = student.status === 'PRESENT' ? 'ABSENT' : 'PRESENT';
  }

  setAllStatus(status: 'PRESENT' | 'ABSENT'): void {
    this.students.forEach(s => s.status = status);
  }

  clearFilter(): void {
    this.students = [];
    this.filterForm.reset({ date: new Date() });
  }

  saveAttendance(): void {
    this.loading = true;
    const { subjectId, date, lectureSlot } = this.filterForm.value;
    const formattedDate = new Date(date).toISOString().split('T')[0];
    
    const attendanceRecords: Attendance[] = this.students.map(s => ({
      studentId: s.id!,
      subjectId,
      date: formattedDate,
      lectureSlot,
      status: s.status
    }));

    this.attendanceService.markBulk(attendanceRecords).subscribe({
      next: () => {
        this.notify.success('Attendance marked successfully!');
        this.students = [];
        this.filterForm.reset({ date: new Date() });
        this.loading = false;
      },
      error: () => {
        this.notify.error('Failed to save attendance');
        this.loading = false;
      }
    });
  }

  getPresentCount(): number {
    return this.students.filter(s => s.status === 'PRESENT').length;
  }

  getAbsentCount(): number {
    return this.students.filter(s => s.status === 'ABSENT').length;
  }
}
