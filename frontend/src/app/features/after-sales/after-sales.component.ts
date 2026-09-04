import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { RMA } from '../../core/models/models';

@Component({
  selector: 'app-after-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="after-sales-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">After-Sales Service & Field Reliability</h1>
          <p class="page-subtitle">RMA case management, field repair diagnostics, warranty claims & component EOL notices</p>
        </div>
      </div>

      <div class="tab-header">
        <div class="tab-item" [class.active]="activeTab === 'rma'" (click)="activeTab = 'rma'">🛠️ Field RMAs</div>
        <div class="tab-item" [class.active]="activeTab === 'warranty'" (click)="activeTab = 'warranty'">🛡️ Warranty Claims</div>
        <div class="tab-item" [class.active]="activeTab === 'eol'" (click)="activeTab = 'eol'">⚠️ End-Of-Life (EOL) Advisories</div>
      </div>

      <div class="tab-content">
        <!-- 1. RMAS -->
        <div *ngIf="activeTab === 'rma'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>RMA Number</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Serial Number</th>
                  <th>Failure Reason</th>
                  <th>Priority</th>
                  <th>Assigned Tech</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of rmas">
                  <td><strong class="code-text">{{ r.rma_number }}</strong></td>
                  <td>{{ r.customer_name || 'Tesla Mobility' }}</td>
                  <td><strong>{{ r.product_name || 'High-Speed ECU' }}</strong></td>
                  <td><code>{{ r.serial_number }}</code></td>
                  <td>{{ r.reason }}</td>
                  <td><span class="badge badge-amber">{{ r.priority }}</span></td>
                  <td>{{ r.assigned_technician || 'Samantha Reed' }}</td>
                  <td><span class="badge badge-blue">{{ r.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. WARRANTIES -->
        <div *ngIf="activeTab === 'warranty'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>Claim Number</th>
                  <th>Failure Mode</th>
                  <th>Claim Amount</th>
                  <th>Status</th>
                  <th>Logged Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let w of warranties">
                  <td><strong class="code-text">{{ w.claim_number }}</strong></td>
                  <td>{{ w.failure_mode }}</td>
                  <td>\${{ w.claim_amount | number:'1.2-2' }}</td>
                  <td><span class="badge badge-green">{{ w.status }}</span></td>
                  <td>{{ w.created_at | date:'mediumDate' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. EOL -->
        <div *ngIf="activeTab === 'eol'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>Notice ID</th>
                  <th>Product Name</th>
                  <th>Last Buy Order Date</th>
                  <th>Last Shipment Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let e of eolNotices">
                  <td><strong class="code-text">{{ e.notice_number }}</strong></td>
                  <td><strong>{{ e.product_name }}</strong></td>
                  <td>{{ e.last_order_date | date:'mediumDate' }}</td>
                  <td>{{ e.last_shipment_date | date:'mediumDate' }}</td>
                  <td><span class="badge badge-red">{{ e.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .after-sales-page { display: flex; flex-direction: column; gap: 20px; }
    .code-text { color: var(--accent-blue); }
  `]
})
export class AfterSalesComponent implements OnInit {
  activeTab = 'rma';
  rmas: RMA[] = [];
  warranties: any[] = [];
  eolNotices: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getRMAs().subscribe(res => this.rmas = res);
    this.apiService.getWarranties().subscribe(res => this.warranties = res);
    this.apiService.getEOLNotices().subscribe(res => this.eolNotices = res);
  }
}
