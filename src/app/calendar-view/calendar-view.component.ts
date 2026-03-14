import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { TimeLog } from "../services/excel-export.service";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  logs: TimeLog[];
  status: "success" | "late" | "mixed" | "none";
}

@Component({
  selector: "app-calendar-view",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: "./calendar-view.component.html",
})
export class CalendarViewComponent implements OnChanges {
  @Input() logs: TimeLog[] = [];
  @Output() delete = new EventEmitter<TimeLog>();

  viewDate: Date = new Date();
  days: CalendarDay[] = [];
  selectedDay: CalendarDay | null = null;
  weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["logs"]) {
      this.generateCalendar();
    }
  }

  generateCalendar(): void {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

    const days: CalendarDay[] = [];
    let current = new Date(startDate);

    while (current <= endDate) {
      const yearStr = current.getFullYear();
      const monthStr = (current.getMonth() + 1).toString().padStart(2, "0");
      const dayStr = current.getDate().toString().padStart(2, "0");
      const isoDate = `${dayStr}/${monthStr}/${yearStr}`; // Match the format used in logs: "DD/MM/YYYY"

      const dayLogs = this.logs.filter((l) => l.date === isoDate);

      let status: "success" | "late" | "mixed" | "none" = "none";
      if (dayLogs.length > 0) {
        const hasLate = dayLogs.some((l) =>
          (l.status || "").toLowerCase().includes("late"),
        );
        const hasSuccess = dayLogs.some(
          (l) =>
            (l.status || "").toLowerCase().includes("succeeded") ||
            (l.status || "").toLowerCase().includes("completed"),
        );
        if (hasLate && hasSuccess) status = "mixed";
        else if (hasLate) status = "late";
        else status = "success";
      }

      const day: CalendarDay = {
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString(),
        logs: dayLogs,
        status,
      };

      days.push(day);

      // Select today by default if in view
      if (day.isToday && !this.selectedDay) {
        this.selectedDay = day;
      }

      current.setDate(current.getDate() + 1);
    }

    // Remember selected date to restore it after refresh
    const selectedDateStr = this.selectedDay?.date.toDateString();

    this.days = days;

    // Restore selection or select today/default
    if (selectedDateStr) {
      this.selectedDay = this.days.find(d => d.date.toDateString() === selectedDateStr) || null;
    }

    if (!this.selectedDay) {
      this.selectedDay = this.days.find(d => d.isToday) || this.days.find(d => d.isCurrentMonth) || this.days[0] || null;
    }
  }

  prevMonth(): void {
    this.viewDate = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth() - 1,
      1,
    );
    this.generateCalendar();
  }

  nextMonth(): void {
    this.viewDate = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth() + 1,
      1,
    );
    this.generateCalendar();
  }

  today(): void {
    this.viewDate = new Date();
    this.generateCalendar();
    this.selectedDay = this.days.find((d) => d.isToday) || this.days[0] || null;
  }

  selectDay(day: CalendarDay): void {
    this.selectedDay = day;
  }

  onDeleteLog(event: Event, log: TimeLog): void {
    event.stopPropagation();
    this.delete.emit(log);
  }
}
