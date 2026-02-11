import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { getErrorMessage } from '../utils/error-handler';
import type { ApiError } from '../api/client';

interface ErrorBannerProps {
  error: ApiError;
  requestId?: string;
  onRetry?: () => void;
}

export function ErrorBanner({ error, requestId, onRetry }: ErrorBannerProps) {
  const { title, message, canRetry } = getErrorMessage(error);

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{message}</p>
        {requestId && (
          <p className="mt-2 text-xs font-mono">Request ID: {requestId}</p>
        )}
        {canRetry && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-3"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
