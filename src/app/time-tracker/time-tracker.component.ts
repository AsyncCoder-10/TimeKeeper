import { Component, OnDestroy } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../shared/components/confirm-dialog/confirm-dialog.component";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ExcelExportService } from "../services/excel-export.service";
import { TimeLogService } from "../services/time-log.service";
import { NotificationService } from "../shared/services/notification.service";

@Component({
  selector: "app-time-tracker",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
  ],
  templateUrl: "./time-tracker.component.html",
})
export class TimeTrackerComponent implements OnDestroy {
  isRunning = false;
  time = 0; // in milliseconds
  startTime: Date | null = null;
  endTime: Date | null = null;
  targetHours: number | null = null;
  targetMinutes: number | null = null;
  private timerInterval: any;

  constructor(
    private excelService: ExcelExportService,
    private logService: TimeLogService,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {}

  get formattedTime(): string {
    const totalSeconds = Math.floor(this.time / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      if (!this.startTime && this.time === 0) {
        this.startTime = new Date();
      }
      this.timerInterval = setInterval(() => {
        this.time += 1000;
      }, 1000);
    }
  }

  pause(): void {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.timerInterval);
    }
  }

  stop(): void {
    this.pause();
    if (this.startTime && this.time > 0) {
      this.endTime = new Date();
      this.exportLog();
      // Reset state after saving
      this.time = 0;
      this.startTime = null;
      this.endTime = null;
      this.targetHours = null;
      this.targetMinutes = null;
    }
  }

  reset(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Reset Timer",
        message:
          "Are you sure you want to reset the timer? All current progress will be lost.",
        confirmText: "Reset",
        cancelText: "Continue",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.isRunning) {
          this.pause();
        }
        this.time = 0;
        this.startTime = null;
        this.endTime = null;
        this.targetHours = null;
        this.targetMinutes = null;
      }
    });
  }

  private exportLog(): void {
    if (!this.startTime || !this.endTime) return;

    let status = "Completed";
    const actualMinutes = this.time / (1000 * 60);
    const totalTargetMinutes = (this.targetHours || 0) * 60 + (this.targetMinutes || 0);

    if (totalTargetMinutes > 0) {
      if (actualMinutes < totalTargetMinutes) {
        const diffTotalMins = Math.ceil(totalTargetMinutes - actualMinutes);
        const diffHrs = Math.floor(diffTotalMins / 60);
        const diffMins = diffTotalMins % 60;
        
        if (diffHrs > 0) {
          status = `${diffHrs}h ${diffMins}m late`;
        } else {
          status = `${diffMins} min late`;
        }
      } else {
        status = "Succeeded";
      }
    }

    const year = this.startTime.getFullYear();
    const month = (this.startTime.getMonth() + 1).toString().padStart(2, '0');
    const day = this.startTime.getDate().toString().padStart(2, '0');
    const formattedDate = `${day}/${month}/${year}`;

    const log = {
      date: formattedDate,
      startTime: this.formatTo24Hour(this.startTime),
      endTime: this.formatTo24Hour(this.endTime),
      duration: this.formattedTime,
      targetTime: totalTargetMinutes > 0 ? `${totalTargetMinutes} min` : "-",
      status: status,
    };

    // this.excelService.exportDailyLog(log);
    this.logService.addLog(log);
    this.notify.showSuccess("Session saved successfully!");
  }

  private formatTo24Hour(date: Date): string {
    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");
    const ss = date.getSeconds().toString().padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }

  private pad(val: number): string {
    return val < 10 ? "0" + val : val.toString();
  }

  ngOnDestroy(): void {
    this.pause();
  }
}
