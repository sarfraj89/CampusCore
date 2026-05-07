import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Student } from '../student.service';
import { DepartmentService, Department } from '../../departments/department.service';

@Component({
  selector: 'app-student-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.scss']
})
export class StudentDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private departmentService = inject(DepartmentService);
  
  departments: Department[] = [];
  form: FormGroup = this.fb.group({
    id: [this.data.id],
    fullName: [this.data.fullName, [Validators.required]],
    email: [this.data.email, [Validators.required, Validators.email]],
    rollNumber: [this.data.rollNumber, [Validators.required]],
    course: [this.data.course, [Validators.required]],
    semester: [this.data.semester, [Validators.required, Validators.min(1), Validators.max(8)]],
    academicYear: [this.data.academicYear, [Validators.required]],
    division: [this.data.division, [Validators.required]],
    departmentId: [this.data.departmentId, [Validators.required]],
    guardianName: [this.data.guardianName],
    guardianPhone: [this.data.guardianPhone],
    dateOfBirth: [this.data.dateOfBirth],
    address: [this.data.address]
  });

  constructor(
    public dialogRef: MatDialogRef<StudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Student
  ) {}

  ngOnInit(): void {
    this.departmentService.getAll().subscribe(data => this.departments = data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
