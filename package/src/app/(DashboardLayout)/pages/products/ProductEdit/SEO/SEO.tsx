'use client';
import { Box, Typography, Input, Card, CardMedia, TableCell, IconButton, TableRow, Paper, Table, TableBody, TableContainer, TableHead, Snackbar, Alert, Grid, Autocomplete, TextField, MenuItem, Select } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { fetchProductById, uploadPhoto, fetchPhotos, deletePhoto, editPhotoType } from '@/app/services/GeneralproductSerivce';
import * as Icons from '@mui/icons-material';



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
}





const SEO = ({ id }: ProductDetailProps) => {


  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
  };
  const [productDetails, setProductDetails] = useState<Product | null>(null);


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

  






const [openSnackbar2, setOpenSnackbar2] = useState(false);
const handleCloseSnackbar2 = () => {
    setOpenSnackbar2(false);
};
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
                        backgroundColor: '#06c258', // Red color
                        color: 'white', // Text color for contrast
                        '& .MuiAlert-icon': {
                            color: 'white' // Icon color
                        },
                        '& .MuiAlert-action': {
                            color: 'white' // Action button color
                        }
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
                severity="error"  // Ensure the severity is error for red color
                sx={{ 
                    width: '300px',
                    fontSize: '0.9rem',
                    padding: '16px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#d32f2f', // Red color
                    color: 'white', // Text color for contrast
                    '& .MuiAlert-icon': {
                        color: 'white' // Icon color
                    },
                    '& .MuiAlert-action': {
                        color: 'white' // Action button color
                    }
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
    <PageContainer title="Photo Management" description="Manage your product photos">
      <DashboardCard title="Descriptions">
    



        <Box sx={{ mt: 4 }}>

         
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>HEAD</TableCell>
        
      </TableRow>
    </TableHead>
    <TableBody>
      
        <TableRow>
      <TableCell>BODY</TableCell>
          
        </TableRow>
      
    </TableBody>
  </Table>


</Box>  
      </DashboardCard>
    </PageContainer></>
  );
};

export default SEO;
