import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-brand">
          <div class="logo">⚡</div>
          <h1>NEXILE FactoryIQ</h1>
          <p>Manufacturing Excellence Portal</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="error-alert" *ngIf="errorMessage">
            ⚠️ {{ errorMessage }}
          </div>

          <div class="form-group">
            <label>Work Email</label>
            <input
              type="email"
              class="fiq-input"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="admin@factoryiq.com"
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="password-wrap">
              <input
                [type]="showPassword ? 'text' : 'password'"
                class="fiq-input"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="••••••••••••"
              />
              <button type="button" class="eye-btn" (click)="showPassword = !showPassword">
                {{ showPassword ? '👁️' : '🙈' }}
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" />
              Remember me
            </label>
            <a href="#" (click)="onForgotPassword($event)">Forgot password?</a>
          </div>

          <button type="submit" class="fiq-btn fiq-btn-primary full-btn" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In to Portal' }}
          </button>
        </form>

        <div class="demo-accounts">
          <p class="demo-title">⚡ Quick Demo Login:</p>
          <div class="demo-chips">
            <button (click)="fillDemo('admin@factoryiq.com')">Super Admin</button>
            <button (click)="fillDemo('manager@factoryiq.com')">Management</button>
            <button (click)="fillDemo('project@factoryiq.com')">Project Mgr</button>
            <button (click)="fillDemo('quality@factoryiq.com')">Quality Mgr</button>
            <button (click)="fillDemo('production@factoryiq.com')">Production Mgr</button>
            <button (click)="fillDemo('supplier@factoryiq.com')">Supplier</button>
            <button (click)="fillDemo('customer@factoryiq.com')">Customer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at top right, #1e293b, #0f172a);
      padding: 20px;
    }

    .auth-card {
      width: 100%;
      max-width: 440px;
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 36px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }

    .auth-brand {
      text-align: center;
      margin-bottom: 28px;
    }

    .logo {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin: 0 auto 12px auto;
    }

    .auth-brand h1 {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .auth-brand p {
      font-size: 12px;
      color: var(--accent-blue);
      font-weight: 600;
    }

    .error-alert {
      background: var(--status-red-bg);
      color: var(--status-red);
      padding: 10px;
      border-radius: 6px;
      font-size: 13px;
      margin-bottom: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 18px;
    }

    .form-group label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .password-wrap {
      position: relative;
    }

    .eye-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      cursor: pointer;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      margin-bottom: 24px;
    }

    .full-btn {
      width: 100%;
      justify-content: center;
      padding: 12px;
      font-size: 14px;
    }

    .demo-accounts {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }

    .demo-title {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-secondary);
      margin-bottom: 10px;
    }

    .demo-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .demo-chips button {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      padding: 4px 10px;
      border-radius: 16px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .demo-chips button:hover {
      border-color: var(--accent-blue);
      color: var(--accent-blue);
    }
  `]
})
export class LoginComponent {
  email = 'admin@factoryiq.com';
  password = 'Password123!';
  showPassword = false;
  rememberMe = true;
  loading = false;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  fillDemo(email: string) {
    this.email = email;
    this.password = 'Password123!';
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    alert('Please contact system administrator to reset password.');
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    this.apiService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.authService.setSession(res.access_token, res.user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.detail || 'Login failed. Please check credentials.';
      }
    });
  }
}
