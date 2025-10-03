import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar
} from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 250;

const navLinks = [
  { to: '/dashboard', icon: <DashboardIcon />, text: 'Dashboard' },
  { to: '/inventory', icon: <InventoryIcon />, text: 'Inventory' },
  { to: '/suppliers', icon: <PeopleIcon />, text: 'Suppliers' },
  { to: '/scan', icon: <QrCodeScannerIcon />, text: 'Barcode Scan' },
  { to: '/reports', icon: <AssessmentIcon />, text: 'Reports' },
  { to: '/settings', icon: <SettingsIcon />, text: 'Settings' },
];

export default function SidebarLayout({ children }) {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: '#fff',
            borderRight: '1px solid #eee',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid #eee' }}>
            <img
              src="/assets/logo.jpg"
              alt="AIVENTORY Logo"
              style={{ width: 60, marginBottom: 8 }}
            />
            <Typography variant="h6" sx={{ color: '#2E3A8C', fontWeight: 700 }}>
              AIVENTORY
            </Typography>
          </Box>

          <List sx={{ flex: 1 }}>
            {navLinks.map(link => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.to}
                  selected={location.pathname === link.to}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />

          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/">
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Log Out" />
              </ListItemButton>
            </ListItem>
          </List>

          <Box
            sx={{
              p: 2,
              borderTop: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar src="/assets/icons/arthur.jpg" alt="User" sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography sx={{ fontWeight: 500, fontSize: 15 }}>Admin User</Typography>
              <Typography sx={{ fontSize: 13, color: '#6C757D' }}>Administrator</Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f5f5f7',
          minHeight: '100vh',
          px: 3, // add horizontal padding here if you want spacing
          pt: 4,
          pb: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
