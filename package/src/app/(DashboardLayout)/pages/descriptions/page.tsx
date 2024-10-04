'use client';
import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { deleteGeneralDescription, getAllGeneralDescriptions } from '@/app/services/GeneraldescriptionService';
import * as Icons from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const styles = {
  content: {
      overflowWrap: 'break-word', // Allows long words to break and wrap onto the next line
      wordBreak: 'break-word',    // Ensures long words will break to prevent overflow
      whiteSpace: 'pre-wrap',     // Preserves whitespace and wraps text
      width: '80%',              // Ensures the content takes up the full width of the container
  },
};
const Descriptions = () => {
  const [descriptions, setDescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getDescriptions = async () => {
      try {
        const data = await getAllGeneralDescriptions();
        setDescriptions(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getDescriptions();
  }, []);
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
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this description?')) {
      try {
        await deleteGeneralDescription(id);
        setDescriptions(descriptions.filter(description => description._id !== id));
      } catch (error) {
        console.error('Error deleting description:', error);
        alert(`Failed to delete description: ${(error as Error).message}`);
      }
    }
  };

  if (loading) {
    return (
      <PageContainer title="Loading..." description="Fetching descriptions">
          <DashboardCard title="All Generic Descriptions">
          <Box
          minHeight={400}
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            flexDirection="row"
          >
            <CircularProgress />
            <Typography variant="h6" ml={2}>Loading...</Typography>
          </Box>
        </DashboardCard>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Error" description="Failed to fetch descriptions">
        <DashboardCard title="Error">
          <Typography color="error">{error}</Typography>
        </DashboardCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="All Descriptions" description="List of all generic descriptions">
      <DashboardCard title="All Generic Descriptions">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Attribution Type</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Text</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {descriptions.map((description) => (
                <TableRow key={description._id}>
                  <TableCell>{description.title}</TableCell>
                  <TableCell>{description.attributionType}</TableCell>
                  <TableCell>{description.type}</TableCell>
                  <TableCell>
                  <Box sx={styles.content}>
                    <div dangerouslySetInnerHTML={{ __html: description.texte }} />
                    </Box></TableCell>
                  <TableCell>
                  <Link href={`/pages/descriptions/${description._id}`} passHref>   
                  <Button >
                      <Icons.EditOutlined />
                    </Button>
                    </Link>
                    </TableCell>
                    <TableCell>
                    <Icons.Delete color="error" onClick={() => handleDelete(description._id)}/>
                     
                    </TableCell>
                

                 
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </PageContainer>
  );
};

export default Descriptions;
