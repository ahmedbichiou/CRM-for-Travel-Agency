'use client';
import React, { useEffect, useState } from 'react';
import { Grid, Typography, Autocomplete, TextField, Button, Alert, IconButton, Snackbar } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Editor } from '@tinymce/tinymce-react';
import { createGeneralDescription } from '@/app/services/GeneraldescriptionService';
import * as Icons from '@mui/icons-material';
import { fetchProductLocations } from '@/app/services/ManageOthersSerivce';
import { useRouter } from 'next/navigation';
const DescriptionsADD = () => {

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
  const [typeOptions, setTypeOptions] = useState<{ label: string; value: string }[]>([]);
  const [title, setTitle] = useState<string>('');
  const [attributionType, setAttributionType] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => 
    
    
    {
      setTitle(e.target.value);
      resetError("title");

    }
  const handleAttributionTypeChange = (event: React.SyntheticEvent, value: string | null) => {
    setAttributionType(value);
  };

  const handleTypeChange = (event: React.SyntheticEvent, value: string | null) => setType(value);


  const resetError = (field: string) => {
    setFormErrors((prevErrors) => {
        const { [field]: _, ...remainingErrors } = prevErrors;
        return remainingErrors;
    });
};



  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let errors: Record<string, string> = {};
    if (!title) errors.title= 'Descrption title is required.';

    
    
    if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
    } 


    const generalDescriptionData = {
       title:title,
       attributionType: attributionType,
       type: type,
        texte:text,
    };

    try {
        // Log the data being sent
        console.log('Submitting data:', generalDescriptionData);

        // Call the createGeneralDescription function
        const response = await createGeneralDescription(generalDescriptionData);

        // Handle successful creation
        setOpenSnackbar(true);
        console.log('Response:', response);

        // Reset form fields
        setTitle('');
        setAttributionType(null);
        setType(null);
        setText('');
    } catch (error) {
        // Handle errors
        console.error('Error creating general description:', error);
        setOpenSnackbar2(true);
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
  
useEffect(() => {
  const loadCountries = async () => {
    if (attributionType === 'Specific country or city description') {
      setLoading(true);
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
        setLoading(false);
      }
    } else {
      // Clear typeOptions if attributionType is not 'Specific Country Description'
      setTypeOptions([]);
    }
  };

  loadCountries();
}, [attributionType]);

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
            General description successfully inserted!
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
        Error inserting general description
    </Alert>
</Snackbar>
    <PageContainer title="Add Description" description="Create a new general description">
      <DashboardCard title="Add New Description">
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

          <Grid item xs={6} lg={6}>
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

          <Grid item xs={6} lg={6}>
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
          <Grid item xs={12} lg={8}> </Grid>
          <Grid item xs={12} lg={4}>
           
            <Button
                        color="success"
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<Icons.Add />}
                        onClick={handleSubmit}  // Attach handleSubmit to onClick event
                    >
                        Add Generic description
                    </Button>
          </Grid>
        </Grid>
      </DashboardCard>
    </PageContainer></div>
  );
};

export default DescriptionsADD;
