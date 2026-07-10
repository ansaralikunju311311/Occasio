export function calculateRefundPercentage(
  publishedAt: Date | string | undefined | null,
  startTime: Date | string,
  cancelTime: Date | string = new Date()
): number {
  if (!publishedAt) {
    // If publishedAt is missing, fallback to 0% (no cancellation/refund)
    return 0;
  }

  const publishMs = new Date(publishedAt).getTime();
  const startMs = new Date(startTime).getTime();
  const cancelMs = new Date(cancelTime).getTime();

  // Time difference between event publish and start time (in hours)
  const hoursDiff = (startMs - publishMs) / (1000 * 60 * 60);

  // Time difference between cancel time and event start time (in hours)
  const hoursBeforeStart = (startMs - cancelMs) / (1000 * 60 * 60);

  // If the event has already started, no refund is allowed
  if (hoursBeforeStart <= 0) {
    return 0;
  }

  // Case 1: Event published 72 hours or more before it starts
  if (hoursDiff >= 72) {
    if (hoursBeforeStart > 72) {
      return 100;
    } else if (hoursBeforeStart > 48) {
      return 50;
    } else if (hoursBeforeStart > 24) {
      return 25;
    } else {
      return 0;
    }
  }

  // Case 2: Event published only 48 hours or more before it starts (but less than 72 hours)
  if (hoursDiff >= 48) {
    if (hoursBeforeStart > 24) {
      return 50;
    } else {
      return 0;
    }
  }

  // Case 3: Event published only 30 hours or more before it starts (but less than 48 hours)
  if (hoursDiff >= 24) {
    if (hoursBeforeStart > 24) {
      return 25;
    } else {
      return 0;
    }
  }

  // Case 4: Event published less than 24 hours before it starts
  return 0;
}
