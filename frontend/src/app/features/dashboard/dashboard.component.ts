import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxEchartsModule],
  template: `
    <div class="dashboard-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Executive Manufacturing Excellence Dashboard</h1>
          <p class="page-subtitle">Real-time cross-functional operational visibility across global manufacturing sites</p>
        </div>
        <div class="filter-actions">
          <select class="fiq-input" [(ngModel)]="selectedSite" (change)="loadKpis()">
            <option value="">All Global Sites</option>
            <option value="1">Hyderabad Main Campus (HYD-01)</option>
            <option value="2">Bangalore Innovation Hub (BLR-02)</option>
            <option value="3">Chennai Assembly Plant (CHE-03)</option>
            <option value="4">Pune Precision Line (PUN-04)</option>
          </select>
          <button class="fiq-btn fiq-btn-secondary" (click)="loadKpis()">🔄 Refresh</button>
        </div>
      </div>

      <!-- Top KPI Card Grid -->
      <div class="card-grid" *ngIf="kpis">
        <div class="fiq-card kpi-card">
          <div class="kpi-title">Total Active Projects</div>
          <div class="kpi-value blue">{{ kpis.projects.total }}</div>
          <div class="kpi-sub">
            <span class="badge badge-green">{{ kpis.projects.on_track }} On Track</span>
            <span class="badge badge-amber">{{ kpis.projects.at_risk }} At Risk</span>
          </div>
        </div>

        <div class="fiq-card kpi-card">
          <div class="kpi-title">Production Achievement</div>
          <div class="kpi-value green">{{ kpis.production.achievement_percent }}%</div>
          <div class="kpi-sub">
            <span class="sub-text">Yield: <strong>{{ kpis.production.yield_percent }}%</strong></span>
            <span class="sub-text">Units: {{ kpis.production.total_produced | number }}</span>
          </div>
        </div>

        <div class="fiq-card kpi-card">
          <div class="kpi-title">Quality Open NCR & CAPA</div>
          <div class="kpi-value red">{{ kpis.quality.open_issues }}</div>
          <div class="kpi-sub">
            <span class="badge badge-red">{{ kpis.quality.critical_ncrs }} Critical</span>
            <span class="sub-text">CAPAs: {{ kpis.quality.open_capas }}</span>
          </div>
        </div>

        <div class="fiq-card kpi-card">
          <div class="kpi-title">Supplier On-Time Delivery</div>
          <div class="kpi-value amber">{{ kpis.supply_chain.supplier_otd_percent }}%</div>
          <div class="kpi-sub">
            <span class="badge badge-amber">{{ kpis.supply_chain.delayed_pos }} Delayed POs</span>
          </div>
        </div>

        <div class="fiq-card kpi-card">
          <div class="kpi-title">Inventory Stock Alerts</div>
          <div class="kpi-value red">{{ kpis.supply_chain.critical_inventory_items }}</div>
          <div class="kpi-sub">
            <span class="sub-text">Critical Shortage: <strong>{{ kpis.supply_chain.critical_inventory_items }}</strong></span>
            <span class="sub-text">Low Stock: {{ kpis.supply_chain.low_stock_items }}</span>
          </div>
        </div>

        <div class="fiq-card kpi-card">
          <div class="kpi-title">Field RMAs & Warranty</div>
          <div class="kpi-value blue">{{ kpis.after_sales.open_rmas }}</div>
          <div class="kpi-sub">
            <span class="badge badge-green">SLA: {{ kpis.after_sales.warranty_sla_percent }}%</span>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <!-- Production Output Trend Chart -->
        <div class="fiq-card chart-card">
          <div class="chart-header">
            <h3>⚙️ Daily Production Output vs Plan</h3>
          </div>
          <div echarts [options]="productionChartOptions" class="echart-container"></div>
        </div>

        <!-- Project Health Distribution -->
        <div class="fiq-card chart-card">
          <div class="chart-header">
            <h3>🚀 Global Project Portfolio Health</h3>
          </div>
          <div echarts [options]="projectHealthChartOptions" class="echart-container"></div>
        </div>

        <!-- Quality Defect Trend -->
        <div class="fiq-card chart-card">
          <div class="chart-header">
            <h3>🛡️ Quality NCR vs CAPA Volume Trend</h3>
          </div>
          <div echarts [options]="qualityChartOptions" class="echart-container"></div>
        </div>

        <!-- Supplier Scorecard Radar -->
        <div class="fiq-card chart-card">
          <div class="chart-header">
            <h3>📦 Supplier Performance OTD vs Quality</h3>
          </div>
          <div echarts [options]="supplierChartOptions" class="echart-container"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .filter-actions {
      display: flex;
      gap: 12px;
    }

    .kpi-card {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .kpi-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .kpi-value {
      font-size: 32px;
      font-weight: 800;
      line-height: 1;
    }

    .kpi-value.green { color: var(--status-green); }
    .kpi-value.blue { color: var(--accent-blue); }
    .kpi-value.amber { color: var(--status-amber); }
    .kpi-value.red { color: var(--status-red); }

    .kpi-sub {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }

    .sub-text {
      font-size: 11px;
      color: var(--text-muted);
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
      gap: 20px;
    }

    .chart-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .chart-header h3 {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .echart-container {
      height: 300px;
      width: 100%;
    }
  `]
})
export class ExecutiveDashboardComponent implements OnInit {
  kpis: any = null;
  selectedSite = '';

