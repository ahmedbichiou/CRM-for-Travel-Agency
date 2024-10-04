'use client';

import { Box, Typography, Container, Grid, Tabs, Tab, CardContent, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchProductById } from '@/app/services/GeneralproductSerivce';
import { useRouter } from 'next/navigation';
import Photos from '../ProductEdit/Photos/Photos';
import ProductDetail from '../ProductEdit/Produit/Produit';
import DescriptionsTABLE from '../ProductEdit/Descriptifs/DescriptionsTABLE';
import MapLEAF from '../ProductEdit/Map/Map';

// Define types
interface Product {
  id: string;
  productName: string;
  productType: { name: string } | null;
  productSubType: { name: string } | null;
  productLocation: { name: string; city: string } | null;
  productStatus: { name: string } | null;
  creationDate: string;
}

interface Props {
  params: { id: string };
}

const ProductDetails = ({ params }: Props) => {

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
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<string>('produit');

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setProduct(null);
      }
    };
    getProduct();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  if (!product) {
    return (
      <Container>
       
      </Container>
    );
  }

  return (
    <Container>
      
      <Grid container spacing={2}>
    {/* Product ID */}
    <Grid item xs={3} lg={1.5}>
      <Card sx={{ bgcolor: 'grey.100', boxShadow: 1, mb: 2 }}>
        <CardContent>
          <Typography variant="h6" align="center" color="textSecondary">
            {product.id}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  
    {/* Product Name */}
    <Grid item xs={9} lg={3} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ mt: -1 }}>
        <Typography variant="h4" gutterBottom>
          {product.productName || 'Unknown Product Name'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
  
      <Grid container spacing={2}>
        {/* NAVBAR */}
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="product tabs">
              <Tab value="produit" label="Produit" />
              
              <Tab value="photos" label="Photos" />
              <Tab value="descriptions" label="Descriptions" />
              <Tab value="map" label="Map" />
            </Tabs>
          </Box>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            {activeTab === 'produit' && (
               <ProductDetail id={id} />
              
            )}
          
            {activeTab === 'photos' && (
               <Photos id={id}/>
            )}
            {activeTab === 'descriptions' && (
             <DescriptionsTABLE  id={id} />
            )}
            {activeTab === 'map' && (
             <MapLEAF  id={id} />
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
