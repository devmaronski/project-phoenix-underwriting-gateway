/**
 * ErrorBanner: Displays user-friendly error message with request ID and retry.
 */

import { ErrorResponse } from "@/types/api.types";
import { getUserFriendlyError } from "@/utils/error-handler";
import { Alert } from "./ui/alert";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

export interface ErrorBannerProps {
  error: ErrorResponse;
  onRetry: () => void;
}

export function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  const friendlyError = getUserFriendlyError(error);
  const [copied, setCopied] = useState(false);

  const handleCopyRequestId = () => {
    navigator.clipboard.writeText(friendlyError.requestId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Alert variant="destructive" className="mb-6">
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-red-900">
            {friendlyError.title}
          </h3>
          <p className="mt-1 text-sm text-red-800">
            {friendlyError.message}
          </p>
        </div>

        {/* Request ID */}
        <div className="flex items-center gap-2 rounded bg-red-50 p-2 text-xs font-mono text-red-700">
          <span>ID: {friendlyError.requestId}</span>
          <button
            onClick={handleCopyRequestId}
            className="ml-auto inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-red-100"
            aria-label="Copy request ID"
          >
            <Copy className="h-3 w-3" />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* Retry Button */}
        {friendlyError.canRetry && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={onRetry}
              className="bg-red-700 hover:bg-red-800"
            >
              Retry
            </Button>
          </div>
        )}
      </div>
    </Alert>
  );
}
