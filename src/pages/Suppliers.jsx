import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography, Rating, Stack, MenuItem, Select, Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search } from '@mui/icons-material';
import SidebarLayout from '../components/SidebarLayout';
import axios from "axios";

export default function Suppliers() {
  const [apiError, setApiError] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    supplier_name: "",
    supplier_contactnum: "",
    supplier_email: "",
    supplier_address: "",
    supplier_category: "",
    lead_time: 0,
    supplier_rating: 0
  });
  const [snackbar, setSnackbar] = useState({ open: false, msg: "" });

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/suppliers");
      setSuppliers(res.data);
      setApiError(null);
    } catch (err) {
      setApiError("Error fetching suppliers. Please check backend.");
      console.error("Error fetching suppliers", err);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleOpen = (supplier) => {
    if (supplier) {
      setEditSupplier(supplier.supplier_id);
      setForm(supplier);
    } else {
      setEditSupplier(null);
      setForm({
        supplier_name: "",
        supplier_contactnum: "",
        supplier_email: "",
        supplier_address: "",
        supplier_category: "",
        lead_time: 0,
        supplier_rating: 0
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleRatingChange = (e, value) => setForm((prev) => ({ ...prev, supplier_rating: value }));

  const handleSubmit = async () => {
    try {
      if (editSupplier) {
        await axios.put(`http://localhost:5000/api/suppliers/${editSupplier}`, form);
        setSnackbar({ open: true, msg: "Supplier updated!" });
      } else {
        await axios.post("http://localhost:5000/api/suppliers", form);
        setSnackbar({ open: true, msg: "Supplier added!" });
      }
      fetchSuppliers();
      handleClose();
    } catch (err) {
      console.error("Error saving supplier", err);
      setSnackbar({ open: true, msg: "Error saving supplier" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this supplier?")) {
      try {
        await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
        fetchSuppliers();
        setSnackbar({ open: true, msg: "Supplier deleted!" });
      } catch (err) {
        console.error("Error deleting supplier", err);
        setSnackbar({ open: true, msg: "Error deleting supplier" });
      }
    }
  };

  return (
    <SidebarLayout>
      <Box p={3}>
        {/* Error message */}
        {apiError && <Typography color="error" align="center">{apiError}</Typography>}

        {/* Header with search */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 4, mt: 1, color: '#2E3A8C' }}>Suppliers </Typography>
          <Box display="flex" gap={2}>
            <TextField
              size="small"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <Search /> }}
            />
            <Button startIcon={<AddIcon />} variant="contained" onClick={() => handleOpen()}>
              Add Supplier
            </Button>
          </Box>
        </Box>

        {/* Supplier Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
  <TableRow>
    <TableCell>Name</TableCell>
    <TableCell>Contact</TableCell>
    <TableCell>Email</TableCell>
    <TableCell>Address</TableCell>
    <TableCell>Lead Time (days)</TableCell>
    <TableCell>Rating</TableCell>
    <TableCell>Actions</TableCell>
  </TableRow>
  </TableHead>
    <TableBody>
      {suppliers
        .filter(s => s.supplier_name.toLowerCase().includes(search.toLowerCase()))
        .map((s) => (
          <TableRow key={s.supplier_id}>
            <TableCell>{s.supplier_name}</TableCell>
            <TableCell>{s.supplier_contactnum}</TableCell>
            <TableCell>{s.supplier_email}</TableCell>
            <TableCell>{s.supplier_address}</TableCell>
            <TableCell>{s.lead_time}</TableCell>
            <TableCell>
              <Rating value={Number(s.supplier_rating) || 0} readOnly size="small" />
            </TableCell>
            <TableCell>
              <IconButton onClick={() => handleOpen(s)}><EditIcon /></IconButton>
              <IconButton color="error" onClick={() => handleDelete(s.supplier_id)}><DeleteIcon /></IconButton>
            </TableCell>
          </TableRow>
      ))}
  </TableBody>

            </Table>
          </TableContainer>
        </Paper>

        {/* Add/Edit Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editSupplier ? "Edit Supplier" : "Add Supplier"}
            <IconButton onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField label="Name" name="supplier_name" value={form.supplier_name} onChange={handleChange} fullWidth />
              <TextField label="Contact Number" name="supplier_contactnum" value={form.supplier_contactnum} onChange={handleChange} fullWidth />
              <TextField label="Email" name="supplier_email" value={form.supplier_email} onChange={handleChange} fullWidth />
              <TextField label="Address" name="supplier_address" value={form.supplier_address} onChange={handleChange} fullWidth />
              <TextField label="Category" name="supplier_category" value={form.supplier_category} onChange={handleChange} fullWidth />
              <TextField type="number" label="Lead Time (days)" name="lead_time" value={form.lead_time} onChange={handleChange} fullWidth />
              <Box>
                <Typography gutterBottom>Rating</Typography>
                <Rating name="supplier_rating" value={form.supplier_rating} onChange={handleRatingChange} />
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.msg}
        />
      </Box>
    </SidebarLayout>
  );
}
