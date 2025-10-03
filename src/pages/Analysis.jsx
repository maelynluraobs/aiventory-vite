import React, { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import {
  Box, Typography, Paper, Stack, Button, Grid, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, InputAdornment
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const summaryStats = [
  { label: 'Current Stock', value: 45 },
  { label: 'Days Until Empty', value: 7, color: '#FF6B6B' },
  { label: 'Usage This Month', value: 75 },
  { label: 'Usage This Year', value: 625 },
];

const dailyChartData = [
  { date: 'May 7', units: 9 },
  { date: 'May 8', units: 6 },
  { date: 'May 9', units: 12 },
  { date: 'May 10', units: 7 },
  { date: 'May 11', units: 10 },
  { date: 'May 12', units: 8 },
  { date: 'May 13', units: 5 },
];
const dailyTable = [
  ['May 13, 2025', 5, '$12.50', 'INV-0562', 'Completed'],
  ['May 12, 2025', 8, '$20.00', 'INV-0555, INV-0557', 'Completed'],
  ['May 11, 2025', 10, '$25.00', 'INV-0542, INV-0548', 'Completed'],
  ['May 10, 2025', 7, '$17.50', 'INV-0539', 'Completed'],
  ['May 9, 2025', 12, '$30.00', 'INV-0533, INV-0536', 'Completed'],
  ['May 8, 2025', 6, '$15.00', 'INV-0527', 'Completed'],
  ['May 7, 2025', 9, '$22.50', 'INV-0520, INV-0522', 'Completed'],
];

const monthlyChartData = [
  { month: 'Dec', sales: 85 },
  { month: 'Jan', sales: 55 },
  { month: 'Feb', sales: 60 },
  { month: 'Mar', sales: 70 },
  { month: 'Apr', sales: 75 },
  { month: 'May (MTD)', sales: 57 },
];
const monthlyTable = [
  ['May 2025 (MTD)', 57, '$142.50', 8.1, '+12%'],
  ['April 2025', 75, '$187.50', 5.0, '+8%'],
  ['March 2025', 70, '$175.00', 2.3, '+5%'],
  ['February 2025', 60, '$150.00', 2.1, '-2%'],
  ['January 2025', 55, '$137.50', 1.8, '-8%'],
  ['December 2024', 85, '$212.50', 2.7, '+15%'],
];

const yearlyChartData = [
  { year: '2021', sales: 770 },
  { year: '2022', sales: 863 },
  { year: '2023', sales: 837 },
  { year: '2024', sales: 879 },
  { year: '2025 (YTD)', sales: 347 },
];
const yearlyTable = [
  ['2025 (YTD)', 347, '$867.50', 69.4, '+18%'],
  ['2024', 879, '$2,197.50', 73.3, '+5%'],
  ['2023', 837, '$2,092.50', 69.8, '-3%'],
  ['2022', 863, '$2,157.50', 71.9, '+12%'],
  ['2021', 770, '$1,925.00', 64.2, '+24%'],
];

const invoiceTable = [
  ['INV-0562', 'May 13, 2025', 'MotoMax Performance', 5, '$12.50', 'Paid'],
  ['INV-0557', 'May 12, 2025', 'Speed Demons Garage', 3, '$7.50', 'Paid'],
  ['INV-0555', 'May 12, 2025', 'RiderZone Supply Co.', 5, '$12.50', 'Paid'],
  ['INV-0548', 'May 11, 2025', 'Two Wheels Service Center', 6, '$15.00', 'Paid'],
  ['INV-0542', 'May 11, 2025', 'MotorHeads Repair Shop', 4, '$10.00', 'Paid'],
  ['INV-0539', 'May 10, 2025', 'Cycle City Parts', 7, '$17.50', 'Paid'],
  ['INV-0536', 'May 9, 2025', 'Throttle Up Customs', 8, '$20.00', 'Paid'],
  ['INV-0533', 'May 9, 2025', 'Biker\'s Paradise', 4, '$10.00', 'Paid'],
];

const tabLabels = ['Daily Sales', 'Monthly Analysis', 'Yearly Analysis', 'Invoice History'];

export default function Analysis() {
  const [tab, setTab] = useState(0);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  return (
    <SidebarLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 3, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight={800} color="#2E3A8C">
            Detailed Analysis: AA Batteries (SKU: BAT-AA-001)
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.location.href = '/prediction'}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              fontSize: 10,
              color: '#2E3A8C !important',
              borderColor: '#2E3A8C !important',
              px: 2.5,
              py: 1,
              boxShadow: 'none',
              ':hover': {
                background: '#e0e7ff',
                borderColor: '#2E3A8C !important',
                color: '#2E3A8C !important',
              },
            }}
          >
            Back to Prediction
          </Button>
        </Box>

        {/* Analysis Summary */}
        <Paper elevation={2} sx={{ mb: 4, p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, textAlign: 'center' }}>
            Analysis Summary
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            {summaryStats.map((stat, i) => (
              <Box key={i} sx={{ flex: 1, minWidth: 120, textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{
                    color: stat.label === 'Days Until Empty' ? '#FF6B6B' : '#2E3A8C',
                    mb: 0.5,
                    fontSize: { xs: 32, sm: 40, md: 48 },
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography color="#555" fontWeight={700} fontSize={16}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Tabs */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          {tabLabels.map((label, i) => <Tab key={i} label={label} />)}
        </Tabs>

        {/* Tab Panels */}
        {tab === 0 && (
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: '#2E3A8C' }}>
              Daily Sales Breakdown
            </Typography>
            <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Units Sold', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="units" name="Units Sold" fill="#2E3A8C" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
            <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Units Sold</TableCell>
                    <TableCell>Revenue</TableCell>
                    <TableCell>Invoice IDs</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dailyTable.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row[0]}</TableCell>
                      <TableCell>{row[1]}</TableCell>
                      <TableCell>{row[2]}</TableCell>
                      <TableCell>{row[3]}</TableCell>
                      <TableCell>
                        <Box component="span" sx={{ display: 'inline-block', px: 2, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: '0.98rem', color: '#fff', background: '#06D6A0', letterSpacing: 0.5, textAlign: 'center', minWidth: 70 }}>
                          {row[4]}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {tab === 1 && (
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: '#2E3A8C' }}>
              Monthly Sales Trends
            </Typography>
            <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Units Sold', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" name="Monthly Sales" stroke="#2E3A8C" strokeWidth={3} dot={true} activeDot={{ r: 6 }} fill="#2E3A8C" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
            <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Units Sold</TableCell>
                    <TableCell>Revenue</TableCell>
                    <TableCell>Avg. Daily Sales</TableCell>
                    <TableCell>Trend</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyTable.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row[0]}</TableCell>
                      <TableCell>{row[1]}</TableCell>
                      <TableCell>{row[2]}</TableCell>
                      <TableCell>{row[3]}</TableCell>
                      <TableCell>
                        <Box component="span" sx={{ color: row[4].includes('+') ? '#06D6A0' : '#FF6B6B', fontWeight: 700 }}>{row[4]}</Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {tab === 2 && (
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: '#2E3A8C' }}>
              Yearly Sales Performance
            </Typography>
            <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis label={{ value: 'Units Sold', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" name="Yearly Sales" fill="#2E3A8C" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
            <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Year</TableCell>
                    <TableCell>Units Sold</TableCell>
                    <TableCell>Revenue</TableCell>
                    <TableCell>Avg. Monthly Sales</TableCell>
                    <TableCell>YoY Growth</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {yearlyTable.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row[0]}</TableCell>
                      <TableCell>{row[1]}</TableCell>
                      <TableCell>{row[2]}</TableCell>
                      <TableCell>{row[3]}</TableCell>
                      <TableCell>
                        <Box component="span" sx={{ color: row[4].includes('+') ? '#06D6A0' : '#FF6B6B', fontWeight: 700 }}>{row[4]}</Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {tab === 3 && (
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: '#2E3A8C' }}>
              Complete Invoice History
            </Typography>
            <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search invoices..."
                  value={invoiceSearch}
                  onChange={e => setInvoiceSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 220 }}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Date Range:</Typography>
                  <TextField
                    type="date"
                    size="small"
                    value={dateRange.start}
                    onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                  <TextField
                    type="date"
                    size="small"
                    value={dateRange.end}
                    onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                  <Button variant="contained" size="small" sx={{ borderRadius: 2, fontWeight: 600 }}>Apply</Button>
                </Stack>
              </Stack>
            </Paper>
            <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Units</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceTable
                    .filter(row => row[0].toLowerCase().includes(invoiceSearch.toLowerCase()) || row[2].toLowerCase().includes(invoiceSearch.toLowerCase()))
                    .filter(row => {
                      if (!dateRange.start && !dateRange.end) return true;
                      const date = new Date(row[1]);
                      const start = dateRange.start ? new Date(dateRange.start) : null;
                      const end = dateRange.end ? new Date(dateRange.end) : null;
                      if (start && date < start) return false;
                      if (end && date > end) return false;
                      return true;
                    })
                    .map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row[0]}</TableCell>
                        <TableCell>{row[1]}</TableCell>
                        <TableCell>{row[2]}</TableCell>
                        <TableCell>{row[3]}</TableCell>
                        <TableCell>{row[4]}</TableCell>
                        <TableCell>
                          <Box component="span" sx={{ display: 'inline-block', px: 2, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: '0.98rem', color: '#fff', background: '#06D6A0', letterSpacing: 0.5, textAlign: 'center', minWidth: 70 }}>
                            {row[5]}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Button variant="text" size="small" sx={{ color: '#2E3A8C', fontWeight: 700 }}>View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </SidebarLayout>
  );
} 