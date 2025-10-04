// Inventory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarLayout from '../components/SidebarLayout';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Insights as InsightsIcon,
  QrCodeScanner as QrCodeScannerIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  'Good': '#06D6A0',
  'Warning': '#FFD166',
  'At Risk': '#FF6B6B',
};

const categories = [
  'Lubricants',
  'Battery',
  'Electrical',
  'Brakes',
  'Engine',
  'Transmission',
];

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    stock: '',
    threshold: '',
    price: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  // Fetch products from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => {
        const formatted = res.data.map(p => ({
          id: p.Product_id,
          name: p.Product_name,
          sku: p.Product_sku,
          category: p.Product_category,
          stock: p.Product_stock,
          threshold: p.reorder_level,
          status: p.Product_status || 'Active'
        }));
        setInventory(formatted);
      })
      .catch(err => {
        setFetchError("Error fetching products. Please check your backend connection.");
        console.error("Error fetching products:", err);
      });
  }, []);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (item, idx) => {
    if (item) {
      setForm({
        name: item.name,
        sku: item.sku,
        category: item.category,
        stock: item.stock,
        threshold: item.threshold,
        price: item.price || ''
      });
      setEditIndex(idx);
    } else {
      setForm({ name: '', sku: '', category: '', stock: '', threshold: '', price: '' });
      setEditIndex(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setForm({ name: '', sku: '', category: '', stock: '', threshold: '', price: '' });
    setEditIndex(null);
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.sku || !form.category || form.stock === '' || form.threshold === '') return;

    const newItem = {
      Product_name: form.name,
      Product_sku: form.sku,
      Product_price: Number(form.price) || 0,
      Product_category: form.category,
      reorder_level: Number(form.threshold),
      supplier_id: 1, // Set default supplier_id to avoid null constraint
      Product_stock: Number(form.stock),
      Product_status: 'Active' // Set default status
    };

    try {
      if (editIndex !== null) {
        const id = inventory[editIndex].id;
        await axios.put(`http://localhost:5000/api/products/${id}`, newItem);
        const res = await axios.get("http://localhost:5000/api/products");
        setInventory(res.data.map(p => ({
          id: p.Product_id,
          name: p.Product_name,
          sku: p.Product_sku,
          category: p.Product_category,
          stock: p.Product_stock,
          threshold: p.reorder_level,
          status: p.Product_status || 'Active'
        })));
        setSnackbarMsg("Item updated successfully!");
      } else {
        const res = await axios.post("http://localhost:5000/api/products", newItem);
        const added = {
          id: res.data.Product_id || res.data.id,
          ...newItem
        };
        setInventory([...inventory, added]);
        setSnackbarMsg("Item added successfully!");
      }
    } catch (err) {
      if (err.response) {
        console.error('Axios error:', err.response.data);
        setSnackbarMsg(`Error saving item: ${err.response.data.error || 'Unknown error'}`);
      } else {
        console.error('Axios error:', err.message);
        setSnackbarMsg("Error saving item.");
      }
    }

    setSnackbarOpen(true);
    handleCloseModal();
  };

  const handleDelete = async (idx) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const id = inventory[idx].id;
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        const res = await axios.get("http://localhost:5000/api/products");
        setInventory(res.data.map(p => ({
          id: p.Product_id,
          name: p.Product_name,
          sku: p.Product_sku,
          category: p.Product_category,
          stock: p.Product_stock,
          threshold: p.reorder_level,
          status: p.Product_status || 'Active'
        })));
        setSnackbarMsg("Item deleted successfully!");
      } catch (err) {
        console.error(err);
        setSnackbarMsg("Error deleting item.");
      }
      setSnackbarOpen(true);
    }
  };

  return (
    <SidebarLayout>
      <Box sx={{ minHeight: '100vh', background: '#f7f7f9', py: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#2E3A8C' }}>Inventory</Typography>
          <Box display="flex" gap={2}>
            <TextField
              placeholder="Search inventory..."
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
              sx={{ background: '#fff', borderRadius: 2 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal(null, null)}
              sx={{ borderRadius: 2, background: '#6c63ff', fontWeight: 600, textTransform: 'none' }}
            >
              Add Item
            </Button>
          </Box>
        </Box>

        {/* Table */}
        {fetchError ? (
          <Box sx={{ color: 'red', textAlign: 'center', mt: 8 }}>
            <Typography variant="h5">{fetchError}</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item Name</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Current Stock</TableCell>
                  <TableCell>Threshold</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No products found.</TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item, idx) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>{item.threshold}</TableCell>
                      <TableCell>
                        <Box sx={{
                          backgroundColor: statusColors[item.status] || '#ccc',
                          color: '#000',
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          textAlign: 'center',
                          display: 'inline-block'
                        }}>
                          {item.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleOpenModal(item, idx)}><EditIcon /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(idx)}><DeleteIcon /></IconButton>
                        <IconButton color="secondary" onClick={() => navigate(`/insights/${item.id}`)}><InsightsIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

       {/* Add/Edit Modal */}
        <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editIndex !== null ? 'Edit Inventory Item' : 'Add Inventory Item'}
            <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 16, top: 16 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleFormSubmit}>
              <Stack spacing={2} mt={1}>
                <TextField label="Item Name" name="name" value={form.name} onChange={handleFormChange} required fullWidth />
                <TextField label="SKU" name="sku" value={form.sku} onChange={handleFormChange} required fullWidth />
                <TextField label="Price" name="price" type="number" value={form.price} onChange={handleFormChange} required inputProps={{ min: 0 }} fullWidth />
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select name="category" value={form.category} onChange={handleFormChange}>
                    <MenuItem value=""><em>Select Category</em></MenuItem>
                    {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField label="Current Stock" name="stock" type="number" value={form.stock} onChange={handleFormChange} required inputProps={{ min: 0 }} fullWidth />
                <TextField label="Threshold" name="threshold" type="number" value={form.threshold} onChange={handleFormChange} required inputProps={{ min: 0 }} fullWidth />
              </Stack>
              <DialogActions sx={{ mt: 2 }}>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit" variant="contained">{editIndex !== null ? 'Update' : 'Add'}</Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2200}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMsg}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        />

      </Box>
    </SidebarLayout>
  );
}
