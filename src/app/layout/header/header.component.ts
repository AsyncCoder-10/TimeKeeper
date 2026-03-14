import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "../../services/auth.service";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentTime: Date = new Date();
  private timeInterval: any;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  onLogout(): void {
    this.auth.logout();
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
}
