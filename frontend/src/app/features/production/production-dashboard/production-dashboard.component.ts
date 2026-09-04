import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { WorkOrder } from '../../../core/models/models';

@Component({
  selector: 'app-production-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="production-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Multi-Site Shop Floor & Production Visibility</h1>
          <p class="page-subtitle">Real-time SMT line throughput, shift achievement, yield performance & work order execution</p>
        </div>
        <div class="filter-actions">
          <select class="fiq-input" [(ngModel)]="selectedSite" (change)="loadData()">
            <option value="">All Production Facilities</option>
            <option value="1">Hyderabad Main Campus (HYD-01)</option>
            <option value="2">Bangalore Innovation Hub (BLR-02)</option>
            <option value="3">Chennai Assembly Plant (CHE-03)</option>
            <option value="4">Pune Precision Line (PUN-04)</option>
          </select>
          <button class="fiq-btn fiq-btn-secondary" (click)="loadData()">🔄 Live Sync</button>
        </div>
      </div>

      <!-- Real-Time Production Lines Grid -->
      <h2 class="section-title">⚡ Live Production Lines Status</h2>
      <div class="card-grid">
        <div class="fiq-card line-card" *ngFor="let line of lines">
          <div class="line-header">
            <div>
              <span class="line-code">{{ line.code }}</span>
              <h3 class="line-name">{{ line.name }}</h3>
              <span class="line-site">{{ line.site_name }}</span>
            </div>
            <span class="badge" [ngClass]="getLineStatusBadge(line.status)">{{ line.status }}</span>
          </div>

          <div class="line-metrics">
            <div class="metric">
              <span class="m-label">Shift Target</span>
              <span class="m-val">{{ line.target }}</span>
            </div>
            <div class="metric">
              <span class="m-label">Actual Output</span>
              <span class="m-val blue">{{ line.actual }}</span>
            </div>
            <div class="metric">
              <span class="m-label">Yield Rate</span>
              <span class="m-val green">{{ line.yield_percent }}%</span>
            </div>
          </div>

          <div class="line-progress">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="line.target ? (line.actual / line.target) * 100 : 0"></div>
            </div>
            <div class="scrap-rework">
              <span>Rework: {{ line.rework }}</span> | <span>Scrap: {{ line.scrap }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Work Orders Table -->
      <div class="fiq-card">
        <div class="chart-header">
          <h3>📋 Active Work Orders (WIP)</h3>
        </div>
        <div class="fiq-table-container mt-12">
          <table class="fiq-table">
            <thead>
              <tr>
                <th>WO Number</th>
                <th>Product</th>
                <th>Facility Site</th>
                <th>Line</th>
                <th>Shift</th>
                <th>Target</th>
                <th>Produced</th>
                <th>Yield</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let wo of workOrders">
                <td><strong>{{ wo.wo_number }}</strong></td>
                <td>{{ wo.product_name || 'High-Speed ECU' }}</td>
                <td>{{ wo.site_name || 'Hyderabad' }}</td>
                <td><span class="badge badge-gray">{{ wo.line_code }}</span></td>
                <td>{{ wo.shift }}</td>
                <td>{{ wo.target_quantity }}</td>
                <td><strong class="text-blue">{{ wo.produced_quantity }}</strong></td>
                <td><span class="badge badge-green">{{ wo.yield_rate }}%</span></td>
                <td><span class="badge badge-blue">{{ wo.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .production-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .line-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .line-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .line-code {
      font-size: 11px;
      font-weight: 700;
      color: var(--accent-blue);
    }

    .line-name {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .line-site {
      font-size: 11px;
      color: var(--text-muted);
    }

    .line-metrics {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      background: var(--bg-primary);
      padding: 10px;
      border-radius: 6px;
    }

    .metric {
      display: flex;
      flex-direction: column;
    }

    .m-label {
      font-size: 10px;
      color: var(--text-secondary);

    }

    .m-val {
      font-size: 16px;
      font-weight: 800;
    }

    .m-val.blue { color: var(--accent-blue); }
    .m-val.green { color: var(--status-green); }

    .line-progress {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .progress-bar {
      height: 6px;
      background: var(--bg-primary);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--status-green);
    }

    .scrap-rework {
      font-size: 11px;
      color: var(--text-muted);
      display: flex;
      gap: 8px;
    }

    .text-blue { color: var(--accent-blue); }
    .mt-12 { margin-top: 12px; }
  `]
})
export class ProductionDashboardComponent implements OnInit {
  lines: any[] = [];
  workOrders: WorkOrder[] = [];
  selectedSite = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const siteId = this.selectedSite ? parseInt(this.selectedSite) : undefined;
    this.apiService.getProductionLines(siteId).subscribe(res => this.lines = res);
    this.apiService.getWorkOrders(siteId).subscribe(res => this.workOrders = res);
  }

  getLineStatusBadge(status: string): string {
    switch (status) {
      case 'Running': return 'badge-green';
      case 'Idle': return 'badge-amber';
      case 'Maintenance': return 'badge-red';
      default: return 'badge-gray';
    }
  }
}
