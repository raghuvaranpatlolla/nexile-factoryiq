import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { PurchaseOrder, Inventory } from '../../../core/models/models';

@Component({
  selector: 'app-supply-chain-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="supply-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Supply Chain & Material Visibility</h1>
          <p class="page-subtitle">Purchase order tracking, supplier scorecard rating, inventory reorder levels & global logistics</p>
        </div>
      </div>

      <!-- Sub-Tab Header -->
      <div class="tab-header">
        <div class="tab-item" [class.active]="activeTab === 'pos'" (click)="activeTab = 'pos'">📄 Purchase Orders (PO)</div>
        <div class="tab-item" [class.active]="activeTab === 'scorecards'" (click)="activeTab = 'scorecards'">⭐ Supplier Scorecards</div>
        <div class="tab-item" [class.active]="activeTab === 'inventory'" (click)="activeTab = 'inventory'">📊 Inventory Stock Control</div>
        <div class="tab-item" [class.active]="activeTab === 'shipments'" (click)="activeTab = 'shipments'">🚛 Logistics & Shipments</div>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- 1. POs LIST -->
        <div *ngIf="activeTab === 'pos'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Supplier Vendor</th>
                  <th>Total Amount</th>
                  <th>Ordered Date</th>
                  <th>Required Delivery</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let po of pos">
                  <td><strong class="code-text">{{ po.po_number }}</strong></td>
                  <td><strong>{{ po.supplier_name || 'Micron Semiconductors' }}</strong></td>
                  <td>\${{ po.total_amount | number:'1.2-2' }}</td>
                  <td>{{ po.ordered_date | date:'mediumDate' }}</td>
                  <td>{{ po.required_date | date:'mediumDate' }}</td>
                  <td>
                    <span class="badge" [class.badge-green]="po.status === 'Confirmed'" [class.badge-amber]="po.status === 'Delayed'">
                      {{ po.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. SUPPLIER SCORECARDS -->
        <div *ngIf="activeTab === 'scorecards'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>Supplier Vendor</th>
                  <th>Evaluation Period</th>
                  <th>On-Time Delivery (OTD)</th>
                  <th>Quality Yield</th>
                  <th>Avg Lead Time</th>
                  <th>Overall Rating Score</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let sc of scorecards">
                  <td><strong>{{ sc.supplier_name }}</strong></td>
                  <td><span class="badge badge-gray">{{ sc.period }}</span></td>
                  <td><strong class="text-green">{{ sc.otd_percent }}%</strong></td>
                  <td><strong class="text-green">{{ sc.quality_yield_percent }}%</strong></td>
                  <td>{{ sc.lead_time_days }} days</td>
                  <td>
                    <span class="badge badge-green" *ngIf="sc.overall_score >= 90">Score: {{ sc.overall_score }}</span>
                    <span class="badge badge-amber" *ngIf="sc.overall_score < 90">Score: {{ sc.overall_score }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. INVENTORY -->
        <div *ngIf="activeTab === 'inventory'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>Part Number</th>
                  <th>Material / Component Name</th>
                  <th>Facility Site</th>
                  <th>On Hand</th>
                  <th>Reserved</th>
                  <th>Min Level</th>
                  <th>Reorder Point</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let inv of inventory">
                  <td><strong class="code-text">{{ inv.item_part_number }}</strong></td>
                  <td>{{ inv.item_name }}</td>
                  <td>{{ inv.site_name }}</td>
                  <td><strong class="text-blue">{{ inv.quantity_on_hand }}</strong></td>
                  <td>{{ inv.quantity_reserved }}</td>
                  <td>{{ inv.min_stock_level }}</td>
                  <td>{{ inv.reorder_point }}</td>
                  <td>
                    <span class="badge" [class.badge-green]="inv.status === 'Healthy'" [class.badge-red]="inv.status === 'Critical Shortage'">
                      {{ inv.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 4. LOGISTICS & SHIPMENTS -->
        <div *ngIf="activeTab === 'shipments'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>Shipment Waybill</th>
                  <th>Freight Carrier</th>
                  <th>Tracking Number</th>
                  <th>Destination Address</th>
                  <th>Estimated ETA</th>
                  <th>Shipment Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let shp of shipments">
                  <td><strong class="code-text">{{ shp.shipment_number }}</strong></td>
                  <td>{{ shp.carrier }}</td>
                  <td><code>{{ shp.tracking_number }}</code></td>
                  <td>{{ shp.destination }}</td>
                  <td>{{ shp.eta | date:'mediumDate' }}</td>
                  <td><span class="badge badge-blue">{{ shp.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .supply-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .code-text { color: var(--accent-blue); }
    .text-green { color: var(--status-green); }
    .text-blue { color: var(--accent-blue); }
  `]
})
export class SupplyChainDashboardComponent implements OnInit {
  activeTab = 'pos';
  pos: PurchaseOrder[] = [];
  scorecards: any[] = [];
  inventory: Inventory[] = [];
  shipments: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getPurchaseOrders().subscribe(res => this.pos = res);
    this.apiService.getSupplierScorecards().subscribe(res => this.scorecards = res);
    this.apiService.getInventory().subscribe(res => this.inventory = res);
    this.apiService.getShipments().subscribe(res => this.shipments = res);
  }
}
