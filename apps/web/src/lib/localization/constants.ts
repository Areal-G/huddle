// Locale reuses the existing `huddle_locale` cookie (see `@/lib/locale/constants`).
// Each preference gets its own cookie so the async timezone detector can't
// read-merge-write-clobber a concurrent change to a different preference.
export const TIMEZONE_COOKIE = "huddle_timezone";
export const TIME_FORMAT_COOKIE = "huddle_time_format";
export const WEEK_START_COOKIE = "huddle_week_start";
