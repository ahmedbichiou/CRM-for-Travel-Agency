'use client';

import { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, TextField, Card, CardContent, Divider, IconButton, MenuItem, Autocomplete, ToggleButtonGroup, ToggleButton, Snackbar, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { URLPORT } from '@/app/services/URL';
import * as Icons from '@mui/icons-material';
import { fetchFournisseurs } from '@/app/services/fournisseurService';
import { fetchProductLocations } from '@/app/services/ManageOthersSerivce';
import { fetchProductStatuses } from '@/app/services/productService';
import { fetchProductTypes, fetchProductSubTypes } from '@/app/services/producttypesService';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { lightBlue, lightGreen } from '@mui/material/colors';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface ProductDetails {
  product_id: string;
  productid: string;
  productName: string;
  // Add other relevant product fields as needed
}
interface Product {
  _id: string;
  id: string;
  productName: string;

}
export interface Description {
  _id: string;
  title: string;
  description: string;
  productDetails?: ProductDetails; // Optional field to include product details
}

const SearchComponent = () => {

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
  const handleProductClick = (id: string) => {
    // Implement your logic to handle product ID click
    console.log('Product ID clicked:', id);
  };
  
//AUTOCOMPLETE OPTIONS FETCHINGS
const [fournisseur, setfournisseur] = useState<string | null>(null);
const [id, setId] = useState<string>('');
const [productName, setProductName] = useState<string>('');
const [productType, setProductType] = useState<string | null>(null);
const [productLocation, setProductLocation] = useState<string | null>(null);
const [productStatus, setProductStatus] = useState<string | null>(null);
const [productSubType, setProductSubType] = useState<string | null>(null);

const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newValue = e.target.value;
  setId(newValue);
};
const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setProductName(e.target.value);
  
  
};

const handleProductTypeChange = (event: React.SyntheticEvent, value: string | null) => {
  setProductType(value);
 

};
const handleProductLocationChange = (event: React.SyntheticEvent, value: string | null) => {
  setProductLocation(value);
  
  
};

const handleProductStatusChange = (event: React.SyntheticEvent, value: string | null) => {
  setProductStatus(value);

  
};

const handleProductSubTypeChange = (event: React.SyntheticEvent, value: string | null) => {
  setProductSubType(value);
 
 
};
const handlefournisseurChange = (event: React.SyntheticEvent, value: string | null) => {
  setfournisseur(value);
};
const [isLoading, setIsLoading] = useState(false);
const fetchOptions = async () => {
  try {
   
      await fetchAndProcessFournisseurs();
      await fetchAndProcessProductTypes();
      await fetchAndProcessProductLocations();
      await fetchAndProcessProductStatuses();
      await fetchAndProcessProductSubTypes();
  } catch (error) {
      console.error('Error fetching options:', error); 
  }};
const [fournisseurOptions, setFournisseurOptions] = useState<string[]>([]);
const [productTypes, setProductTypeOptions] = useState<string[]>([]);
const [productStatuses, setProductStatusOptions] = useState<string[]>([]);
const [productSubTypes, setProductSubTypeOptions] = useState<string[]>([]);
const [productLocationNameOptions, setProductLocationNameOptions] = useState<string[]>([]);


async function fetchAndProcessFournisseurs() {
  interface FournisseurOption {
      _id: string;
      name: string;
      reference: string;
  }

  const fournisseurResponse: FournisseurOption[] = await fetchFournisseurs();
  const names = fournisseurResponse.map(item => item.name);
  setFournisseurOptions(names);
}
async function fetchAndProcessProductTypes() {
  interface ProductTypeOption {
      _id: string;
      name: string;
  }

  const productTypeResponse: ProductTypeOption[] = await fetchProductTypes();
  const names = productTypeResponse.map(item => item.name);
  setProductTypeOptions(names);
} 
async function fetchAndProcessProductStatuses() {
  interface ProductStatusOption {
      _id: string;
      name: string;
  }

  const productStatusResponse: ProductStatusOption[] = await fetchProductStatuses();
  const names = productStatusResponse.map(item => item.name);
  setProductStatusOptions(names);
}
async function fetchAndProcessProductSubTypes() {
  interface ProductSubTypeOption {
      _id: string;
      name: string;
  }

  const productSubTypeResponse: ProductSubTypeOption[] = await fetchProductSubTypes();
  const names = productSubTypeResponse.map(item => item.name);
  setProductSubTypeOptions(names);
}

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
      setProductLocationNameOptions(uniqueNameArray);  // Set the array of unique names
  } catch (error) {
      console.error('Error fetching product locations:', error);
  }
};
useEffect(() => {
  fetchOptions();
  }, []);
