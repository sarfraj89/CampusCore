import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectService, Subject } from '../subject.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SubjectDialogComponent } from '../subject-dialog/subject-dialog.component';

import { NotificationService } from '../../../core/services/notification.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule, 
    MatDialogModule, MatTooltipModule, MatProgressSpinnerModule
  ],
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss']
})
export class SubjectListComponent implements OnInit {
  private subjectService = inject(SubjectService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);

  subjects: Subject[] = [];
  displayedColumns: string[] = ['code', 'name', 'semester', 'department', 'actions'];
  loading = false;

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.loading = true;
    this.subjectService.getAll().subscribe({
      next: (data) => {
        this.subjects = data;
        this.loading = false;
      },
      error: () => {
        this.notify.error('Failed to load subjects');
        this.loading = false;
      }
    });
  }

  openDialog(subject?: Subject): void {
    const dialogRef = this.dialog.open(SubjectDialogComponent, {
      width: '500px',
      data: subject ? { ...subject } : { name: '', code: '', departmentId: '', semester: 1 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        if (result.id) {
          this.subjectService.update(result.id, result).subscribe({
            next: () => {
              this.notify.success('Subject updated successfully');
              this.loadSubjects();
            },
            error: () => {
              this.notify.error('Failed to update subject');
              this.loading = false;
            }
          });
        } else {
          this.subjectService.create(result).subscribe({
            next: () => {
              this.notify.success('Subject created successfully');
              this.loadSubjects();
            },
            error: () => {
              this.notify.error('Failed to create subject');
              this.loading = false;
            }
          });
        }
      }
    });
  }

  deleteSubject(id: string): void {
    if (confirm('Are you sure you want to delete this subject?')) {
      this.loading = true;
      this.subjectService.delete(id).subscribe({
        next: () => {
          this.notify.success('Subject deleted successfully');
          this.loadSubjects();
        },
        error: () => {
          this.notify.error('Failed to delete subject');
          this.loading = false;
        }
      });
    }
  }
}
