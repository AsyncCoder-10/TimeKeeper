import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material/snack-bar";

export interface NotificationData {
  message: string;
  type: "success" | "error" | "info";
}

@Component({
  selector: "app-notification",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex items-center gap-3 px-4 py-2 min-w-[300px]">
      <div 
        [class.bg-emerald-100]="data.type === 'success'"
        [class.text-emerald-600]="data.type === 'success'"
        [class.bg-red-100]="data.type === 'error'"
        [class.text-red-600]="data.type === 'error'"
        class="p-2 rounded-xl"
      >
        <mat-icon class="material-icons !flex items-center justify-center">
          {{ data.type === 'success' ? 'check_circle' : data.type === 'error' ? 'error' : 'info' }}
        </mat-icon>
      </div>
      <div class="flex-1 text-sm font-semibold text-slate-800">
        {{ data.message }}
      </div>
      <button 
        (click)="snackBarRef.dismiss()" 
        class="text-slate-400 hover:text-slate-600 transition-colors"
      >
        <mat-icon class="material-icons !text-lg">close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NotificationComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<NotificationComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: NotificationData
  ) {}
}
