'use client';
import { useEffect, useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert, Card, IconButton, CircularProgress } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import * as Icons from '@mui/icons-material';
import { URLPORT } from '@/app/services/URL';

const UploadFile = () => {

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        let interval: number | undefined;

        if (loading) {
            setProgress(20);
            interval = window.setInterval(() => {
                setProgress((prev) => {
                    if (prev < 90) {
                        return prev + 20; // Advance progress by 20% every 5 seconds
                    }
                    return prev;
                });
            }, 5000); // 5 seconds interval

            // Simulate finishing process (e.g., after 20 seconds)
            const timeout = window.setTimeout(() => {
                setLoading(false);
                setProgress(100);
                if (interval !== undefined) {
                    window.clearInterval(interval);
                }
            }, 20000); // Adjust the total loading time as needed

            return () => {
                if (interval !== undefined) {
                    window.clearInterval(interval);
                }
                window.clearTimeout(timeout);
            };
        } else if (interval !== undefined) {
            window.clearInterval(interval);
        }
    }, [loading]);


  const [file, setFile] = useState<File | null>(null);
 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbar2, setOpenSnackbar2] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleConfirm = async () => {
    if (!file) {
      setOpenSnackbar2(true);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(URLPORT+'/api/upload-xml', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let result: any;

    if (contentType && contentType.includes('application/json')) {
        result = await response.json();
    } else {
        // Handle non-JSON response
        const text = await response.text();
        throw new Error(`Unexpected response format: ${text}`);
    }

    console.log('API Result:', result);
    setOpenSnackbar(true);
} catch (error) {
    console.error('Error calling API:', error);
    setOpenSnackbar2(true);
} finally {
    setLoading(false);
}
};

  const handleCloseSnackbar = () => setOpenSnackbar(false);
  const handleCloseSnackbar2 = () => setOpenSnackbar2(false);

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
              color: 'white'
            },
            '& .MuiAlert-action': {
              color: 'white'
            }
          }}
        >
          Success
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
          Fail
        </Alert>
      </Snackbar>
      <PageContainer title="Upload File" description="Upload and process your XML file">
    <Card sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
        <Typography variant="h5" component="h2" gutterBottom>
            Upload Database XML
        </Typography>
        <Box
        
            sx={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f5f5f5',
                border: '2px dashed #ccc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
                position: 'relative',
            }}
        >
            <input
                type="file"
                accept=".xml"
                onChange={handleFileChange}
                disabled={loading}
                style={{
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    cursor: 'pointer',
                }}
            />
            <Icons.UploadFile sx={{ fontSize: 40, color: '#888' }} />
        </Box>
        {file && (
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Selected File:{file.name}
                </Typography>
            </Box>
        )}
        <Button
            color="success"
            variant="contained"
            size="large"
            fullWidth
            startIcon={<Icons.FileCopy />}
            onClick={handleConfirm}
            disabled={loading}
            sx={{ mt: 2 }}
        >
            {loading ? 'Processing...' : 'Upload to Database'}
        </Button>
        {loading && (
                    <Box sx={{ mt: 2, position: 'relative', width: '100%' }}>
                        <Box
                            sx={{
                                height: '5px',
                                width: '100%',
                                backgroundColor: '#f0f0f0',
                                position: 'relative',
                                mt: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    height: '100%',
                                    width: `${progress}%`, // Advance the width based on progress
                                    backgroundColor: '#3f51b5',
                                    transition: 'width 0.5s ease-in-out',
                                }}
                            />
                        </Box>
                    </Box>
                )}
    </Card>
</PageContainer>

    </>
  );
};

export default UploadFile;