// END  AUTOCOMPLETE OPTIONS FETCHINGS


const [searchType, setSearchType] = useState<'product' | 'description'>('description');


const handleSearchTypeChange = (event: React.MouseEvent<HTMLElement>, newSearchType: 'product' | 'description') => {
  if (newSearchType !== null) {
    setSearchType(newSearchType);
    handleResetSelection();
    setNameToBeReplaced('')
    if (newSearchType === 'product') {
      // Reset fields for product search
      setTitleQuery('');
      setDescriptionQuery('');
      setDescriptions([]);
    } else if (newSearchType === 'description') {
      // Reset fields for description search
      setId(''); // Assuming you have a state for 'id'
      setProductName(''); // Assuming you have a state for 'productName'
      setproducts([]);
    }
    
    // Empty the data array
   
  }
};



  const [products, setproducts] = useState<Product[]>([]);
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [selectedDescriptions, setSelectedDescriptions] = useState<Set<string>>(new Set());
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [titleQuery, setTitleQuery] = useState<string>('');
  const [descriptionQuery, setDescriptionQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [count, setCount] = useState<string>('');
  const [isCardExpanded, setIsCardExpanded] = useState<boolean>(false);
  const [criteria, setCriteria] = useState<'title' | 'description' | 'both'>('both');
  const [nameToBeReplaced, setNameToBeReplaced] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [executiontime, setexecutiontime] = useState<string>('');

  const highlightText = (text: string, query: string) => {
    if (!query || query.length < 3) return text; // Ensure the query is at least 3 characters long
  
    // Escape special regex characters in the query
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
    // Create a regular expression to match substrings containing the query
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
  
    // Highlight matches in the text
    return text.replace(regex, '<span style="background-color: yellow;">$1</span>');
  };
  
  const [openSnackbar2, setOpenSnackbar2] = useState(false);
  const handleSearch = async () => {
    if (searchType == 'product') {
      try {
        // Construct the API URL for searching products
        setLoading(true);
        const productApiUrl =`${URLPORT}/api/search/search-products-filtered` +
    `?id=${id || ''}` +
    `&productName=${productName || ''}` +
    `&productTypeName=${productType|| ''}` + 
    `&productStatusName=${productStatus || ''}` +
    `&productSubTypeName=${productSubType || ''}` +
    `&fournisseurName=${fournisseur || ''}`;
        console.log(productName);
        // Fetch data from the API
        if(id==''&&productName=='')
        {
          setOpenSnackbar2(true);
        }
        const response = await fetch(productApiUrl);
        const data = await response.json();

        // Log the received data
        console.log('Product Search Results:', data);
        setexecutiontime(data.executionTime);
       
        // Update state with the received data
        setCount(data.totalCount);
        setproducts(data.products || []); // Assuming 'products' is the key in the response
        setLoading(false);

    } catch (error) {
        console.error('Error during product search:', error);
    } 
        
    
    return; // Exit early for product search
    }

    setLoading(true);
    handleResetSelection();

    // Determine search criteria based on the presence of queries
    const newCriteria = !titleQuery && !descriptionQuery
        ? 'both' // Default or fallback case if neither is provided
        : titleQuery && descriptionQuery
        ? 'both'
        : titleQuery
        ? 'title'
        : 'description';

    setCriteria(newCriteria); // Set the criteria based on the queries

    try {
        const response = await fetch(
          
            `${URLPORT}/api/search/search-descriptions-title-text-with-products?titleQuery=${titleQuery || ''}&descriptionQuery=${descriptionQuery || ''}&id=${id || ''}&productLocation=${productLocation || ''}&productName=${productName || ''}&productStatus=${productStatus || ''}&productSubType=${productSubType || ''}&productType=${productType || ''}&fournisseur=${fournisseur || ''}`
        );
        const data = await response.json();
        console.log(data);
        if(titleQuery==''&&descriptionQuery =='')
          {
            setOpenSnackbar2(true);
          }
        setCount(data.totalCount);
        setDescriptions(data.descriptions || []);
        setexecutiontime(data.executionTime);
    } catch (error) {
        console.error('Error during search:', error);
    } finally {
        setLoading(false);
    }
    setNewName('');
    
      setNameToBeReplaced(descriptionQuery || titleQuery || '');

};


const handleSelect = (id: string) => {
  if (searchType === 'product') {
    // Handle selection for products
    setSelectedProducts(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  } else {
    // Handle selection for descriptions
    setSelectedDescriptions(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  }
};


  const handleSelectAll = () => {
    const allIds = new Set(descriptions.map(desc => desc._id));
    setSelectedDescriptions(allIds);
  };

  const handleResetSelection = () => {
    setSelectedDescriptions(new Set());
    setSelectedProducts(new Set());
  };

  const handleConfirmSelection = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior
   
    if (searchType === 'product') {
        // If searching for products, send a request to update product names
        const ids = Array.from(selectedProducts);
        if (!ids.length || !nameToBeReplaced || !newName) return;

        try {
          setIsLoading(true);
            const response = await fetch(`${URLPORT}/api/search/update-products-fromsearch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ids,
                    nameToBeReplaced,
                    newName
                }),
            });
            const result = await response.json();
            if(result)
            {
              setIsLoading(false);
            }
            handleResetSelection();
            
            handleSearch(); // Optionally refresh the search results
            console.log('Update result:', result);
        } catch (error) {
            console.error('Error updating products:', error);
        }finally {
          setIsLoading(false); // Set loading state to false once processing is complete
      }
        return;
    }

    // Proceed with updating descriptions if searchType is 'description'
    const ids = Array.from(selectedDescriptions);
    if (!ids.length || !nameToBeReplaced || !newName) return;

    try {
      setIsLoading(true);
        const response = await fetch(`${URLPORT}/api/search/update-descriptions-fromsearch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ids,
                criteria,
                nameToBeReplaced,
                newName
            }),
        });
        const result = await response.json();
        if(result)
          {
            setIsLoading(false);
          }
        handleResetSelection();
        handleSearch();
        console.log('Update result:', result);
    } catch (error) {
        console.error('Error updating descriptions:', error);
    }
};

  
  

  const toggleCardExpansion = () => {
    setIsCardExpanded(prev => !prev);
  };
  const handleCloseSnackbar2 = () => {
    setOpenSnackbar2(false);
};
const executionTimeNumber = Number(executiontime);

