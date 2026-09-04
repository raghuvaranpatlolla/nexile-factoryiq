import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuditLog } from '../../core/models/models';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Administration & System Governance</h1>
          <p class="page-subtitle">User provisioning, role-based permission matrix & system audit logs</p>
        </div>
      </div>

      <div class="tab-header">
        <div class="tab-item" [class.active]="activeTab === 'users'" (click)="activeTab = 'users'">👥 User Management</div>
        <div class="tab-item" [class.active]="activeTab === 'roles'" (click)="activeTab = 'roles'">🔐 Role & Permission Matrix</div>
        <div class="tab-item" [class.active]="activeTab === 'audit'" (click)="activeTab = 'audit'">📜 Audit Trail Logs</div>
      </div>

      <div class="tab-content">
        <!-- 1. USERS -->
        <div *ngIf="activeTab === 'users'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Job Title / Department</th>
                  <th>Assigned Role</th>
                  <th>Account Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let u of users">
                  <td>#{{ u.id }}</td>
                  <td><strong>{{ u.full_name }}</strong></td>
                  <td><code>{{ u.email }}</code></td>
                  <td>{{ u.job_title }} ({{ u.department }})</td>
                  <td><span class="badge badge-blue">{{ u.role_name || 'Viewer' }}</span></td>
                  <td>
                    <span class="badge" [class.badge-green]="u.is_active" [class.badge-red]="!u.is_active">
                      {{ u.is_active ? 'Active' : 'Disabled' }}
                    </span>
                  </td>
                  <td>
                    <button class="fiq-btn fiq-btn-secondary btn-sm" (click)="toggleUser(u)">
                      {{ u.is_active ? 'Deactivate' : 'Activate' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. ROLES MATRIX -->
        <div *ngIf="activeTab === 'roles'" class="tab-pane">
          <div class="fiq-card">
            <h3>🔐 17 Role Permission Hierarchy Matrix</h3>
            <p class="text-muted mt-8">Configured permissions for Super Admin, Management, Project Manager, Quality, Supplier, Customer, etc.</p>
            <div class="roles-grid mt-16">
              <div class="role-chip" *ngFor="let r of roles">
                <strong>{{ r }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. AUDIT LOGS -->
        <div *ngIf="activeTab === 'audit'" class="tab-pane">
          <div class="fiq-table-container">
            <table class="fiq-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User Email</th>
                  <th>Action</th>
                  <th>Entity Target</th>
                  <th>Details Log</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let log of auditLogs">
                  <td>{{ log.timestamp | date:'medium' }}</td>
                  <td><code>{{ log.user_email }}</code></td>
                  <td><span class="badge badge-blue">{{ log.action }}</span></td>
                  <td><strong>{{ log.entity_name }} #{{ log.entity_id }}</strong></td>
                  <td>{{ log.details }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { display: flex; flex-direction: column; gap: 20px; }
    .roles-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .role-chip { background: var(--bg-primary); border: 1px solid var(--border-color); padding: 8px 14px; border-radius: 6px; font-size: 12px; }
    .btn-sm { padding: 4px 8px; font-size: 11px; }
    .mt-16 { margin-top: 16px; }
    .mt-8 { margin-top: 8px; }
    .text-muted { color: var(--text-muted); font-size: 12px; }
  `]
})
export class AdminComponent implements OnInit {
  activeTab = 'users';
  users: any[] = [];
  auditLogs: AuditLog[] = [];

  roles = [
    '1. Super Admin', '2. Management', '3. Customer', '4. Program Manager',
    '5. Project Manager', '6. R&D / Engineering', '7. NPI Team', '8. Production Manager',
    '9. Production User', '10. Quality Manager', '11. Quality Engineer', '12. Procurement',
    '13. Supplier', '14. Logistics', '15. After-Sales / Service', '16. Finance / Compliance', '17. Viewer'
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getUsers().subscribe(res => this.users = res);
    this.apiService.getAuditLogs().subscribe(res => this.auditLogs = res);
  }

  toggleUser(u: any) {
    u.is_active = !u.is_active;
  }
}
