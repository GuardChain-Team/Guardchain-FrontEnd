// src/components/alerts/copy-alert-link.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LinkIcon, CopyIcon, CheckIcon } from "@heroicons/react/24/outline";

interface CopyAlertLinkProps {
  alertId: string;
  alertTitle?: string;
}

export const CopyAlertLink: React.FC<CopyAlertLinkProps> = ({
  alertId,
  alertTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateShareLink = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/alerts/copy-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ alertId }),
      });

      const data = await response.json();

      if (data.success) {
        setShareLink(data.data.shareLink);
        toast({
          title: "Share Link Generated",
          description: "The link will expire in 24 hours.",
        });
      } else {
        throw new Error(data.error || "Failed to generate share link");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard.",
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !shareLink) {
      generateShareLink();
    }
    if (!open) {
      setShareLink("");
      setCopied(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <LinkIcon className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Alert Link</DialogTitle>
          <DialogDescription>
            Generate a secure link to share this alert with team members.
            {alertTitle && (
              <span className="block mt-1 font-medium text-sm">
                Alert: {alertTitle}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="share-link">Share Link</Label>
            <div className="flex space-x-2">
              <Input
                id="share-link"
                value={shareLink}
                readOnly
                placeholder={
                  isLoading
                    ? "Generating link..."
                    : "Click to generate share link"
                }
                className="flex-1"
              />
              <Button
                onClick={copyToClipboard}
                disabled={!shareLink || isLoading}
                size="sm"
                variant="outline"
                className="px-3"
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {shareLink && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <div className="flex">
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Security Notice:</p>
                  <ul className="mt-1 list-disc list-inside text-xs space-y-1">
                    <li>This link will expire in 24 hours</li>
                    <li>
                      Only authorized team members should access this link
                    </li>
                    <li>All access is logged and audited</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>

            {!shareLink && (
              <Button onClick={generateShareLink} disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate New Link"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
