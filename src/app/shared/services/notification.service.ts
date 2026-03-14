import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NotificationComponent } from "../components/notification/notification.component";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.show(message, "success");
  }

  showError(message: string): void {
    this.show(message, "error");
  }

  showInfo(message: string): void {
    this.show(message, "info");
  }

  private show(message: string, type: "success" | "error" | "info"): void {
    this.snackBar.openFromComponent(NotificationComponent, {
      data: { message, type },
      duration: 3000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: ["notification-panel", `notification-${type}`],
    });
  }
}
