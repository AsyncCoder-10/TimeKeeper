import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { TimeLog } from "./excel-export.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class TimeLogService {
  private readonly SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbw_z9yctkeb7CPp6HNsOyrBqHVUyaQmTR_ap4ddxfSTooNVEZhEcxdPw4EZjZh1oOYa/exec";

  private logsSubject = new BehaviorSubject<TimeLog[]>([]);

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {
    // Clear any legacy local storage to avoid confusion
    localStorage.removeItem("time_tracker_logs");

    // Initial sync
    this.syncWithCloud();

    // Sync whenever user changes (login/logout)
    this.auth.getCurrentUser().subscribe(() => {
      this.syncWithCloud();
    });
  }

  getLogs(): Observable<TimeLog[]> {
    return this.logsSubject.asObservable();
  }

  /**
   * Syncs local state with Google Sheets.
   */
  public syncWithCloud(): void {
    const currentUser = this.auth.currentUserName;
    if (!currentUser) {
      this.logsSubject.next([]);
      return;
    }

    // Pass user to the GET request for server-side filtering
    const url = `${this.SCRIPT_URL}?user=${encodeURIComponent(currentUser)}`;

    this.http.get<any[]>(url).subscribe({
      next: (cloudData) => {
        if (cloudData && Array.isArray(cloudData)) {
          // Normalize and reverse to show LATEST records first
          const normalizedLogs = cloudData
            .map((item) => this.normalizeLog(item))
            .reverse();

          this.logsSubject.next(normalizedLogs);
          console.log(
            "Synced with Google Sheets:",
            normalizedLogs.length,
            "logs for",
            currentUser,
          );
        }
      },
      error: (err) => {
        console.warn("Cloud sync failed (CORS or Network):", err);
      },
    });
  }

  /**
   * Normalizes log data from cloud (handles case sensitivity and date formats)
   */
  private normalizeLog(item: any): TimeLog {
    return {
      date: this.formatValue(item.date || item.Date, "date"),
      startTime: this.formatValue(item.startTime || item.StartTime, "time"),
      endTime: this.formatValue(item.endTime || item.EndTime, "time"),
      duration: this.formatValue(item.duration || item.Duration, "time"),
      targetTime: item.targetTime || item.TargetTime || "-",
      status: item.status || item.Status || "Tracked",
      user: item.user || item.User || "Unknown",
    };
  }

  /**
   * Cleans up weird ISO strings (like 1899-12-30T...) into clean DD/MM/YYYY or HH:mm:ss
   */
  private formatValue(val: any, type: "date" | "time"): string {
    if (!val) return "-";
    const strVal = String(val);

    const d = new Date(strVal);
    if (!isNaN(d.getTime())) {
      if (type === "time") {
        const hh = d.getHours().toString().padStart(2, "0");
        const mm = d.getMinutes().toString().padStart(2, "0");
        const ss = d.getSeconds().toString().padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
      }

      if (type === "date") {
        if (d.getFullYear() < 1970) return strVal.includes("/") ? strVal : "-";
        const dd = d.getDate().toString().padStart(2, "0");
        const mm = (d.getMonth() + 1).toString().padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
      }
    }
    return strVal;
  }

  addLog(log: TimeLog): void {
    const currentUser = this.auth.currentUserName;
    if (!currentUser) return;

    const logWithUser = { ...log, user: currentUser };

    // 1. Optimistic Update
    const currentLogs = this.logsSubject.value;
    this.logsSubject.next([logWithUser, ...currentLogs]);

    const headers = new HttpHeaders({ "Content-Type": "text/plain" });

    // 2. Persist to Cloud
    this.http
      .post(this.SCRIPT_URL, JSON.stringify(logWithUser), {
        headers,
        responseType: "text",
      })
      .subscribe({
        next: () => {
          console.log("Log saved to Google Sheets for", currentUser);
          setTimeout(() => this.syncWithCloud(), 2000);
        },
        error: (err) => {
          console.error("Failed to save to cloud:", err);
        },
      });
  }

  deleteLog(log: TimeLog): void {
    const currentUser = this.auth.currentUserName;
    if (!currentUser) return;

    // 1. Optimistic Update
    const currentLogs = this.logsSubject.value;
    const updatedLogs = currentLogs.filter((l) => l !== log);
    this.logsSubject.next(updatedLogs);

    const headers = new HttpHeaders({ "Content-Type": "text/plain" });
    const payload = { action: "delete", log: { ...log, user: currentUser } };

    // 2. Persist Deletion to Cloud
    this.http
      .post(this.SCRIPT_URL, JSON.stringify(payload), {
        headers,
        responseType: "text",
      })
      .subscribe({
        next: (res) => {
          console.log("Delete response from cloud:", res);
          setTimeout(() => this.syncWithCloud(), 1500);
        },
        error: (err) => {
          console.error("Failed to delete from cloud:", err);
        },
      });
  }

  clearAll(): void {
    this.logsSubject.next([]);
  }
}
