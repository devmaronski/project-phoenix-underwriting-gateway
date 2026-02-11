import { getRiskLevel, getRiskColorClass } from "../types/api.types";
import { useDisclosure } from "../hooks/useDisclosure";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DisclosurePanel } from "./DisclosurePanel";
import { ChevronDown } from "lucide-react";

export interface RiskScoreCardProps {
  score: number;
  topReasons: string[];
  allReasons?: string[];
}

export function RiskScoreCard({ score, topReasons, allReasons }: RiskScoreCardProps) {
  const riskLevel = getRiskLevel(score);
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
          </div>
          <div
            className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 ${riskColorClass}`}
          >
            <div className="text-3xl font-bold">{score}</div>
            <div className="text-xs font-medium">{scoreLabel}</div>
          </div>
        </div>

        {/* Top 3 Reasons */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900">
            Top Risk Factors
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {topReasons.map((reason, idx) => (
              <Badge key={idx} variant="secondary">
                {reason}
              </Badge>
            ))}
          </div>
        </div>

        {/* Progressive Disclosure */}
        {allReasons && allReasons.length > topReasons.length && (
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
                allReasons={allReasons}
                topReasons={topReasons}
              />
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
