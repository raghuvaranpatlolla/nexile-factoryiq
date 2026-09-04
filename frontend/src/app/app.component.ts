import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  template: `
    <div class="app-container" *ngIf="!isAuthPage; else authLayout">
      <app-sidebar [isCollapsed]="sidebarCollapsed" (toggle)="sidebarCollapsed = !sidebarCollapsed"></app-sidebar>
      <div class="main-wrapper">
        <app-header></app-header>
        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <ng-template #authLayout>
      <router-outlet></router-outlet>
    </ng-template>
  `
})
export class AppComponent {
  isAuthPage = false;
  sidebarCollapsed = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAuthPage = event.url.includes('/login') || event.url.includes('/signup');
    });
  }
}
