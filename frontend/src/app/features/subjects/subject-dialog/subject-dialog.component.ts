import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from '../subject.service';
import { DepartmentService, Department } from '../../departments/department.service';

@Component({
  selector: 'app-subject-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule],
  templateUrl: './subject-dialog.component.html',
  styleUrls: ['./subject-dialog.component.scss']
})
export class SubjectDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private departmentService = inject(DepartmentService);
  
  departments: Department[] = [];
  form: FormGroup = this.fb.group({
    id: [this.data.id],
    name: [this.data.name, [Validators.required]],
    code: [this.data.code, [Validators.required]],
    departmentId: [this.data.departmentId, [Validators.required]],
    semester: [this.data.semester, [Validators.required, Validators.min(1), Validators.max(8)]]
  });

  constructor(
    public dialogRef: MatDialogRef<SubjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Subject
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
