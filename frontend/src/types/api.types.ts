/**
 * Type definitions for loan review API contract.
 * These types align with the NestJS backend DTO structures.
 */

import { z } from "zod";

// ─────────────────────────────────────────────────────
// LOAN DATA TYPES
// ─────────────────────────────────────────────────────

export interface Loan {
  id: string;
  borrower_name: string;
  loan_amount_dollars: number;
  issued_date: string; // ISO8601 UTC datetime
  interest_rate_percent: number;
  term_months: number;
}

// Validation schema (Zod) for runtime type safety
export const LoanSchema = z.object({
  id: z.string().min(1),
  borrower_name: z.string().min(1),
  loan_amount_dollars: z.number().nonnegative(),
  issued_date: z.string().datetime(),
  interest_rate_percent: z.number().nonnegative(),
  term_months: z.number().positive().int(),
});

// ─────────────────────────────────────────────────────
// RISK DATA TYPES
// ─────────────────────────────────────────────────────

export interface Risk {
  score: number; // 0-100
  topReasons: string[];
  allReasons?: string[]; // Optional, full list
}

export const RiskSchema = z.object({
  score: z.number().min(0).max(100),
  topReasons: z.array(z.string()).min(1),
  allReasons: z.array(z.string()).optional(),
});

// ─────────────────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────────────────

export interface LoanReviewResponse {
  loan: Loan;
  risk: Risk;
  meta: {
    requestId: string;
  };
}

export const LoanReviewResponseSchema = z.object({
  loan: LoanSchema,
  risk: RiskSchema,
  meta: z.object({
    requestId: z.string().uuid(),
  }),
});

// ─────────────────────────────────────────────────────
// ERROR TYPES
// ─────────────────────────────────────────────────────

export const ErrorCodeSchema = z.enum([
  "NOT_FOUND",
  "VALIDATION_FAILED",
  "LEGACY_DATA_CORRUPT",
  "AI_TIMEOUT",
  "RISK_SERVICE_DOWN",
  "NETWORK_ERROR",
  "INTERNAL_SERVER_ERROR",
]);

export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

export interface ErrorDetail {
  code: ErrorCode | string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ErrorResponse {
  error: ErrorDetail;
  meta: {
    requestId: string;
  };
}

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: ErrorCodeSchema,
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
  meta: z.object({
    requestId: z.string().uuid(),
  }),
});

// ─────────────────────────────────────────────────────
// STATE & HOOK TYPES
// ─────────────────────────────────────────────────────

export interface LoanReviewState {
  data: LoanReviewResponse | null;
  error: ErrorResponse | null;
  isLoading: boolean;
  refetch: () => void;
}

export type RiskLevel = "low" | "medium" | "high";

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export function getRiskColor(riskLevel: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    high: "bg-red-100 text-red-800 border-red-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    low: "bg-green-100 text-green-800 border-green-300",
  };
  return colors[riskLevel];
}

export function getRiskColorClass(riskLevel: RiskLevel): string {
  const classes: Record<RiskLevel, string> = {
    high: "text-red-900 bg-red-50 border-red-200",
    medium: "text-yellow-900 bg-yellow-50 border-yellow-200",
    low: "text-green-900 bg-green-50 border-green-200",
  };
  return classes[riskLevel];
}
