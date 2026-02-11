import { Card } from './ui/card';

export function LoadingState() {
  return (
    <div className="space-y-6" data-testid="loading-state">
      {/* Loan Summary Skeleton */}
      <Card>
        <div className="space-y-4 p-6">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2 h-3 w-16 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
            </div>
            <div>
              <div className="mb-2 h-3 w-16 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </Card>

      {/* Risk Score Skeleton */}
      <Card>
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-24 w-24 animate-pulse rounded-full bg-slate-200" />
          </div>

          <div>
            <div className="mb-3 h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-28 animate-pulse rounded-full bg-slate-200"
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
