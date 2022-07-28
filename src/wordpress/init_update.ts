import type { UpdateCallback } from "./update";
import { getUpdates } from "./update";

// 10 mins * 60 secs * 1000 millis
export const TEN_MINUTES = 10 * 60 * 1000;

export const initUpdateTimer = (
  url: string,
  callback: UpdateCallback,
): NodeJS.Timer => setInterval(() => getUpdates(url, callback), TEN_MINUTES);
