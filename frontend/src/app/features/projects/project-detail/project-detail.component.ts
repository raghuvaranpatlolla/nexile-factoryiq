import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Project } from '../../../core/models/models';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="project-detail-page" *ngIf="project">
      <!-- Breadcrumb Header -->
      <div class="breadcrumb">
        <a routerLink="/projects">Projects</a> &gt; <span>{{ project.project_code }}</span>
      </div>

      <!-- Project Header -->
      <div class="fiq-card project-header-card">
        <div class="header-main">
          <div>
            <div class="code-badge">{{ project.project_code }}</div>
            <h1 class="project-title">{{ project.name }}</h1>
            <p class="project-sub">
              Customer: <strong>{{ project.customer_name || 'Tesla Mobility' }}</strong> |
              Facility: <strong>{{ project.site_name || 'Hyderabad Main Campus' }}</strong>
            </p>
          </div>

          <div class="header-status-badges">
            <span class="badge" [ngClass]="getHealthClass(project.health)">
              Health: {{ project.health }}
            </span>
            <span class="badge badge-blue">
              Status: {{ project.status }}
            </span>
            <span class="badge badge-gray">
              Priority: {{ project.priority }}
            </span>
          </div>
        </div>

        <div class="header-progress">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="project.progress_percent" [ngClass]="getHealthClass(project.health)"></div>
          </div>
          <span class="progress-label">{{ project.progress_percent | number:'1.0-0' }}% Overall Completion</span>
        </div>
      </div>

      <!-- 13 Tab Navigation -->
      <div class="tab-header">
        <div class="tab-item" [class.active]="activeTab === 'overview'" (click)="activeTab = 'overview'">📊 Overview</div>
        <div class="tab-item" [class.active]="activeTab === 'timeline'" (click)="activeTab = 'timeline'">📅 Timeline / Gantt</div>
        <div class="tab-item" [class.active]="activeTab === 'milestones'" (click)="activeTab = 'milestones'">🚩 Milestones</div>
        <div class="tab-item" [class.active]="activeTab === 'tasks'" (click)="activeTab = 'tasks'">☑️ Tasks & Actions</div>
        <div class="tab-item" [class.active]="activeTab === 'risks'" (click)="activeTab = 'risks'">⚠️ Risks</div>
        <div class="tab-item" [class.active]="activeTab === 'issues'" (click)="activeTab = 'issues'">🚨 Issues</div>
        <div class="tab-item" [class.active]="activeTab === 'bom'" (click)="activeTab = 'bom'">🔩 Engineering BOM</div>
        <div class="tab-item" [class.active]="activeTab === 'evidence'" (click)="activeTab = 'evidence'">📷 Evidence Repo</div>
        <div class="tab-item" [class.active]="activeTab === 'production'" (click)="activeTab = 'production'">⚙️ Production Drilldown</div>
        <div class="tab-item" [class.active]="activeTab === 'quality'" (click)="activeTab = 'quality'">🛡️ Quality NCRs</div>
        <div class="tab-item" [class.active]="activeTab === 'supply'" (click)="activeTab = 'supply'">📦 Supply Chain POs</div>
        <div class="tab-item" [class.active]="activeTab === 'documents'" (click)="activeTab = 'documents'">📁 Documents</div>
        <div class="tab-item" [class.active]="activeTab === 'activity'" (click)="activeTab = 'activity'">📜 Activity Log</div>
      </div>

      <!-- Tab Content Area -->
      <div class="tab-content">
        <!-- 1. OVERVIEW -->
        <div *ngIf="activeTab === 'overview'" class="tab-pane">
          <div class="overview-grid">
            <div class="fiq-card">
              <h3>🎯 Target Schedule</h3>
              <p>Start Date: <strong>{{ project.start_date | date:'mediumDate' }}</strong></p>
              <p>Target Launch: <strong>{{ project.target_date | date:'mediumDate' }}</strong></p>
              <p>Description: {{ project.description || 'Manufacturing Ramp & NPI qualification phase for high precision electronic assembly.' }}</p>
            </div>

            <div class="fiq-card">
              <h3>🚩 Milestone Summary</h3>
              <div class="mini-list" *ngFor="let ms of project.milestones">
                <span class="ms-title">{{ ms.title }}</span>
                <span class="badge" [class.badge-green]="ms.status === 'Completed'" [class.badge-amber]="ms.status === 'In Progress'">{{ ms.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. TIMELINE / GANTT -->
        <div *ngIf="activeTab === 'timeline'" class="tab-pane">
          <div class="fiq-card">
            <h3>📅 Project Gantt Timeline</h3>
            <div class="gantt-chart">
              <div class="gantt-row" *ngFor="let ms of project.milestones; let i = index">
                <div class="gantt-label">{{ ms.title }}</div>
                <div class="gantt-bar-wrap">
                  <div class="gantt-bar" [style.left.%]="i * 15" [style.width.%]="25" [class.completed]="ms.status === 'Completed'">
                    {{ ms.phase }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. MILESTONES -->
        <div *ngIf="activeTab === 'milestones'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Milestone Title</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ms of project.milestones">
                  <td><span class="badge badge-gray">{{ ms.phase }}</span></td>
                  <td><strong>{{ ms.title }}</strong></td>
                  <td>{{ ms.due_date | date:'mediumDate' }}</td>
                  <td>
                    <span class="badge" [class.badge-green]="ms.status === 'Completed'" [class.badge-amber]="ms.status === 'In Progress'">
                      {{ ms.status }}
                    </span>
                  </td>
                  <td>
                    <button class="fiq-btn fiq-btn-secondary btn-sm" (click)="toggleMilestone(ms)">
                      {{ ms.status === 'Completed' ? 'Reopen' : 'Mark Complete' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 7. ENGINEERING BOM -->
        <div *ngIf="activeTab === 'bom'" class="tab-pane">
          <div class="fiq-card">
            <h3>🔩 Bill of Materials (BOM) & Component Tree</h3>
            <div class="bom-tree" *ngIf="bomData">
              <div class="bom-meta">
                <span>Product SKU: <strong>{{ bomData.sku }}</strong></span> |
                <span>Revision: <strong>{{ bomData.revision }}</strong></span> |
                <span>Unit BOM Cost: <strong>\${{ bomData.total_cost | number:'1.2-2' }}</strong></span>
              </div>
              <table class="fiq-table mt-12">
                <thead>
                  <tr>
                    <th>Part Number</th>
                    <th>Component Name</th>
                    <th>Qty Per Unit</th>
                    <th>Standard Cost</th>
                    <th>Rev</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let comp of bomData.components">
                    <td><strong>{{ comp.part_number }}</strong></td>
                    <td>{{ comp.name }}</td>
                    <td>{{ comp.quantity }} {{ comp.unit }}</td>
                    <td>\${{ comp.cost | number:'1.2-2' }}</td>
                    <td><span class="badge badge-gray">{{ comp.revision }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 8. EVIDENCE REPOSITORY -->
        <div *ngIf="activeTab === 'evidence'" class="tab-pane">
          <div class="fiq-card">
            <h3>📷 PASS/FAIL Readiness Artifacts & Test Evidence</h3>
            <div class="evidence-grid">
              <div class="evidence-card">
                <div class="evidence-thumb pass">PASS</div>
                <div class="evidence-title">X-Ray Solder BGA Inspection Report</div>
                <div class="evidence-sub">Uploaded by Quality Lead | 100% Void-free</div>
              </div>
              <div class="evidence-card">
                <div class="evidence-thumb pass">PASS</div>
                <div class="evidence-title">Thermal Shock 1000 Cycles Sign-off</div>
                <div class="evidence-sub">Uploaded by Engineering | MIL-STD-810G</div>
              </div>
            </div>
          </div>
        </div>

        <!-- OTHER TABS PLACEHOLDER (Clean Enterprise Layout) -->
        <div *ngIf="!['overview', 'timeline', 'milestones', 'bom', 'evidence'].includes(activeTab)" class="tab-pane">
          <div class="fiq-card">
            <h3>Module Integration Panel: {{ activeTab | uppercase }}</h3>
            <p class="text-muted mt-8">Connected real-time live data feed for project {{ project.project_code }}.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .project-detail-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .breadcrumb {
      font-size: 12px;
      color: var(--text-muted);
    }

    .breadcrumb a {
      color: var(--accent-blue);
    }

    .project-header-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .code-badge {
      font-size: 11px;
      font-weight: 700;
      color: var(--accent-blue);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .project-title {
      font-size: 24px;
      font-weight: 800;
      color: var(--text-primary);
    }

    .project-sub {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .header-status-badges {
      display: flex;
      gap: 8px;
    }

    .header-progress {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background: var(--bg-primary);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--accent-blue);
    }

    .progress-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .overview-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .mini-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .ms-title {
      font-weight: 600;
      font-size: 13px;
    }

    .gantt-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;
    }

    .gantt-row {
      display: grid;
      grid-template-columns: 220px 1fr;
      align-items: center;
    }

    .gantt-label {
      font-size: 12px;
      font-weight: 600;
    }

    .gantt-bar-wrap {
      position: relative;
      height: 28px;
      background: var(--bg-primary);
      border-radius: 4px;
    }

    .gantt-bar {
      position: absolute;
      top: 2px;
      bottom: 2px;
      background: var(--accent-blue);
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      padding-left: 8px;
      border-radius: 4px;
    }

    .gantt-bar.completed {
      background: var(--status-green);
    }

    .evidence-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .evidence-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .evidence-thumb {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      margin-bottom: 12px;
    }

    .evidence-thumb.pass {
      background: var(--status-green-bg);
      color: var(--status-green);
      border: 1px solid var(--status-green);
    }

    .evidence-title {
      font-size: 13px;
      font-weight: 700;
    }

    .evidence-sub {
      font-size: 11px;
      color: var(--text-muted);
    }

    .mt-12 { margin-top: 12px; }
    .mt-8 { margin-top: 8px; }
    .btn-sm { padding: 4px 8px; font-size: 11px; }
  `]
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  activeTab = 'overview';
  bomData: any = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.apiService.getProjectDetails(id).subscribe(res => {
        this.project = res;
      });
      this.apiService.getBOMTree(1).subscribe(res => {
        this.bomData = res;
      });
    });
  }

  toggleMilestone(ms: any) {
    ms.status = ms.status === 'Completed' ? 'In Progress' : 'Completed';
  }

  getHealthClass(health: string): string {
    switch (health) {
      case 'Green': return 'badge-green';
      case 'Yellow': return 'badge-amber';
      case 'Red': return 'badge-red';
      default: return 'badge-gray';
    }
  }
}
