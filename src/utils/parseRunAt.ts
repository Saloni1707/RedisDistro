import * as Chrono from "chrono-node";

export function parseRunAt(req: any): number | undefined {
  let runAtMs: number | undefined = undefined;
  const now = new Date();

  if (typeof req.body.runAt === "string") {
    // Case 1: ISO string like "2025-08-30T17:30:00Z"
    if (!isNaN(Date.parse(req.body.runAt))) {
      runAtMs = Date.parse(req.body.runAt);
    }

    // Case 2: Time format like "5:30 pm"
    else if (/^\d{1,2}:\d{2}\s*(am|pm)$/i.test(req.body.runAt)) {
      const match = req.body.runAt.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const meridiem = match[3].toLowerCase();

        if (meridiem === "pm" && hours !== 12) hours += 12;
        if (meridiem === "am" && hours === 12) hours = 0;

        const runAt = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hours,
          minutes,
          0,
          0
        );

        if (runAt.getTime() < Date.now()) {
          runAt.setDate(runAt.getDate() + 1);
        }
        runAtMs = runAt.getTime();
      }
    }

    // Case 3: Duration format like "5m", "2h"
    else if (/^\d+\s*[smhd]$/.test(req.body.runAt.replace(/\s+/g, ""))) {
      const match = req.body.runAt.replace(/\s+/g, "").match(/^(\d+)([smhd])$/);
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2];
        let ms = 0;
        if (unit === "s") ms = value * 1000;
        if (unit === "m") ms = value * 60 * 1000;
        if (unit === "h") ms = value * 60 * 60 * 1000;
        if (unit === "d") ms = value * 24 * 60 * 60 * 1000;
        runAtMs = Date.now() + ms;
      }
    }

    // Case 4: Natural language (e.g. "tomorrow at 5pm")
    else if (typeof Chrono !== "undefined") {
      const parsed = Chrono.parseDate(req.body.runAt);
      if (parsed) {
        runAtMs = parsed.getTime();
      }
    }
  }

  // Case 5: delay field, like "10m"
  else if (
    typeof req.body.delay === "string" &&
    /^\d+\s*[smhd]$/.test(req.body.delay.replace(/\s+/g, ""))
  ) {
    const match = req.body.delay.replace(/\s+/g, "").match(/^(\d+)([smhd])$/);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2];
      let ms = 0;
      if (unit === "s") ms = value * 1000;
      if (unit === "m") ms = value * 60 * 1000;
      if (unit === "h") ms = value * 60 * 60 * 1000;
      if (unit === "d") ms = value * 24 * 60 * 60 * 1000;
      runAtMs = Date.now() + ms;
    }
  }

  return runAtMs;
}
