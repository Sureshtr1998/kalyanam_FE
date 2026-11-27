import { useSyncExternalStore } from "react";
import api from "@/utils/api";
import { isBroker } from "@/lib/session";

/**
 * The member's membership from GET /membership (kalyanam_BE
 * src/utils/membership.js). Memberships start March 2027: before `launched`
 * the app shows no end dates or renewal prompts.
 */
export interface Membership {
  launched: boolean;
  stage: "active" | "renewal" | "grace" | "paused" | "closed";
  endsAt: string;
  graceEndsAt: string;
  daysLeft: number;
  canRenew: boolean;
  isPaused: boolean;
  marriedAt: string | null;
  renewalFee: number;
  renewalInterests: number;
  hiddenForInactivity?: boolean;
  /** Only once the membership has ended: members who joined since, who would see this member. */
  newMatches?: number;
  /** Interests received and not yet answered. */
  pendingInterests?: number;
}

let current: Membership | null = null;
let inflight: Promise<Membership | null> | null = null;
const listeners = new Set<() => void>();

const publish = (m: Membership | null) => {
  current = m;
  listeners.forEach((cb) => cb());
};

/** Loads (or reloads) the membership; shared by every component that shows it. */
export const refreshMembership = (force = false) => {
  // Partners have no membership, and a broker token on a member route signs them out.
  if (isBroker()) return Promise.resolve(null);
  if (inflight && !force) return inflight;
  inflight = api
    .get<Membership>("/membership")
    .then(({ data }) => {
      publish(data);
      return data;
    })
    .catch(() => {
      inflight = null;
      return null;
    });
  return inflight;
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  void refreshMembership();
  return () => listeners.delete(cb);
};

export const useMembership = () => useSyncExternalStore(subscribe, () => current, () => null);

/** True for the stages where the member should be nudged to renew. */
export const needsRenewal = (m: Membership | null) =>
  !!m?.launched && (m.stage === "renewal" || m.stage === "grace" || m.stage === "paused");

export const formatDay = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })
    : "";

/** Server error code for "this needs a live membership". */
export const MEMBERSHIP_REQUIRED = "MEMBERSHIP_REQUIRED";
