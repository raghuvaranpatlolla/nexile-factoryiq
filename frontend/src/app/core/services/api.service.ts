import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AuthResponse, Project, WorkOrder, NCR, CAPA, Certificate,
  PurchaseOrder, Inventory, RMA, SearchResult, NotificationItem, AuditLog
} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) {}

  // Generic helpers
  get<T>(endpoint: string): Observable<T> {
    const url = endpoint.startsWith('/') ? `${this.baseUrl}${endpoint}` : `${this.baseUrl}/${endpoint}`;
    return this.http.get<T>(url);
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    const url = endpoint.startsWith('/') ? `${this.baseUrl}${endpoint}` : `${this.baseUrl}/${endpoint}`;
    return this.http.post<T>(url, body);
  }

  // Auth
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials);
  }

  // Dashboard
  getDashboardKpis(siteId?: number): Observable<any> {
    let params = new HttpParams();
    if (siteId) params = params.set('site_id', siteId);
    return this.http.get<any>(`${this.baseUrl}/dashboard/kpis`, { params });
  }

  getDashboardCharts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dashboard/charts`);
  }

  // Projects
  getProjects(search?: string, status?: string, health?: string): Observable<Project[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    if (health) params = params.set('health', health);
    return this.http.get<Project[]>(`${this.baseUrl}/projects`, { params });
  }

  getProjectDetails(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/projects/${id}`);
  }

  createProject(project: any): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects`, project);
  }

  // Production
  getProductionLines(siteId?: number): Observable<any[]> {
    let params = new HttpParams();
    if (siteId) params = params.set('site_id', siteId);
    return this.http.get<any[]>(`${this.baseUrl}/production/lines`, { params });
  }

  getWorkOrders(siteId?: number): Observable<WorkOrder[]> {
    let params = new HttpParams();
    if (siteId) params = params.set('site_id', siteId);
    return this.http.get<WorkOrder[]>(`${this.baseUrl}/production/work-orders`, { params });
  }

  // Quality
  getNCRs(status?: string): Observable<NCR[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<NCR[]>(`${this.baseUrl}/quality/ncrs`, { params });
  }

  getCAPAs(): Observable<CAPA[]> {
    return this.http.get<CAPA[]>(`${this.baseUrl}/quality/capas`);
  }

  getCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.baseUrl}/quality/certificates`);
  }

  getSPCRecords(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/quality/spc`);
  }

  getAudits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/quality/audits`);
  }

  // Supply Chain
  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.baseUrl}/supply-chain/pos`);
  }

  getSupplierScorecards(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/supply-chain/scorecards`);
  }

  getInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.baseUrl}/supply-chain/inventory`);
  }

  getShipments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/supply-chain/shipments`);
  }

  // After-Sales
  getRMAs(): Observable<RMA[]> {
    return this.http.get<RMA[]>(`${this.baseUrl}/after-sales/rmas`);
  }

  getWarranties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/after-sales/warranties`);
  }

  getEOLNotices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/after-sales/eol`);
  }

  // Documents & BOM
  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/documents`);
  }

  getBOMTree(productId: number = 1): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/documents/boms?product_id=${productId}`);
  }

  getKnowledgeArticles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/documents/knowledge-base`);
  }

  // Admin & System
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/users`);
  }

  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.baseUrl}/admin/audit-logs`);
  }

  getNotifications(): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(`${this.baseUrl}/admin/notifications`);
  }

  globalSearch(query: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`${this.baseUrl}/admin/search?query=${encodeURIComponent(query)}`);
  }
}
