import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Project } from '../../../core/models/models';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="projects-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Program & Project Portfolio</h1>
          <p class="page-subtitle">Track NPI, R&D, and Production Ramp projects across all global facilities</p>
        </div>
        <button class="fiq-btn fiq-btn-primary" (click)="showCreateModal = true">
          ➕ Create New Project
        </button>
      </div>

      <!-- Search & Filters Bar -->
      <div class="fiq-card filter-bar">
        <div class="filter-group">
          <input
            type="text"
            class="fiq-input"
            placeholder="Search by code or project name..."
            [(ngModel)]="searchQuery"
            (input)="loadProjects()"
          />
        </div>

        <div class="filter-group">
          <select class="fiq-input" [(ngModel)]="statusFilter" (change)="loadProjects()">
            <option value="">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="At Risk">At Risk</option>
            <option value="Blocked">Blocked</option>
            <option value="Completed">Completed</option>
          </select>

          <select class="fiq-input" [(ngModel)]="healthFilter" (change)="loadProjects()">
            <option value="">All Health Indicators</option>
            <option value="Green">Green (Healthy)</option>
            <option value="Yellow">Yellow (At Risk)</option>
            <option value="Red">Red (Critical)</option>
          </select>
        </div>
      </div>

      <!-- Projects Data Table -->
      <div class="fiq-table-container">
        <table class="fiq-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Project Name</th>
              <th>Customer</th>
              <th>Facility Site</th>
              <th>Status</th>
              <th>Health</th>
              <th>Priority</th>
              <th>Progress</th>
              <th>Target Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of projects">
              <td>
                <strong class="code-link" [routerLink]="['/projects', p.id]">{{ p.project_code }}</strong>
              </td>
              <td>
                <a [routerLink]="['/projects', p.id]" class="proj-name">{{ p.name }}</a>
              </td>
              <td>{{ p.customer_name || 'Aerospace Dynamics' }}</td>
              <td>{{ p.site_name || 'Hyderabad Main' }}</td>
              <td>
                <span class="badge" [ngClass]="getStatusBadgeClass(p.status)">{{ p.status }}</span>
              </td>
              <td>
                <span class="badge" [ngClass]="getHealthBadgeClass(p.health)">{{ p.health }}</span>
              </td>
              <td>
                <span class="badge badge-gray">{{ p.priority }}</span>
              </td>
              <td>
                <div class="progress-wrap">
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="p.progress_percent" [ngClass]="getHealthBadgeClass(p.health)"></div>
                  </div>
                  <span class="progress-text">{{ p.progress_percent | number:'1.0-0' }}%</span>
                </div>
              </td>
              <td>{{ p.target_date | date:'mediumDate' }}</td>
              <td>
                <a [routerLink]="['/projects', p.id]" class="fiq-btn fiq-btn-secondary btn-sm">View Details</a>
              </td>
            </tr>
            <tr *ngIf="projects.length === 0">
              <td colspan="10" class="empty-state">No projects found matching the criteria.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create Project Modal -->
      <div class="modal-overlay" *ngIf="showCreateModal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Initiate New Manufacturing Project</h3>
            <button class="close-btn" (click)="showCreateModal = false">✕</button>
          </div>
          <form (ngSubmit)="onCreateProject()" class="modal-form">
            <div class="form-row">
              <div class="form-group">
                <label>Project Code</label>
                <input type="text" class="fiq-input" [(ngModel)]="newProj.project_code" name="project_code" required placeholder="PRJ-HYD-501" />
              </div>
              <div class="form-group">
                <label>Project Name</label>
                <input type="text" class="fiq-input" [(ngModel)]="newProj.name" name="name" required placeholder="EV Battery Pack Assembly Line" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Customer</label>
                <select class="fiq-input" [(ngModel)]="newProj.customer_id" name="customer_id">
                  <option [ngValue]="1">Aerospace Dynamics Corp</option>
                  <option [ngValue]="2">Tesla Mobility Solutions</option>
                  <option [ngValue]="3">Siemens Energy Tech</option>
                </select>
              </div>
              <div class="form-group">
                <label>Facility Site</label>
                <select class="fiq-input" [(ngModel)]="newProj.site_id" name="site_id">
                  <option [ngValue]="1">Hyderabad Main Campus (HYD-01)</option>
                  <option [ngValue]="2">Bangalore Innovation Hub (BLR-02)</option>
                  <option [ngValue]="3">Chennai Assembly Plant (CHE-03)</option>
                  <option [ngValue]="4">Pune Precision Line (PUN-04)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Description & Scope</label>
              <textarea class="fiq-input" rows="3" [(ngModel)]="newProj.description" name="description" placeholder="Project objectives, NPI milestones, and deliverable specs..."></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="fiq-btn fiq-btn-secondary" (click)="showCreateModal = false">Cancel</button>
              <button type="submit" class="fiq-btn fiq-btn-primary">Launch Project</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .projects-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }

    .filter-group {
      display: flex;
      gap: 12px;
    }

    .code-link {
      color: var(--accent-blue);
      cursor: pointer;
    }

    .proj-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .progress-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .progress-bar {
      flex: 1;
      height: 6px;
      background: var(--bg-primary);
      border-radius: 3px;
      overflow: hidden;
      min-width: 60px;
    }

    .progress-fill {
      height: 100%;
      background: var(--accent-blue);
    }

    .btn-sm {
      padding: 4px 10px;
      font-size: 11px;
    }

    .empty-state {
      text-align: center;
      padding: 36px;
      color: var(--text-muted);
    }

    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 300;
    }

    .modal-card {
      width: 100%;
      max-width: 600px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 18px;
      cursor: pointer;
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 12px;
    }
  `]
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  searchQuery = '';
  statusFilter = '';
  healthFilter = '';
  showCreateModal = false;

  newProj = {
    project_code: '',
    name: '',
    description: '',
    customer_id: 1,
    site_id: 1,
    priority: 'High'
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.apiService.getProjects(this.searchQuery, this.statusFilter, this.healthFilter).subscribe(res => {
      this.projects = res;
    });
  }

  onCreateProject() {
    if (!this.newProj.project_code || !this.newProj.name) return;
    this.apiService.createProject(this.newProj).subscribe(res => {
      this.showCreateModal = false;
      this.loadProjects();
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'In Progress': return 'badge-blue';
      case 'Completed': return 'badge-green';
      case 'At Risk': return 'badge-amber';
      case 'Blocked': return 'badge-red';
      default: return 'badge-gray';
    }
  }

  getHealthBadgeClass(health: string): string {
    switch (health) {
      case 'Green': return 'badge-green';
      case 'Yellow': return 'badge-amber';
      case 'Red': return 'badge-red';
      default: return 'badge-gray';
    }
  }
}
