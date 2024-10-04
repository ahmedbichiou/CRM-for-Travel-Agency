'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Grid } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import ListSearch from './components/table';

interface Product {
  _id: string;
  id: string;
  productName: string;
  productType: { name: string } | null;
  productSubType: { name: string } | null;
  productStatus: { name: string } | null;
  creationDate: string;
  productLocation: { type: string, name: string } | null; 
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchKey, setSearchKey] = useState<number>(0);
  const router = useRouter();

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // If no token is found, redirect to the login page
      router.push('/authentication/login');
    } else {
      // Optionally, you can also decode the token to verify its validity and user role
      // Example: jwt_decode(token)
      // If the token is invalid or expired, you can also redirect to the login page
    }
  }, [router]);

  // Callback function to handle product updates from AdvancedSearch
  const handleProductsUpdate = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    setSearchKey((prevKey) => prevKey + 1); // Trigger a change in key to force re-render
  };

  return (
    <PageContainer title="Sample Page" description="This is a sample page">
      <PageContainer title="Dashboard" description="This is the dashboard">
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <ListSearch />
            </Grid>

            <Grid item xs={12} lg={12}>
              {/* Additional content can go here */}
            </Grid>
          </Grid>
        </Box>
      </PageContainer>
    </PageContainer>
  );
};

export default Products;
