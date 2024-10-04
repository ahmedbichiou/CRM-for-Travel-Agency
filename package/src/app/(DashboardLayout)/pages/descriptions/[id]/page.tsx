'use client';
import { Box, Typography, Button, Snackbar, Alert, Grid, IconButton, Autocomplete, TextField, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchProductByfullId, fetchSpecificDescription, updateDescription } from '@/app/services/GeneralproductSerivce';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import * as Icons from '@mui/icons-material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Editor } from '@tinymce/tinymce-react';
import { addProductToGeneralDescription, getGeneralDescriptionById, removeProductFromGeneralDescription, updateGeneralDescription } from '@/app/services/GeneraldescriptionService';
import { fetchProductLocations } from '@/app/services/ManageOthersSerivce';
import { fetchProductIds, getIdFrom_Id } from '@/app/services/productService';
import { useRouter } from 'next/navigation';



interface Props {
    params: { id: string };
}

const DescriptionDetails = ({ params }: Props) => {
    const { id } = params;

    const attributionTypeOptions = [
        { label: 'Specific country or city description', value: 'Specific country or city description' },
        
      ];
      const [openSnackbar2, setOpenSnackbar2] = useState(false);
      const handleCloseSnackbar2 = () => {
          setOpenSnackbar2(false);
      };
      
          const [openSnackbar, setOpenSnackbar] = useState(false);
          const handleCloseSnackbar = () => {
              setOpenSnackbar(false);
          };
          const [options, setOptions] = useState<{ _id: string, id: string }[]>([]);
      const [typeOptions, setTypeOptions] = useState<{ label: string; value: string }[]>([]);
      const [title, setTitle] = useState<string>('');
      const [attributionType, setAttributionType] = useState<string | null>(null);
      const [type, setType] = useState<string | null>(null);
      const [text, setText] = useState<string>('');
      const [formErrors, setFormErrors] = useState<Record<string, string>>({});
      const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
      const [selectedProducts, setSelectedProducts] = useState<{ _id: string, id: string }[]>([]);
      const handleAttributionTypeChange = (event: React.SyntheticEvent, value: string | null) => {
        setAttributionType(value);
      };
    
      const handleTypeChange = (event: React.SyntheticEvent, value: string | null) => setType(value);

      const [descriptionDetails, setDescriptionDetails] = useState<any>(null);


    
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
      const fetchDescriptionDetails = async () => {
        try {
          const details = await getGeneralDescriptionById(id);
          setDescriptionDetails(details);
        setTitle(details.title);
        setAttributionType(details.attributionType);
        setType(details.type);
        setText(details.texte);
        if (details.products && details.products.length > 0) {
            const productIds = await Promise.all(
                details.products.map(async (_id: string) => {
                    const id = await getIdFrom_Id(_id);
                    return { _id, id };
                })
            );
            setSelectedProducts(productIds);}
        } catch (error) {
          console.error('Error fetching description details:', error);
        
        }
      };

      const fetchproductsids = async()=>{
        try{
                const ids = await fetchProductIds();
                setOptions(ids);
     
        }catch (error){
            console.error('Error fetching product ids:', error); 
        }
      }
      useEffect(() => {
        const loadCountries = async () => {
          if (attributionType === 'Specific country or city description') {
            try {
              // Fetch product locations
              const productLocationResponse: { _id: string; type: string; name: string }[] = await fetchProductLocations();
              
              // Map the names to typeOptions
              const countries = productLocationResponse.map((location) => ({
                label: location.name,
                value: location._id, // or any other unique identifier you prefer
              }));
      
              setTypeOptions(countries);
            } catch (error) {
              console.error('Error fetching countries:', error);
            } finally {
            }
          } else {
            // Clear typeOptions if attributionType is not 'Specific Country Description'
            setTypeOptions([]);
          }
        };
      
        loadCountries();
      }, [attributionType]);


      useEffect(() => {
        fetchproductsids();
        fetchDescriptionDetails();
    },[]);

    const handleEdit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        let errors: Record<string, string> = {};
        if (!title) errors.title = 'Title is required.';
        if (!text) errors.text = 'Text is required.';
    
        if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          return;
        }
    
        const updatedDescription = {
          title,
          attributionType,
          type,
          texte: text,
        };
    
        try {
          await updateGeneralDescription(id, updatedDescription);
        
          setOpenSnackbar(true)
        } catch (error) {
          console.error('Error updating description:', error);
          setOpenSnackbar2(true)
        }
      };
      const handleChange = async (event: React.SyntheticEvent, newValue: { _id: string, id: string } | null) => {
        if (newValue) {
            // Check if the product is already selected
            const isAlreadySelected = selectedProducts.some(product => product._id === newValue._id);
            
            if (isAlreadySelected) {
                // Optional: Provide feedback to the user
                setOpenSnackbar2(true)
                return;
            }
    
            // Add the product to the selectedProducts state
            setSelectedProducts((prev) => [...prev, newValue]);
    
            // Add the product to the general description via API
            try {
                await addProductToGeneralDescription(id, newValue._id);
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error adding product to general description:', error);
                // Optional: Provide feedback to the user
                setOpenSnackbar2(true)
            }
        }
    };
    







    const handleDelete = async (productId: string) => {
        try {
            await removeProductFromGeneralDescription(id, productId);
            setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error removing product from general description:', error);
        }
    };

    return (
        <div>
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
                General description successfully updated!
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
            Error updating general description
        </Alert>
    </Snackbar>
        <PageContainer title="Add Description" description="Create a new general description">
          <DashboardCard title="Edit generic description">
            <Grid container spacing={2}>
              <Grid item xs={12} lg={12}>
                <Typography variant="subtitle1" fontWeight={600} component="label" mb="5px">
                  Title
                </Typography>
                <CustomTextField
                  variant="outlined"
                  fullWidth
                  required
                  value={title}
                  onChange={handleTitleChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
    
                />
              </Grid>
    
              <Grid item xs={6} lg={4}>
                <Typography variant="subtitle1" fontWeight={600} component="label" mb="5px">
                  Attribution Type
                </Typography>
                <Autocomplete
                  disablePortal
                  options={attributionTypeOptions.map((option) => option.label)}
                  value={attributionType}
                  onChange={handleAttributionTypeChange}
                  renderInput={(params) => 
                    <TextField 
                        {...params} 
                        required 
                        error={!!formErrors.attributionType}
                        helperText={formErrors.attributionType}
                    />
                }
                />
              </Grid>
    
              <Grid item xs={6} lg={4}>
                <Typography variant="subtitle1" fontWeight={600} component="label" mb="5px">
                  Type
                </Typography>
                <Autocomplete
                  disablePortal
                  options={typeOptions.map((option) => option.label)}
                  value={type}
                  onChange={handleTypeChange}
                  renderInput={(params) => 
                    <TextField 
                        {...params} 
                        required 
                        error={!!formErrors.type}
                        helperText={formErrors.type}
                    />
                }
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <Typography variant="subtitle1" fontWeight={600} component="label" mb="5px">
                  Specific products
                </Typography>
                <div>
            <Autocomplete
                disablePortal
                options={options}
                getOptionLabel={(option) => option.id}
                onChange={handleChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        
                        
                    />
                )}
            />
               <div>
                {selectedProducts.map((product) => (
                    <Chip
                        key={product._id}
                        label={product.id}
                        onDelete={() => handleDelete(product._id)}
                        sx={{
                            backgroundColor: '#81d4fa',
                            color: 'black',
                            borderRadius: '5px',  // Less round
                            marginTop: '8px',
                            marginLeft: '4px',
                            marginRight: '4px',
                            marginBottom: '4px',
                        }}
                    />
                ))}
            </div>
        </div>
              </Grid>
              <Grid item xs={12} lg={12}>
                <Typography variant="subtitle1" fontWeight={600} component="label" mb="5px">
                  Text
                </Typography>
                <Editor
                  apiKey="pffl1rs9z6e23p2spma0356tvhgvdpwxrhsudf0k4vlnvyhn"
                  value={text}
                  id="YOUR_FIXED_ID"
                  onEditorChange={(content) => setText(content)}
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
              </Grid>
             
              <Grid item xs={6} lg={6}>
              <Button
                                    color="success"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={<Icons.ArrowBackIosNewOutlined />}
                                    href={`/pages/descriptions`}
                                    sx={{
                                        mt: 2,
                                        backgroundColor: 'gray',
                                        '&:hover': {
                                            backgroundColor: 'darkgray',
                                        },
                                    }}
                                >
                                    Back
                                </Button> </Grid>
                                <Grid item xs={6} lg={6}>
                <Button
                            color="success"
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{
                                mt: 2,
                            }}
                            startIcon={<Icons.EditOutlined/>}
                            onClick={handleEdit}  // Attach handleSubmit to onClick event
                        >
                            Edit
                        </Button>
              </Grid>
            </Grid>
          </DashboardCard>
        </PageContainer></div>
    );
};

export default DescriptionDetails;
