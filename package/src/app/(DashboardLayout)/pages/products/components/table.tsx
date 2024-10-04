import * as Icons from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Snackbar,
    Alert,
    Paper,
    TableContainer,
    TablePagination,
    Chip,
    Grid,
    Autocomplete,
    Collapse,
    Button,
    TextField
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)//components/shared/DashboardCard';
import { fetchProducts, deleteProduct, fetchProductsPagination, fetchProductsBySearch } from '@/app/services/GeneralproductSerivce';
import Link from 'next/link';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { fetchProductLocations, fetchProductStatuses, fetchProductSubTypes, fetchProductTypes } from '@/app/services/productService';
import { fetchFournisseurs } from '@/app/services/fournisseurService';
import { fetchPensions } from '@/app/services/pensionService';
interface ProductLocation {
    _id: string;
    type: string;
    name: string;
    __v: number;
}

interface Product {
    _id: string;
    id: string;
    fournisseur:  { _id: string; name: string;reference: string } | null;
    productName: string;
    productType: { _id: string; name: string } | null;
    productSubType: { _id: string; name: string } | null;
    productStatus: { _id: string; name: string } | null;
    creationDate: string;
    productLocation: ProductLocation[]; // Ensure this is an array
}
const ListSearch = () => {


//search

const [fournisseur, setfournisseur] = useState<string | null>(null);
const [id, setId] = useState<string>('');
const [productName, setProductName] = useState<string>('');
const [productType, setProductType] = useState<string | null>(null);
const [productLocation, setProductLocation] = useState<string | null>(null);
const [productStatus, setProductStatus] = useState<string | null>(null);
const [productSubType, setProductSubType] = useState<string | null>(null);



//handlers
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
const cellStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',  // Allows text to wrap and overlap
    wordBreak: 'break-word' // Break long words to fit in container
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

const toggleExpanded = () => {
    setExpanded(prev => !prev);
    if(expanded)
    {
        setProductType(null)
        setProductLocation(null)
        setProductStatus(null)
        setProductSubType(null)
        setfournisseur(null);
    }

  };

//handlers


const [products, setProducts] = useState<Product[]>([]);












//AUTOCOMPLETE OPTIONS FETCHINGS
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
// END  AUTOCOMPLETE OPTIONS FETCHINGS


const [expanded, setExpanded] = useState(false);

useEffect(() => {
fetchOptions();
}, []);
//search 
   


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openSnackbar2, setOpenSnackbar2] = useState(false);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const handleSubmit = async () => {
        // Declare mutable variables to track changes
        let changeid = false;
        let changeproductName = false;
        let changeproductType = false;
        let changeProductLocation = false;
        let changeproductStatus = false;
        let changeproductSubType = false;
        let changeFournisseur = false;
    
        const initial: Product = {
            _id: '',
            id: '',
            productName: '',
            productType: null,
            fournisseur: null,
            productSubType: null,
            productStatus: null,
            creationDate: '',
            productLocation: [] // Initialize as an empty array
        };
    
        if (id !== initial?.id) {
            changeid = true;
        }
        if (productName !== initial?.productName) {
            changeproductName = true;
        }
        if (productType !== initial?.productType) {
            changeproductType = true;
        }
        if (productLocation !== (initial.productLocation.length > 0 ? initial.productLocation[0].name : null)) {
            changeProductLocation = true;
        }
        if (productStatus !== initial?.productStatus) {
            changeproductStatus = true;
        }
        if (productSubType !== initial?.productSubType) {
            changeproductSubType = true;
        }
        if (fournisseur !== initial.fournisseur?.name) {
            changeFournisseur = true;
        }
    
        if (
            !changeid &&
            !changeproductName &&
            !changeproductType &&
            !changeProductLocation &&
            !changeproductStatus &&
            !changeproductSubType &&
            !changeFournisseur
        ) {
            getProducts();
            return;
        }
    
        // Build the search criteria object, excluding null or undefined values
        const searchCriteria: Record<string, string | undefined> = {};
        if (changeid) searchCriteria.id = id;
        if (changeproductName) searchCriteria.productName = productName;
        if (changeproductType && productType) searchCriteria.productType = productType;
        if (changeProductLocation && productLocation) searchCriteria.productLocation = productLocation;
        if (changeproductStatus && productStatus) searchCriteria.productStatus = productStatus;
        if (changeproductSubType && productSubType) searchCriteria.productSubType = productSubType;
        if (changeFournisseur && fournisseur) searchCriteria.fournisseur = fournisseur;
    
        try {
            // Fetch products based on search criteria and pagination
            const response = await fetchProductsBySearch(searchCriteria, page + 1, rowsPerPage);
            console.log("search results");
            console.log(response);
            setProducts(response.products);
            setTotalProducts(response.totalProducts);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    

    const getProducts = async () => {
        try {
            const data = await fetchProductsPagination(page + 1, rowsPerPage); 
            setProducts(data.products);
            console.log(data.products);
            setTotalProducts(data.totalProducts);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to get products:', error);
        }
    };

  
    useEffect(() => {
        handleSubmit();
    }, [page, rowsPerPage]);
    
    const handleCloseSnackbar2 = () => {
        setOpenSnackbar2(false);
    };

    const handleDelete = async (productId: string,product_id : string ) => {
        if (confirm('Are you sure you want to delete this product?')) {
        try {
            await deleteProduct(productId,product_id);
            await getProducts(); // Refresh the list
            setOpenSnackbar2(true);
        } catch (error) {
            console.error('Failed to delete product', error);
        } }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (

        <Grid container spacing={2}>
                {/* ID */}
                <Grid item xs={12} lg={12}>
  <DashboardCard title="Search products">
        <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
            <Grid container spacing={2}>
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


                {!expanded ? (
    <>
        <Grid item xs={6} lg={2}>
            <Box mt={3.5}>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                     onClick={async () => {
                        await handleSubmit();
                        setPage(0); 
                    }}
                    type="submit"
                    startIcon={<Icons.Search />}
                >
                    Search
                </Button>
            </Box>
        </Grid>

        <Grid item xs={6} lg={2}>
            <Box mt={3.5}>
                <Button
                    color="success"
                    variant="contained"
                    size="large"
                    fullWidth
                    href="/pages/products/addproducts"
                    startIcon={<Icons.Add />}
                >
                    Add Product
                </Button>
            </Box>
        </Grid>
    </>
) : (
    <Grid item xs={10} lg={4} >
        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="productLocation" mb="5px">
                                Product Location
                            </Typography>
                            <Autocomplete
                                disablePortal
                                options={productLocationNameOptions}
                                value={productLocation}
                                onChange={handleProductLocationChange}
                                renderInput={(params) => <TextField {...params} />}
                            />
        </Grid>
)}
            {expanded ?    <Grid item xs={1} lg={2} /> : <Grid item xs={5.6} lg={2} /> }
                                {/* Expand/Collapse Button */}
                                <Grid item xs={1} lg={1}>
                                {!expanded ?        
                     <Box mt={3.5} onClick={() => toggleExpanded()}>
                    <Icons.ExpandMoreOutlined sx={{ fontSize: '2rem', width: '2rem', height: '2rem' }} /></Box>: <Grid item xs={1} lg={1}></Grid>
                    }
                </Grid></Grid>
                {/* Collapsible Fields */}
                <Collapse in={expanded}>
                    <Grid container spacing={2}  paddingTop='2px'>
                        {/* Product Type */}
                        <Grid item xs={6} lg={3}>
                            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="productType" >
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
                                                {/* Product Status */}
                                                <Grid item xs={6} lg={3}>
                            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="productStatus" mb="5px">
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
                        <Grid item xs={0} lg={3}></Grid>
                        <Grid item xs={0} lg={8}></Grid>
                         {/*add */}
                        <Grid item xs={5} lg={2}>
            <Box mt={3.5}>
                <Button
                    color="success"
                    variant="contained"
                    size="large"
                    fullWidth
                    href="/pages/products/addproducts"
                    startIcon={<Icons.Add />}
                >
                    Add Product
                </Button>
            </Box>
        </Grid>
         {/*search */}
                        <Grid item xs={5} lg={2}>
            <Box mt={3.5}>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={async () => {
                        await handleSubmit();
                        setPage(0); 
                    }}
                    type="submit"
                    startIcon={<Icons.Search />}
                >
                    Search
                </Button>
            </Box>
        </Grid>
        <Grid item xs={0} lg={7}></Grid>
        <Grid item xs={6} lg={1}>
        {expanded ?        
                     <Box mt={3.5} onClick={() => toggleExpanded()}>
                    <Icons.ExpandLessOutlined sx={{ fontSize: '2rem', width: '2rem', height: '2rem' }} /></Box>: <Grid item xs={1} lg={1}></Grid>
                    }</Grid>
                    </Grid>
                </Collapse>


            
        </Box>
    </DashboardCard>

</Grid> <Grid item xs={12} lg={12}>
        <DashboardCard title={`List of Products`}>
        <Box sx={{ height: '100%', overflow: 'hidden', width: { xs: '280px', sm: 'auto' } }}>
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
                    Product Deleted!
                </Alert>
            </Snackbar>
            <Paper sx={{ height: 'calc(100% - 64px)', overflow: 'auto' }}>
                <TableContainer sx={{ maxHeight: 'calc(100% - 80px)', overflow: 'auto' }}>
                    <Table stickyHeader aria-label="sticky table"
                       sx={{
                        whiteSpace: "nowrap",
                        mt: 2,
                        minWidth: 800
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Product Code
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Product Name
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Product Type
                                        <br />
                                        Product Sub-Type
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Localization
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Creation Date
                                    </Typography>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Modification Date
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Status
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Actions
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product: any) => (
                                <TableRow key={product.id} sx={{ borderBottom: '2px solid #ddd' }}>
                                    
                                    <TableCell>
                                        <Link href={`/pages/products/${product.id}`} passHref>
                                            <Box
                                                sx={{
                                                    display: 'inline-block',
                                                    padding: '8px 16px',
                                                    borderRadius: '4px',
                                                    backgroundColor: 'pastelgray.main',
                                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                                    textDecoration: 'none',
                                                    transition: 'background-color 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'pastelBlue.dark',
                                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                    },
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: "15px",
                                                        fontWeight: "500",
                                                        cursor: 'pointer',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {product.id}
                                                </Typography>
                                            </Box>
                                        </Link>
                                    </TableCell>
                                    <TableCell sx={cellStyle}>
            <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                {product.productName}
            </Typography>
        </TableCell>
                                    <TableCell>
                                        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                            {product.productType.name}
                                        </Typography>
                                        <Box
                                            sx={{
                                                backgroundColor: 'lightblue',
                                                borderRadius: '4px',
                                                padding: '4px 8px',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                                display: 'inline-block',
                                            }}
                                        >
                                            <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                                {product.productSubType.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {product.productLocation.length === 0 ? (
                                            <Box></Box>
                                        ) : (
                                            product.productLocation.map((location: { _id: React.Key | null | undefined; type: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }) => (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        paddingTop: '3px',
                                                        gap: 1,
                                                    }} key={location._id}
                                                >
                                                    <Box>
                                                        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                                            {location.name}
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            backgroundColor: 'gray',
                                                            borderRadius: '4px',
                                                            padding: '2px 6px',
                                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                                            color: '#fff',
                                                            mr: 1,
                                                        }}
                                                    >
                                                        <Typography variant="caption" fontWeight={500}>
                                                            {location.type}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ))
                                        )}
                                    </TableCell>
                                    <TableCell>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    {product.creationDate && !isNaN(new Date(product.creationDate).getTime()) && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                backgroundColor: '#e0f7fa',
                                                borderRadius: '4px',
                                                padding: '4px 8px',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                                color: '#00796b',
                                                marginBottom: '10px'
                                            }}
                                        >
                                           <Icons.Construction sx={{ color:  '#00796b'}} />
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    gap: 1,
                                                    ml: 1
                                                }}
                                            >
                                                <Typography variant="caption" fontWeight={400} color="inherit">
                                                    {new Date(product.creationDate).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="caption" fontWeight={400} color="inherit">
                                                    {new Date(product.creationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
    
                                    {product.lastEditDate && !isNaN(new Date(product.lastEditDate).getTime()) && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                backgroundColor: '#dcedc8',
                                                borderRadius: '4px',
                                                padding: '4px 8px',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                                color: '#388e3c',
                                            }}
                                        ><Icons.Edit sx={{ color: '#388e3c' }} />
                                            
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    gap: 1,
                                                    ml: 1
                                                }}
                                            >
                                                <Typography variant="caption" fontWeight={400} color="inherit">
                                                    {new Date(product.lastEditDate).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="caption" fontWeight={400} color="inherit">
                                                    {new Date(product.lastEditDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </TableCell>
                                    <TableCell>
                                    <Chip
                                        sx={{
                                            px: "4px",
                                            backgroundColor: product.productStatus.name === 'Actif' ? 'success.main' : 'error.main',
                                            color: "#fff",
                                        }}
                                        size="small"
                                        label={product.productStatus.name}
                                    />
                                </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleDelete(product.id,product._id)} color="inherit" size="small">
                                            <Icons.Delete fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalProducts} // Set total count of items here
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Paper>
        </Box>
    </DashboardCard></Grid></Grid>
    
    );
};

export default ListSearch;
