// src/components/alerts/evidence-viewer.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  FolderOpenIcon,
  DocumentIcon,
  PhotoIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  UserIcon,
  EyeIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

interface EvidenceViewerProps {
  alertId: string;
}

interface Evidence {
  id: string;
  type: string;
  category: string;
  filename: string;
  filepath: string;
  fileSize: number;
  mimeType: string;
  description: string;
  uploadedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
  metadata?: any;
}

interface InvestigationLog {
  id: string;
  action: string;
  details: string;
  investigator: {
    name: string;
    email: string;
  };
  timestamp: string;
}

interface TransactionLog {
  id: string;
  event: string;
  details: string;
  timestamp: string;
  metadata?: any;
}

interface Documentation {
  id: string;
  title: string;
  content: string;
  type: string;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ alertId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [investigationLogs, setInvestigationLogs] = useState<
    InvestigationLog[]
  >([]);
  const [transactionLogs, setTransactionLogs] = useState<TransactionLog[]>([]);
  const [documentation, setDocumentation] = useState<Documentation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchEvidenceData();
    }
  }, [isOpen, alertId]);

  const fetchEvidenceData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/alerts/${alertId}/evidence`);
      const data = await response.json();

      if (data.success) {
        setEvidence(data.data.evidence);
        setInvestigationLogs(data.data.investigationLogs);
        setTransactionLogs(data.data.transactionLogs);
        setDocumentation(data.data.documentation);
      } else {
        throw new Error(data.error || "Failed to fetch evidence");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load evidence data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <PhotoIcon className="h-5 w-5 text-blue-500" />;
    }
    return <DocumentIcon className="h-5 w-5 text-gray-500" />;
  };

  const downloadFile = async (filepath: string, filename: string) => {
    try {
      const response = await fetch(
        `/api/evidence/download?path=${encodeURIComponent(filepath)}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download file.",
        variant: "destructive",
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FolderOpenIcon className="h-4 w-4 mr-2" />
          View Evidence
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Evidence & Documentation</DialogTitle>
          <DialogDescription>
            Review all evidence, logs, and documentation for this alert
            investigation.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading evidence...</span>
          </div>
        ) : (
          <Tabs defaultValue="evidence" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="evidence">
                Evidence ({evidence.length})
              </TabsTrigger>
              <TabsTrigger value="investigation">
                Investigation ({investigationLogs.length})
              </TabsTrigger>
              <TabsTrigger value="transaction">
                Transaction ({transactionLogs.length})
              </TabsTrigger>
              <TabsTrigger value="documentation">
                Docs ({documentation.length})
              </TabsTrigger>
            </TabsList>

            {/* Evidence Tab */}
            <TabsContent
              value="evidence"
              className="space-y-4 max-h-96 overflow-y-auto"
            >
              {evidence.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FolderOpenIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No evidence files uploaded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {evidence.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getFileIcon(item.mimeType)}
                          <div className="flex-1">
                            <h4 className="font-medium">{item.filename}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{formatFileSize(item.fileSize)}</span>
                              <span className="flex items-center">
                                <UserIcon className="h-3 w-3 mr-1" />
                                {item.uploadedBy.name}
                              </span>
                              <span className="flex items-center">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {formatTimestamp(item.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              downloadFile(item.filepath, item.filename)
                            }
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Investigation Logs Tab */}
            <TabsContent
              value="investigation"
              className="space-y-4 max-h-96 overflow-y-auto"
            >
              {investigationLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardDocumentListIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No investigation logs recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {investigationLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{log.action}</h4>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{log.details}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <UserIcon className="h-3 w-3 mr-1" />
                        {log.investigator.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Transaction Logs Tab */}
            <TabsContent
              value="transaction"
              className="space-y-4 max-h-96 overflow-y-auto"
            >
              {transactionLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardDocumentListIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No transaction logs available.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactionLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border-l-4 border-green-500 pl-4 py-2"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{log.event}</h4>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{log.details}</p>
                      {log.metadata && (
                        <div className="mt-2 text-xs font-mono bg-gray-50 p-2 rounded">
                          {JSON.stringify(log.metadata, null, 2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Documentation Tab */}
            <TabsContent
              value="documentation"
              className="space-y-4 max-h-96 overflow-y-auto"
            >
              {documentation.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <DocumentIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No documentation created yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documentation.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{doc.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {doc.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {doc.content}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <UserIcon className="h-3 w-3 mr-1" />
                          {doc.createdBy.name}
                        </span>
                        <span className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {formatTimestamp(doc.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={fetchEvidenceData} disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
