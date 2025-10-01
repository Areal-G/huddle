// Runs in the browser before the app hydrates.
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client

import { reloadOnceForChunkError } from "@/lib/chunk-recovery";
import { installTranslationDomGuard } from "@/lib/translation-dom-guard";

// Runs before React hydrates, so every DOM update React makes is covered.
installTranslationDomGuard();

// Errors React catches in an error boundary reach the boundary instead; see
// app/[locale]/error.tsx and app/global-error.tsx.
window.addEventListener("error", (event) =>
  reloadOnceForChunkError(event.error),
);
window.addEventListener("unhandledrejection", (event) =>
  reloadOnceForChunkError(event.reason),
);
