import { TimeTrackerComponent } from "../time-tracker/time-tracker.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../shared/components/confirm-dialog/confirm-dialog.component";
import { NotificationService } from "../shared/services/notification.service";
import { ProgressGraphComponent } from "../progress-graph/progress-graph.component";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { TimeLogService } from "../services/time-log.service";
import { ExcelExportService, TimeLog } from "../services/excel-export.service";
import { Component, OnInit } from "@angular/core";
import { CalendarViewComponent } from "../calendar-view/calendar-view.component";
import { StatusChartComponent } from "../status-chart/status-chart.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink,
    TimeTrackerComponent,
    MatDialogModule,
    ProgressGraphComponent,
    StatusChartComponent,
    CalendarViewComponent,
  ],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  logs: TimeLog[] = [];
  todayStats = {
    totalSessions: 0,
    totalDuration: "00:00:00",
  };

  constructor(
    private logService: TimeLogService,
    private excelService: ExcelExportService,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.logService.getLogs().subscribe((logs) => {
      this.logs = logs;
      this.calculateStats();
    });
  }

  exportAll(): void {
    if (this.logs.length === 0) return;
    const dateStr = new Date().toLocaleDateString().replace(/\//g, "-");
    this.excelService.exportLogs(this.logs, `TimeLog_Summary_${dateStr}`);
  }

  deleteLog(log: TimeLog): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Delete Log",
        message:
          "Are you sure you want to delete this session? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Keep it",
      },
      panelClass: "custom-dialog-container",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.logService.deleteLog(log);
        this.notify.showSuccess("Session deleted successfully.");
      }
    });
  }

  onDeleteLog(log: TimeLog): void {
    this.deleteLog(log);
  }

  private calculateStats(): void {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const today = `${day}/${month}/${year}`;

    const todayLogs = this.logs.filter((log) => log.date === today);

    this.todayStats.totalSessions = todayLogs.length;

    let totalMs = 0;
    todayLogs.forEach((log) => {
      const parts = log.duration.split(":").map(Number);
      totalMs += (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
    });

    const totalSeconds = Math.floor(totalMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.todayStats.totalDuration = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(val: number): string {
    return val < 10 ? "0" + val : val.toString();
  }
}
