import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { NotificationItem } from '../../core/models/models';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notif-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Real-Time Notification Center</h1>
          <p class="page-subtitle">Automated system alerts, quality escalations, milestone reminders & inventory warnings</p>
        </div>
      </div>

      <div class="fiq-table-container">
        <table class="fiq-table">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Category</th>
              <th>Notification Details</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let n of notifications">
              <td>
                <span class="badge" [class.badge-red]="n.priority === 'High'" [class.badge-amber]="n.priority === 'Medium'">
                  {{ n.priority }}
                </span>
              </td>
              <td><span class="badge badge-gray">{{ n.category }}</span></td>
              <td>
                <div class="n-title">{{ n.title }}</div>
                <div class="n-msg">{{ n.message }}</div>
              </td>
              <td>{{ n.created_at | date:'shortTime' }}</td>
              <td>
                <span class="badge" [class.badge-blue]="!n.is_read" [class.badge-gray]="n.is_read">
                  {{ n.is_read ? 'Read' : 'New Alert' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .notif-page { display: flex; flex-direction: column; gap: 20px; }
    .n-title { font-weight: 700; font-size: 13px; }
    .n-msg { font-size: 11px; color: var(--text-secondary); }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: NotificationItem[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getNotifications().subscribe(res => this.notifications = res);
  }
}
