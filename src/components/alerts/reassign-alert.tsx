// src/components/alerts/reassign-alert.tsx
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  UserPlusIcon,
  UserIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface ReassignAlertProps {
  alertId: string;
  currentAssignee?: {
    id: string;
    name: string;
    email: string;
  };
  onReassignSuccess?: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const ReassignAlert: React.FC<ReassignAlertProps> = ({
  alertId,
  currentAssignee,
  onReassignSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState("");
  const { toast } = useToast();

  // Fetch available users when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableUsers();
    }
  }, [isOpen]);

  const fetchAvailableUsers = async () => {
    try {
      const response = await fetch(
        "/api/users?roles=FRAUD_INVESTIGATOR,COMPLIANCE_OFFICER,ADMIN"
      );
      const data = await response.json();

      if (data.success) {
        // Filter out current assignee if any
        const availableUsers = data.data.filter(
          (user: User) => user.id !== currentAssignee?.id
        );
        setUsers(availableUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load available users.",
        variant: "destructive",
      });
    }
  };

  const handleReassign = async () => {
    if (!selectedUserId) {
      toast({
        title: "Validation Error",
        description: "Please select a user to assign the alert to.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/alerts/${alertId}/reassign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignToUserId: selectedUserId,
          reason: reason || "Manual reassignment",
          priority: priority || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Alert Reassigned",
          description: `Alert has been assigned to ${data.data.newAssignee.name}`,
        });

        setIsOpen(false);
        setSelectedUserId("");
        setReason("");
        setPriority("");

        if (onReassignSuccess) {
          onReassignSuccess();
        }
      } else {
        throw new Error(data.error || "Failed to reassign alert");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reassign alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedUser = users.find((user) => user.id === selectedUserId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlusIcon className="h-4 w-4 mr-2" />
          Reassign
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reassign Alert</DialogTitle>
          <DialogDescription>
            Transfer this alert to another team member for investigation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Assignee */}
          {currentAssignee && (
            <div className="p-3 bg-gray-50 rounded-md">
              <Label className="text-sm font-medium">
                Currently Assigned To:
              </Label>
              <div className="flex items-center mt-1">
                <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">
                    {currentAssignee.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentAssignee.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* New Assignee Selection */}
          <div className="space-y-2">
            <Label htmlFor="assignee">Assign To</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a team member" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">
                          {user.email} • {user.role.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Change */}
          <div className="space-y-2">
            <Label htmlFor="priority">Update Priority (Optional)</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Keep current priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Reassignment</Label>
            <Textarea
              id="reason"
              placeholder="Explain why this alert is being reassigned..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* Selected User Preview */}
          {selectedUser && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start">
                <UserIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-900">
                    {selectedUser.name}
                  </div>
                  <div className="text-xs text-blue-700">
                    {selectedUser.email}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Role: {selectedUser.role.replace("_", " ")}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mr-2" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Important:</p>
                <ul className="mt-1 text-xs space-y-1">
                  <li>• The new assignee will be notified immediately</li>
                  <li>• This action will be logged in the audit trail</li>
                  <li>• Investigation context will be preserved</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              onClick={handleReassign}
              disabled={isLoading || !selectedUserId}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Reassigning...
                </>
              ) : (
                "Reassign Alert"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
