import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacultyService, Faculty } from '../faculty.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FacultyDialogComponent } from '../faculty-dialog/faculty-dialog.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-faculty-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './faculty-list.component.html',
  styleUrls: ['./faculty-list.component.scss']
})
export class FacultyListComponent implements OnInit {
  private facultyService = inject(FacultyService);
  private dialog = inject(MatDialog);

  faculty: Faculty[] = [];
  loading: boolean = false;
  displayedColumns: string[] = ['fullName', 'email', 'designation', 'department', 'actions'];

  ngOnInit(): void {
    this.loadFaculty();
  }

  loadFaculty(): void {
    this.loading = true;
    this.facultyService.getAll().subscribe({
      next: (data) => {
        this.faculty = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openDialog(faculty?: Faculty): void {
    const dialogRef = this.dialog.open(FacultyDialogComponent, {
      width: '500px',
      data: faculty ? { ...faculty } : { fullName: '', email: '', designation: '', departmentId: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.facultyService.update(result.id, result).subscribe(() => this.loadFaculty());
        } else {
          this.facultyService.create(result).subscribe(() => this.loadFaculty());
        }
      }
    });
  }

  deleteFaculty(id: string): void {
    if (confirm('Are you sure you want to delete this faculty member?')) {
      this.facultyService.delete(id).subscribe(() => this.loadFaculty());
    }
  }
}