// Define styles based on execution time
const getExecutionTimeStyle = () => {
  if (executionTimeNumber <= 1000) {
    return { color: 'green' }; // Green if execution time is between 0 and 1000 ms
  } else {
    return { color: 'red' }; // Red if execution time is more than 1000 ms
  }
};
  return (
    <>
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
                    Missing informations for search!<br></br><br></br> Consider switching modes
                </Alert>
            </Snackbar>
  
    <PageContainer title="Search Descriptions" description="Display and select descriptions">
      <PageContainer title="Dashboard" description="this is Dashboard">

       
      <DashboardCard title="Search products"
      >
      <Box 
    sx={{ 
        overflow: 'auto', 
        width: { xs: '280px', sm: 'auto' },
        opacity: loading ? 0.5 : 1,                // Apply opacity when loading
        pointerEvents: loading ? 'none' : 'auto',  // Disable pointer events when loading
    }}
>
    <Grid container spacing={2}
      sx={{ 
               
        opacity: isLoading ? 0.5 : 1,                // Apply opacity when loading
        pointerEvents: isLoading ? 'none' : 'auto',  // Disable pointer events when loading
    }}
  >
        {/* ID */}
        <Grid item xs={6} lg={2}>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="id" mb="5px">
                Id
            </Typography>
            <CustomTextField
                variant="outlined"
                fullWidth
                value={id}
                onChange={handleIdChange}
            />
        </Grid>

        {/* Product Name */}
        <Grid item xs={6} lg={3}>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="productName" mb="5px">
                Product Name
            </Typography>
            <CustomTextField
                variant="outlined"
                fullWidth
                value={productName}
                onChange={handleProductNameChange}
            />
        </Grid>
    </Grid>

    {/* Collapsible Fields */}
    <Grid container spacing={2} paddingTop='2px'
      sx={{ 
               
        opacity: isLoading ? 0.5 : 1,                // Apply opacity when loading
        pointerEvents: isLoading ? 'none' : 'auto',  // Disable pointer events when loading
    }}>
        {/* Product Type */}
        <Grid item xs={6} lg={3}>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="productType">
                Product Type
            </Typography>
            <Autocomplete
                disablePortal
                options={productTypes}
                value={productType}
                onChange={handleProductTypeChange}
                renderInput={(params) => <TextField {...params} />}
            />
        </Grid>

        {/* Product Sub-Type */}
        <Grid item xs={6} lg={3}>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="productSubType" mb="5px">
                Product Sub-Type
            </Typography>
            <Autocomplete
                disablePortal
                options={productSubTypes}
                value={productSubType}
                onChange={handleProductSubTypeChange}
                renderInput={(params) => <TextField {...params} />}
            />
        </Grid>

        {/* Product Status */}
        <Grid item xs={6} lg={3}>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="productStatus" mb="5px">
                Product Status
            </Typography>
            <Autocomplete
                disablePortal
                options={productStatuses}
                value={productStatus}
                onChange={handleProductStatusChange}
                renderInput={(params) => <TextField {...params} />}
            />
        </Grid>

        {/* Fournisseur */}
        <Grid item xs={6} lg={3}>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="fournisseur" mb="5px">
                Fournisseur
            </Typography>
            <Autocomplete
                disablePortal
                options={fournisseurOptions}
                value={fournisseur}
                onChange={handlefournisseurChange}
                renderInput={(params) => <TextField {...params} />}
            />
        </Grid>
    </Grid>
</Box>

    </DashboardCard>


        <Box>
          <Box
            sx={{
              top: 0,
              backgroundColor: 'background.paper',
              padding: 2,
              zIndex: 1000,
              boxShadow: 1,
              opacity: loading ? 0.5 : 1,                // Apply opacity when loading
              pointerEvents: loading ? 'none' : 'auto',  // Disable pointer events when loading
              mb: 3,
            }}
          >
            <Grid container spacing={2}
              sx={{ 
               
                opacity: isLoading ? 0.5 : 1,                // Apply opacity when loading
                pointerEvents: isLoading ? 'none' : 'auto',  // Disable pointer events when loading
            }}>
            <Grid item xs={12} lg={12}
              sx={{ 
               
                opacity: isLoading ? 0.5 : 1,                // Apply opacity when loading
                pointerEvents: isLoading ? 'none' : 'auto',  // Disable pointer events when loading
            }}>
  {searchType === 'description' ? (
    <>
      <Typography variant="h6" gutterBottom>
        Descriptions
      </Typography>
      {/* Your existing code to display descriptions */}
    </>
  ) : (
    <Typography variant="body1" color="textSecondary">
      Descriptions unavailable
    </Typography>
  )}
</Grid>
              <Grid item xs={6} lg={6}
                sx={{ 
               
                  opacity: isLoading ? 0.5 : 1,                // Apply opacity when loading
                  pointerEvents: isLoading ? 'none' : 'auto',  // Disable pointer events when loading
              }}>
                <TextField
                    fullWidth
                    label="Title"
                    variant="outlined"
                    value={searchType === 'product' ? '' : titleQuery}
                    onChange={(e) => setTitleQuery(e.target.value)}
                    sx={{
                        mb: 2,
                        backgroundColor: searchType === 'product' ? '#f5f5f5' : 'inherit', // Light gray background when disabled
                        '& .MuiInputBase-input': {
                            color: searchType === 'product' ? 'rgba(0, 0, 0, 0.5)' : 'inherit', // Gray text when disabled
                        }
                    }}
                    disabled={searchType === 'product'}
                />
            </Grid>
            <Grid item xs={6} lg={6}
              sx={{ 
               
                opacity: isLoading ? 0.5 : 1,                // Apply opacity when loading
                pointerEvents: isLoading ? 'none' : 'auto',  // Disable pointer events when loading
            }}>
                <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    value={searchType === 'product' ? '' : descriptionQuery}
                    onChange={(e) => setDescriptionQuery(e.target.value)}
                    sx={{
                        mb: 2,
                        backgroundColor: searchType === 'product' ? '#f5f5f5' : 'inherit', // Light gray background when disabled
                        '& .MuiInputBase-input': {
                            color: searchType === 'product' ? 'rgba(0, 0, 0, 0.5)' : 'inherit', // Gray text when disabled
                        }
                    }}
                    disabled={searchType === 'product'}
                />
            </Grid>
              <Grid item xs={6} lg={6}
                sx={{ 
               
                  opacity: isLoading ? 0.5 : 1,                // Apply opacity when loading
                  pointerEvents: isLoading ? 'none' : 'auto',  // Disable pointer events when loading
              }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
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
                  onClick={handleSearch}
                  startIcon={<Icons.Search />}
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </Grid>
              <Grid item xs={6} lg={4}
                sx={{ 
               
                  opacity: isLoading ? 0.5 : 1,                // Apply opacity when loading
                  pointerEvents: isLoading ? 'none' : 'auto',  // Disable pointer events when loading
              }}>
            <Box p={0.5}
              sx={{ 
               
                opacity: isLoading ? 0.5 : 1,                // Apply opacity when loading
                pointerEvents: isLoading ? 'none' : 'auto',  // Disable pointer events when loading
            }}>
                <ToggleButtonGroup
                    value={searchType}
                    exclusive
                    onChange={handleSearchTypeChange}
                    aria-label="search type"
                >
                    <ToggleButton
                        value="description"
                        aria-label="search descriptions"
                        sx={{
                            backgroundColor: searchType === 'description' ? lightGreen[200] : 'inherit',
                            '&.Mui-selected': {
                                backgroundColor: lightGreen[200],
                                color: 'black',
                            },
                            '&:hover': {
                                backgroundColor: lightGreen[100],
                            }
                        }}
                    >
                        Search Descriptions
                    </ToggleButton>
                    <ToggleButton
                        value="product"
                        aria-label="search products"
                        sx={{
                            backgroundColor: searchType === 'product' ? lightBlue[200] : 'inherit',
                            '&.Mui-selected': {
                                backgroundColor: lightBlue[200],
                                color: 'black',
                            },
                            '&:hover': {
                                backgroundColor: lightBlue[100],
                            }
                        }}
                    >
                        Search Products
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Grid>
            </Grid>
          </Box>
          <Grid container spacing={3}>
  <Grid item xs={10} lg={10}>
    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="searchResults" mb="5px">
      Search Results
    </Typography>

  </Grid>
  <Grid item xs={2} lg={2}>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        component="label"
        htmlFor="searchResults"
        mb="5px"
        sx={{ color: 'lightgray' }} // Light gray for the label
      >
        Execution time :
      </Typography>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        component="span"
        sx={getExecutionTimeStyle()} // Apply conditional styling
      >
        {executiontime} ms
      </Typography>
    </Grid>
  <Grid item xs={12} lg={12}>
  {searchType === 'product' ? (
  products.map(product => (
    <Card
      key={product.id}
      sx={{
        mb: 2,
        backgroundColor: selectedProducts.has(product._id) ? 'lightgreen' : 'transparent',
        cursor: 'pointer',
        boxShadow: 3,
        transition: 'background-color 0.3s ease',
      }}
      onClick={() => handleSelect(product._id)}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
           <Link href={`/pages/products/${product.id}`} passHref>
          <Button
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            borderRadius: '16px',
            padding: '4px 8px',
            marginRight: '8px',
            cursor: 'pointer',
            width: 'fit-content', // Ensure the pill takes up only as much space as needed
            '&:hover': {
              backgroundColor: 'blue', // Keep the same color on hover
              borderRadius: '10px', // Maintain the same border radius on hover
              boxShadow: 'none', // Remove any box shadow on hover if present
            },
          }}
          
            onClick={() => handleProductClick(product.id)}
          >
            {product.id}
          </Button></Link>
          {product.productName}
        </Typography>
      </CardContent>
    </Card>
  ))
) : (
      descriptions.map(desc => (
        <Card
        key={desc._id}
        sx={{
          mb: 2,
          backgroundColor: selectedDescriptions.has(desc._id) ? 'lightgreen' : 'transparent',
          cursor: 'pointer',
          boxShadow: 3,
          transition: 'background-color 0.3s ease',
        }}
        onClick={() => handleSelect(desc._id)}
      >
        <CardContent>
          <Grid xs={6}lg={3}>
          <Link href={`/pages/products/${desc.productDetails?.productid}`} passHref>
          <Button
  sx={{
    backgroundColor: 'primary.main',
    width: 'auto', // Make width flexible
    maxWidth: '100px', // Limit width
    color: 'white',
    borderRadius: '16px', // Ensure the button is rounded
    padding: '4px 8px',
    marginRight: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    overflow: 'hidden', // Ensure text does not overflow
    textOverflow: 'ellipsis', // Add ellipsis for overflow text
    whiteSpace: 'nowrap', // Prevent text from wrapping
    textDecoration: 'none', // Remove underline
    '&:hover': {
      backgroundColor: 'blue', // Keep the same color on hover
              borderRadius: '10px', // Maintain the same border radius on hover
              boxShadow: 'none', // Remove any box shadow on hover if present

    },
  }}
  
  onClick={() => {
    const productId = desc.productDetails?.productid;
    if (productId) {
      handleProductClick(productId);
    }
  }}
>
  {desc.productDetails?.productid || 'N/A'}
</Button></Link>

         
          </Grid>
          <Divider sx={{ my: 1 }} />
          {criteria !== 'description' && (
            <>
              <Typography
                variant="h6"
                component="div"
                dangerouslySetInnerHTML={{
                  __html: highlightText(desc.title, titleQuery),
                }}
              />
              <Divider sx={{ my: 1 }} />
            </>
          )}
          {criteria !== 'title' && (
            <Typography
              variant="body1"
              component="div"
              dangerouslySetInnerHTML={{
                __html: highlightText(desc.description, descriptionQuery),
              }}
            />
          )}
        </CardContent>
        </Card>
      ))
    )}
  </Grid>
