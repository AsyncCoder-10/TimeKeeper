import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { AuthService } from "./services/auth.service";
import { LoginComponent } from "./login/login.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, LoginComponent, CommonModule],
  template: `
    <ng-container *ngIf="auth.getCurrentUser() | async as user; else loginScreen">
      <app-header></app-header>
      <main class="min-h-screen pt-20 pb-16 px-4 bg-gray-50/50">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </ng-container>
    
    <ng-template #loginScreen>
      <app-login></app-login>
    </ng-template>
  `,
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
