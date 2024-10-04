"use client";
import * as Icons from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Editor } from '@tinymce/tinymce-react';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { useEffect, useRef, useState } from "react";


import { fetchPhotos, fetchProductById,changeOrdre, editPhotoType, uploadPhoto, deletePhoto, addDescription, deleteDescription, updateDescriptionOrdre } from "@/app/services/GeneralproductSerivce";
import { Alert, Box, Button, Card, CardContent, Grid, IconButton, Input, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import SortableLinks from './components/ui/SortableLinks';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { useRouter } from 'next/navigation';


interface ProductDetailProps {
  id: string;
}
interface Description {
  _id: string;
  title: string;
  family: string;
  description: string;
  ordre: number;
}
interface Product {
  _id: string;
  id: string;
  productName: string;
  productType: { name: string } | null;
  productSubType: { name: string } | null;
  productStatus: { name: string } | null;
  creationDate: string;
  productLocation: { type: string; name: string } | null;
}



const DescriptionsTABLE = ({ id }: ProductDetailProps) => {

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
  };
  const [productDetails, setProductDetails] = useState<any | null>(null);


  const fetchProductDetails = async () => {
    try {
      const productDetails = await fetchProductById(id);
      setProductDetails(productDetails as Product);
  
      // Map and sort descriptions by ordre
      if (productDetails && productDetails.descriptions) {
        const sortedDescriptions = productDetails.descriptions
          .map((desc: { _id: any; title: any; family: any; description: any; ordre: any; }) => ({
            _id: desc._id,
            title: desc.title,
            family: desc.family,
            description: desc.description,
            ordre: desc.ordre
          }))
          .sort((a: { ordre: number; }, b: { ordre: number; }) => a.ordre - b.ordre); // Sort descriptions by their ordre
  
        setDescriptions(sortedDescriptions);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };
  
  






  const [descriptions, setDescriptions] = useState<Description[]>([]);

  useEffect(() => {
   

    fetchProductDetails();
  }, [id]);



    

 




const [openSnackbar2, setOpenSnackbar2] = useState(false);
const handleCloseSnackbar2 = () => {
    setOpenSnackbar2(false);
};




  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );



const handleDragEnd = async (event: any) => {
  const { active, over } = event;

  if (active.id !== over.id) {
    setDescriptions((prevDescriptions) => {
      const oldIndex = prevDescriptions.findIndex((desc) => desc._id === active.id);
      const newIndex = prevDescriptions.findIndex((desc) => desc._id === over.id);

      const newDescriptions = arrayMove(prevDescriptions, oldIndex, newIndex);

      // Update the ordre for each description based on their new position
      newDescriptions.forEach(async (description, index) => {
        if (description.ordre !== index + 1) {
          try {
            await updateDescriptionOrdre(productDetails._id, description._id, index + 1);
          } catch (error) {
            console.error(`Failed to update order for description ${description._id}:`, error);
          }
        }
      });

      return newDescriptions.map((description, index) => ({
        ...description,
        ordre: index + 1,
      }));
    });
  }
};



  const [isAddingDescription, setIsAddingDescription] = useState(false); // State to toggle form visibility
  const [newDescription, setNewDescription] = useState({
    title: '',
    family: '',
    description: '',
    ordre: ''
  }); // State to manage new description form input


  const handleDeleteDescription = async (descriptionId: string) => {
    try {
      await deleteDescription(productDetails._id, descriptionId);
      setOpenSnackbar(true);
      fetchProductDetails(); // Refresh the product details to reflect changes
    } catch (error) {
      setOpenSnackbar2(true);
    }
  };

  const handleAddDescription = async () => {
    try {
      await addDescription(productDetails._id, newDescription);
      setOpenSnackbar(true);
      setIsAddingDescription(false);
      fetchProductDetails();
      setNewDescription({
        title: '',
        family: '',
        description: '',
        ordre: ''
      });
    } catch (error) {
      setOpenSnackbar2(true);
    }
  };
  const editorRef = useRef<any>(null);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleEditDescription = async (productId: string, descriptionId: string) => {
    try {
        // Construct the URL
        const url = `/pages/products/ProductEdit/Descriptifs/${productId}descr${descriptionId}`;

        // Navigate to the URL
        router.push(url);
    } catch (error) {
        console.error('Error navigating to edit description:', error);
    }
};

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
                        backgroundColor: '#06c258', 
                        color: 'white', 
                        '& .MuiAlert-icon': {
                            color: 'white' 
                        },
                        '& .MuiAlert-action': {
                            color: 'white' 
                        }
                    }}
                >
                    Product Description successfully updated!
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
                    backgroundColor: '#d32f2f', 
                    color: 'white',
                    '& .MuiAlert-icon': {
                        color: 'white' 
                    },
                    '& .MuiAlert-action': {
                        color: 'white' 
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
                Error
            </Alert>
        </Snackbar>

      


        
 

<PageContainer title="Description Management" description="Manage product descriptions">
        <Card >
        <CardContent sx={{ padding: 2 }}> {/* Add padding to the content */}
          <Box sx={{ mt: 4 }}>
        
          <Box sx={{ mb: 2 }}>
  <Grid container alignItems="center" spacing={2}>
    {/* Left-aligned text */}
    {!isAddingDescription ?   <Grid item xs={12} sm={9} md={10} lg={9}>
      <Typography variant="h6" component="div"  sx={{
            fontWeight: 'bold', 
           fontSize: '1.3rem' 
         }}>
         All Descriptions
      </Typography>
    </Grid>:<Grid item xs={12} sm={9} md={10} lg={7}>
      <Typography variant="h6" component="div"sx={{
            fontWeight: 'bold', 
           fontSize: '1.3rem' 
         }}>
      Add Description 
      </Typography>
    </Grid> }
    {/* Right-aligned buttons */}
    
      {!isAddingDescription ? (
       <Grid item xs={12} sm={3} md={2} lg={3}> <Button
          color="success"
          variant="contained"
          size="large"
          fullWidth
          onClick={() => setIsAddingDescription(true)}
          startIcon={<Icons.Add />}
        >
          Add Description
        </Button></Grid>
      ) : (
        <Grid item xs={12} sm={3} md={2} lg={5}> <Box display="flex" gap={2}>
          <Button
            variant="contained"
            size="large"
            sx={{
              flex: 1,
              backgroundColor: 'gray',
              '&:hover': {
                backgroundColor: 'darkgray',
              },
            }}
            onClick={() => setIsAddingDescription(false)}
            startIcon={<Icons.ArrowBackIosNewOutlined />}
          >
            Back
          </Button>
          <Button
            color="success"
            variant="contained"
            size="large"
            sx={{ flex: 2 }}
            onClick={handleAddDescription}
            startIcon={<Icons.Add />}
          >
            Save Description
          </Button>
        </Box></Grid>
      )}
    </Grid>
  
</Box>


            {isAddingDescription? (
              <Box sx={{ mb: 2 }}>
    <Grid container spacing={2}>    
      {/*title */}     
<Grid item xs={5} lg={4}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="productName"
                    mb="5px"
                >
                    Title
                </Typography>
                <CustomTextField
                    variant="outlined"
                    fullWidth
                    required
                    value={newDescription.title}
                    onChange={(e: { target: { value: any; }; }) => setNewDescription({ ...newDescription, title: e.target.value })}
                />    
            </Grid>
             {/*title */}  
             <Grid item xs={5} lg={4}>
             <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="productName"
                    mb="5px"
                >
                    Family
                </Typography>
                <CustomTextField
                    variant="outlined"
                    fullWidth
                    required
                    value={newDescription.family}
                    onChange={(e: { target: { value: any; }; }) => setNewDescription({ ...newDescription, family: e.target.value })}
                />   </Grid> <Grid item xs={2} lg={4}>




                </Grid>

               
                <Grid item xs={12} lg={12}>
                <Box sx={{ mb: 2 }}>
     
      <Editor
              apiKey="pffl1rs9z6e23p2spma0356tvhgvdpwxrhsudf0k4vlnvyhn"
              value={newDescription.description}
              onEditorChange={(content) => setNewDescription({ ...newDescription, description: content })}
              id="YOUR_FIXED_ID"
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist", "anchor", "autolink", "charmap", "code", 
                  "help", "image", "insertdatetime", "link", "lists", "media", 
                  "preview", "searchreplace", "table", "visualblocks", 
              ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | ' +
                  'alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist outdent indent | removeformat | help',
                valid_elements: 'p[style],a[href|target],strong/b,em/i,ul,ol,li,br',
                valid_styles: {
                  '*': 'color,text-align,font-size,font-weight',
                },
                invalid_elements: 'script,iframe,embed,object',
                extended_valid_elements: '',
              }}
            />
</Box>
                </Grid>
            </Grid>  
              </Box>
            ):
            <TableContainer >
            <Table>
              <TableHead>
                <TableRow sx={{ borderBottom: '2px solid #ddd' }}>
                  <TableCell 
                    sx={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold', 
                    }}
                  >
                    Order
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold', 
                    }}
                  >
                    Title
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold', 
                    }}
                  >
                    Family
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold', 
                    }}
                  >
                    Description
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold', 
                    }}
                  >
                    
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                   
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              </TableBody>
            </Table>
            <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={descriptions.map((description) => description._id)} strategy={verticalListSortingStrategy}>
          {descriptions.map((description) => (
            <SortableLinks key={description._id} description={description} onDelete={ handleDeleteDescription} onEdit= {handleEditDescription} product = {productDetails} />
          ))}
        </SortableContext>
      </DndContext>

          </TableContainer>
          
          
          }
          </Box>
          </CardContent>
        </Card>
      </PageContainer>




     
      
 

   
        </>
      
   
   
  );
};

export default DescriptionsTABLE;
