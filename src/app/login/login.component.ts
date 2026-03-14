import { Component, AfterViewInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "../services/auth.service";
import { MatIconModule } from "@angular/material/icon";

declare var google: any;

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden"
    >
      <!-- Decorative Background Elements -->
      <div
        class="absolute -top-24 -left-24 w-96 h-96 bg-tracker-brand/5 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-24 -right-24 w-96 h-96 bg-tracker-accent/5 rounded-full blur-3xl"
      ></div>

      <div
        class="w-full max-w-[440px] z-10 animate-in fade-in zoom-in duration-700"
      >
        <div
          class="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white p-10 md:p-12 backdrop-blur-sm bg-white/90"
        >
          <!-- Logo & Header -->
          <div class="text-center mb-10">
            <div
              class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-tracker-brand to-tracker-accent rounded-[28px] shadow-xl shadow-tracker-brand/20 mb-6 group transition-all duration-500 hover:scale-110"
            >
              <mat-icon class="material-icons text-white !text-[36px]"
                >timer</mat-icon
              >
            </div>
            <h1 class="text-4xl font-[900] text-slate-900 tracking-tight mb-3">
              TimeKeeper
            </h1>
            <p class="text-slate-500 font-medium">
              Capture every second of your productivity.
            </p>
          </div>

          <!-- Login Form -->
          <form (submit)="onLogin()" class="space-y-6">
            <div class="space-y-2">
              <label
                for="userName"
                class="text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1"
                >Your Name</label
              >
              <div class="relative group">
                <div
                  class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"
                >
                  <mat-icon
                    class="material-icons !text-[20px] text-slate-400 group-focus-within:text-tracker-brand transition-colors"
                    >person_outline</mat-icon
                  >
                </div>
                <input
                  type="text"
                  id="userName"
                  [(ngModel)]="userName"
                  name="userName"
                  required
                  placeholder="Enter your name..."
                  autocomplete="off"
                  class="w-full h-[64px] pl-14 pr-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-semibold focus:bg-white focus:border-tracker-brand/50 focus:ring-4 focus:ring-tracker-brand/5 outline-none transition-all duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              [disabled]="!userName.trim()"
              class="w-full h-[64px] bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/10 hover:shadow-2xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <span>Get Started</span>
              <mat-icon class="material-icons !text-[20px]"
                >arrow_forward</mat-icon
              >
            </button>
          </form>

          <!-- Separator -->
          <!-- <div class="relative my-8 text-center">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-100"></div>
            </div>
            <span class="relative bg-white px-4 text-[11px] font-black uppercase tracking-widest text-slate-300">OR</span>
          </div> -->

          <!-- Google Login Button -->
          <!-- <div class="flex flex-col items-center gap-2 min-h-[48px]">
            <div id="google-btn"></div>
            <p *ngIf="isClientPlaceholder" class="text-[10px] text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full animate-pulse text-center">
              ⚠️ Please replace your Client ID in login.component.ts
            </p>
          </div> -->

          <!-- Footer Info -->
          <div
            class="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-3"
          >
            <div
              class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"
            >
              <span
                class="w-1.5 h-1.5 bg-tracker-success rounded-full animate-pulse"
              ></span>
              Connected to Cloud Sync
            </div>
            <p class="text-[11px] text-slate-300 font-medium">
              Version 2.3.0 • Enterprise Edition
            </p>
          </div>
        </div>

        <!-- Bottom Tagline -->
        <p class="text-center mt-8 text-slate-400 text-sm font-medium">
          Built for teams who value their time.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      input::placeholder {
        opacity: 1;
      }
      @keyframes in {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-in {
        animation: in 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }
    `,
  ],
})
export class LoginComponent implements AfterViewInit {
  userName: string = "";

  // 🚨 ACTION REQUIRED: Replace this with your actual Client ID!
  // Get it from: https://console.cloud.google.com/apis/credentials
  private clientId = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  isClientPlaceholder = true;

  constructor(private auth: AuthService) {
    this.isClientPlaceholder = this.clientId.includes("YOUR_GOOGLE_CLIENT_ID");
  }

  ngAfterViewInit(): void {
    this.tryRenderGoogleButton();
  }

  private tryRenderGoogleButton(retries = 0): void {
    if (this.isClientPlaceholder) {
      console.warn(
        "Google Client ID is still placeholder. Button won't render.",
      );
      return;
    }

    if (typeof google !== "undefined" && google.accounts) {
      this.auth.initializeGoogleLogin(this.clientId);
      google.accounts.id.renderButton(document.getElementById("google-btn"), {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: 350,
      });
    } else if (retries < 10) {
      setTimeout(() => this.tryRenderGoogleButton(retries + 1), 500);
    }
  }

  onLogin(): void {
    if (this.userName.trim()) {
      this.auth.login(this.userName);
    }
  }
}
