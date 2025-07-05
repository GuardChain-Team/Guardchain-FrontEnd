// src/app/demo/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DemoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-muted/50 p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">GuardChain Demo Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Experience our AI-powered fraud detection platform
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push('/login')}>
              Login to Full Version
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-green-600">1,234</CardTitle>
              <CardDescription>Total Transactions</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-yellow-600">56</CardTitle>
              <CardDescription>Flagged Alerts</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">98.5%</CardTitle>
              <CardDescription>Detection Accuracy</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-purple-600">2.1s</CardTitle>
              <CardDescription>Response Time</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Demo Features</CardTitle>
            <CardDescription>This is a preview of GuardChain capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Real-time fraud detection monitoring</li>
              <li>• Advanced analytics and reporting</li>
              <li>• Investigation management tools</li>
              <li>• Compliance and audit features</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}