  productionChartOptions: any = {};
  projectHealthChartOptions: any = {};
  qualityChartOptions: any = {};
  supplierChartOptions: any = {};

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadKpis();
    this.loadCharts();
  }

  loadKpis() {
    const siteId = this.selectedSite ? parseInt(this.selectedSite) : undefined;
    this.apiService.getDashboardKpis(siteId).subscribe(res => {
      this.kpis = res;
    });
  }

  loadCharts() {
    this.apiService.getDashboardCharts().subscribe(res => {
      // 1. Production Chart
      this.productionChartOptions = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['Target', 'Actual Output', 'Yield Rate (%)'], textStyle: { color: '#94a3b8' } },
        xAxis: { type: 'category', data: res.production_output_trend.categories, axisLine: { lineStyle: { color: '#334155' } } },
        yAxis: [
          { type: 'value', name: 'Units', axisLine: { lineStyle: { color: '#334155' } }, splitLine: { lineStyle: { color: '#1e293b' } } },
          { type: 'value', name: 'Yield %', min: 90, max: 100, axisLine: { lineStyle: { color: '#334155' } } }
        ],
        series: [
          { name: 'Target', type: 'bar', data: res.production_output_trend.target, itemStyle: { color: '#334155' } },
          { name: 'Actual Output', type: 'bar', data: res.production_output_trend.actual, itemStyle: { color: '#10b981' } },
          { name: 'Yield Rate (%)', type: 'line', yAxisIndex: 1, data: res.production_output_trend.yield_rate, itemStyle: { color: '#3b82f6' } }
        ]
      };

      // 2. Project Health Donut
      this.projectHealthChartOptions = {
        tooltip: { trigger: 'item' },
        legend: { bottom: '0', textStyle: { color: '#94a3b8' } },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: res.project_health_distribution,
          label: { color: '#f8fafc' }
        }]
      };

      // 3. Quality Chart
      this.qualityChartOptions = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['NCRs Logged', 'CAPAs Opened'], textStyle: { color: '#94a3b8' } },
        xAxis: { type: 'category', data: res.quality_defects_trend.categories, axisLine: { lineStyle: { color: '#334155' } } },
        yAxis: { type: 'value', splitLine: { lineStyle: { color: '#1e293b' } } },
        series: [
          { name: 'NCRs Logged', type: 'line', smooth: true, data: res.quality_defects_trend.ncrs, itemStyle: { color: '#ef4444' } },
          { name: 'CAPAs Opened', type: 'line', smooth: true, data: res.quality_defects_trend.capas, itemStyle: { color: '#f59e0b' } }
        ]
      };

      // 4. Supplier Chart
      this.supplierChartOptions = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['OTD %', 'Quality %'], textStyle: { color: '#94a3b8' } },
        xAxis: { type: 'category', data: res.supplier_performance.suppliers, axisLine: { lineStyle: { color: '#334155' } } },
        yAxis: { type: 'value', min: 80, max: 100, splitLine: { lineStyle: { color: '#1e293b' } } },
        series: [
          { name: 'OTD %', type: 'bar', data: res.supplier_performance.otd, itemStyle: { color: '#f59e0b' } },
          { name: 'Quality %', type: 'bar', data: res.supplier_performance.quality, itemStyle: { color: '#10b981' } }
        ]
      };
    });
  }
}
