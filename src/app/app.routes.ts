import { Routes } from "@angular/router";
import { TimeTrackerComponent } from "./time-tracker/time-tracker.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

export const routes: Routes = [
  { path: "", component: DashboardComponent },
  { path: "**", redirectTo: "" },
];
