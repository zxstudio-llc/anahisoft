// resources/js/Pages/app/customer/tenant/redirect.tsx
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import WebLayout from '@/layouts/web-layout';

export default function RedirectPage({ destination }: { destination: string }) {
  useEffect(() => {
    window.location.href = destination;
  }, [destination]);

  return (
    <WebLayout>
      <Head title="Redirecting" />
      <div>Redirecting...</div>
    </WebLayout>
  );
}