import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="documents-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Document Management & Interactive Engineering Viewers</h1>
          <p class="page-subtitle">Revision-controlled drawings, specifications, BOM comparison & CAD visualization</p>
        </div>
      </div>

      <div class="tab-header">
        <div class="tab-item" [class.active]="activeTab === 'library'" (click)="activeTab = 'library'">📁 Document Vault</div>
        <div class="tab-item" [class.active]="activeTab === 'bom'" (click)="activeTab = 'bom'">🔩 BOM Tree & Revision Comparison</div>
        <div class="tab-item" [class.active]="activeTab === 'cad'" (click)="activeTab = 'cad'">🖥️ 3D CAD & Gerber Viewer</div>
      </div>

      <div class="tab-content">
        <!-- 1. LIBRARY -->
        <div *ngIf="activeTab === 'library'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>Doc ID</th>
                  <th>Title / File Name</th>
                  <th>Document Type</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let doc of docs">
                  <td><strong class="code-text">{{ doc.doc_number }}</strong></td>
                  <td><strong>{{ doc.title }}</strong></td>
                  <td><span class="badge badge-gray">{{ doc.doc_type }}</span></td>
                  <td><span class="badge badge-blue">{{ doc.current_version }}</span></td>
                  <td><span class="badge badge-green">{{ doc.status }}</span></td>
                  <td>{{ doc.created_at | date:'mediumDate' }}</td>
                  <td>
                    <button class="fiq-btn fiq-btn-secondary btn-sm" (click)="alertDoc(doc.doc_number)">⬇️ Download</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. BOM VIEWER -->
        <div *ngIf="activeTab === 'bom'" class="tab-pane">
          <div class="fiq-card" *ngIf="bomData">
            <div class="bom-header-bar">
              <div>
                <h2>Product Assembly: {{ bomData.product_name }} ({{ bomData.sku }})</h2>
                <p>Revision: <strong>{{ bomData.revision }}</strong> | Total Cost: <strong>\${{ bomData.total_cost | number:'1.2-2' }}</strong></p>
              </div>
              <button class="fiq-btn fiq-btn-secondary" (click)="compareRevisions = !compareRevisions">
                {{ compareRevisions ? 'Hide Comparison' : '🔄 Compare Rev A vs Rev B' }}
              </button>
            </div>

            <div class="fiq-table-container mt-16">
              <table class="fiq-table">
                <thead>
                  <tr>
                    <th>Part Number</th>
                    <th>Component Name</th>
                    <th>Qty</th>
                    <th>Unit Cost</th>
                    <th>Subtotal Cost</th>
                    <th *ngIf="compareRevisions">Diff vs Rev A</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let c of bomData.components">
                    <td><strong class="code-text">{{ c.part_number }}</strong></td>
                    <td>{{ c.name }}</td>
                    <td>{{ c.quantity }} {{ c.unit }}</td>
                    <td>\${{ c.cost | number:'1.2-2' }}</td>
                    <td><strong>\${{ (c.quantity * c.cost) | number:'1.2-2' }}</strong></td>
                    <td *ngIf="compareRevisions">
                      <span class="badge badge-green" *ngIf="c.part_number.includes('MCU')">No Change</span>
                      <span class="badge badge-amber" *ngIf="!c.part_number.includes('MCU')">+1 Qty Added</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 3. CAD VIEWER -->
        <div *ngIf="activeTab === 'cad'" class="tab-pane">
          <div class="fiq-card cad-viewport-card">
            <h3>🖥️ WebGL 3D CAD & Gerber Inspection Viewport</h3>
            <div class="cad-viewport">
              <div class="cad-grid-overlay">
                <div class="cad-3d-box">
                  <span>3D STEP / IGES Model Render</span>
                  <div class="cad-sub">PRD-ECU-9000 Board Assembly v2.1</div>
                </div>
              </div>
              <div class="cad-controls">
                <button class="fiq-btn fiq-btn-secondary btn-sm">🔄 Rotate 360°</button>
                <button class="fiq-btn fiq-btn-secondary btn-sm">🔍 Zoom Fit</button>
                <button class="fiq-btn fiq-btn-secondary btn-sm">📐 Measure</button>
                <button class="fiq-btn fiq-btn-secondary btn-sm">LAYER: Solder Mask Top</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .documents-page { display: flex; flex-direction: column; gap: 20px; }
    .code-text { color: var(--accent-blue); }
    .bom-header-bar { display: flex; justify-content: space-between; align-items: center; }
    .cad-viewport-card { display: flex; flex-direction: column; gap: 16px; }
    .cad-viewport {
      height: 400px;
      background: radial-gradient(circle at center, #1e293b, #090d16);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cad-3d-box {
      border: 2px dashed var(--accent-blue);
      padding: 40px;
      border-radius: 12px;
      text-align: center;
      color: var(--accent-blue);
      font-weight: 800;
    }
    .cad-sub { font-size: 11px; color: var(--text-secondary); margin-top: 6px; font-weight: normal; }
    .cad-controls {
      position: absolute;
      bottom: 16px;
      display: flex;
      gap: 8px;
    }
    .btn-sm { padding: 4px 10px; font-size: 11px; }
    .mt-16 { margin-top: 16px; }
  `]
})
export class DocumentsComponent implements OnInit {
  activeTab = 'library';
  docs: any[] = [];
  bomData: any = null;
  compareRevisions = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getDocuments().subscribe(res => this.docs = res);
    this.apiService.getBOMTree(1).subscribe(res => this.bomData = res);
  }

  alertDoc(docNum: string) {
    alert(`Downloading document artifact package for ${docNum}`);
  }
}
