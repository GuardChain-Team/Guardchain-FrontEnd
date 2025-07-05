// src/app/(dashboard)/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function DashboardContent() {
  const { data: session } = useSession();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome to GuardChain Dashboard</h1>
        <p className="text-muted-foreground">
          {session?.user?.name ? `Hello, ${session.user.name}` : 'Hello there'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">1,234</CardTitle>
            <CardDescription>Total Alerts</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">56</CardTitle>
            <CardDescription>High Risk</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">98.5%</CardTitle>
            <CardDescription>Detection Rate</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">2.1s</CardTitle>
            <CardDescription>Avg Response Time</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest fraud detection alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Dashboard content will be implemented here...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}