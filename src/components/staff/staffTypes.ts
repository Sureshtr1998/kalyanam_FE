import type { UserDetails } from "@/utils/interfaces";

/** Who is using the member manager: admins see everyone, partners only their referrals. */
export type StaffKind = "admin" | "broker";

export interface MemberRow {
  _id: string;
  basic: {
    fullName: string;
    uniqueId?: string;
    gender?: string;
    dob?: string;
    email?: string;
    mobile?: string;
    motherTongue?: string;
    caste?: string;
    referralId?: string;
  };
  photo?: string;
  isVerified?: boolean;
  isHidden?: boolean;
  isAdmin?: boolean;
  hasCompleteProfile?: boolean;
  brokerUnlinked?: boolean;
  commissionPaidAt?: string;
  createdAt?: string;
  lastActiveAt?: string;
  credits: number;
  accepted: number;
}

export interface MemberDetail extends UserDetails {
  _id: string;
  stats: {
    remainingCredits: number;
    sent: number;
    received: number;
    accepted: number;
    declined: number;
    contactsViewed: number;
    blocked: number;
    profileViews: number;
    totalPaid: number;
  };
  broker?: { name: string; companyName?: string; referralId: string } | null;
}

export interface BrokerInfo {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  note?: string;
  caste?: string[];
  motherTongue?: string[];
  referralId?: string;
  status: "pending" | "approved" | "suspended";
  createdAt?: string;
  lastActiveAt?: string;
  idProofs?: { url: string; fileId: string }[];
  paidFee?: number;
  referred?: number;
  complete?: number;
  commissionDue?: number;
  commissionPaid?: number;
  usersReferred?: number;
}

export interface Summary {
  kind: StaffKind;
  broker?: BrokerInfo;
  members: {
    total: number;
    male: number;
    female: number;
    complete: number;
    incomplete: number;
    verified: number;
    hidden: number;
    new7: number;
    new30: number;
    active7: number;
    admins?: number;
  };
  signups: { _id: string; n: number }[];
  revenue?: { total: number; last30: number; byType: Record<string, { total: number; count: number }> };
  interests?: { sent: number; accepted: number; contacts: number };
  brokers?: { total: number; pending: number; approved: number; suspended: number };
  commission: { perMember: number; referred: number; earned?: number; paid: number; due: number };
}

export const inr = (n?: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n ?? 0);
