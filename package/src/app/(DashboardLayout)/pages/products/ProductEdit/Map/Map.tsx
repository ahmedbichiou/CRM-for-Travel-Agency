'use client';

import dynamic from 'next/dynamic';
import { Box, Typography, Snackbar, Alert, IconButton } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { fetchProductById } from '@/app/services/GeneralproductSerivce';
import * as Icons from '@mui/icons-material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import the GPS pin image (ensure you have a suitable image in your project)


// Dynamic import of the MapContainer and other Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface ProductDetailProps {
  id: string;
}

interface Product {
  _id: string;
  id: string;
  productName: string;
  productType: { name: string } | null;
  productSubType: { name: string } | null;
  productStatus: { name: string } | null;
  creationDate: string;
  productLocation: { type: string, name: string } | null;
  longitude: string | null;
  latitude: string | null;
}

const MapLEAF = ({ id }: ProductDetailProps) => {
  const [productDetails, setProductDetails] = useState<Product | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbar2, setOpenSnackbar2] = useState(false);

  const handleCloseSnackbar = () => setOpenSnackbar(false);
  const handleCloseSnackbar2 = () => setOpenSnackbar2(false);

  const fetchProductDetails = async () => {
    try {
      const productDetails = await fetchProductById(id);
      setProductDetails(productDetails);
      console.log(productDetails);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  // Create a custom GPS pin icon
  const gpsPin = L.icon({
    iconUrl: '/gps.svg',
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
  });

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        sx={{ zIndex: 1400 }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{
            width: '300px',
            fontSize: '0.9rem',
            padding: '16px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#06c258', // Success color
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' },
            '& .MuiAlert-action': { color: 'white' },
          }}
        >
          Product Photos successfully updated!
        </Alert>
      </Snackbar>

      <Snackbar
        open={openSnackbar2}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar2}
        sx={{ zIndex: 1400 }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar2}
          severity="error"
          sx={{
            width: '300px',
            fontSize: '0.9rem',
            padding: '16px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#d32f2f', // Error color
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' },
            '& .MuiAlert-action': { color: 'white' },
          }}
          action={
            <IconButton
              onClick={handleCloseSnackbar2}
              color="inherit"
              size="small"
            >
              <Icons.Close fontSize="inherit" />
            </IconButton>
          }
        >
          Product Icon is already defined
        </Alert>
      </Snackbar>

      <PageContainer title="Map" description="View product location on the map">
        <DashboardCard title="Product Location">
          {productDetails?.latitude && productDetails?.longitude ? (
           <MapContainer
           center={[parseFloat(productDetails?.latitude || '0'), parseFloat(productDetails?.longitude || '0')]}
           zoom={13}
           style={{ height: '400px', width: '100%' }}
         >
           <TileLayer
             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
           />
           {productDetails?.latitude && productDetails?.longitude && (
             <Marker
               position={[parseFloat(productDetails.latitude), parseFloat(productDetails.longitude)]}
               icon={gpsPin}
             >
               <Popup>
                 {productDetails.productName}
               </Popup>
             </Marker>
           )}
         </MapContainer>
          ) : (
            <Typography>No location data available for this product.</Typography>
          )}
        </DashboardCard>
      </PageContainer>
    </>
  );
};

export default MapLEAF;
