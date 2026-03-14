import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: "./confirm-dialog.component.html",
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}
}
