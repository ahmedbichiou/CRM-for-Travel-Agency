'use client';
import { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, TextField, Card, CardContent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar, Alert } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Icons from '@mui/icons-material';
import { addProductSubType, addProductType, deleteProductSubType, deleteProductType, fetchProductSubTypes, fetchProductTypes } from '@/app/services/producttypesService';
import { addFournisseur, addPension, addProductLocation, deleteFournisseur, deletePension, deleteProductLocation, fetchPensions, fetchProductLocations } from '@/app/services/ManageOthersSerivce';
import { fetchFournisseurs } from '@/app/services/fournisseurService';
import { useRouter } from 'next/navigation';


// Define the TypeScript types for Product Type, Subtype, Pension, Location, and Fournisseur
interface ProductType {
  _id: string;
  name: string;
}

interface ProductSubType {
  _id: string;
  name: string;
}

interface Pension {
  _id: string;
  name: string;
}

interface ProductLocation {
  _id: string;
  type: string;
  name: string;
}

interface Fournisseur {
  _id: string;
  name: string;
  reference: string;
}

const Manage = () => {
  // States for Product Types
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [newType, setNewType] = useState<string>('');

  // States for Product Subtypes
  const [productSubTypes, setProductSubTypes] = useState<ProductSubType[]>([]);
  const [newSubType, setNewSubType] = useState<string>('');

  // States for Pensions
  const [pensions, setPensions] = useState<Pension[]>([]);
  const [newPension, setNewPension] = useState<string>('');

  // States for Product Locations
  const [locations, setLocations] = useState<ProductLocation[]>([]);
  const [newLocationName, setNewLocationName] = useState<string>('');
  const [newLocationType, setNewLocationType] = useState<string>('');

  // States for Fournisseurs
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [newFournisseurName, setNewFournisseurName] = useState<string>('');
  const [newFournisseurReference, setNewFournisseurReference] = useState<string>('');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setProductTypes(await fetchProductTypes());
      setProductSubTypes(await fetchProductSubTypes());
      setPensions(await fetchPensions());
      setLocations(await fetchProductLocations());
      setFournisseurs(await fetchFournisseurs());
    };
    fetchData();
  }, []);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbar2, setOpenSnackbar2] = useState(false);
  const [openSnackbar3, setOpenSnackbar3] = useState(false);

  const handleCloseSnackbar = () => setOpenSnackbar(false);
  const handleCloseSnackbar2 = () => setOpenSnackbar2(false);
  const handleCloseSnackbar3 = () => setOpenSnackbar3(false);

  // Handle adding a new Product Type
  const handleAddType = async () => {
    if (newType.trim()) {
      const addedType = await addProductType(newType);
      setProductTypes([...productTypes, addedType]);
      setOpenSnackbar(true);
      setNewType('');
    }
  };

  // Handle deleting a Product Type
  const handleDeleteType = async (id: string) => {
    await deleteProductType(id);
    setProductTypes(productTypes.filter((type) => type._id !== id));
    setOpenSnackbar2(true);
  };

  // Handle adding a new Product Subtype
  const handleAddSubType = async () => {
    if (newSubType.trim()) {
      const addedSubType = await addProductSubType(newSubType);
      setProductSubTypes([...productSubTypes, addedSubType]);
      setNewSubType('');
      setOpenSnackbar(true);
    }
  };

  // Handle deleting a Product Subtype
  const handleDeleteSubType = async (id: string) => {
    await deleteProductSubType(id);
    setProductSubTypes(productSubTypes.filter((subType) => subType._id !== id));
    setOpenSnackbar2(true);
  };

  // Handle adding a new Pension
  const handleAddPension = async () => {
    if (newPension.trim()) {
      const addedPension = await addPension(newPension);
      setPensions([...pensions, addedPension]);
      setNewPension('');
      setOpenSnackbar(true);
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
  // Handle deleting a Pension
  const handleDeletePension = async (id: string) => {
    await deletePension(id);
    setPensions(pensions.filter((pension) => pension._id !== id));
    setOpenSnackbar2(true);
  };

  // Handle adding a new Product Location
  const handleAddLocation = async () => {
    if (newLocationName.trim() && newLocationType.trim()) {
      const addedLocation = await addProductLocation(newLocationType, newLocationName);
      setLocations([...locations, addedLocation]);
      setNewLocationName('');
      setNewLocationType('');
      setOpenSnackbar(true);
    }
  };

  // Handle deleting a Product Location
  const handleDeleteLocation = async (id: string) => {
    await deleteProductLocation(id);
    setLocations(locations.filter((location) => location._id !== id));
    setOpenSnackbar2(true);
  };

  // Handle adding a new Fournisseur
  const handleAddFournisseur = async () => {
    if (newFournisseurName.trim() && newFournisseurReference.trim()) {
      const addedFournisseur = await addFournisseur(newFournisseurName, newFournisseurReference);
      setFournisseurs([...fournisseurs, addedFournisseur]);
      setNewFournisseurName('');
      setNewFournisseurReference('');
      setOpenSnackbar(true);
    }
  };

  // Handle deleting a Fournisseur
  const handleDeleteFournisseur = async (id: string) => {
    await deleteFournisseur(id);
    setFournisseurs(fournisseurs.filter((fournisseur) => fournisseur._id !== id));
    setOpenSnackbar2(true);
  };

  return (
    <PageContainer title="Manage Product Types, Subtypes, Locations, Pensions, and Fournisseurs" description="Manage various entities">
      <Box>
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
            Successfully added!
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
            Deleted
          </Alert>
        </Snackbar>
        <Snackbar
          open={openSnackbar3}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar3}
          sx={{ zIndex: 1400 }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar3} 
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
            Successfully added!
          </Alert>
        </Snackbar>
        <Grid container spacing={1}>
          {/* Product Types Section */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight={600} component="label" mb="20px">
                      Product Types
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      color="success"
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<Icons.EditNoteOutlined/>}
                      onClick={handleAddType}
                      sx={{ mt: 2 }}
                    >
                      Add Product Type
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {productTypes.map((type) => (
                            <TableRow key={type._id}>
                              <TableCell style={{ fontSize: '0.9rem' }}>{type.name}</TableCell>
                              <TableCell align="right">
                            {/*   <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteType(type._id)}>
                                  <DeleteIcon /> 
                                </IconButton>*/}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Product Subtypes Section */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight={600} component="label" mb="20px">
                      Product Subtypes
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      value={newSubType}
                      onChange={(e) => setNewSubType(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      color="success"
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<Icons.EditNoteOutlined/>}
                      onClick={handleAddSubType}
                      sx={{ mt: 2 }}
                    >
                      Add Product Subtype
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {productSubTypes.map((subType) => (
                            <TableRow key={subType._id}>
                              <TableCell style={{ fontSize: '0.9rem' }}>{subType.name}</TableCell>
                              <TableCell align="right">
                               
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* Fournisseurs Section */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12} lg={12}>
                    <Typography variant="h6" fontWeight={600} component="label" mb="20px">
                      Fournisseurs
                    </Typography>
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <TextField
                    label="Fournisseur Reference"
                      variant="outlined"
                      value={newFournisseurReference}
                      onChange={(e) => setNewFournisseurReference(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} lg={8}>
                    <TextField
                    label="Fournisseur Name"
                      variant="outlined"
                      value={newFournisseurName}
                      onChange={(e) => setNewFournisseurName(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                
                  <Grid item xs={12} lg={12}>
                    <Button 
                      color="success"
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<Icons.EditNoteOutlined/>}
                      onClick={handleAddFournisseur}
                      sx={{ mt: 2 }}
                    >
                      Add Fournisseur
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                          <TableCell style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Ref</TableCell>
                            <TableCell style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {fournisseurs.map((fournisseur) => (
                            <TableRow key={fournisseur._id}>
                              <TableCell style={{ fontSize: '0.9rem' }}>{fournisseur.reference}</TableCell>
                              <TableCell style={{ fontSize: '0.9rem' }}>{fournisseur.name}</TableCell>
                              <TableCell align="right">
                              
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* Pensions Section */}
 <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight={600} component="label" mb="20px">
                      Pensions
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      value={newPension}
                      onChange={(e) => setNewPension(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      color="success"
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<Icons.EditNoteOutlined/>}
                      onClick={handleAddPension}
                      sx={{ mt: 2 }}
                    >
                      Add Pension
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pensions.map((pension) => (
                            <TableRow key={pension._id}>
                              <TableCell style={{ fontSize: '0.9rem' }}>{pension.name}</TableCell>
                              <TableCell align="right">
                              
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Product Locations Section */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight={600} component="label" mb="20px">
                      Product Locations
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Location Type"
                      variant="outlined"
                      value={newLocationType}
                      onChange={(e) => setNewLocationType(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Location Name"
                      variant="outlined"
                      value={newLocationName}
                      onChange={(e) => setNewLocationName(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      color="success"
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<Icons.EditNoteOutlined/>}
                      onClick={handleAddLocation}
                      sx={{ mt: 2 }}
                    >
                      Add Product Location
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {locations.map((location) => (
                            <TableRow key={location._id}>
                              <TableCell style={{ fontSize: '0.9rem' }}>{location.name}</TableCell>
                              <TableCell style={{ fontSize: '0.9rem' }}>{location.type}</TableCell>
                              <TableCell align="right">
                            
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>


        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Manage;
