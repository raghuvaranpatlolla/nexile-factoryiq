import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { NCR, CAPA, Certificate } from '../../../core/models/models';

@Component({
  selector: 'app-quality-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="quality-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Quality Management & Compliance Portal</h1>
          <p class="page-subtitle">NCR logging, 8D CAPA investigation, ISO certificate registry, SPC control charts & audit governance</p>
        </div>
      </div>

      <!-- Sub-Tab Header -->
      <div class="tab-header">
        <div class="tab-item" [class.active]="activeTab === 'ncrs'" (click)="activeTab = 'ncrs'">🚨 Non-Conformance Reports (NCR)</div>
        <div class="tab-item" [class.active]="activeTab === 'capas'" (click)="activeTab = 'capas'">🛠️ CAPA Actions</div>
        <div class="tab-item" [class.active]="activeTab === 'certs'" (click)="activeTab = 'certs'">📜 Certificate Registry</div>
        <div class="tab-item" [class.active]="activeTab === 'spc'" (click)="activeTab = 'spc'">📈 SPC Statistical Control</div>
        <div class="tab-item" [class.active]="activeTab === 'audits'" (click)="activeTab = 'audits'">🔍 Quality Audits</div>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- 1. NCR LIST -->
        <div *ngIf="activeTab === 'ncrs'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>NCR Number</th>
                  <th>Title / Failure Description</th>
                  <th>Facility Site</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Containment Action</th>
                  <th>Logged Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ncr of ncrs">
                  <td><strong class="code-text">{{ ncr.ncr_number }}</strong></td>
                  <td>
                    <div class="cell-title">{{ ncr.title }}</div>
                    <div class="cell-sub">{{ ncr.description }}</div>
                  </td>
                  <td>Hyderabad Main</td>
                  <td>
                    <span class="badge" [class.badge-red]="ncr.severity === 'Critical'" [class.badge-amber]="ncr.severity === 'Major'">
                      {{ ncr.severity }}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-blue">{{ ncr.status }}</span>
                  </td>
                  <td>{{ ncr.containment_action || '100% Sorting active' }}</td>
                  <td>{{ ncr.created_at | date:'mediumDate' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. CAPAS LIST -->
        <div *ngIf="activeTab === 'capas'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>CAPA Number</th>
                  <th>Corrective Action Plan</th>
                  <th>Preventive Action</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of capas">
                  <td><strong class="code-text">{{ c.capa_number }}</strong></td>
                  <td>{{ c.corrective_action }}</td>
                  <td>{{ c.preventive_action }}</td>
                  <td><strong>{{ c.owner }}</strong></td>
                  <td><span class="badge badge-amber">{{ c.status }}</span></td>
                  <td>{{ c.due_date | date:'mediumDate' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. CERTIFICATES LIBRARY -->
        <div *ngIf="activeTab === 'certs'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>Cert Number</th>
                  <th>Compliance Standard / Certification</th>
                  <th>Issuing Registrar</th>
                  <th>Issue Date</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let cert of certs">
                  <td><strong>{{ cert.cert_number }}</strong></td>
                  <td><strong>{{ cert.name }}</strong></td>
                  <td>{{ cert.issuing_body }}</td>
                  <td>{{ cert.issue_date | date:'mediumDate' }}</td>
                  <td>{{ cert.expiry_date | date:'mediumDate' }}</td>
                  <td>
                    <span class="badge" [class.badge-green]="cert.status === 'Active'" [class.badge-amber]="cert.status === 'Expiring Soon'">
                      {{ cert.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 4. SPC ANALYTICS -->
        <div *ngIf="activeTab === 'spc'" class="tab-pane">
          <div class="fiq-card">
            <h3>📈 Statistical Process Control (SPC) X-Bar & Capability (Cpk)</h3>
            <div class="spc-grid mt-16">
              <div class="spc-metric-card" *ngFor="let spc of spcData">
                <div class="spc-header">
                  <span class="spc-param">{{ spc.parameter_name }}</span>
                  <span class="badge badge-green" *ngIf="!spc.is_out_of_control">In Control</span>
                </div>
                <div class="spc-body">
                  <div class="spc-cpk">
                    <span class="label">Process Cpk:</span>
                    <span class="val">{{ spc.cpk }}</span>
                  </div>
                  <div class="spc-limits">
                    <span>LCL: {{ spc.lcl }}</span> | <span>Mean: {{ spc.mean_value }}</span> | <span>UCL: {{ spc.ucl }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. AUDITS -->
        <div *ngIf="activeTab === 'audits'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Audit Title</th>
                  <th>Type</th>
                  <th>Lead Auditor</th>
                  <th>Audit Date</th>
                  <th>Compliance Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let aud of audits">
                  <td><strong>{{ aud.audit_number }}</strong></td>
                  <td><strong>{{ aud.title }}</strong></td>
                  <td>{{ aud.audit_type }}</td>
                  <td>{{ aud.lead_auditor }}</td>
                  <td>{{ aud.audit_date | date:'mediumDate' }}</td>
                  <td><strong class="text-green">{{ aud.score_percent }}%</strong></td>
                  <td><span class="badge badge-green">{{ aud.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quality-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .code-text { color: var(--accent-blue); }
    .cell-title { font-weight: 700; font-size: 13px; }
    .cell-sub { font-size: 11px; color: var(--text-muted); }

    .spc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }

    .spc-metric-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;

    }

    .spc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .spc-param { font-weight: 700; font-size: 13px; }
    .spc-cpk { display: flex; justify-content: space-between; font-size: 14px; font-weight: 800; margin-bottom: 8px; }
    .spc-cpk .val { color: var(--status-green); }
    .spc-limits { font-size: 11px; color: var(--text-muted); }
    .text-green { color: var(--status-green); }
    .mt-16 { margin-top: 16px; }
  `]
})
export class QualityDashboardComponent implements OnInit {
  activeTab = 'ncrs';
  ncrs: NCR[] = [];
  capas: CAPA[] = [];
  certs: Certificate[] = [];
  spcData: any[] = [];
  audits: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getNCRs().subscribe(res => this.ncrs = res);
    this.apiService.getCAPAs().subscribe(res => this.capas = res);
    this.apiService.getCertificates().subscribe(res => this.certs = res);
    this.apiService.getSPCRecords().subscribe(res => this.spcData = res);
    this.apiService.getAudits().subscribe(res => this.audits = res);
  }
}
