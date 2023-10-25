"use client"
import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux'; // Import Provider
import store from '@/app/store'
import { RingLoader } from 'react-spinners';

import { startLoading, stopLoading } from "@/features/loading/loadingSlice";
import { MaterialReactTable } from 'material-react-table';
import Swal from 'sweetalert2';

export default function Home() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading);
  const [dataFetched, setDataFetched] = useState(false); // Track whether data has been fetched


  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [data, setData] = useState([
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Sara', age: 25 },
  ]);

  const handleRowSelect = (selectedRowIds) => {
    setSelectedRowIds(selectedRowIds);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeAddModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (rowIndex) => {
    setEditRowIndex(rowIndex);
    setIsEditModalOpen(true);
    if (rowIndex !== null) {
      // Populate the edit modal with the selected row data
      const selectedRow = data.find((row) => row.id === rowIndex);
      setName(selectedRow.name);
      setAge(selectedRow.age.toString());
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditRowIndex(null);
    // Clear input fields
    setName('');
    setAge('');
  };

  const addData = () => {
    console.log('Add button clicked');

    if (name.trim() === '' || isNaN(age)) {
      console.log('Invalid data');
      return;
    }

    const newId = data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1; // Calculate a new unique ID
    const newRow = { id: newId, name, age: parseInt(age) };
    const newData = [...data, newRow];

    console.log('Before setData', data);
    setData(newData);
    console.log('After setData', newData);

    setName('');
    setAge('');
    closeAddModal();
  };

  const editData = () => {
    if (editRowIndex === null || name.trim() === '' || isNaN(age)) {
      return;
    }

    const updatedData = data.map((row) =>
      row.id === editRowIndex ? { id: editRowIndex, name, age: parseInt(age) } : row
    );
    setData(updatedData);
    closeEditModal();
  };

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Name",
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorFn: (row) => row.age,
      id: "age",
      header: "Age",
      Header: <i style={{ color: "red" }}>Age</i>,
    },
    {
      id: 'delete',
      header: 'Delete',
      Cell: ({ row }) => (
        <Button onClick={() => handleDelete(row.original)} color="error" >
          Delete
        </Button>
      ),
    },
  ], []);

  const handleDelete = (row) => {
    if (!row) {
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${row.name} . This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData = data.filter((rowData) => rowData.id !== row.id);
        setData(updatedData);
        setSelectedRowIds([]); // Clear selected row IDs
        Swal.fire('Deleted!', 'The row has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The row was not deleted.', 'error');
      }
    });
  };

  const fetchData = () => {
    dispatch(startLoading());

    // Simulate an async data fetch (replace with your actual data fetching logic)
    setTimeout(() => {
      // Data fetching is done
      dispatch(stopLoading());
      setDataFetched(true); // Set dataFetched to true
    }, 2000); // Simulate a 2-second delay
  };

  const LoadingSpinner = () => (
    <div className="w-full h-full flex items-center justify-center">
      <RingLoader size={100} color={'#123abc'} loading={true} />
    </div>
  );

  return (
    <>
      <div className="h-full flex items-center justify-center">
        <Button className="m-auto" onClick={fetchData}>
          Fetch Data
        </Button>
      </div>
      {isLoading ? <LoadingSpinner /> : dataFetched ? (
        <main className="flex min-h-screen flex-col items-center justify-between p-5">
          <MaterialReactTable
            columns={columns}
            data={data}
            enableRowSelection
            renderTopToolbarCustomActions={({ table }) => (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button onClick={openModal}>Add</Button>
                <Button
                  disabled={!table.getIsSomeRowsSelected()}
                  onClick={() => openEditModal(table.getSelectedRowModel().flatRows[0]?.original.id)}
                >
                  Edit
                </Button>
              </div>
            )}
          />
          <Modal open={isModalOpen} onClose={closeAddModal}>
            <Box
              sx={{
                backgroundColor: "white",
                height: "300px",
                width: "300px",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                padding: "5px",
              }}
            >
              <Typography variant="h6">Add New Data</Typography>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button onClick={addData}>Add</Button>
            </Box>
          </Modal>
          <Modal open={isEditModalOpen} onClose={closeEditModal}>
            <Box
              sx={{
                backgroundColor: "white",
                height: "300px",
                width: "300px",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                padding: "5px",
              }}
            >
              <Typography variant="h6">Edit Data</Typography>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button onClick={editData}>Edit</Button>
            </Box>
          </Modal>
        </main>
      ) : null}
    </>
  );
}
