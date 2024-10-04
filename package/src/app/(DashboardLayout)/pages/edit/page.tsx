'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Snackbar, Alert, Card, IconButton } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { useRouter } from 'next/navigation';
import { URLPORT } from '@/app/services/URL';
import * as Icons from '@mui/icons-material';
const EditProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState({ username: '', email: '', password: '', newPassword: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const [openSnackbar2, setOpenSnackbar2] = useState(false);
  const handleCloseSnackbar2 = () => {
      setOpenSnackbar2(false);
  };
  
      const [openSnackbar, setOpenSnackbar] = useState(false);


      const handleCloseSnackbar = () => {
          setOpenSnackbar(false);
      };
  // Fetch user information on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${URLPORT}/api/auth/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser({ ...data, password: '', newPassword: '' }); // Reset password fields
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URLPORT}/api/auth/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setSuccess('Profile updated successfully');
        setOpenSnackbar(true);
        // Optionally, redirect or refresh the data
      } else {
        setError('Error updating profile');
        setOpenSnackbar2(true);
      }
    } catch (err) {
      setError('Error updating profile');
      setOpenSnackbar2(true);
    }
  };

 

  if (loading) return <div>Loading...</div>;

  return (
    <PageContainer title="Edit Profile" description="Edit your profile information">
      <Card sx={{ p: 4, maxWidth: 600, margin: '0 auto' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Edit Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={user.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Current Password"
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={user.newPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Save Changes
          </Button>
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
                    Account successfully updated!
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
                {error}
            </Alert>
        </Snackbar>
      </Card>
    </PageContainer>
  );
};

export default EditProfile;
