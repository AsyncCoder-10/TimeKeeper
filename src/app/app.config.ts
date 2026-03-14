import { ApplicationConfig, isDevMode } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideServiceWorker } from "@angular/service-worker";
import { provideHttpClient } from "@angular/common/http";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000",
    }),
  ],
};
