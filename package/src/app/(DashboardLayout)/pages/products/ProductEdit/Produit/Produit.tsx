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
    Alert,
    TableCell,
    Chip,
    IconButton,
    TableRow,
    TableBody,
    Table,
    TableHead,
    CircularProgress,
    Paper
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { fetchPensions } from '@/app/services/pensionService';
import { fetchFournisseurs } from '@/app/services/fournisseurService';
import { fetchProductLocations, fetchProductStatuses, fetchProductSubTypes, fetchProductTypes} from '@/app/services/productService';
import { addLocationToProduct, fetchProductById, removeLocationFromProduct, updateProduct } from '@/app/services/GeneralproductSerivce';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
interface Location
{

    _id : string,
    type : string,
    name : string
}
// Define interfaces for options
interface Option {
    _id: string;
    name: string;
}
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
    productLocation: {  type : string,name: string } | null; 
}




// Define the ProductDetails component
const ProductDetail = ({ id }: ProductDetailProps) => {

    // State for options and selected values
    const [_id, setProduct_id] = useState<string>('');
    const [productName, setProductName] = useState<string>('');
    const [productType, setProductType] = useState<string | null>(null);
    const [productStatus, setProductStatus] = useState<string | null>(null);
    const [productSubType, setProductSubType] = useState<string | null>(null);
    const [pension, setPension] = useState<string | null>(null);
    const [longitude, setLongitude] = useState<string>('');
    const [latitude, setLatitude] = useState<string>('');
    const [fournisseur, setFournisseur] = useState<string | null>(null);
    const [creationDate, setCreationDate] = useState<string>('');
    const [ProductLocation, setProductLocation] = useState<string | null>(null);
    const [ProductLocationname, setProductLocationname] = useState<string | null>(null);
    // State for option lists
    const [pensionOptions, setPensionOptions] = useState<string[]>([]);
    const [fournisseurOptions, setFournisseurOptions] = useState<string[]>([]);
    const [productTypes, setProductTypeOptions] = useState<string[]>([]);
    const [productStatuses, setProductStatusOptions] = useState<string[]>([]);
    const [productSubTypes, setProductSubTypeOptions] = useState<string[]>([]);



    const [LocationName, setLocationName] = useState<string | null>(null);


    // State for maps
    const [LocationNameMap, setLocationNameMap] = useState<Record<string, { type: string; name: string }>>({});
    const [fournisseurNameMap, setFournisseurNameMap] = useState<Record<string, { name: string; reference: string }>>({});
    const [pensionsNameMap, setPensionsNameMap] = useState<Record<string, string>>({});
    const [productTypeMap, setProductTypeMap] = useState<Record<string, string>>({});
    const [productStatusMap, setProductStatusMap] = useState<Record<string, string>>({});
    const [productSubTypeMap, setProductSubTypeMap] = useState<Record<string, string>>({});

    const [productLocationTypeOptions, setProductLocationTypeOptions] = useState<string[]>([]);
    const [productLocationNameOptions, setProductLocationNameOptions] = useState<string[]>([]);
    const map: Record<string, Set<string>> = {};
    const [productLocationMap, setProductLocationMap] = useState<Record<string, { type: string; name: string }>>({});
    const [locationsArray, setLocationsArray] = useState<Location[]>([]);
    LocationName

 //AUTOCOMPLETE ----------------------------------------------------------------------------------------------------------------OPTIONS
    const fetchOptions = async () => {
        try {
            await fetchAndProcessPensions();
            await fetchAndProcessFournisseurs();
            await fetchAndProcessProductTypes();
            await fetchAndProcessProductLocations();
            await fetchProductLocations();
            await fetchAndProcessProductStatuses();
            await fetchAndProcessProductSubTypes();
            await fetchProductDetails();
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };
    const [productdetails, setProductDetails] = useState<Product | null>(null);
 
    const fetchProductDetails = async () => {
      try {
          const productDetails = await fetchProductById(id);
          setProductDetails(productDetails);
          if (productDetails) {
              // Extract values directly from the productDetails object
              const _id = productDetails.productType?._id || '';
              const productTypeName = productDetails.productType?.name || '';
              const productStatusName = productDetails.productStatus?.name || '';
              const productSubTypeName = productDetails.productSubType?.name || '';
              const pensionName = productDetails.pension?.name || '';
              const fournisseurName = productDetails.fournisseur?.name || '';
  
              // Set state with extracted values
              setProduct_id(productDetails._id || 'locations');
              setProductName(productDetails.productName || '');
              setProductType(productTypeName);
              const locations = productDetails.productLocation || [];
              setLocationsArray(locations);
              setProductStatus(productStatusName);
              setProductSubType(productSubTypeName);
              setPension(pensionName);
              setLongitude(productDetails.longitude || '');
              setLatitude(productDetails.latitude || '');
              setFournisseur(fournisseurName);
              setCreationDate(productDetails.creationDate || new Date().toLocaleString());
          }
      } catch (error) {
          console.error('Error fetching product details:', error);
      }
  };

    const fetchAndProcessPensions = async () => {
        const pensionResponse: Option[] = await fetchPensions();
        setPensionsNameMap(Object.fromEntries(pensionResponse.map(item => [item._id, item.name])));
        setPensionOptions(pensionResponse.map(item => item.name));
    };

    const fetchAndProcessFournisseurs = async () => {
        const fournisseurResponse: { _id: string; name: string; reference: string }[] = await fetchFournisseurs();
        setFournisseurNameMap(Object.fromEntries(fournisseurResponse.map(item => [item._id, { name: item.name, reference: item.reference }])));
        setFournisseurOptions(fournisseurResponse.map(item => item.name));
    };

    const fetchAndProcessProductTypes = async () => {
        const productTypeResponse: Option[] = await fetchProductTypes();
        setProductTypeMap(Object.fromEntries(productTypeResponse.map(item => [item._id, item.name])));
        setProductTypeOptions(productTypeResponse.map(item => item.name));
    };



    const fetchAndProcessProductStatuses = async () => {
        const productStatusResponse: Option[] = await fetchProductStatuses();
        setProductStatusMap(Object.fromEntries(productStatusResponse.map(item => [item._id, item.name])));
        setProductStatusOptions(productStatusResponse.map(item => item.name));
    };

    const fetchAndProcessProductSubTypes = async () => {
        const productSubTypeResponse: Option[] = await fetchProductSubTypes();
        setProductSubTypeMap(Object.fromEntries(productSubTypeResponse.map(item => [item._id, item.name])));
        setProductSubTypeOptions(productSubTypeResponse.map(item => item.name));
    };

 
// rewind
const fetchAndProcessProductLocations = async () => {
    try {
        const productLocationResponse: { _id: string; type: string; name: string }[] = await fetchProductLocations();
        
        const map: Record<string, Set<string>> = {};  // Ensure the map is defined
        const uniqueNames = new Set<string>();  // Use a set to store unique names

        // Populate the map and unique names set
        productLocationResponse.forEach(item => {
            if (!map[item.type]) {
                map[item.type] = new Set();
            }
            map[item.type].add(item.name);
            uniqueNames.add(item.name);  // Add the name to the set
        });

        // Convert the set of unique names to an array
        const uniqueNameArray = Array.from(uniqueNames);

        setProductLocationMap(Object.fromEntries(productLocationResponse.map(item => [item._id, { type: item.type, name: item.name }])));
        setProductLocationTypeOptions(Object.keys(map));
        setProductLocationNameOptions(uniqueNameArray);  // Set the array of unique names
    } catch (error) {
        console.error('Error fetching product locations:', error);
    }
};


//AUTOCOMPLETE ----------------------------------------------------------------------------------------------------------------OPTIONS

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

    useEffect(() => {
        fetchOptions();
        if (productType == null) {
            setLoading(true);
          }
          else{
            setLoading(false);
          }
    }, [productType]);

    const handleUpdateProduct = async () => {
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
        const productData = {
            productName,
            productType: Object.keys(productTypeMap).find(key => productTypeMap[key] === productType) || '',
         
            productStatus: Object.keys(productStatusMap).find(key => productStatusMap[key] === productStatus) || '',
            productSubType: Object.keys(productSubTypeMap).find(key => productSubTypeMap[key] === productSubType) || '',
            pension: Object.keys(pensionsNameMap).find(key => pensionsNameMap[key] === pension) || '',
            longitude,
            latitude,
            fournisseur: Object.keys(fournisseurNameMap).find(key => fournisseurNameMap[key].name === fournisseur) || '',
            lastEditDate: new Date()  // Add the current date and time
        };
        console.log("product object id ", productdetails?._id);
        console.log('Product Type Map:', productTypeMap);
        console.log('Product Status Map:', productStatusMap);
        console.log('Product SubType Map:', productSubTypeMap);
        console.log('Pensions Name Map:', pensionsNameMap);
        console.log('Fournisseur Name Map:', fournisseurNameMap);
        console.log('Product Data:', productData);
        if (productdetails && productdetails._id) {
            await updateProduct(productdetails._id, productData);
          } else {
            console.error("Product details or product ID is undefined");
          }
          
        setOpenSnackbar(true);
    } catch (error) {
        console.error('Failed to update product:', error);
    }
};
const [openSnackbar2, setOpenSnackbar2] = useState(false);
const handleCloseSnackbar2 = () => {
    setOpenSnackbar2(false);
};

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    const handleFournisseurChange = (event: React.SyntheticEvent, value: string | null) => {
        resetError('fournisseur');
        setFournisseur(value);
    };
// Assuming creationDate is in a format that can be parsed by Date (e.g., ISO format)
const creationDateObj = new Date(creationDate);
const formattedCreationDate = creationDateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,  // Use 12-hour clock if you want AM/PM
});

  
    const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductName(e.target.value);
        resetError('productName');
    };

    const handleProductTypeChange = (event: React.SyntheticEvent, value: string | null) => {
        setProductType(value);
        resetError('productType');
    };

 //rewind
    const handleDelete = async (locationId : string ) => {
        try {
            if (locationId && productdetails) {
            await removeLocationFromProduct(productdetails._id,locationId);
            await fetchOptions();
            setOpenSnackbar(true);
    
            }

        } catch (error) {
            console.error('Error deleting location:', error);
        }
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

    const handleLocationNameChange = (event: React.SyntheticEvent, value: string | null) => {
        setLocationName(value);
    };

    const getLocationIdByName = (name: string): string => {
        for (const [id, location] of Object.entries(productLocationMap)) {
            if (location.name === name) {
                return id;  // Return the ID if the name matches
            }
        }
        return '';  // Return an empty string if the name is not found
    };



      const [Loading, setLoading] = useState<boolean>(true);
   
    const handleAddLocation = async () => {
        try {
            if (LocationName && productdetails) {
                const locationId = getLocationIdByName(LocationName);
                if (!locationId) {
                    // Handle the case where the location ID is not found
                    setFormErrors({ ...formErrors, fournisseur: 'Location not found' });
                    return;
                }
                
             
                await addLocationToProduct(productdetails._id, locationId);
                await fetchOptions();
                setOpenSnackbar(true);
  
    
            } else {
                setOpenSnackbar2(true);
            }
        } catch (error) {
            setOpenSnackbar2(true);
    
        }
    };
    



    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const resetError = (field: string) => {
        setFormErrors((prevErrors) => {
            const { [field]: _, ...remainingErrors } = prevErrors;
            return remainingErrors;
        });
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
                    Product successfully updated!
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
                Product location already exists
            </Alert>
        </Snackbar>



           {
            Loading?(<Paper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading...</Typography>
              </Paper>):
            <Grid container spacing={1}>
            <Grid item xs={12} lg={8}>
            <DashboardCard title="Product Details">
                <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                    <Grid container spacing={2}>
                        {/* Product Name */}
                        <Grid item xs={6} lg={6}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                component="label"
                                htmlFor="productName"
                                mb="5px"
                            >
                                Product Name
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
                        <Grid item xs={6} lg={3}>
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

                        {/* Product SubType */}
                        <Grid item xs={6} lg={4}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                component="label"
                                htmlFor="productSubType"
                                mb="5px"
                            >
                                Product SubType
                            </Typography>
                            <Autocomplete
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

                        {/* Fournisseur */}
                        <Grid item xs={6} lg={4}>
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
                            {/* Creation Date */}
                            <Grid item xs={6} lg={4}>
    <Typography
        variant="subtitle1"
        fontWeight={600}
        component="label"
        htmlFor="creationDate"
        mb="5px"
    >
        Creation Date
    </Typography>
    <CustomTextField
        variant="outlined"
        fullWidth
        value={formattedCreationDate}  // Use the formatted date here
        disabled
    />
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

                  
                    </Grid>

                    
                </Box>
            </DashboardCard> </Grid>
            <Grid item xs={12} lg={4}> 
            <DashboardCard title="Locations">
            <Grid container spacing={1}>
            <Grid item xs={5} lg={5}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                component="label"
                                htmlFor="productName"
                                mb="5px"
                            >
                               Type
                            </Typography>
                            
                        </Grid> 
                        <Grid item xs={7} lg={7}>
                        <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                component="label"
                                htmlFor="productName"
                                mb="5px"
                            >
                                Name
                            </Typography> </Grid> 
                            {locationsArray.map((location) => (
                <Grid container spacing={1} key={location._id}>
                    <Grid item xs={5} lg={5} sx={{ padding: 2 }}>
                        <CustomTextField
                            variant="outlined"
                            fullWidth
                            required
                            value={location.type}
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{ backgroundColor: 'lightgray' }}
                        />
                    </Grid>
                    <Grid item xs={5} lg={5} sx={{ padding: 2 }}>
                        <CustomTextField
                            variant="outlined"
                            fullWidth
                            required
                            value={location.name}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={1} lg={1}>
                    <Button
    variant="contained"
    onClick={() => handleDelete(location._id)}
    sx={{ 
        mt: 0, 
        padding: '14px',
        backgroundColor: 'white',  // Background color
        borderRadius: '7px', 
        border: '1px solid rgba(0, 0, 0, 0.2)',  // Light black border
        '&:hover': {
            backgroundColor: 'LightCoral', 
            borderRadius: '6px',
            boxShadow: 'none',  // Remove shadow on hover
        },
        boxShadow: 'none',  // Remove shadow by default
        display: 'flex',
        justifyContent: 'center', // Center icon horizontally
        alignItems: 'center',    // Center icon vertically
        cursor: 'pointer',  // Ensure the cursor is a pointer
    }}
>
    <Icons.Delete sx={{ color: 'red' }} />  {/* Icon color set to red */}
</Button>

                    </Grid>
                </Grid>
            ))}

                          
                          
                          
       
     
     {/*rewind3*/}
                <Grid item xs={8} lg={8}>   <Autocomplete
     options={productLocationNameOptions}
     value={LocationName}
     onChange={handleLocationNameChange}
     renderInput={(params) => 
         <TextField 
             {...params} 
             required 
             error={!!formErrors.fournisseur}
             helperText={formErrors.fournisseur}
         />
     }
 />          </Grid> 
               <Grid item xs={4} lg={4}>             
                
               <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ 
                        mt: 0, 
                        padding: '13px',
                        backgroundColor: 'primary.main',  // Adjust the color as necessary
                        borderRadius: '7px', 
                        '&:hover': {
                            backgroundColor: 'blue',
                            borderRadius: '6px',
                        },
                    }}
                    onClick={handleAddLocation}
                    startIcon={<Icons.Add />}
                >
                    Add
                </Button>
 </Grid>
                          </Grid>
                        
            </DashboardCard> </Grid>

             {/* empty space   */}
            <Grid item xs={12} lg={7}></Grid>
            {/* All products  button href */}
            <Grid item xs={4} lg={2}>
            <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ 
                mt: 2, 
                backgroundColor: 'gray',  // Set the background color to gray
                '&:hover': {
                    backgroundColor: 'darkgray',  // Optional: Set a darker shade on hover
                },
            }}
            component={Link}
            href="/pages/products"
            startIcon={<Icons.ArrowBackIosNewOutlined />} 
        >
            All Products
        </Button> </Grid>

         {/* Update product button  */}
            <Grid item xs={8} lg={3}>
            <Button 
                       color="success"
                       variant="contained"
                       size="large"
                       fullWidth
                       startIcon={<Icons.EditNoteOutlined/>}
                        onClick={handleUpdateProduct}
                        sx={{ mt: 2 }}
                    >
                        Update Product
                    </Button></Grid>
            </Grid>


        }
        </div>
    );
};

export default ProductDetail;
