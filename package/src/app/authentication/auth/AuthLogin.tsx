'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Stack, TextField, Alert, IconButton, Snackbar } from '@mui/material';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { URLPORT } from '@/app/services/URL';
import { useRouter } from 'next/navigation';
import * as Icons from '@mui/icons-material';
import { error } from 'console';

interface AuthLoginProps {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin: React.FC<AuthLoginProps> = ({ title, subtitle, subtext }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbar2, setOpenSnackbar2] = useState(false);
  const [error, setError] = useState('');
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseSnackbar2 = () => {
    setOpenSnackbar2(false);
  };


  const router = useRouter(); 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(URLPORT+'/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push('/pages/products');
        }, 1000);
      
      } else {
        const errorData = await response.json();
       setError(`Error: ${errorData.msg}`);
       setOpenSnackbar2(true);
      }
    } catch (error) {
      console.error(error);
      setError('Error logging in');
      setOpenSnackbar2(true);
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
              color: 'white',
            },
            '& .MuiAlert-action': {
              color: 'white',
            },
          }}
        >
          Logged in successfully!
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
          {error}
        </Alert>
      </Snackbar>
  
    <form onSubmit={handleSubmit}>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      <Stack>
        <Box>
          <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="username" mb="5px">
            Username
          </Typography>
          <TextField id="username" value={username} onChange={(e) => setUsername(e.target.value)} variant="outlined" fullWidth />
        </Box>
        <Box mt="25px">
          <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px">
            Password
          </Typography>
          <TextField id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined" fullWidth />
        </Box>
        <Box mt="25px">
          <Button color="primary" variant="contained" size="large" fullWidth type="submit">
            Sign In
          </Button>
        </Box>
      </Stack>
      {subtitle}
    </form>  </>
  );
};

export default AuthLogin;
