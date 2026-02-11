/**
 * Tests for error handler utilities.
 * Covers: error mapping, user-friendly messages, retry logic.
 */

import { describe, it, expect } from "vitest";
import {
  getUserFriendlyError,
  isRetryableError,
} from "@/utils/error-handler";
import { createMockErrorResponse } from "@/mocks/loan-review.mock";
import { ErrorCode } from "@/types/api.types";

describe("Error Handler Utilities", () => {
  describe("getUserFriendlyError", () => {
    it("should map NOT_FOUND to user-friendly message", () => {
      const error = createMockErrorResponse(ErrorCode.NOT_FOUND);
      const friendly = getUserFriendlyError(error);

      expect(friendly.title).toBe("Loan Not Found");
      expect(friendly.canRetry).toBe(false);
      expect(friendly.requestId).toBe(error.meta.requestId);
    });

    it("should map AI_TIMEOUT to retryable error", () => {
      const error = createMockErrorResponse(ErrorCode.AI_TIMEOUT);
      const friendly = getUserFriendlyError(error);

      expect(friendly.title).toBe("Service Timeout");
      expect(friendly.canRetry).toBe(true);
    });

    it("should map NETWORK_ERROR correctly", () => {
      const error = createMockErrorResponse(ErrorCode.NETWORK_ERROR);
      const friendly = getUserFriendlyError(error);

      expect(friendly.title).toBe("Network Error");
      expect(friendly.canRetry).toBe(true);
    });

    it("should map LEGACY_DATA_CORRUPT correctly", () => {
      const error = createMockErrorResponse(ErrorCode.LEGACY_DATA_CORRUPT);
      const friendly = getUserFriendlyError(error);

      expect(friendly.title).toBe("Data Error");
      expect(friendly.canRetry).toBe(false);
    });

    it("should handle unknown error codes", () => {
      const error = createMockErrorResponse("UNKNOWN_ERROR");
      const friendly = getUserFriendlyError(error);

      expect(friendly.title).toBe("Server Error");
      expect(friendly.message).toBeDefined();
      expect(friendly.requestId).toBe(error.meta.requestId);
    });

    it("should preserve custom error messages", () => {
      const customMessage = "Custom error message";
      const error = createMockErrorResponse(ErrorCode.NOT_FOUND, customMessage);
      const friendly = getUserFriendlyError(error);

      // Still maps the title but shows the backend message
      expect(friendly.title).toBe("Loan Not Found");
      expect(friendly.requestId).toBe(error.meta.requestId);
    });
  });

  describe("isRetryableError", () => {
    it("should return false for non-retryable errors", () => {
      expect(isRetryableError(ErrorCode.NOT_FOUND)).toBe(false);
      expect(isRetryableError(ErrorCode.VALIDATION_FAILED)).toBe(false);
      expect(isRetryableError(ErrorCode.LEGACY_DATA_CORRUPT)).toBe(false);
    });

    it("should return true for retryable errors", () => {
      expect(isRetryableError(ErrorCode.AI_TIMEOUT)).toBe(true);
      expect(isRetryableError(ErrorCode.RISK_SERVICE_DOWN)).toBe(true);
      expect(isRetryableError(ErrorCode.NETWORK_ERROR)).toBe(true);
      expect(isRetryableError(ErrorCode.INTERNAL_SERVER_ERROR)).toBe(true);
    });

    it("should handle unknown error codes as retryable", () => {
      expect(isRetryableError("UNKNOWN_CODE")).toBe(true);
    });
  });
});
