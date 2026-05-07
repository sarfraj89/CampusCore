import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentService, Department } from '../department.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DepartmentDialogComponent } from '../department-dialog/department-dialog.component';

import { NotificationService } from '../../../core/services/notification.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  private departmentService = inject(DepartmentService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);

  departments: Department[] = [];
  displayedColumns: string[] = ['name', 'code', 'actions'];
  loading = false;

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.departments = data;
        this.loading = false;
      },
      error: () => {
        this.notify.error('Failed to load departments');
        this.loading = false;
      }
    });
  }

  openDialog(department?: Department): void {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
      width: '400px',
      data: department ? { ...department } : { name: '', code: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        if (result.id) {
          this.departmentService.update(result.id, result).subscribe({
            next: () => {
              this.notify.success('Department updated successfully');
              this.loadDepartments();
            },
            error: () => {
              this.notify.error('Failed to update department');
              this.loading = false;
            }
          });
        } else {
          this.departmentService.create(result).subscribe({
            next: () => {
              this.notify.success('Department created successfully');
              this.loadDepartments();
            },
            error: () => {
              this.notify.error('Failed to create department');
              this.loading = false;
            }
          });
        }
      }
    });
  }

  deleteDepartment(id: string): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.loading = true;
      this.departmentService.delete(id).subscribe({
        next: () => {
          this.notify.success('Department deleted successfully');
          this.loadDepartments();
        },
        error: () => {
          this.notify.error('Failed to delete department');
          this.loading = false;
        }
      });
    }
  }
}
