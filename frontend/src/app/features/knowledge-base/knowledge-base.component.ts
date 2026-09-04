import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="kb-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Manufacturing Knowledge Base & SOP Repository</h1>
          <p class="page-subtitle">Standard operating procedures, process guidelines, maintenance guides & training SOPs</p>
        </div>
      </div>

      <div class="search-box mb-16">
        <input type="text" class="fiq-input" placeholder="Search SOPs, test procedures, maintenance guides..." [(ngModel)]="search" />
      </div>

      <div class="card-grid">
        <div class="fiq-card kb-card" *ngFor="let item of articles">
          <div class="kb-cat">{{ item.category }}</div>
          <h3 class="kb-title">{{ item.title }}</h3>
          <p class="kb-snippet">{{ item.content }}</p>
          <div class="kb-meta">Author: {{ item.author }} | Date: {{ item.created_at | date:'mediumDate' }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kb-page { display: flex; flex-direction: column; gap: 20px; }
    .mb-16 { margin-bottom: 16px; }
    .kb-card { display: flex; flex-direction: column; gap: 8px; }
    .kb-cat { font-size: 11px; font-weight: 700; color: var(--accent-blue); text-transform: uppercase; }
    .kb-title { font-size: 16px; font-weight: 700; color: var(--text-primary); }
    .kb-snippet { font-size: 13px; color: var(--text-secondary); }
    .kb-meta { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
  `]
})
export class KnowledgeBaseComponent implements OnInit {
  articles: any[] = [];
  search = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getKnowledgeArticles().subscribe(res => this.articles = res);
  }
}
