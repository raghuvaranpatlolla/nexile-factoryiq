import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ApiService } from '../../../core/services/api.service';
import { User, SearchResult } from '../../../core/models/models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <header class="header">
      <div class="header-left">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="search-input"
            placeholder="Global search (Projects, POs, Documents, NCRs)..."
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
          />
          <!-- Search dropdown popup -->
          <div class="search-dropdown" *ngIf="searchResults.length > 0 && searchQuery">
            <div
              class="search-item"
              *ngFor="let item of searchResults"
              (click)="navigateTo(item.link)"
            >
              <div class="search-cat">{{ item.category }}</div>
              <div class="search-title">{{ item.title }}</div>
              <div class="search-sub">{{ item.subtitle }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="header-right">
        <!-- Site Selector -->
        <div class="site-selector">
          <span class="site-icon">🏢</span>
          <select [(ngModel)]="selectedSite">
            <option value="all">All Sites (Global)</option>
            <option value="hyd">Hyderabad Campus (HYD-01)</option>
            <option value="blr">Bangalore Hub (BLR-02)</option>
            <option value="che">Chennai Assembly (CHE-03)</option>
            <option value="pun">Pune Precision (PUN-04)</option>
          </select>
        </div>

        <!-- Theme Toggle -->
        <button class="icon-btn" (click)="themeService.toggleTheme()" [title]="'Toggle Light/Dark Theme'">
          <span *ngIf="themeService.isDark$ | async">☀️</span>
          <span *ngIf="!(themeService.isDark$ | async)">🌙</span>
        </button>

        <!-- Notifications -->
        <button class="icon-btn notif-btn" routerLink="/notifications" [title]="'Notifications'">
          <span>🔔</span>
          <span class="badge-dot"></span>
        </button>

        <!-- User Profile Dropdown -->
        <div class="user-profile" *ngIf="user">
          <div class="avatar">{{ getInitials(user.full_name) }}</div>
          <div class="user-info">
            <span class="user-name">{{ user.full_name }}</span>
            <span class="user-role">{{ user.role }}</span>
          </div>
          <button class="logout-btn" (click)="logout()" title="Logout">🚪</button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 64px;
      background-color: var(--bg-card);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      z-index: 90;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      max-width: 480px;
    }

    .search-box {
      position: relative;
      width: 100%;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: var(--text-muted);
    }

    .search-input {
      width: 100%;
      background-color: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 8px 16px 8px 36px;
      color: var(--text-primary);
      font-size: 13px;
      outline: none;
    }

    .search-input:focus {
      border-color: var(--accent-blue);
    }

    .search-dropdown {
      position: absolute;
      top: 44px;
      left: 0;
      right: 0;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      box-shadow: var(--shadow-md);
      max-height: 300px;
      overflow-y: auto;
      z-index: 200;
    }

    .search-item {
      padding: 10px 14px;
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
    }

    .search-item:hover {
      background: var(--bg-hover);
    }

    .search-cat {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--accent-blue);
    }

    .search-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .search-sub {
      font-size: 11px;
      color: var(--text-secondary);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .site-selector {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-primary);
      padding: 4px 10px;
      border: 1px solid var(--border-color);
      border-radius: 6px;
    }

    .site-selector select {
      background: transparent;
      border: none;
      color: var(--text-primary);
      font-size: 12px;
      outline: none;
      cursor: pointer;
    }

    .icon-btn {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-primary);
      cursor: pointer;
      position: relative;
    }

    .badge-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 8px;
      height: 8px;
      background: var(--status-red);
      border-radius: 50%;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-primary);
      padding: 4px 12px;
      border-radius: 20px;
      border: 1px solid var(--border-color);
    }

    .avatar {
      width: 28px;
      height: 28px;
      background: var(--accent-blue);
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .user-role {
      font-size: 10px;
      color: var(--accent-blue);
    }

    .logout-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 14px;
      padding: 4px;
    }
  `]
})
export class HeaderComponent implements OnInit {
  user: User | null = null;
  selectedSite = 'all';
  searchQuery = '';
  searchResults: SearchResult[] = [];

  constructor(
    private authService: AuthService,
    public themeService: ThemeService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => this.user = u);
  }

  onSearch() {
    if (this.searchQuery.trim().length >= 2) {
      this.apiService.globalSearch(this.searchQuery).subscribe({
        next: (res) => this.searchResults = res,
        error: () => this.searchResults = []
      });
    } else {
      this.searchResults = [];
    }
  }

  navigateTo(link: string) {
    this.searchQuery = '';
    this.searchResults = [];
    this.router.navigate([link]);
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  logout() {
    this.authService.logout();
  }
}
