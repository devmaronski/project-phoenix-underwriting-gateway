/**
 * RiskScoreCard: Displays risk score with color coding and progressive disclosure.
 */

import { Risk, getRiskLevel, getRiskColorClass } from "@/types/api.types";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DisclosurePanel } from "./DisclosurePanel";
import { ChevronDown } from "lucide-react";

export interface RiskScoreCardProps {
  risk: Risk;
  requestId: string;
}

export function RiskScoreCard({ risk, requestId }: RiskScoreCardProps) {
  const riskLevel = getRiskLevel(risk.score);
  const riskColorClass = getRiskColorClass(riskLevel);
  const { isOpen, toggle } = useDisclosure();

  const scoreLabel = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
  }[riskLevel];

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        {/* Risk Score Display */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Risk Assessment
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Request: {requestId}
            </p>
          </div>
          <div
            className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 ${riskColorClass}`}
          >
            <div className="text-3xl font-bold">{risk.score}</div>
            <div className="text-xs font-medium">{scoreLabel}</div>
          </div>
        </div>

        {/* Top 3 Reasons */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900">
            Top Risk Factors
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {risk.topReasons.map((reason, idx) => (
              <Badge key={idx} variant="secondary">
                {reason}
              </Badge>
            ))}
          </div>
        </div>

        {/* Progressive Disclosure */}
        {risk.allReasons &&
          risk.allReasons.length > risk.topReasons.length && (
            <div className="border-t border-slate-200 pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggle}
                className="mt-2 flex items-center gap-2"
              >
                {isOpen ? "Hide" : "View"} All Reasons
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {isOpen && (
                <DisclosurePanel
                  allReasons={risk.allReasons}
                  topReasons={risk.topReasons}
                />
              )}
            </div>
          )}
      </div>
    </Card>
  );
}
