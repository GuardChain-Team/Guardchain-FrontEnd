// src/app/(auth)/login/loading.tsx
import { Spinner } from '@/components/ui/spinner';

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading login page...</p>
      </div>
    </div>
  );
}