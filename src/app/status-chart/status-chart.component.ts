import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TimeLog } from "../services/excel-export.service";

interface StatusData {
  name: string;
  count: number;
  color: string;
  percentage: number;
  offset: number;
}

@Component({
  selector: "app-status-chart",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./status-chart.component.html",
})
export class StatusChartComponent implements OnChanges {
  @Input() logs: TimeLog[] = [];

  statusData: StatusData[] = [];
  totalSessions = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["logs"]) {
      this.processData();
    }
  }

  private processData(): void {
    const counts = {
      succeeded: 0,
      late: 0,
      completed: 0,
    };

    this.logs.forEach((log) => {
      const status = (log.status || "").toLowerCase();
      if (status.includes("succeeded")) counts.succeeded++;
      else if (status.includes("late")) counts.late++;
      else counts.completed++;
    });

    this.totalSessions = this.logs.length || 1; // avoid div by zero

    const rawData = [
      { name: "Succeeded", count: counts.succeeded, color: "#10b981" },
      { name: "Late", count: counts.late, color: "#ef4444" },
      { name: "Completed", count: counts.completed, color: "#6366f1" },
    ];

    let currentOffset = 0;
    this.statusData = rawData
      .filter((d) => d.count > 0)
      .map((d) => {
        const percentage = (d.count / this.totalSessions) * 100;
        const data = {
          ...d,
          percentage,
          offset: currentOffset,
        };
        currentOffset += percentage;
        return data;
      });
  }
}
