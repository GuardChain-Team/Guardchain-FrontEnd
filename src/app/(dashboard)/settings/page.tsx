// src/app/(dashboard)/settings/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
  UserGroupIcon,
  CpuChipIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  GlobeAltIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CloudIcon,
  ServerIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  LockClosedIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/helpers';

// Mock data untuk settings
const mockUserProfile = {
  id: 'user-001',
  name: 'John Anderson',
  email: 'john.anderson@guardchain.ai',
  role: 'Senior Fraud Analyst',
  department: 'Fraud Investigation Team',
  phoneNumber: '+62-812-3456-7890',
  avatar: null,
  timezone: 'Asia/Jakarta',
  language: 'en',
  twoFactorEnabled: true,
  lastLogin: '2024-07-05T14:30:00Z',
  createdAt: '2024-01-15T08:00:00Z'
};

const mockNotificationSettings = {
  email: {
    fraudAlerts: true,
    caseAssignments: true,
    systemUpdates: false,
    weeklyReports: true,
    criticalAlerts: true
  },
  push: {
    fraudAlerts: true,
    caseAssignments: true,
    systemUpdates: false,
    weeklyReports: false,
    criticalAlerts: true
  },
  sms: {
    fraudAlerts: false,
    caseAssignments: false,
    systemUpdates: false,
    weeklyReports: false,
    criticalAlerts: true
  }
};

const mockSecuritySettings = {
  passwordLastChanged: '2024-06-01T10:00:00Z',
  twoFactorAuth: {
    enabled: true,
    method: 'authenticator',
    backupCodes: 8
  },
  apiKeys: [
    {
      id: 'key-001',
      name: 'Analytics API Key',
      created: '2024-05-15T08:00:00Z',
      lastUsed: '2024-07-05T12:30:00Z',
      permissions: ['read:analytics', 'read:transactions']
    },
    {
      id: 'key-002',
      name: 'Investigation Bot Key',
      created: '2024-06-01T10:00:00Z',
      lastUsed: '2024-07-04T16:45:00Z',
      permissions: ['read:investigations', 'write:evidence']
    }
  ],
  sessions: [
    {
      id: 'session-001',
      device: 'Chrome on Windows',
      location: 'Jakarta, Indonesia',
      lastActive: '2024-07-05T14:30:00Z',
      current: true
    },
    {
      id: 'session-002',
      device: 'Mobile App on Android',
      location: 'Jakarta, Indonesia',
      lastActive: '2024-07-05T08:15:00Z',
      current: false
    }
  ]
};

const mockSystemSettings = {
  fraudDetection: {
    enabled: true,
    sensitivity: 'high',
    autoBlock: false,
    mlModels: ['neural_network', 'random_forest', 'gradient_boost']
  },
  alerts: {
    retentionDays: 90,
    maxAlertsPerHour: 1000,
    escalationThreshold: 0.85
  },
  integrations: {
    coreBank: {
      enabled: true,
      status: 'connected',
      lastSync: '2024-07-05T14:00:00Z'
    },
    bifast: {
      enabled: true,
      status: 'connected',
      lastSync: '2024-07-05T13:45:00Z'
    },
    qris: {
      enabled: true,
      status: 'connected',
      lastSync: '2024-07-05T14:10:00Z'
    }
  }
};

const mockTeamMembers = [
  {
    id: 'user-001',
    name: 'John Anderson',
    email: 'john.anderson@guardchain.ai',
    role: 'Senior Fraud Analyst',
    status: 'active',
    lastActive: '2024-07-05T14:30:00Z'
  },
  {
    id: 'user-002',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@guardchain.ai',
    role: 'Investigation Lead',
    status: 'active',
    lastActive: '2024-07-05T13:15:00Z'
  },
  {
    id: 'user-003',
    name: 'Michael Chen',
    email: 'michael.chen@guardchain.ai',
    role: 'Compliance Officer',
    status: 'inactive',
    lastActive: '2024-07-04T17:00:00Z'
  }
];

// Switch component untuk toggle settings
const Switch = ({ checked, onCheckedChange, disabled = false }: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
};

