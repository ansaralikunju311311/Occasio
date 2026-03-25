export const UpgradeStatus = {
  NONE: "NONE",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
} as const;

export type UpgradeStatus = typeof UpgradeStatus[keyof typeof UpgradeStatus];
