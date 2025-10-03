import React, { useState, useEffect } from 'react';
import {
  Box, Button, Grid, MenuItem, Paper, Select, Typography, Stack, FormControl, InputLabel
} from '@mui/material';
import { PictureAsPdf, Download, TrendingUp } from '@mui/icons-material';
import SidebarLayout from '../components/SidebarLayout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

export default function Reports() {
  const [reportType, setReportType] = useState('inventory');
  const [timePeriod, setTimePeriod] = useState('7days');
  const [lowStock, setLowStock] = useState([]);
  const [stockByCategory, setStockByCategory] = useState([]);
  const [supplierPerformance, setSupplierPerformance] = useState([]);
  const [monthlyOrders, setMonthlyOrders] = useState([]);

  // Fetch reports from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/reports/low-stock")
      .then(res => res.json())
      .then(setLowStock);

    fetch("http://localhost:5000/api/reports/stock-by-category")
      .then(res => res.json())
      .then(setStockByCategory);

    fetch("http://localhost:5000/api/reports/supplier-performance")
      .then(res => res.json())
      .then(setSupplierPerformance);

    fetch("http://localhost:5000/api/reports/monthly-orders")
      .then(res => res.json())
      .then(setMonthlyOrders);
  }, []);

  return (
    <SidebarLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          Reports & Analytics
        </Typography>

        {/* Low Stock Table */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            ⚠ Low Stock Items
          </Typography>
          <table width="100%" border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Reorder Level</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map(item => (
                <tr key={item.Product_id}>
                  <td>{item.Product_name}</td>
                  <td>{item.Product_stock}</td>
                  <td>{item.reorder_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>

        {/* Stock by Category */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            📦 Stock by Category
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Product_category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_stock" fill="#6c63ff" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Supplier Performance */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            👨‍💼 Supplier Performance
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplierPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="supplier_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_orders" fill="#ff9800" />
              <Bar dataKey="total_amount" fill="#36a2eb" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Monthly Orders */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            📈 Monthly Orders
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyOrders}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_amount" stroke="#6c63ff" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </SidebarLayout>
  );
}
