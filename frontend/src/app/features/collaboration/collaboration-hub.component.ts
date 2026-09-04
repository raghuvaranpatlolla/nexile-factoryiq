import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-collaboration-hub',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="collab-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Cross-Functional Collaboration & Discussion Threads</h1>
          <p class="page-subtitle">Project discussion channels, engineering mentions, and design change notes</p>
        </div>
      </div>

      <div class="collab-grid">
        <div class="fiq-card channels-card">
          <h3>💬 Channels & Projects</h3>
          <div class="channel-list">
            <div class="channel-item active"># PRJ-HYD-101 EV Inverter Ramp</div>
            <div class="channel-item"># PRJ-BLR-204 Flight Computer Qual</div>
            <div class="channel-item"># NCR-2026-042 Micro-crack Inquiry</div>
            <div class="channel-item"># Quality Audit 2026 Preparation</div>
          </div>
        </div>

        <div class="fiq-card chat-card">
          <div class="chat-header">
            <h3>Thread: PRJ-HYD-101 EV Inverter SMT Line Ramp</h3>
          </div>

          <div class="messages-list">
            <div class="msg" *ngFor="let m of messages">
              <div class="msg-avatar">{{ m.initials }}</div>
              <div class="msg-content">
                <div class="msg-meta">
                  <span class="msg-author">{{ m.author }}</span>
                  <span class="msg-time">{{ m.time }}</span>
                </div>
                <div class="msg-text">{{ m.text }}</div>
              </div>
            </div>
          </div>

          <div class="chat-input-row">
            <input type="text" class="fiq-input" placeholder="Type your comment or mention @engineer..." [(ngModel)]="newMsg" (keyup.enter)="sendMsg()" />
            <button class="fiq-btn fiq-btn-primary" (click)="sendMsg()">Send</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .collab-page { display: flex; flex-direction: column; gap: 20px; }
    .collab-grid { display: grid; grid-template-columns: 240px 1fr; gap: 20px; }
    .channel-list { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; }
    .channel-item { padding: 8px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; color: var(--text-secondary); }
    .channel-item.active { background: var(--accent-blue-bg); color: var(--accent-blue); }
    .chat-card { display: flex; flex-direction: column; height: 500px; }
    .messages-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; padding: 12px 0; }
    .msg { display: flex; gap: 12px; }
    .msg-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--accent-blue); color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .msg-content { display: flex; flex-direction: column; gap: 4px; }
    .msg-meta { display: flex; gap: 8px; align-items: center; }
    .msg-author { font-size: 12px; font-weight: 700; color: var(--text-primary); }
    .msg-time { font-size: 10px; color: var(--text-muted); }
    .msg-text { font-size: 13px; color: var(--text-secondary); }
    .chat-input-row { display: flex; gap: 12px; border-top: 1px solid var(--border-color); padding-top: 12px; }
    .chat-input-row input { flex: 1; }
  `]
})
export class CollaborationComponent {
  messages = [
    { initials: 'SL', author: 'Dr. Sarah Lin (Quality)', time: '10:14 AM', text: '@Vikram Seth Please review the updated ESD protection spec for CAN Bus in v2.1 drawings.' },
    { initials: 'VS', author: 'Vikram Seth (NPI)', time: '10:22 AM', text: 'Reviewed and approved. Updated in the BOM viewer artifact.' }
  ];
  newMsg = '';

  sendMsg() {
    if (!this.newMsg.trim()) return;
    this.messages.push({
      initials: 'AV',
      author: 'Alexander Vance (You)',
      time: 'Just now',
      text: this.newMsg
    });
    this.newMsg = '';
  }
}
