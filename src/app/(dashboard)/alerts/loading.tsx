// src/app/(dashboard)/loading.tsx
import { Spinner } from '@/components/ui/spinner';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}