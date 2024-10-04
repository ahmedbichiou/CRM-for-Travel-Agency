'use client';
import { useEffect, useState } from 'react';
import * as Icons from '@mui/icons-material';
import {
    Typography, Box,
    Grid,
    Button,
    Autocomplete,
    TextField,
    Snackbar,
    Alert
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { fetchPensions } from '@/app/services/pensionService';
import { fetchFournisseurs } from '@/app/services/fournisseurService';
import { fetchProductLocations, fetchProductStatuses, fetchProductSubTypes, fetchProductTypes } from '@/app/services/productService';
import { addProduct } from '@/app/services/GeneralproductSerivce';
import { URLPORT } from '@/app/services/URL';
import { useRouter } from 'next/navigation';
interface FournisseurEntry {
    name: string;
    reference: string;
}
const Addproducts = () => {

   // Define the state and setters for all records
const [id, setId] = useState<string>('');
const [productName, setProductName] = useState<string>('');
const [productType, setProductType] = useState<string | null>(null);
const [productLocation, setProductLocation] = useState<string | null>(null);
const [productStatus, setProductStatus] = useState<string | null>(null);
const [productSubType, setProductSubType] = useState<string | null>(null);
const [pension, setPension] = useState<string | null>(null);
const [longitude, setLongitude] = useState<string>('');
const [latitude, setLatitude] = useState<string>('');
const [fournisseurRef, setFournisseurRef] = useState<string>('');
const [fournisseur, setFournisseur] = useState<string | null>(null);
const [creationDate, setCreationDate] = useState<string>('');
const [pensionOptions, setPensionOptions] = useState<string[]>([]);
const [fournisseurOptions, setFournisseurOptions] = useState<string[]>([]);
const [productTypes, setProductTypeOptions] = useState<string[]>([]);





const [productStatuses, setProductStatusOptions] = useState<string[]>([]);
const [productSubTypes, setProductSubTypeOptions] = useState<string[]>([]);
const [fournisseurNameMap, setFournisseurNameMap] = useState<Record<string, { name: string; reference: string }>>({});


const [pensionsNameMap, setPensionsNameMap] = useState<Record<string, string>>({});
const [productTypeMap, setProductTypeMap] = useState<Record<string, string>>({});


const [productStatusMap, setProductStatusMap] = useState<Record<string, string>>({});
const [productSubTypeMap, setProductSubTypeMap] = useState<Record<string, string>>({});

const [selectedCountry, setSelectedCountry] = useState<string | null>(null);



async function fetchAndProcessPensions() {
    interface PensionOption {
        _id: string;
        name: string;
    }

    const pensionResponse: PensionOption[] = await fetchPensions();
    const names = pensionResponse.map(item => item.name);

    const newPensionsNameMap: Record<string, string> = {};
    pensionResponse.forEach(item => {
        newPensionsNameMap[item._id] = item.name;
    });

    setPensionsNameMap(newPensionsNameMap);
    setPensionOptions(names);
}

async function fetchAndProcessFournisseurs() {
    interface FournisseurOption {
        _id: string;
        name: string;
        reference: string;
    }

    const fournisseurResponse: FournisseurOption[] = await fetchFournisseurs();
    const names = fournisseurResponse.map(item => item.name);

    const newFournisseurNameMap: Record<string, { name: string; reference: string }> = {};
    fournisseurResponse.forEach(item => {
        newFournisseurNameMap[item._id] = { name: item.name, reference: item.reference };
    });

    setFournisseurNameMap(newFournisseurNameMap);
    setFournisseurOptions(names);
}

async function fetchAndProcessProductTypes() {
    interface ProductTypeOption {
        _id: string;
        name: string;
    }

    const productTypeResponse: ProductTypeOption[] = await fetchProductTypes();
    const names = productTypeResponse.map(item => item.name);

    const newProductTypeMap: Record<string, string> = {};
    productTypeResponse.forEach(item => {
        newProductTypeMap[item._id] = item.name;
    });

    setProductTypeMap(newProductTypeMap);
    setProductTypeOptions(names);
}




async function fetchAndProcessProductStatuses() {
    interface ProductStatusOption {
        _id: string;
        name: string;
    }

    const productStatusResponse: ProductStatusOption[] = await fetchProductStatuses();
    const names = productStatusResponse.map(item => item.name);

    const newProductStatusMap: Record<string, string> = {};
    productStatusResponse.forEach(item => {
        newProductStatusMap[item._id] = item.name;
    });

    setProductStatusMap(newProductStatusMap);
    setProductStatusOptions(names);
}

async function fetchAndProcessProductSubTypes() {
    interface ProductSubTypeOption {
        _id: string;
        name: string;
    }

    const productSubTypeResponse: ProductSubTypeOption[] = await fetchProductSubTypes();
    const names = productSubTypeResponse.map(item => item.name);

    const newProductSubTypeMap: Record<string, string> = {};
    productSubTypeResponse.forEach(item => {
        newProductSubTypeMap[item._id] = item.name;
    });

    setProductSubTypeMap(newProductSubTypeMap);
    setProductSubTypeOptions(names);
}

//rewind
    const fetchOptions = async () => {
        try {
            await fetchAndProcessPensions();
            await fetchAndProcessFournisseurs();
            await fetchAndProcessProductTypes();
     
            await fetchAndProcessProductStatuses();
            await fetchAndProcessProductSubTypes();
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    useEffect(() => {
        fetchOptions();
        const currentDate = new Date().toLocaleString();
        setCreationDate(currentDate);
    }, []);

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setId(e.target.value);
        resetError('id');
    };
3  
    const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductName(e.target.value);
        resetError('productName');
    };

    const handleProductTypeChange = (event: React.SyntheticEvent, value: string | null) => {
        setProductType(value);
        resetError('productType');
    };

 
    

    const handleProductStatusChange = (event: React.SyntheticEvent, value: string | null) => {
        setProductStatus(value);
        resetError('productStatus');
    };

    const handleProductSubTypeChange = (event: React.SyntheticEvent, value: string | null) => {
        setProductSubType(value);
        resetError('productSubType');
    };

    const handlePensionChange = (event: React.SyntheticEvent, value: string | null) => {
        setPension(value);
        resetError('pension');
    };

    const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLongitude(e.target.value);
        resetError('longitude');
    };

    const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLatitude(e.target.value);
        resetError('latitude');
    };

    const resetError = (field: string) => {
        setFormErrors((prevErrors) => {
            const { [field]: _, ...remainingErrors } = prevErrors;
            return remainingErrors;
        });
    };


    const ResetForm = () => {
        setId("");
        setProductName("");
        setProductType(null);
        setProductLocation(null);
       
        setProductStatus(null);
        setProductSubType(null);
        setPension(null);
        setLongitude("");
        setLatitude("");
        setFournisseur(null);
        setFournisseurRef('');
    };

    const handleFournisseurChange = (event: React.SyntheticEvent, value: string | null) => {
        resetError('fournisseur');
        setFournisseur(value);
       
        if (value) {
           
            const selectedFournisseur = Object.values(fournisseurNameMap).find(
                item => item.name.trim().toLowerCase() === value.trim().toLowerCase()
            );
    
            if (selectedFournisseur) {
               
                setFournisseurRef(selectedFournisseur.reference);
            } else {
              
                setFournisseurRef('');
            }
        } else {
            setFournisseurRef(''); 
        }
    };
    
    
    
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    const handleSubmit = async () => {
       
        setFormErrors({});
      
    
        
        let errors: Record<string, string> = {};
        if (!id) errors.id = 'Product ID is required.';
        if (!productName) errors.productName = 'Product name is required.';
        if (!productType) errors.productType = 'Product type is required.';
       
        if (!productStatus) errors.productStatus = 'Product status is required.';
        if (!productSubType) errors.productSubType = 'Product sub-type is required.';
        if (!pension) errors.pension = 'Pension is required.';
        if (!longitude) errors.longitude = 'Longitude is required.';
        if (!latitude) errors.latitude = 'Latitude is required.';
        if (!fournisseur) errors.fournisseur = 'Fournisseur is required.';
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        } 
        try {
            const response = await fetch(URLPORT+'/api/products/check-id?id='+id);
            const result = await response.json();
            if (!result.unique) {
                setFormErrors({ id: 'Product ID already exists.' });
                return;
            }
            const productTypeId = Object.keys(productTypeMap).find(key => productTypeMap[key] === productType);
            const productStatusId = Object.keys(productStatusMap).find(key => productStatusMap[key] === productStatus);
            const productSubTypeId = Object.keys(productSubTypeMap).find(key => productSubTypeMap[key] === productSubType);
            const pensionId = Object.keys(pensionsNameMap).find(key => pensionsNameMap[key] === pension);
            const fournisseurId = Object.keys(fournisseurNameMap).find(key => fournisseurNameMap[key].name === fournisseur);
            const productData = {
                id,
                productName,
                productType: productTypeId || '',
              
                productStatus: productStatusId || '',
                productSubType: productSubTypeId || '',
                pension: pensionId || '',
                longitude,
                latitude,
                fournisseur: fournisseurId || ''
            };
    
            await addProduct(productData);
            setOpenSnackbar(true);
            ResetForm();
        } catch (error) {
            console.error('Failed to submit product:', error);
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
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    return (
        <div>
<Snackbar
    open={openSnackbar}
    autoHideDuration={6000}
    onClose={handleCloseSnackbar}
    sx={{ zIndex: 1400 }}  // Ensure it appears on top of other elements
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}  // Adjust position
>
    <Alert 
        onClose={handleCloseSnackbar} 
        severity="success" 
        sx={{ 
            width: '300px',  // Increase width
            fontSize: '0.9rem',  // Adjust font size
            padding: '16px',  // Adjust padding
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',  // Add shadow
        }}
    >
        Product successfully inserted!
    </Alert>
</Snackbar>


<DashboardCard title="Add products">
    <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        <Grid container spacing={2}>
            {/* Id */}
            <Grid item xs={6} lg={2}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="id"
                    mb="5px"
                >
                    Code produit
                </Typography>
                <CustomTextField
                    variant="outlined"
                    fullWidth
                    required
                    value={id}
                    onChange={handleIdChange}
                    error={!!formErrors.id}
                    helperText={formErrors.id}
                />
            </Grid>

            {/* Product name */}
            <Grid item xs={6} lg={3}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="productName"
                    mb="5px"
                >
                    Product name
                </Typography>
                <CustomTextField
                    variant="outlined"
                    fullWidth
                    required
                    value={productName}
                    onChange={handleProductNameChange}
                    error={!!formErrors.productName}
                    helperText={formErrors.productName}
                />
            </Grid>

            {/* Product Type */}
            <Grid item xs={6} lg={3}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="productType"
                    mb="5px"
                >
                    Product Type
                </Typography>
                <Autocomplete
                    disablePortal
                    options={productTypes}
                    value={productType}
                    onChange={handleProductTypeChange}
                    
                    renderInput={(params) => 
                        <TextField 
                            {...params} 
                            required 
                            error={!!formErrors.productType}
                            helperText={formErrors.productType}
                        />
                    }
                />
            </Grid>

           

            {/* Product Status */}
            <Grid item xs={6} lg={4}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="productStatus"
                    mb="5px"
                >
                    Product Status
                </Typography>
                <Autocomplete
                    disablePortal
                    options={productStatuses}
                    value={productStatus}
                    onChange={handleProductStatusChange}
                    renderInput={(params) => 
                        <TextField 
                            {...params} 
                            required 
                            error={!!formErrors.productStatus}
                            helperText={formErrors.productStatus}
                        />
                    }
                />
            </Grid>

            {/* Product Sub-Type */}
            <Grid item xs={6} lg={4}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="productSubType"
                    mb="5px"
                >
                    Product Sub-Type
                </Typography>
                <Autocomplete
                    disablePortal
                    options={productSubTypes}
                    value={productSubType}
                    onChange={handleProductSubTypeChange}
                    renderInput={(params) => 
                        <TextField 
                            {...params} 
                            required 
                            error={!!formErrors.productSubType}
                            helperText={formErrors.productSubType}
                        />
                    }
                />
            </Grid>

            {/* Pension */}
            <Grid item xs={6} lg={4}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="pension"
                    mb="5px"
                >
                    Pension
                </Typography>
                <Autocomplete
                    disablePortal
                    options={pensionOptions}
                    value={pension}
                    onChange={handlePensionChange}
                    renderInput={(params) => 
                        <TextField 
                            {...params} 
                            required 
                            error={!!formErrors.pension}
                            helperText={formErrors.pension}
                        />
                    }
                />
            </Grid>

    
{/*-----------------------------------------fournisseur --------------------------*/}
            <Grid item xs={12} lg={12}>     
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="fournisseurRef"
                    mb="5px"
                    sx={{ fontSize: '1.2rem' }} // Adjust the font size as needed
                >
                    Fournisseur
                </Typography>
            </Grid>

            {/* Fournisseur Reference */}
            <Grid item xs={6} lg={3}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="fournisseurRef"
                    mb="5px"
                >
                    Ref Fournisseur
                </Typography>
                <CustomTextField
                    variant="outlined"
                    fullWidth
                    required
                    value={fournisseurRef}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Grid>

            {/* Fournisseur */}
            <Grid item xs={6} lg={3}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="fournisseur"
                    mb="5px"
                >
                    Fournisseur
                </Typography>
                <Autocomplete
                    disablePortal
                    options={fournisseurOptions}
                    value={fournisseur}
                    onChange={handleFournisseurChange}
                    renderInput={(params) => 
                        <TextField 
                            {...params} 
                            required 
                            error={!!formErrors.fournisseur}
                            helperText={formErrors.fournisseur}
                        />
                    }
                />
            </Grid>

            {/* ----------------Location---------------------------------- */}               
            <Grid item xs={12} lg={12}>     
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="location"
                    mb="5px"
                    sx={{ fontSize: '1.2rem' }} // Adjust the font size as needed
                >
                    Product Location
                </Typography>
            </Grid>
           
     


          
             {/* Longitude */}
             <Grid item xs={6} lg={3}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="longitude"
                    mb="5px"
                >
                    Longitude
                </Typography>
                <CustomTextField
                    variant="outlined"
                    fullWidth
                    type="number"
                    required
                    value={longitude}
                    onChange={handleLongitudeChange}
                    inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                    }}
                    error={!!formErrors.longitude}
                    helperText={formErrors.longitude}
                />
            </Grid>
            {/* Latitude */}
            <Grid item xs={6} lg={3}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="latitude"
                    mb="5px"
                >
                    Latitude
                </Typography>
                <CustomTextField
                variant="outlined"
                type="number"
                fullWidth
                required
                value={latitude}
                onChange={handleLatitudeChange}
                inputProps={{
                    inputMode: 'numeric', 
                    pattern: '\\d*', 
                }}
                error={!!formErrors.latitude}
                helperText={formErrors.latitude}
            />
            </Grid>
            <Grid item xs={12} lg={4}></Grid>
          
            <Grid item xs={12} lg={2}>
                
                <Grid item xs={12} lg={12} container spacing={2}>
                    <Button
                        color="success"
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<Icons.Add />}
                        onClick={handleSubmit}  // Attach handleSubmit to onClick event
                    >
                        Add Product
                    </Button>
                    <Grid item xs={12} lg={12}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="creationDate"
                        mb="5px"
                        sx={{ fontSize: '0.8rem', mt: '10px' }} // Adjust font size and margin-top if needed
                    >
                    Creation date 
                    </Typography>
                    <Typography
                        variant="body1"
                        fontWeight={400}
                        component="div"
                        mb="5px"
                        sx={{ fontSize: '0.7rem', mt: '5px' }} // Adjust font size and margin-top if needed
                    >
                        {creationDate}
                    </Typography>
                </Grid></Grid>
            </Grid>
        </Grid>
    </Box>
</DashboardCard>

               
           </div>
    );
};

export default Addproducts;
