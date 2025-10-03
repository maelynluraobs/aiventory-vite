import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Switch,
  Typography,
  Avatar,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit, AccountCircle, ArrowForwardIos, ExitToApp } from '@mui/icons-material';
import SidebarLayout from '../components/SidebarLayout';

export default function Settings() {
  // Mock state for toggles
  const [settings, setSettings] = useState({
    notifications: true,
    lowStock: true,
    darkMode: false,
    autoFlash: false,
    vibrate: true,
    beep: true,
    usageStats: true,
    aiPredictions: true,
  });

  const handleToggle = (key) => (e) => {
    setSettings((prev) => ({ ...prev, [key]: e.target.checked }));
  };

  return (
    <SidebarLayout>
      <Box sx={{ p: { xs: 1, md: 3 }, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700} color="primary.main" mb={3}>
          Settings
        </Typography>
        {/* User Profile Section */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 3, width: '100%', maxWidth: 900 }}>
          <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'grey.100' }}>
            <AccountCircle sx={{ fontSize: 60, color: 'grey.400' }} />
          </Avatar>
          <Typography variant="h6" fontWeight={600} className="profile-name">
            Admin User
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Administrator
          </Typography>
          <Button variant="outlined" startIcon={<Edit />} size="small">
            Edit Profile
          </Button>
        </Paper>
        {/* App Settings */}
        <Box mb={4} sx={{ width: '100%', maxWidth: 900 }}>
          <Typography variant="subtitle2" color="text.secondary" mb={1} sx={{ pl: 1 }}>
            APP SETTINGS
          </Typography>
          <Card variant="outlined" sx={{ borderRadius: 3, width: '100%', p: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Stack divider={<Divider />}>
                <Box className="setting-item" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                  <Typography>Notifications</Typography>
                  <Switch checked={settings.notifications} onChange={handleToggle('notifications')} />
                </Box>
                <Box className="setting-item" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                  <Typography>Low Stock Alerts</Typography>
                  <Switch checked={settings.lowStock} onChange={handleToggle('lowStock')} />
                </Box>
                <Box className="setting-item" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                  <Typography>Dark Mode</Typography>
                  <Switch checked={settings.darkMode} onChange={handleToggle('darkMode')} />
                </Box>
                <Box className="setting-item" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                  <Typography>Sync Frequency</Typography>
                  <Typography color="text.secondary">Every 30 minutes</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        {/* Scanner Settings */}
        <Box mb={4} sx={{ width: '100%', maxWidth: 900 }}>
          <Typography variant="subtitle2" color="text.secondary" mb={1} sx={{ pl: 1 }}>
            SCANNER SETTINGS
          </Typography>
          <Card variant="outlined" sx={{ borderRadius: 3, width: '100%', p: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Stack divider={<Divider />}>
                <Box className="setting-item" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                  <Typography>Auto-flash</Typography>
                  <Switch checked={settings.autoFlash} onChange={handleToggle('autoFlash')} />
                </Box>
                <Box className="setting-item" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                  <Typography>Vibrate on Scan</Typography>
                  <Switch checked={settings.vibrate} onChange={handleToggle('vibrate')} />
                </Box>
                <Box className="setting-item" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                  <Typography>Beep on Scan</Typography>
                  <Switch checked={settings.beep} onChange={handleToggle('beep')} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        {/* Analytics Settings */}
        <Box mb={4} sx={{ width: '100%', maxWidth: 900 }}>
          <Typography variant="subtitle2" color="text.secondary" mb={1} sx={{ pl: 1 }}>
            ANALYTICS
          </Typography>
          <Card variant="outlined" sx={{ borderRadius: 3, width: '100%', p: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Stack divider={<Divider />}>
                <Box className="setting-item" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                  <Typography>Usage Statistics</Typography>
                  <Switch checked={settings.usageStats} onChange={handleToggle('usageStats')} />
                </Box>
                <Box className="setting-item" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                  <Typography>AI Predictions</Typography>
                  <Switch checked={settings.aiPredictions} onChange={handleToggle('aiPredictions')} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        {/* Account Settings */}
        <Box mb={4} sx={{ width: '100%', maxWidth: 900 }}>
          <Typography variant="subtitle2" color="text.secondary" mb={1} sx={{ pl: 1 }}>
            ACCOUNT
          </Typography>
          <Card variant="outlined" sx={{ borderRadius: 3, width: '100%', p: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Stack divider={<Divider />}>
                <Box
                  className="setting-item"
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, cursor: 'pointer' }}
                  onClick={() => { /* TODO: Change Password */ }}
                >
                  <Typography>Change Password</Typography>
                  <ArrowForwardIos sx={{ color: '#888', fontSize: 20 }} />
                </Box>
                <Box
                  className="setting-item"
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, cursor: 'pointer' }}
                  onClick={() => { /* TODO: Privacy Settings */ }}
                >
                  <Typography>Privacy Settings</Typography>
                  <ArrowForwardIos sx={{ color: '#888', fontSize: 20 }} />
                </Box>
                <Box
                  className="setting-item"
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, cursor: 'pointer', color: 'error.main' }}
                  onClick={() => { /* TODO: Log Out */ }}
                >
                  <Typography sx={{ color: 'error.main' }}>Log Out</Typography>
                  <ExitToApp sx={{ color: 'error.main', fontSize: 24 }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </SidebarLayout>
  );
} 