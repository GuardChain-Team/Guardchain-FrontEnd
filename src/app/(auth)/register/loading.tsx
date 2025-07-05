// src/app/(auth)/register/loading.tsx
import { Spinner } from '@/components/ui/spinner';

export default function RegisterLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading registration page...</p>
      </div>
    </div>
  );
}