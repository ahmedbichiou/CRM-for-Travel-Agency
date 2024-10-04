'use client';
import { Box, Typography, Button, Snackbar, Alert, Grid, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchProductByfullId, fetchSpecificDescription, updateDescription } from '@/app/services/GeneralproductSerivce';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import * as Icons from '@mui/icons-material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Editor } from '@tinymce/tinymce-react';

interface Product {
    id: string;
    productName: string;
    productType: string;
    productStatus: string;
    productSubType: string;
    pension: string;
    longitude: string;
    latitude: string;
    fournisseur: string;
}

interface Description {
    title: string;
    family: string;
    description: string;
}

interface Props {
    params: { id: string };
}

const DescriptionDetails = ({ params }: Props) => {
    const { id } = params;

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleCloseSnackbar = () => setOpenSnackbar(false);

    const [openSnackbar2, setOpenSnackbar2] = useState(false);
    const handleCloseSnackbar2 = () => setOpenSnackbar2(false);


    const [description_id, setDescriptionId] = useState<string>('');
    const [product_id, setProductId] = useState<string>('');
    const [productDetails, setProductDetails] = useState<Product | null>(null);
    const [descriptionDetails, setDescriptionDetails] = useState<Description | null>(null);

    const [Title, setTitle] = useState<string>('');
    const [Family, setFamily] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    useEffect(() => {
        if (id) {
            const [productPart, descriptionPart] = id.split('descr');
            if (productPart && descriptionPart) {
                setProductId(productPart);
                setDescriptionId(descriptionPart);
                
                const fetchProductDetails = async () => {
                    try {
                        const productDetails = await fetchProductByfullId(productPart);
                        setProductDetails(productDetails);
                    } catch (error) {
                        console.error('Error fetching product details:', error);
                    }
                };

                const fetchDescriptionDetails = async () => {
                    try {
                        const descriptionDetails = await fetchSpecificDescription(productPart, descriptionPart);
                        setDescriptionDetails(descriptionDetails);
                        setTitle(descriptionDetails.title || '');
                        setFamily(descriptionDetails.family || '');
                        setDescription(descriptionDetails.description || '');
                    } catch (error) {
                        console.error('Error fetching description details:', error);
                    }
                };

                fetchProductDetails();
                fetchDescriptionDetails();
            } else {
                console.error('Invalid format for id:', id);
            }
        } else {
            console.error('ID is not defined or empty');
        }
    }, [id]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleFamilyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFamily(e.target.value);
    };
    interface DescriptionUpdateData {
        title: string;
        family: string;
        description: string;
    }
   
    const handleUpdateProduct = async () => {


        const updateData: DescriptionUpdateData = {
            title: Title,
            family: Family,
            description: description, // Assuming newDescription is the updated description state
        };
        if (Title == '' || Family == '' || description == '') {
            setOpenSnackbar2(true);
            console.error('Product ID or Description ID is missing');
            return;
        }
    else{
        try {
            await updateDescription(product_id, description_id, updateData);
            setOpenSnackbar(true); // Show success snackbar
        } catch (error) {
            console.error('Error updating description:', error);
            setOpenSnackbar(true); // Show error snackbar
        }

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
                        backgroundColor: '#06c258', // Success color
                        color: 'white',
                        '& .MuiAlert-icon': {
                            color: 'white',
                        },
                        '& .MuiAlert-action': {
                            color: 'white',
                        },
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
                        '& .MuiAlert-icon': {
                            color: 'white',
                        },
                        '& .MuiAlert-action': {
                            color: 'white',
                        },
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
                   All fields must be completed
                </Alert>
            </Snackbar>
            <PageContainer title="Photo Management" description="Manage your product photos">
                <DashboardCard title="Descriptions">
                    <Box sx={{ mt: 4 }}>
                        <Grid container spacing={2}>
                            {/* Title */}
                            <Grid item xs={5} lg={4}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    component="label"
                                    htmlFor="title"
                                    mb="5px"
                                >
                                    Title
                                </Typography>
                                <CustomTextField
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={Title}
                                    onChange={handleTitleChange}
                                />
                            </Grid>
                            {/* Family */}
                            <Grid item xs={5} lg={4}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    component="label"
                                    htmlFor="family"
                                    mb="5px"
                                >
                                    Family
                                </Typography>
                                <CustomTextField
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={Family}
                                    onChange={handleFamilyChange}
                                />
                            </Grid>
                            <Grid item xs={2} lg={4}></Grid>
                            <Grid item xs={12} lg={12}>
                            <Editor
              apiKey="pffl1rs9z6e23p2spma0356tvhgvdpwxrhsudf0k4vlnvyhn"
              value={description}
              onEditorChange={(content) => setDescription(content)}
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
                            </Grid>
                            <Grid item xs={12} lg={7}></Grid>
                            <Grid item xs={12} lg={2}>
                                <Button
                                    color="success"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={<Icons.ArrowBackIosNewOutlined />}
                                    href={"/pages/products/"+productDetails?.id}
                                    sx={{
                                        mt: 2,
                                        backgroundColor: 'gray',
                                        '&:hover': {
                                            backgroundColor: 'darkgray',
                                        },
                                    }}
                                >
                                    Back
                                </Button>
                            </Grid>
                            <Grid item xs={12} lg={3}>
                                <Button
                                    color="success"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={<Icons.EditNoteOutlined />}
                                    onClick={handleUpdateProduct}
                                    sx={{ mt: 2 }}
                                >
                                    Update Description
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </DashboardCard>
            </PageContainer>
        </>
    );
};

export default DescriptionDetails;