//Dashboard.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area
} from 'recharts';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
//import '../css/dashboard.css';
//import '../css/style.css';



const drawerWidth = 250;

const navLinks = [
  { to: '/dashboard', icon: <DashboardIcon />, text: 'Dashboard' },
  { to: '/inventory', icon: <InventoryIcon />, text: 'Inventory' },
  { to: '/suppliers', icon: <PeopleIcon />, text: 'Suppliers' },
  { to: '/scan', icon: <QrCodeScannerIcon />, text: 'Barcode Scan' },
  { to: '/reports', icon: <AssessmentIcon />, text: 'Reports' },
  { to: '/settings', icon: <SettingsIcon />, text: 'Settings' },
];

const Dashboard = () => {
  const location = useLocation();
  const data = [
    { month: 'Jan', stock: 120, demand: 50 },
    { month: 'Feb', stock: 110, demand: 50 },
    { month: 'Mar', stock: 95, demand: 50 },
    { month: 'Apr', stock: 83, demand: 50 },
    { month: 'May', stock: 70, demand: 45 },
    { month: 'Jun', stock: 60, demand: 30 },
    { month: 'Jul', stock: 20, demand: 20 },
  ];
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: '#fff',
            boxShadow: 'none',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid #eee' }}>
            <img src="/assets/logo.jpg" alt="AIVENTORY Logo" className="logo" style={{ width: 60, marginBottom: 8 }} />
            <Typography variant="h6" sx={{ color: '#2E3A8C', fontWeight: 700 }}>AIVENTORY</Typography>
          </Box>
          <List sx={{ flex: 1 }}>
          {navLinks.map(link => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton
                  component={Link}
              to={link.to}
                  selected={location.pathname === link.to}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText primary={typeof link.text === 'string' ? link.text : String(link.text)} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/">
                <ListItemIcon sx={{ minWidth: 36 }}><LogoutIcon color="error" /></ListItemIcon>
                <ListItemText primary="Log Out" />
              </ListItemButton>
            </ListItem>
          </List>
          <Box sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src="/assets/icons/arthur.jpg" alt="User" sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography className="username" sx={{ fontWeight: 500, fontSize: 15 }}>Admin User</Typography>
              <Typography className="user-role" sx={{ fontSize: 13, color: '#6C757D' }}>Administrator</Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f5f5f7',
          minHeight: '100vh',
          px: 4, // Only horizontal padding
          pt: 4,
          pb: 4,
          display: 'block',
        }}
      >
        <Box
          sx={{
            width: '100%',
            boxSizing: 'border-box',
            // No maxWidth, marginLeft, or marginRight
          }}
        >
          {/* Header */}
          <Typography variant="h4" fontWeight={700} sx={{ mb: 4, mt: 1, color: '#2E3A8C' }}>
            Dashboard
          </Typography>

          {/* Summary Cards - Compact, equal width */}
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
            <Grid>
              <Paper elevation={3} sx={{
                width: 220,
                p: 1.5,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#fff',
                minHeight: 100,
                boxShadow: '0 2px 12px rgba(44,62,80,0.08)',
              }}>
                <Avatar sx={{ bgcolor: '#2E3A8C', width: 32, height: 32, mb: 0.5 }}>
                  <StorageIcon sx={{ fontSize: 18, color: '#fff' }} />
                </Avatar>
                <Typography fontWeight={700} variant="body1" sx={{ mb: 0.25, color: '#2E3A8C' }}>Total Items</Typography>
                <Typography variant="h5" fontWeight={900} sx={{ color: '#FFD166', mb: 0.25 }}>5</Typography>
                <Typography color="text.secondary" fontSize={11}>Motorcycle parts inventory</Typography>
              </Paper>
            </Grid>
            <Grid>
              <Paper elevation={3} sx={{
                width: 220,
                p: 1.5,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#fff',
                minHeight: 100,
                boxShadow: '0 2px 12px rgba(44,62,80,0.08)',
              }}>
                <Avatar sx={{ bgcolor: '#FFD166', width: 32, height: 32, mb: 0.5 }}>
                  <WarningIcon sx={{ fontSize: 18, color: '#b48a00' }} />
                </Avatar>
                <Typography fontWeight={700} variant="body1" sx={{ mb: 0.25, color: '#b48a00' }}>Low-Stock Alerts</Typography>
                <Typography variant="h5" fontWeight={900} sx={{ color: '#FFD166', mb: 0.25 }}>1</Typography>
                <Typography color="text.secondary" fontSize={11}>Item below threshold</Typography>
              </Paper>
            </Grid>
            <Grid>
              <Paper elevation={3} sx={{
                width: 220,
                p: 1.5,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#fff',
                minHeight: 100,
                boxShadow: '0 2px 12px rgba(44,62,80,0.08)',
              }}>
                <Avatar sx={{ bgcolor: '#FF6B6B', width: 32, height: 32, mb: 0.5 }}>
                  <ErrorIcon sx={{ fontSize: 18, color: '#fff' }} />
                </Avatar>
                <Typography fontWeight={700} variant="body1" sx={{ mb: 0.25, color: '#FF6B6B' }}>Critical Items</Typography>
                <Typography variant="h5" fontWeight={900} sx={{ color: '#FF6B6B', mb: 0.25 }}>2</Typography>
                <Typography color="text.secondary" fontSize={11}>Urgent reorder needed</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* AI-Powered Alerts */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#2E3A8C' }}>
            AI-Powered Alerts
          </Typography>
          <Stack spacing={3} sx={{ mb: 4 }}>
            {/* Alert 1 */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                <Avatar sx={{ bgcolor: '#FF6B6B', width: 56, height: 56 }}>
                  <ErrorIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#2E3A8C', fontSize: 18, mb: 0.25, lineHeight: 1.2 }}>
                  Motorcycle Batteries
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    BAT-YTX-001
                  </Typography>
                  <Chip
                    label="92% confidence"
                    size="small"
                    sx={{ bgcolor: '#fbe9e7', color: '#FF6B6B', fontWeight: 700, fontSize: 11, borderRadius: 2, height: 22 }}
                  />
                </Box>
                <Typography color="error.main" fontWeight={700} sx={{ fontSize: 15, mb: 0.5 }}>
                  Predicted to run out in 7 days
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Stock: <b>45</b> &nbsp;|&nbsp; Threshold: <b>50</b>
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ minWidth: 180, mt: { xs: 2, sm: 0 } }}>
                <Button variant="contained" color="error" sx={{ fontWeight: 700, px: 2 }}>REORDER NOW</Button>
                <Button variant="outlined" sx={{ fontWeight: 700, px: 2 }}>VIEW DETAILS</Button>
              </Stack>
            </Paper>
            {/* Alert 2 */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                <Avatar sx={{ bgcolor: '#FFD166', width: 56, height: 56 }}>
                  <WarningIcon sx={{ fontSize: 32, color: '#b48a00' }} />
                </Avatar>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#b48a00', fontSize: 18, mb: 0.25, lineHeight: 1.2 }}>
                  Engine Oil (10W-40)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    OIL-10W40-002
                  </Typography>
                  <Chip
                    label="85% confidence"
                    size="small"
                    sx={{ bgcolor: '#fff8e1', color: '#b48a00', fontWeight: 700, fontSize: 11, borderRadius: 2, height: 22 }}
                  />
                </Box>
                <Typography color="warning.main" fontWeight={700} sx={{ fontSize: 15, mb: 0.5 }}>
                  Order placed - expected delivery: May 22, 2025
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Stock: <b>32</b> &nbsp;|&nbsp; Threshold: <b>30</b>
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ minWidth: 180, mt: { xs: 2, sm: 0 } }}>
                <Button variant="contained" sx={{ bgcolor: '#FFD166', color: '#333', fontWeight: 700, px: 2, '&:hover': { bgcolor: '#e6c155' } }}>VIEW ORDER</Button>
                <Button variant="outlined" sx={{ fontWeight: 700, px: 2 }}>VIEW DETAILS</Button>
              </Stack>
            </Paper>
            {/* Alert 3 */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                <Avatar sx={{ bgcolor: '#FF6B6B', width: 56, height: 56 }}>
                  <ErrorIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#FF6B6B', fontSize: 18, mb: 0.25, lineHeight: 1.2 }}>
                  Brake Pads
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    BRK-PAD-004
                  </Typography>
                  <Chip
                    label="98% confidence"
                    size="small"
                    sx={{ bgcolor: '#fbe9e7', color: '#FF6B6B', fontWeight: 700, fontSize: 11, borderRadius: 2, height: 22 }}
                  />
                </Box>
                <Typography color="error.main" fontWeight={700} sx={{ fontSize: 15, mb: 0.5 }}>
                  Critical stock level
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Stock: <b>15</b> &nbsp;|&nbsp; Threshold: <b>20</b>
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ minWidth: 180, mt: { xs: 2, sm: 0 } }}>
                <Button variant="contained" color="error" sx={{ fontWeight: 700, px: 2 }}>REORDER NOW</Button>
                <Button variant="outlined" sx={{ fontWeight: 700, px: 2 }}>VIEW DETAILS</Button>
              </Stack>
            </Paper>
          </Stack>

          {/* Demand Forecast Chart */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#2E3A8C' }}>
            Demand Forecast
          </Typography>
          <div className="chart-section">
            <div className="chart-container" style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Stock Level', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="stock" stroke="#2E3A8C" fill="#2E3A8C" fillOpacity={0.08} />
                  <Line type="monotone" dataKey="stock" stroke="#2E3A8C" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="demand" stroke="#00B4D8" strokeWidth={3} dot={{ r: 4 }} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;