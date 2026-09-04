import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analytics-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="analytics-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Analytics & Cross-Functional Reporting</h1>
          <p class="page-subtitle">Generate custom manufacturing performance reports, quality Pareto exports & OEE summaries</p>
        </div>
      </div>

      <div class="card-grid">
        <div class="fiq-card report-card" *ngFor="let rep of reportTemplates">
          <h3>{{ rep.icon }} {{ rep.title }}</h3>
          <p class="rep-desc">{{ rep.desc }}</p>
          <div class="rep-actions">
            <button class="fiq-btn fiq-btn-primary btn-sm" (click)="exportReport(rep.title, 'CSV')">📊 Export CSV</button>
            <button class="fiq-btn fiq-btn-secondary btn-sm" (click)="exportReport(rep.title, 'PDF')">📄 Export PDF</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-page { display: flex; flex-direction: column; gap: 20px; }
    .report-card { display: flex; flex-direction: column; gap: 12px; }
    .rep-desc { font-size: 13px; color: var(--text-secondary); }
    .rep-actions { display: flex; gap: 8px; margin-top: 8px; }
    .btn-sm { padding: 6px 12px; font-size: 12px; }
  `]
})
export class AnalyticsComponent {
  reportTemplates = [
    { icon: '🚀', title: 'Project Status & Milestone Compliance Report', desc: 'Comprehensive progress, milestone completion rates, and risk register.' },
    { icon: '⚙️', title: 'Multi-Site Shop Floor OEE & Output Analysis', desc: 'Line throughput, downtime categorization, scrap & rework totals.' },
    { icon: '🛡️', title: 'Quality Defect Pareto & CAPA Closure Summary', desc: 'Non-conformance root cause breakdown and 8D effectiveness verification.' },
    { icon: '📦', title: 'Supplier Scorecard & On-Time Delivery Audit', desc: 'Vendor ratings, lead time compliance, and PO fulfillment status.' },
    { icon: '🛠️', title: 'After-Sales RMA & Field Warranty SLA Report', desc: 'Return merchandise authorization resolution times & failure mode trends.' }
  ];

  exportReport(title: string, format: string) {
    alert(`Generating ${format} report export for: "${title}". File download will initiate shortly.`);
  }
}
