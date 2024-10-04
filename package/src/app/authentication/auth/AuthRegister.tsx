'use client';
import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Snackbar, Alert, IconButton } from '@mui/material';
import { Stack } from '@mui/system';
import { URLPORT } from '@/app/services/URL';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Icons from '@mui/icons-material';
interface AuthLoginProps {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
  }
const Register: React.FC<AuthLoginProps> = ({ title, subtitle, subtext }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbar2, setOpenSnackbar2] = useState(false);
  const router = useRouter();

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseSnackbar2 = () => {
    setOpenSnackbar2(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!username || !email || !password) {
      setError('All fields are required.');
      setOpenSnackbar2(true);
      return;
    }

    try {
      const response = await fetch(`${URLPORT}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push('/authentication/login');
        }, 2000); // 2000 milliseconds = 2 seconds
      } else {
        const errorData = await response.json();
        setError(`${errorData.msg}`);
        setOpenSnackbar2(true);
      }
    } catch (error) {
      console.error(error);
      setError('Error registering user');
      setOpenSnackbar2(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box>
          <Stack mb={3}>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="username" mb="5px">
              Username
            </Typography>
            <TextField
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              fullWidth
            />

            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email" mb="5px" mt="25px">
              Email Address
            </Typography>
            <TextField
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              fullWidth
              error={!!error && !email} // Show error if email is empty
              helperText={!!error && !email ? 'Email is required' : ''} // Show helper text if email is empty
            />

            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px" mt="25px">
              Password
            </Typography>
            <TextField
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              fullWidth
              error={!!error && !password} // Show error if password is empty
              helperText={!!error && !password ? 'Password is required' : ''} // Show helper text if password is empty
            />
          </Stack>
          <Button color="primary" variant="contained" size="large" fullWidth type="submit">
            Sign Up
          </Button>
        </Box>
      </form>
      <Box
        mt={1}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginTop: '50px', // Centering adjustment
        }}
      >
        <Typography
          component={Link}
          href="/authentication/login"
          fontWeight="500"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
          }}
        >
          Already Have an account?
        </Typography>
      </Box>
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
          Account successfully created!
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
    </>
  );
};

export default Register;
