/**
 * DisclosurePanel: Expandable list of all risk reasons.
 */

import { Badge } from "./ui/badge";

export interface DisclosurePanelProps {
  allReasons: string[];
  topReasons: string[];
}

export function DisclosurePanel({
  allReasons,
  topReasons,
}: DisclosurePanelProps) {
  // Reasons that aren't in the top 3
  const additionalReasons = allReasons.filter(
    (reason) => !topReasons.includes(reason)
  );

  return (
    <div className="mt-4 space-y-3">
      <p className="text-xs font-medium text-slate-600">Additional Factors</p>
      <div className="flex flex-wrap gap-2">
        {additionalReasons.map((reason, idx) => (
          <Badge key={idx} variant="outline">
            {reason}
          </Badge>
        ))}
      </div>
    </div>
  );
}
