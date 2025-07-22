import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface CopyAlertLinkProps {
  alertId: string;
  className?: string;
}

export function CopyAlertLink({ alertId, className }: CopyAlertLinkProps) {
  const handleCopy = async () => {
    const baseUrl = window.location.origin;
    const alertUrl = `${baseUrl}/alerts/${alertId}`;

    try {
      await navigator.clipboard.writeText(alertUrl);
      toast({
        title: "Link Copied",
        description: "Alert link has been copied to clipboard",
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleCopy}
    >
      Copy Link
    </Button>
  );
}

interface AlertLinkProps {
  alertId: string;
  className?: string;
}

export function AlertLink({ alertId, className }: AlertLinkProps) {
  return (
    <Button variant="link" className={className} asChild>
      <a href={`/alerts/${alertId}`}>View Alert</a>
    </Button>
  );
}
