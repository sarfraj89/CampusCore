import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Faculty } from '../faculty.service';
import { DepartmentService, Department } from '../../departments/department.service';

@Component({
  selector: 'app-faculty-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './faculty-dialog.component.html',
  styleUrls: ['./faculty-dialog.component.scss']
})
export class FacultyDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private departmentService = inject(DepartmentService);
  
  departments: Department[] = [];
  form: FormGroup = this.fb.group({
    id: [this.data.id],
    fullName: [this.data.fullName, [Validators.required]],
    email: [this.data.email, [Validators.required, Validators.email]],
    designation: [this.data.designation, [Validators.required]],
    departmentId: [this.data.departmentId, [Validators.required]]
  });

  constructor(
    public dialogRef: MatDialogRef<FacultyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Faculty
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
