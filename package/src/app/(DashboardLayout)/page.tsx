'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /pages/products when the component mounts
    router.push('/pages/products');
  }, [router]);

  return null; // Render nothing since it's just a redirect
};

export default Dashboard;
