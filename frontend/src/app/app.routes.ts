import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ExecutiveDashboardComponent } from './features/dashboard/dashboard.component';
import { ProjectListComponent } from './features/projects/project-list/project-list.component';
import { ProjectDetailComponent } from './features/projects/project-detail/project-detail.component';
import { ProductionDashboardComponent } from './features/production/production-dashboard/production-dashboard.component';
import { QualityDashboardComponent } from './features/quality/quality-dashboard/quality-dashboard.component';
import { SupplyChainDashboardComponent } from './features/supply-chain/supply-chain-dashboard/supply-chain-dashboard.component';
import { AfterSalesComponent } from './features/after-sales/after-sales.component';
import { DocumentsComponent } from './features/documents/documents.component';
import { CollaborationComponent } from './features/collaboration/collaboration-hub.component';
import { KnowledgeBaseComponent } from './features/knowledge-base/knowledge-base.component';
import { AnalyticsComponent } from './features/analytics/analytics-reports.component';
import { NotificationsComponent } from './features/notifications/notification-center.component';
import { AdminComponent } from './features/admin/admin-panel.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: ExecutiveDashboardComponent, canActivate: [authGuard] },
  { path: 'projects', component: ProjectListComponent, canActivate: [authGuard] },
  { path: 'projects/:id', component: ProjectDetailComponent, canActivate: [authGuard] },
  { path: 'production', component: ProductionDashboardComponent, canActivate: [authGuard] },
  { path: 'quality', component: QualityDashboardComponent, canActivate: [authGuard] },
  { path: 'supply-chain', component: SupplyChainDashboardComponent, canActivate: [authGuard] },
  { path: 'after-sales', component: AfterSalesComponent, canActivate: [authGuard] },
  { path: 'documents', component: DocumentsComponent, canActivate: [authGuard] },
  { path: 'collaboration', component: CollaborationComponent, canActivate: [authGuard] },
  { path: 'knowledge-base', component: KnowledgeBaseComponent, canActivate: [authGuard] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [authGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