</Grid>
       
    <Button
                    variant="contained"
                    size="large"
                    
                   
                    sx={{ 
                      position: 'fixed', bottom: 16, right: 16,
                        padding: '13px',
                        
                        backgroundColor: isLoading ? 'gray' : 'primary.main',
                        borderRadius: '7px', 
                        '&:hover': {
                          backgroundColor: isLoading ? 'gray' : 'blue',
                            borderRadius: '6px',
                        },
                    }}
                    onClick={handleConfirmSelection}
                    startIcon={isLoading ? null : <Icons.Check />} // Remove icon when loading
                    disabled={isLoading} // Disable button when loading
                >
                    {isLoading ? 'Modifying...' : 'Confirm Selection'}
                </Button>
          <Card
            sx={{
              position: 'fixed',
              bottom: 75,
              right: 16,
              zIndex: 1000,
              minWidth: 80,
              boxShadow: 3,
              p: 2,
            }}
          >

            <CardContent
           >
              <Box display="flex" flexDirection="column"
                 sx={{ 
               
                  opacity: isLoading ? 0.5 : 1,                // Apply opacity when loading
                  pointerEvents: isLoading ? 'none' : 'auto',  // Disable pointer events when loading
              }}>
                <Box display="flex" alignItems="center">
                  <Typography variant="h6" gutterBottom marginRight={2}>
                    Summary
                  </Typography>
                  <IconButton onClick={toggleCardExpansion}>
                    {isCardExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
                {isCardExpanded && (
                  <Box marginTop={2}>
                    <Typography variant="body1">
                    Selected Items: {searchType === 'product' ? selectedProducts.size : selectedDescriptions.size}

                    </Typography>
                    <Typography variant="body1">
                      Total Items: {count}
                    </Typography>
                   
                    <Box display="flex" flexDirection="column" mt={2}>
                      <TextField
                        fullWidth
                        label="Name to be replaced"
                        variant="outlined"
                        value={nameToBeReplaced}
                        onChange={(e) => setNameToBeReplaced(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="New name"
                        variant="outlined"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                     {searchType !== 'product' && (
    <Grid item xs={12} lg={12}>
      <TextField
        fullWidth
        label="Criteria"
        variant="outlined"
        select
        value={criteria}
        onChange={(e) => setCriteria(e.target.value as 'title' | 'description' | 'both')}
        sx={{ mb: 2 }}
      >
        <MenuItem value="title">Title</MenuItem>
        <MenuItem value="description">Description</MenuItem>
        <MenuItem value="both">Both</MenuItem>
      </TextField>
    </Grid>
  )}
                      <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="outlined" color="secondary" onClick={handleResetSelection}>
                          Reset
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSelectAll}>
                          Select All
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
         </PageContainer>
    </PageContainer>  </>
  );
};

export default SearchComponent;
