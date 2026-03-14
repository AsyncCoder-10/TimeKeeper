import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TimeLog } from "../services/excel-export.service";

interface DayData {
  day: string;
  minutes: number;
  height: number;
  label: string;
}

@Component({
  selector: "app-progress-graph",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./progress-graph.component.html",
})
export class ProgressGraphComponent implements OnChanges {
  @Input() logs: TimeLog[] = [];

  days: DayData[] = [];
  maxMinutes = 0;
  chartType: "bar" | "line" = "bar";
  linePath = "";
  linePoints: { x: number; y: number }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["logs"]) {
      this.processData();
    }
  }

  private processData(): void {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${day}/${month}/${year}`;
    });

    const dataMap = new Map<string, number>();
    last7Days.forEach((day) => dataMap.set(day, 0));

    this.logs.forEach((log) => {
      if (dataMap.has(log.date)) {
        const [h, m, s] = log.duration.split(":").map(Number);
        const mins = h * 60 + m + s / 60;
        dataMap.set(log.date, (dataMap.get(log.date) || 0) + mins);
      }
    });

    this.maxMinutes = Math.max(...Array.from(dataMap.values()), 60); // min 60 for scale

    this.days = last7Days.map((dateStr, index) => {
      const mins = dataMap.get(dateStr) || 0;
      // Re-parse date for label
      const [d, m, y] = dateStr.split('/').map(Number);
      const date = new Date(y, m - 1, d);
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        minutes: mins,
        height: (mins / this.maxMinutes) * 100,
        label: this.formatMinutes(mins),
      };
    });

    this.calculateLinePath();
  }

  private calculateLinePath(): void {
    const width = 100; // viewBox width %
    const height = 100; // viewBox height %
    const padding = 10;
    
    this.linePoints = this.days.map((day, i) => ({
      x: (i / (this.days.length - 1)) * 100,
      y: 100 - day.height
    }));

    if (this.linePoints.length < 2) return;

    // Build the SVG path string
    let path = `M ${this.linePoints[0].x},${this.linePoints[0].y}`;
    
    for (let i = 0; i < this.linePoints.length - 1; i++) {
      const curr = this.linePoints[i];
      const next = this.linePoints[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      path += ` C ${cp1x},${curr.y} ${cp2x},${next.y} ${next.x},${next.y}`;
    }
    
    this.linePath = path;
  }

  setChartType(type: "bar" | "line"): void {
    this.chartType = type;
  }

  private formatMinutes(mins: number): string {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }
}
