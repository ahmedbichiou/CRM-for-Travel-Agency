import React, { useState } from "react";
import Link from "next/link";
import * as Icons from '@mui/icons-material';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Card,
} from "@mui/material";

import { IconListCheck, IconMail, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');

    // Optionally, redirect to the login page
    router.push('/authentication/login');
  };
  const handleAccountClick = () => {
    // Redirect to the account edit page
    router.push('/pages/edit');
    handleClose2(); // Close the menu after navigating
  };

  return (
    <Box>
 <Card
      sx={{
        display: 'inline-block',
        borderRadius: 9,
        boxShadow: 1,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.1)',
          borderRadius: 8,
          boxShadow: 2,
        },
      }}
    >
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          color: anchorEl2 ? 'primary.main' : 'inherit',
        }}
        onClick={handleClick2}
      >
        <Icons.Person />
      </IconButton>
    </Card>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >

<MenuItem onClick={handleAccountClick}>
          <ListItemIcon>
            <Icons.Settings />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>

        <Box mt={1} py={1} px={2}>
        <Button
      onClick={handleLogout}
      variant="outlined"
      color="primary"
      fullWidth
    >
      Logout
    </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
