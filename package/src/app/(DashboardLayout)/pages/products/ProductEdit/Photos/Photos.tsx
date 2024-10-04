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
import { useEffect, useState } from "react";

import SortableLinks from "./components/ui/SortableLinks";
import { fetchPhotos, fetchProductById,changeOrdre, editPhotoType, uploadPhoto, deletePhoto } from "@/app/services/GeneralproductSerivce";
import { Alert, Box, Grid, IconButton, Input, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { deleteUrl, getUrlsByProductId, updateUrlOrdre, updateUrlType } from '@/app/services/photourlService';
import { useRouter } from 'next/navigation';


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
  productLocation: { type: string; name: string } | null;
}

interface Photo {
  contentType: string;
  _id: string;
  filename: string;
  ordre: number;
  base64: string;
  photoType: string;
}
const productTypes = [
  'List',
  'Gallery',
  'Panoramic',
  'Icon'
];
const Photos = ({ id }: ProductDetailProps) => {

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
  };
  const [productDetails, setProductDetails] = useState<Product | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewPhotos, setPreviewPhotos] = useState<string[]>([]);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);

  const fetchProductDetails = async () => {
    try {
      const productDetails = await fetchProductById(id);
      setProductDetails(productDetails);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const uploadPhotoToServer = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('photos', file);
      if (productDetails?._id) {
        await uploadPhoto(productDetails._id, formData);
       await fetchAndCombinePhotos(productDetails._id); // Refresh photos after upload
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const fetchAndCombinePhotos = async (productId: string) => {
    try {
        // Fetch PNG photos
        const photos = await fetchPhotos(productId);
        console.log(photos);
        // Fetch URLs
        const  urls = await getUrlsByProductId(productId);



        // Combine photos and URL photos
        const combinedPhotos = [...photos, ...urls];

        // Sort combined photos by ordre
        const sortedPhotos = combinedPhotos.sort((a, b) => a.ordre - b.ordre);

        // Update state with sorted photos
        setAllPhotos(sortedPhotos);

    } catch (error) {
        console.error('Error fetching and combining photos:', error);
    }
};
  

  
const handleDelete = async (fileId: string, contentType: string) => {
  try {
      if (productDetails?._id) {
          if (contentType === 'image/jpeg') {
           
              await deletePhoto(fileId);
          } else if (contentType === 'url') {
            
              await deleteUrl(fileId);
          } else {
              throw new Error('Unsupported content type');
          }
          
          
          await fetchAndCombinePhotos(productDetails._id);
          setOpenSnackbar(true);
      }
  } catch (error) {
      console.error('Error deleting photo:', error);
    
  }
};


const handlePhotoTypeChange = async (photoId: string, newValue: string, contentType: string) => {
  try {
    // Check if the new value is 'Icon' and ensure no other photo is set as 'Icon'
    if (newValue === 'Icon') {
      const hasIconPhoto = await checkForIconPhoto();
      if (hasIconPhoto) {
        setOpenSnackbar2(true);
        return;
      }
    }

    // Use the appropriate method based on contentType
    if (contentType === 'image/jpeg') { // For PNG photos
      await editPhotoType(photoId, newValue);
    } else if (contentType === 'url') { // For URL photos
      await updateUrlType(photoId, newValue);
    } else {
      console.error('Unsupported content type:', contentType);
      setOpenSnackbar2(true);
      return;
    }

    // Fetch and combine updated photos
    if (productDetails?._id) {
      await fetchAndCombinePhotos(productDetails._id);
      setOpenSnackbar(true);
    }
  } catch (error) {
    console.error('Error changing photo type:', error);
    setOpenSnackbar2(true);
  }
};



const hasIconPhotoType = (photos: Photo[]): boolean => {
  return photos.some(photo => photo.photoType === 'Icon');
};


const checkForIconPhoto = async (): Promise<boolean> => {
  try {
      return hasIconPhotoType(allPhotos);
  } catch (error) {
      console.error('Error fetching photos:', error);
      return false;
  }
};

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (productDetails?._id) {
    fetchAndCombinePhotos(productDetails._id);}
  }, [productDetails]);
  useEffect(() => {
    const loadPhotos = async () => {
        try {
           if (productDetails?._id) {
            await  fetchAndCombinePhotos(productDetails._id);}
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };


    

    loadPhotos();
}, []);
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setPhotos(files);

      // Upload each file
      for (const file of files) {
        await uploadPhotoToServer(file);
      }

      // Clear file input and preview photos
      setPhotos([]);
      setPreviewPhotos([]);
    }
  };

  useEffect(() => {
    // Generate previews for files
    const previews = photos.map(file => URL.createObjectURL(file));
    setPreviewPhotos(previews);

    // Clean up object URLs on component unmount
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [photos]);


//HANDLERS
const [imageType, setImageType] = useState<string | null>(null);
const handleimageTypeChange = (event: React.SyntheticEvent, value: string | null) => {

  setImageType(value);
  
};
const [openSnackbar2, setOpenSnackbar2] = useState(false);
const handleCloseSnackbar2 = () => {
    setOpenSnackbar2(false);
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
  
    if (active.id !== over.id) {
      setAllPhotos((prevPhotos) => {
        const oldIndex = prevPhotos.findIndex((photo) => photo._id === active.id);
        const newIndex = prevPhotos.findIndex((photo) => photo._id === over.id);
  
        const newPhotos = arrayMove(prevPhotos, oldIndex, newIndex);
  
        // Update the ordre for each photo based on their new position
        newPhotos.forEach(async (photo, index) => {
          if (photo.ordre !== index + 1) {
            if (photo.contentType === 'image/jpeg') { // For PNG photos
              await changeOrdre(photo._id, index + 1);
            } else if (photo.contentType === 'url') { // For URL photos
              await updateUrlOrdre(photo._id, index + 1);
            } else {
              console.error('Unsupported content type:', photo.contentType);
            }
          }
        });
  
        return newPhotos.map((photo, index) => ({
          ...photo,
          ordre: index + 1,
        }));
      });
    }
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
                Product Icon is already defined
            </Alert>
        </Snackbar>

      
<DashboardCard>
  <>
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
   
    height: 200, 
    border: '2px dashed gray',
    borderRadius: '8px',
    cursor: 'pointer',
    position: 'relative',
    backgroundColor: '#f5f5f5', 
    '&:hover': {
      backgroundColor: '#e0e0e0'
    }
  }}
  onClick={() => handleFileChange} 
