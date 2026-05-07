import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService, Student } from '../student.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudentDialogComponent } from '../student-dialog/student-dialog.component';
import { StudentAnalysisDialogComponent } from '../../ai-insights/student-analysis-dialog/student-analysis-dialog.component';
import { NotificationService } from '../../../core/services/notification.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatTooltipModule, MatProgressSpinnerModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);

  students: Student[] = [];
  displayedColumns: string[] = ['rollNumber', 'fullName', 'course', 'semester', 'department', 'actions'];
  loading = false;

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getAll().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: () => {
        this.notify.error('Failed to load students');
        this.loading = false;
      }
    });
  }

  openAnalysis(student: Student): void {
    this.dialog.open(StudentAnalysisDialogComponent, {
      width: '800px',
      data: { studentId: student.id, studentName: student.fullName }
    });
  }

  openDialog(student?: Student): void {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '600px',
      data: student ? { ...student } : { 
        fullName: '', email: '', rollNumber: '', course: '', 
        semester: 1, academicYear: '', division: '', departmentId: '' 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        if (result.id) {
          this.studentService.update(result.id, result).subscribe({
            next: () => {
              this.notify.success('Student updated successfully');
              this.loadStudents();
            },
            error: () => {
              this.notify.error('Failed to update student');
              this.loading = false;
            }
          });
        } else {
          this.studentService.create(result).subscribe({
            next: () => {
              this.notify.success('Student admitted successfully');
              this.loadStudents();
            },
            error: () => {
              this.notify.error('Failed to admit student');
              this.loading = false;
            }
          });
        }
      }
    });
  }

  deleteStudent(id: string): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.loading = true;
      this.studentService.delete(id).subscribe({
        next: () => {
          this.notify.success('Student record deleted');
          this.loadStudents();
        },
        error: () => {
          this.notify.error('Failed to delete student');
          this.loading = false;
        }
      });
    }
  }
}
