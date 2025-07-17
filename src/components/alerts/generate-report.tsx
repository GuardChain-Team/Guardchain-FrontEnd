// src/components/alerts/generate-report.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

interface GenerateReportProps {
  alertId: string;
  alertData?: {
    alertId: string;
    severity: string;
    alertType: string;
    riskScore: number;
  };
}

interface ReportOptions {
  reportType: string;
  includeEvidence: boolean;
  includeTimeline: boolean;
  includeAnalysis: boolean;
  customNotes: string;
}

export const GenerateReport: React.FC<GenerateReportProps> = ({
  alertId,
  alertData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<ReportOptions>({
    reportType: "standard",
    includeEvidence: true,
    includeTimeline: true,
    includeAnalysis: true,
    customNotes: "",
  });
  const { toast } = useToast();

  const reportTypes = [
    {
      value: "standard",
      label: "Standard Report",
      description: "Complete investigation report with all details",
    },
    {
      value: "executive",
      label: "Executive Summary",
      description: "High-level summary for management review",
    },
    {
      value: "technical",
      label: "Technical Analysis",
      description: "Detailed technical findings for investigators",
    },
    {
      value: "compliance",
      label: "Compliance Report",
      description: "Regulatory-focused report for compliance teams",
    },
  ];

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/alerts/${alertId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType: options.reportType,
          includeEvidence: options.includeEvidence,
          includeTimeline: options.includeTimeline,
          includeAnalysis: options.includeAnalysis,
          customNotes: options.customNotes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Trigger download
        const downloadUrl = data.data.downloadUrl;
        window.open(downloadUrl, "_blank");

        toast({
          title: "Report Generated",
          description: "Your report has been generated and download started.",
        });

        setIsOpen(false);
      } else {
        throw new Error(data.error || "Failed to generate report");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <DocumentTextIcon className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate Investigation Report</DialogTitle>
          <DialogDescription>
            Create a comprehensive report for this fraud alert investigation.
            {alertData && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Alert ID:</strong> {alertData.alertId}
                  </div>
                  <div>
                    <strong>Severity:</strong> {alertData.severity}
                  </div>
                  <div>
                    <strong>Type:</strong> {alertData.alertType}
                  </div>
                  <div>
                    <strong>Risk Score:</strong> {alertData.riskScore}
                  </div>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Report Type</Label>
            <RadioGroup
              value={options.reportType}
              onValueChange={(value) =>
                setOptions((prev) => ({ ...prev, reportType: value }))
              }
            >
              {reportTypes.map((type) => (
                <div key={type.value} className="flex items-start space-x-2">
                  <RadioGroupItem
                    value={type.value}
                    id={type.value}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={type.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Include Options */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Include in Report</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-evidence"
                  checked={options.includeEvidence}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({
                      ...prev,
                      includeEvidence: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="include-evidence" className="text-sm">
                  Evidence and Documentation
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-timeline"
                  checked={options.includeTimeline}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({
                      ...prev,
                      includeTimeline: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="include-timeline" className="text-sm">
                  Investigation Timeline
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-analysis"
                  checked={options.includeAnalysis}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({
                      ...prev,
                      includeAnalysis: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="include-analysis" className="text-sm">
                  Risk Analysis and ML Predictions
                </Label>
              </div>
            </div>
          </div>

          {/* Custom Notes */}
          <div className="space-y-2">
            <Label htmlFor="custom-notes" className="text-base font-medium">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="custom-notes"
              placeholder="Add any additional context, findings, or recommendations for this report..."
              value={options.customNotes}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, customNotes: e.target.value }))
              }
              rows={3}
            />
          </div>

          {/* Generation Time Estimate */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-center text-sm text-blue-800">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span>Estimated generation time: 30-60 seconds</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>

            <Button
              onClick={generateReport}
              disabled={isGenerating}
              className="min-w-[120px]"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
