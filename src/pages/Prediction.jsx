//Prediction.jsx
import React from 'react';

import SidebarLayout from '../components/SidebarLayout';
import { Box, Typography, Button, Paper, Stack, Chip, LinearProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InsightsIcon from '@mui/icons-material/Insights';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area } from 'recharts';

const item = {
  name: 'AA Batteries',
  sku: 'BAT-AA-001',
  status: 'At Risk',
  stock: 45,
  threshold: 50,
  lastOrdered: 'March 15, 2025',
};

const prediction = {
  depletionDays: 7,
  depletionDate: 'May 20, 2025',
  confidence: 92,
  reorderQty: 50,
};

const chartData = [
  { month: 'Jan', stock: 120, prediction: null, threshold: 50 },
  { month: 'Feb', stock: 110, prediction: null, threshold: 50 },
  { month: 'Mar', stock: 105, prediction: null, threshold: 50 },
  { month: 'Apr', stock: 100, prediction: null, threshold: 50 },
  { month: 'May', stock: 95, prediction: null, threshold: 50 },
  { month: 'Jun', stock: 85, prediction: null, threshold: 50 },
  { month: 'Jul', stock: 80, prediction: null, threshold: 50 },
  { month: 'Aug', stock: 75, prediction: null, threshold: 50 },
  { month: 'Sep', stock: 70, prediction: null, threshold: 50 },
  { month: 'Oct', stock: 65, prediction: 55, threshold: 50 },
  { month: 'Nov', stock: 55, prediction: 45, threshold: 50 },
  { month: 'Dec', stock: 45, prediction: 35, threshold: 50 },
  { month: 'Jan+', stock: null, prediction: 25, threshold: 50 },
  { month: 'Feb+', stock: null, prediction: 15, threshold: 50 },
  { month: 'Mar+', stock: null, prediction: 5, threshold: 50 },
  { month: 'Apr+', stock: null, prediction: 0, threshold: 50 },
];

export default function Prediction() {
  const navigate = useNavigate();
  return (
    <SidebarLayout>
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 3, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" fontWeight={800} color="#2E3A8C">
            AI Prediction
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/inventory')}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Back to Inventory
          </Button>
        </Box>

        {/* Item Details */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" fontWeight={700}>
              {item.name} (SKU: {item.sku})
            </Typography>
            <Chip
              label={item.status}
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                color: '#fff',
                background: '#FF6B6B',
                px: 0,
                py: 0.5,
                borderRadius: 2,
                textTransform: 'capitalize',
              }}
            />
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
            <Box>
              <Typography fontWeight={600} color="#222">Current Stock:</Typography>
              <Typography>{item.stock} units</Typography>
            </Box>
            <Box>
              <Typography fontWeight={600} color="#222">Reorder Threshold:</Typography>
              <Typography>{item.threshold} units</Typography>
            </Box>
            <Box>
              <Typography fontWeight={600} color="#222">Last Ordered:</Typography>
              <Typography>{item.lastOrdered}</Typography>
            </Box>
          </Stack>
        </Paper>

        {/* AI Prediction Card */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, borderLeft: '6px solid #FF6B6B', background: '#fff7f7' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <NotificationImportantIcon sx={{ color: '#FF6B6B', fontSize: 32, mr: 1 }} />
            <Typography variant="h6" fontWeight={800} color="#FF6B6B">
              AI Prediction Alert
            </Typography>
          </Box>
          <Typography sx={{ mb: 2 }}>
            Based on historical sales data and current trends, this item is predicted to run out of stock in <b>{prediction.depletionDays} days</b>.
          </Typography>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <Box flex={1}>
              <Typography fontWeight={600}>Predicted Depletion Date:</Typography>
              <Typography>{prediction.depletionDate}</Typography>
            </Box>
            <Box flex={1}>
              <Typography fontWeight={600}>Confidence Level:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={prediction.confidence}
                  sx={{ height: 10, borderRadius: 5, flex: 1, background: '#eee', '& .MuiLinearProgress-bar': { background: '#2E3A8C' } }}
                />
                <Typography fontWeight={700} color="#2E3A8C">{prediction.confidence}%</Typography>
              </Box>
            </Box>
            <Box flex={1}>
              <Typography fontWeight={600}>Suggested Reorder Quantity:</Typography>
              <Typography>{prediction.reorderQty} units</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button variant="contained" startIcon={<ShoppingCartIcon />} sx={{ background: '#2E3A8C', fontWeight: 700, borderRadius: 2, textTransform: 'none', boxShadow: 'none', ':hover': { background: '#1a237e' } }}>
              Place Reorder
            </Button>
            <Button variant="outlined" startIcon={<InsightsIcon />} sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }} onClick={() => navigate('/analysis')}>
              View Full Analysis
            </Button>
          </Stack>
        </Paper>

        {/* Chart Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#2E3A8C' }}>
            Stock Level History & Prediction
          </Typography>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 3, background: '#f8f9fa' }}>
            <Box sx={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Stock Level (units)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="stock" name="Historical Stock" stroke="#2E3A8C" strokeWidth={3} dot={false} activeDot={{ r: 6 }} fill="#2E3A8C" />
                  <Line type="monotone" dataKey="prediction" name="AI Prediction" stroke="#FF6B6B" strokeWidth={3} strokeDasharray="5 5" dot={false} fill="#FF6B6B" />
                  <Line type="monotone" dataKey="threshold" name="Reorder Threshold" stroke="#06D6A0" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Box>
    </SidebarLayout>
  );
} 