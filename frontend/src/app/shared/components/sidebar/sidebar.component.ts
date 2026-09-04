import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <div class="brand">
        <div class="logo-box">
          <span class="logo-icon">⚡</span>
        </div>
        <div class="brand-text" *ngIf="!isCollapsed">
          <span class="brand-name">NEXILE</span>
          <span class="brand-sub">FactoryIQ</span>
        </div>
        <button class="toggle-btn" (click)="toggleSidebar()">
          {{ isCollapsed ? '❯' : '❮' }}
        </button>
      </div>

      <nav class="nav-menu">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" [title]="'Dashboard'">
          <span class="icon">📊</span>
          <span class="label" *ngIf="!isCollapsed">Dashboard</span>
        </a>
        <a routerLink="/projects" routerLinkActive="active" class="nav-item" [title]="'Projects'">
          <span class="icon">🚀</span>
          <span class="label" *ngIf="!isCollapsed">Projects</span>
        </a>
        <a routerLink="/production" routerLinkActive="active" class="nav-item" [title]="'Production'">
          <span class="icon">⚙️</span>
          <span class="label" *ngIf="!isCollapsed">Production</span>
        </a>
        <a routerLink="/quality" routerLinkActive="active" class="nav-item" [title]="'Quality & Compliance'">
          <span class="icon">🛡️</span>
          <span class="label" *ngIf="!isCollapsed">Quality & Compliance</span>
        </a>
        <a routerLink="/supply-chain" routerLinkActive="active" class="nav-item" [title]="'Supply Chain'">
          <span class="icon">📦</span>
          <span class="label" *ngIf="!isCollapsed">Supply Chain</span>
        </a>
        <a routerLink="/after-sales" routerLinkActive="active" class="nav-item" [title]="'After-Sales'">
          <span class="icon">🛠️</span>
          <span class="label" *ngIf="!isCollapsed">After-Sales</span>
        </a>
        <a routerLink="/documents" routerLinkActive="active" class="nav-item" [title]="'Documents'">
          <span class="icon">📁</span>
          <span class="label" *ngIf="!isCollapsed">Documents</span>
        </a>
        <a routerLink="/collaboration" routerLinkActive="active" class="nav-item" [title]="'Collaboration'">
          <span class="icon">💬</span>
          <span class="label" *ngIf="!isCollapsed">Collaboration</span>
        </a>
        <a routerLink="/knowledge-base" routerLinkActive="active" class="nav-item" [title]="'Knowledge Base'">
          <span class="icon">📚</span>
          <span class="label" *ngIf="!isCollapsed">Knowledge Base</span>
        </a>
        <a routerLink="/analytics" routerLinkActive="active" class="nav-item" [title]="'Analytics & Reports'">
          <span class="icon">📈</span>
          <span class="label" *ngIf="!isCollapsed">Analytics & Reports</span>
        </a>
        <a routerLink="/notifications" routerLinkActive="active" class="nav-item" [title]="'Notifications'">
          <span class="icon">🔔</span>
          <span class="label" *ngIf="!isCollapsed">Notifications</span>
        </a>
        <a routerLink="/admin" routerLinkActive="active" class="nav-item" [title]="'Administration'">
          <span class="icon">🔑</span>
          <span class="label" *ngIf="!isCollapsed">Administration</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100vh;
      background-color: var(--bg-card);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: width 0.2s ease;
      z-index: 100;
    }

    .sidebar.collapsed {
      width: 64px;
    }

    .brand {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 12px;
      border-bottom: 1px solid var(--border-color);
      position: relative;
    }

    .logo-box {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: bold;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-weight: 800;
      font-size: 16px;
      letter-spacing: 1px;
      color: var(--text-primary);
    }

    .brand-sub {
      font-size: 11px;
      color: var(--accent-blue);
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .toggle-btn {
      margin-left: auto;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 12px;
      padding: 4px;
    }

    .nav-menu {
      display: flex;
      flex-direction: column;
      padding: 12px 8px;
      gap: 4px;
      flex: 1;
      overflow-y: auto;
      min-height: 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 6px;
      color: var(--text-secondary);
      font-weight: 500;
      transition: all 0.15s ease;
      text-decoration: none;
    }

    .nav-item:hover {
      background-color: var(--bg-hover);
      color: var(--text-primary);
    }

    .nav-item.active {
      background-color: var(--accent-blue-bg);
      color: var(--accent-blue);
      font-weight: 600;
    }

    .icon {
      font-size: 16px;
      width: 20px;
      text-align: center;
    }

    .label {
      font-size: 13px;
      white-space: nowrap;
    }
  `]
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Output() toggle = new EventEmitter<void>();

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit();
  }
}