// Components
const ProfileSettings = () => {
  const [profile, setProfile] = useState(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Manage your personal information and account preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <UserIcon className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input 
                    value={profile.name} 
                    disabled={!isEditing}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input 
                    value={profile.email} 
                    disabled={!isEditing}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Role</label>
                  <Input 
                    value={profile.role} 
                    disabled={true}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Department</label>
                  <Input 
                    value={profile.department} 
                    disabled={true}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input 
                    value={profile.phoneNumber} 
                    disabled={!isEditing}
                    onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Timezone</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" disabled={!isEditing} className="w-full justify-between">
                        {profile.timezone}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setProfile({...profile, timezone: 'Asia/Jakarta'})}>
                        Asia/Jakarta
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setProfile({...profile, timezone: 'Asia/Singapore'})}>
                        Asia/Singapore
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setProfile({...profile, timezone: 'UTC'})}>
                        UTC
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Last login: {new Date(profile.lastLogin).toLocaleString()}
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">127</p>
              <p className="text-sm text-muted-foreground">Cases Investigated</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-green-600">94.2%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-blue-600">18</p>
              <p className="text-sm text-muted-foreground">Months Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState(mockNotificationSettings);

  const updateNotification = (channel: keyof typeof notifications, type: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: value
      }
    }));
  };

  const notificationTypes = [
    { key: 'fraudAlerts', label: 'Fraud Alerts', description: 'High-priority fraud detection alerts' },
    { key: 'caseAssignments', label: 'Case Assignments', description: 'When new cases are assigned to you' },
    { key: 'systemUpdates', label: 'System Updates', description: 'System maintenance and updates' },
    { key: 'weeklyReports', label: 'Weekly Reports', description: 'Weekly performance and analytics reports' },
    { key: 'criticalAlerts', label: 'Critical Alerts', description: 'Emergency and critical system alerts' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified about important events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {notificationTypes.map((type) => (
              <div key={type.key} className="space-y-3">
                <div>
                  <h4 className="font-medium">{type.label}</h4>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 pl-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Email</span>
                    </div>
                    <Switch
                      checked={notifications.email[type.key as keyof typeof notifications.email]}
                      onCheckedChange={(checked) => updateNotification('email', type.key, checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DevicePhoneMobileIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Push</span>
                    </div>
                    <Switch
                      checked={notifications.push[type.key as keyof typeof notifications.push]}
                      onCheckedChange={(checked) => updateNotification('push', type.key, checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DevicePhoneMobileIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">SMS</span>
                    </div>
                    <Switch
                      checked={notifications.sms[type.key as keyof typeof notifications.sms]}
                      onCheckedChange={(checked) => updateNotification('sms', type.key, checked)}
                      disabled={type.key !== 'criticalAlerts'}
                    />
                  </div>
                </div>
                {type.key !== 'criticalAlerts' && (
                  <div className="border-b border-border"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Quiet Hours</CardTitle>
          <CardDescription>
            Set times when you don't want to receive non-critical notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Start Time</label>
              <Input type="time" defaultValue="22:00" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Time</label>
              <Input type="time" defaultValue="07:00" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Switch checked={true} onCheckedChange={() => {}} />
            <span className="text-sm">Enable quiet hours</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SecuritySettings = () => {
  const [security, setSecurity] = useState(mockSecuritySettings);
  const [showAddAPIKey, setShowAddAPIKey] = useState(false);

  return (
    <div className="space-y-6">
      {/* Password & Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockClosedIcon className="h-5 w-5" />
            Password & Authentication
          </CardTitle>
          <CardDescription>
            Manage your password and two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Password</h4>
              <p className="text-sm text-muted-foreground">
                Last changed: {new Date(security.passwordLastChanged).toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline">
              Change Password
            </Button>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={security.twoFactorAuth.enabled}
                onCheckedChange={(checked) => 
                  setSecurity(prev => ({
                    ...prev,
                    twoFactorAuth: { ...prev.twoFactorAuth, enabled: checked }
                  }))
                }
              />
            </div>
            
            {security.twoFactorAuth.enabled && (
              <div className="space-y-4 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Authentication Method</p>
                    <p className="text-sm text-muted-foreground">Authenticator App</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Method
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Backup Codes</p>
                    <p className="text-sm text-muted-foreground">
                      {security.twoFactorAuth.backupCodes} codes remaining
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Generate New
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <KeyIcon className="h-5 w-5" />
              API Keys
            </span>
            <Button size="sm" onClick={() => setShowAddAPIKey(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add API Key
            </Button>
          </CardTitle>
          <CardDescription>
            Manage API keys for external integrations and applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {security.apiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{key.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(key.created).toLocaleDateString()} • 
                    Last used: {new Date(key.lastUsed).toLocaleDateString()}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {key.permissions.map((permission) => (
                      <Badge key={permission} variant="secondary" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GlobeAltIcon className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            Monitor and manage your active login sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {security.sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-secondary rounded">
                    <DevicePhoneMobileIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{session.device}</h4>
                      {session.current && (
                        <Badge variant="default" className="text-xs">Current</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {session.location} • Last active: {new Date(session.lastActive).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button size="sm" variant="outline">
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add API Key Dialog */}
      <Dialog open={showAddAPIKey} onOpenChange={setShowAddAPIKey}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">API Key Name</label>
              <Input placeholder="Enter a descriptive name for this API key" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Permissions</label>
              <div className="space-y-2">
                {['read:analytics', 'read:transactions', 'read:investigations', 'write:evidence'].map((permission) => (
                  <div key={permission} className="flex items-center gap-2">
                    <input type="checkbox" id={permission} className="rounded" />
                    <label htmlFor={permission} className="text-sm">{permission}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Expiration</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    30 days
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>30 days</DropdownMenuItem>
                  <DropdownMenuItem>90 days</DropdownMenuItem>
                  <DropdownMenuItem>1 year</DropdownMenuItem>
                  <DropdownMenuItem>Never</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAPIKey(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddAPIKey(false)}>
              Create API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SystemSettings = () => {
  const [system, setSystem] = useState(mockSystemSettings);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Fraud Detection Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5" />
            Fraud Detection Settings
          </CardTitle>
          <CardDescription>
            Configure fraud detection algorithms and thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Fraud Detection Engine</h4>
              <p className="text-sm text-muted-foreground">
                Enable or disable the fraud detection system
              </p>
            </div>
            <Switch
              checked={system.fraudDetection.enabled}
              onCheckedChange={(checked) => 
                setSystem(prev => ({
                  ...prev,
                  fraudDetection: { ...prev.fraudDetection, enabled: checked }
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Detection Sensitivity</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {system.fraudDetection.sensitivity.charAt(0).toUpperCase() + system.fraudDetection.sensitivity.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => 
                    setSystem(prev => ({
                      ...prev,
                      fraudDetection: { ...prev.fraudDetection, sensitivity: 'low' }
                    }))
                  }>
                    Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => 
                    setSystem(prev => ({
                      ...prev,
                      fraudDetection: { ...prev.fraudDetection, sensitivity: 'medium' }
                    }))
                  }>
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => 
                    setSystem(prev => ({
                      ...prev,
                      fraudDetection: { ...prev.fraudDetection, sensitivity: 'high' }
                    }))
                  }>
                    High
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Escalation Threshold</label>
              <Input 
                type="number" 
                value={system.alerts.escalationThreshold} 
                min="0" 
                max="1" 
                step="0.01"
                onChange={(e) => 
                  setSystem(prev => ({
                    ...prev,
                    alerts: { ...prev.alerts, escalationThreshold: parseFloat(e.target.value) }
                  }))
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto-block Suspicious Transactions</h4>
              <p className="text-sm text-muted-foreground">
                Automatically block high-risk transactions
              </p>
            </div>
            <Switch
              checked={system.fraudDetection.autoBlock}
              onCheckedChange={(checked) => 
  setSystem(prev => ({
                 ...prev,
                 fraudDetection: { ...prev.fraudDetection, autoBlock: checked }
               }))
             }
           />
         </div>

         <div>
           <label className="text-sm font-medium mb-2 block">Active ML Models</label>
           <div className="flex flex-wrap gap-2">
             {system.fraudDetection.mlModels.map((model) => (
               <Badge key={model} variant="secondary">
                 {model.replace('_', ' ')}
               </Badge>
             ))}
           </div>
         </div>
       </CardContent>
     </Card>

     {/* Alert Settings */}
     <Card>
       <CardHeader>
         <CardTitle className="flex items-center gap-2">
           <BellIcon className="h-5 w-5" />
           Alert Configuration
         </CardTitle>
         <CardDescription>
           Configure alert retention and rate limiting
         </CardDescription>
       </CardHeader>
       <CardContent>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="text-sm font-medium mb-2 block">Alert Retention (Days)</label>
             <Input 
               type="number" 
               value={system.alerts.retentionDays}
               onChange={(e) => 
                 setSystem(prev => ({
                   ...prev,
                   alerts: { ...prev.alerts, retentionDays: parseInt(e.target.value) }
                 }))
               }
             />
           </div>
           <div>
             <label className="text-sm font-medium mb-2 block">Max Alerts per Hour</label>
             <Input 
               type="number" 
               value={system.alerts.maxAlertsPerHour}
               onChange={(e) => 
                 setSystem(prev => ({
                   ...prev,
                   alerts: { ...prev.alerts, maxAlertsPerHour: parseInt(e.target.value) }
                 }))
               }
             />
           </div>
         </div>
       </CardContent>
     </Card>

     {/* System Integrations */}
     <Card>
       <CardHeader>
         <CardTitle className="flex items-center gap-2">
           <CloudIcon className="h-5 w-5" />
           System Integrations
         </CardTitle>
         <CardDescription>
           Monitor and manage external system connections
         </CardDescription>
       </CardHeader>
       <CardContent>
         <div className="space-y-4">
           {Object.entries(system.integrations).map(([key, integration]) => (
             <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
               <div className="flex items-center gap-4">
                 <div className="p-2 bg-secondary rounded">
                   <ServerIcon className="h-4 w-4" />
                 </div>
                 <div>
                   <div className="flex items-center gap-2">
                     <h4 className="font-medium">{key.toUpperCase()}</h4>
                     <Badge variant="outline" className={getStatusColor(integration.status)}>
                       {integration.status}
                     </Badge>
                   </div>
                   <p className="text-sm text-muted-foreground">
                     Last sync: {new Date(integration.lastSync).toLocaleString()}
                   </p>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <Switch
                   checked={integration.enabled}
                   onCheckedChange={(checked) => 
                     setSystem(prev => ({
                       ...prev,
                       integrations: {
                         ...prev.integrations,
                         [key]: { ...integration, enabled: checked }
                       }
                     }))
                   }
                 />
                 <Button size="sm" variant="outline">
                   Configure
                 </Button>
               </div>
             </div>
           ))}
         </div>
       </CardContent>
     </Card>

     {/* System Performance */}
     <Card>
       <CardHeader>
         <CardTitle className="flex items-center gap-2">
           <ChartBarIcon className="h-5 w-5" />
           System Performance
         </CardTitle>
         <CardDescription>
           Current system status and performance metrics
         </CardDescription>
       </CardHeader>
       <CardContent>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="text-center p-4 bg-muted rounded-lg">
             <p className="text-2xl font-bold text-green-600">99.9%</p>
             <p className="text-sm text-muted-foreground">Uptime</p>
           </div>
           <div className="text-center p-4 bg-muted rounded-lg">
             <p className="text-2xl font-bold text-blue-600">450ms</p>
             <p className="text-sm text-muted-foreground">Avg Response</p>
           </div>
           <div className="text-center p-4 bg-muted rounded-lg">
             <p className="text-2xl font-bold text-orange-600">1,247</p>
             <p className="text-sm text-muted-foreground">TPS Current</p>
           </div>
           <div className="text-center p-4 bg-muted rounded-lg">
             <p className="text-2xl font-bold text-purple-600">78%</p>
             <p className="text-sm text-muted-foreground">CPU Usage</p>
           </div>
         </div>
       </CardContent>
     </Card>
   </div>
 );
};

const TeamManagement = () => {
 const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
 const [showAddMember, setShowAddMember] = useState(false);

 const getStatusColor = (status: string) => {
   switch (status) {
     case 'active':
       return 'text-green-600 bg-green-50 border-green-200';
     case 'inactive':
       return 'text-gray-600 bg-gray-50 border-gray-200';
     case 'suspended':
       return 'text-red-600 bg-red-50 border-red-200';
     default:
       return 'text-gray-600 bg-gray-50 border-gray-200';
   }
 };

 return (
   <div className="space-y-6">
     {/* Team Overview */}
     <Card>
       <CardHeader>
         <CardTitle className="flex items-center justify-between">
           <span className="flex items-center gap-2">
             <UserGroupIcon className="h-5 w-5" />
             Team Management
           </span>
           <Button size="sm" onClick={() => setShowAddMember(true)}>
             <PlusIcon className="h-4 w-4 mr-2" />
             Add Member
           </Button>
         </CardTitle>
         <CardDescription>
           Manage team members, roles, and permissions
         </CardDescription>
       </CardHeader>
       <CardContent>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
           <div className="text-center p-4 bg-muted rounded-lg">
             <p className="text-2xl font-bold text-primary">12</p>
             <p className="text-sm text-muted-foreground">Total Members</p>
           </div>
           <div className="text-center p-4 bg-muted rounded-lg">
             <p className="text-2xl font-bold text-green-600">10</p>
             <p className="text-sm text-muted-foreground">Active Members</p>
           </div>
           <div className="text-center p-4 bg-muted rounded-lg">
             <p className="text-2xl font-bold text-blue-600">4</p>
             <p className="text-sm text-muted-foreground">Roles Defined</p>
           </div>
         </div>
       </CardContent>
     </Card>

     {/* Team Members Table */}
     <Card>
       <CardHeader>
         <CardTitle>Team Members</CardTitle>
         <CardDescription>
           Current team members and their roles
         </CardDescription>
       </CardHeader>
       <CardContent>
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>Member</TableHead>
               <TableHead>Role</TableHead>
               <TableHead>Status</TableHead>
               <TableHead>Last Active</TableHead>
               <TableHead>Actions</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {teamMembers.map((member) => (
               <TableRow key={member.id}>
                 <TableCell>
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                       <UserIcon className="h-4 w-4 text-primary" />
                     </div>
                     <div>
                       <p className="font-medium">{member.name}</p>
                       <p className="text-sm text-muted-foreground">{member.email}</p>
                     </div>
                   </div>
                 </TableCell>
                 <TableCell>
                   <Badge variant="secondary">{member.role}</Badge>
                 </TableCell>
                 <TableCell>
                   <Badge variant="outline" className={getStatusColor(member.status)}>
                     {member.status}
                   </Badge>
                 </TableCell>
                 <TableCell>
                   <span className="text-sm text-muted-foreground">
                     {new Date(member.lastActive).toLocaleDateString()}
                   </span>
                 </TableCell>
                 <TableCell>
                   <div className="flex gap-2">
                     <Button size="sm" variant="ghost">
                       <EyeIcon className="h-4 w-4" />
                     </Button>
                     <Button size="sm" variant="ghost">
                       <PencilIcon className="h-4 w-4" />
                     </Button>
                     <Button size="sm" variant="ghost">
                       <TrashIcon className="h-4 w-4" />
                     </Button>
                   </div>
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </CardContent>
     </Card>

     {/* Role Permissions */}
     <Card>
       <CardHeader>
         <CardTitle className="flex items-center gap-2">
           <IdentificationIcon className="h-5 w-5" />
           Role Permissions
         </CardTitle>
         <CardDescription>
           Define permissions for different user roles
         </CardDescription>
       </CardHeader>
       <CardContent>
         <div className="space-y-6">
           {[
             { role: 'Senior Fraud Analyst', permissions: ['view_all_cases', 'manage_investigations', 'export_data', 'run_ai_tools'] },
             { role: 'Investigation Lead', permissions: ['view_all_cases', 'manage_investigations', 'assign_cases', 'manage_team'] },
             { role: 'Compliance Officer', permissions: ['view_compliance_reports', 'generate_reports', 'audit_trail'] },
             { role: 'Junior Analyst', permissions: ['view_assigned_cases', 'basic_investigation'] }
           ].map((roleConfig) => (
             <div key={roleConfig.role} className="space-y-3">
               <h4 className="font-medium">{roleConfig.role}</h4>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pl-4">
                 {roleConfig.permissions.map((permission) => (
                   <div key={permission} className="flex items-center gap-2">
                     <input type="checkbox" defaultChecked className="rounded" />
                     <span className="text-sm">{permission.replace('_', ' ')}</span>
                   </div>
                 ))}
               </div>
               {roleConfig.role !== 'Junior Analyst' && (
                 <div className="border-b border-border"></div>
               )}
             </div>
           ))}
         </div>
       </CardContent>
     </Card>

     {/* Add Member Dialog */}
     <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
       <DialogContent>
         <DialogHeader>
           <DialogTitle>Add Team Member</DialogTitle>
         </DialogHeader>
         <div className="space-y-4">
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-sm font-medium mb-2 block">First Name</label>
               <Input placeholder="Enter first name" />
             </div>
             <div>
               <label className="text-sm font-medium mb-2 block">Last Name</label>
               <Input placeholder="Enter last name" />
             </div>
           </div>
           <div>
             <label className="text-sm font-medium mb-2 block">Email Address</label>
             <Input type="email" placeholder="Enter email address" />
           </div>
           <div>
             <label className="text-sm font-medium mb-2 block">Role</label>
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="outline" className="w-full justify-between">
                   Select role
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent>
                 <DropdownMenuItem>Senior Fraud Analyst</DropdownMenuItem>
                 <DropdownMenuItem>Investigation Lead</DropdownMenuItem>
                 <DropdownMenuItem>Compliance Officer</DropdownMenuItem>
                 <DropdownMenuItem>Junior Analyst</DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           </div>
           <div>
             <label className="text-sm font-medium mb-2 block">Department</label>
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="outline" className="w-full justify-between">
                   Select department
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent>
                 <DropdownMenuItem>Fraud Investigation Team</DropdownMenuItem>
                 <DropdownMenuItem>Cyber Fraud Team</DropdownMenuItem>
                 <DropdownMenuItem>AML Compliance Team</DropdownMenuItem>
                 <DropdownMenuItem>Risk Management</DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           </div>
         </div>
         <DialogFooter>
           <Button variant="outline" onClick={() => setShowAddMember(false)}>
             Cancel
           </Button>
           <Button onClick={() => setShowAddMember(false)}>
             Send Invitation
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   </div>
 );
};

export default function SettingsPage() {
 const [activeTab, setActiveTab] = useState('profile');

 return (
   <div className="p-6 space-y-6">
     {/* Header */}
     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
       <div>
         <h1 className="text-3xl font-bold text-foreground">Settings</h1>
         <p className="text-muted-foreground">
           Manage your account, preferences, and system configuration
         </p>
       </div>
       
       <div className="flex items-center gap-3">
         <Button variant="outline" size="sm">
           <ArrowPathIcon className="h-4 w-4 mr-2" />
           Reset to Defaults
         </Button>
         
         <Button size="sm">
           <CheckCircleIcon className="h-4 w-4 mr-2" />
           Save All Changes
         </Button>
       </div>
     </div>

     {/* Settings Navigation */}
     <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
       <TabsList className="grid w-full grid-cols-5">
         <TabsTrigger value="profile">Profile</TabsTrigger>
         <TabsTrigger value="notifications">Notifications</TabsTrigger>
         <TabsTrigger value="security">Security</TabsTrigger>
         <TabsTrigger value="system">System</TabsTrigger>
         <TabsTrigger value="team">Team</TabsTrigger>
       </TabsList>

       <TabsContent value="profile">
         <ProfileSettings />
       </TabsContent>

       <TabsContent value="notifications">
         <NotificationSettings />
       </TabsContent>

       <TabsContent value="security">
         <SecuritySettings />
       </TabsContent>

       <TabsContent value="system">
         <SystemSettings />
       </TabsContent>

       <TabsContent value="team">
         <TeamManagement />
       </TabsContent>
     </Tabs>
   </div>
 );
}