>
  <IconButton
  onClick={() => handleFileChange} 
    sx={{
      fontSize: 40, 
      color: '#888', 
    }}
  >
    <Icons.CameraAltOutlined onClick={() => handleFileChange} />
  </IconButton>
  <Typography variant="body2" sx={{ mt: 1 }}onClick={() => handleFileChange} >
    Upload Photos
  </Typography>
  
  <Input
    id="file-input"
    onClick={() => handleFileChange} 
    type="file"
    inputProps={{ multiple: true }}
    onChange={handleFileChange}
    style={{
      position: 'absolute',
      width: '100%', 
      height: '100%',
      top: 0, 
      left: 0, 
      opacity: 0, 
      cursor: 'pointer',
    }}
  />
</Box>
        <Box sx={{ mt: 4 }}>
       
   <Grid container spacing={2} alignItems="center" marginTop={1}>
  <Grid item xs={1} lg={1}>
    {/* Empty space */}
  </Grid>
  <Grid item xs={2} lg={1}>
    <Typography variant="h6"> 
      Ordre
    </Typography>
  </Grid>
  <Grid item xs={2} lg={2}>
    <Typography variant="h6"> 
      Photo Name
    </Typography>
  </Grid>
  <Grid item xs={8} lg={5}>
    <Typography variant="h6"> 
      Photo
    </Typography>
  </Grid>
  <Grid item xs={2} lg={2}>
    <Typography variant="h6"> {/* or any larger variant */}
      Type
    </Typography>
  </Grid>
  <Grid item xs={1} lg={1}>
    {/* Empty space */}
  </Grid>
</Grid>


      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={allPhotos.map((photo) => photo._id)} strategy={verticalListSortingStrategy}>
          {allPhotos.map((photo) => (
            <SortableLinks key={photo._id} photo={photo} onDelete={handleDelete} ontypechange={handlePhotoTypeChange} />
          ))}
        </SortableContext>
      </DndContext>
      
 

        </Box>
        </>
        </DashboardCard>
        </>
   
   
  );
};

export default Photos;
