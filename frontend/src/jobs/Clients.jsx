import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import GoHome from '../util/GoHome';

const Clients = () => {
  // Column definitions for the Data Grid
  const columns = [
    {
      headerName: 'ID',
      footerName: 'ID',
      field: 'id',
      width: 25,
      type: 'number',
      sortable: true,
    },
    {
      headerName: 'ShortName',
      footerName: 'ShortName',
      field: 'shortName',
      width: 55,
      type: 'text',
      sortable: true,
    },
    {
      headerName: 'FullName',
      footerName: 'FullName',
      field: 'fullName',
      width: 125,
      type: 'text',
      sortable: true,
    },
    {
      headerName: 'Website',
      footerName: 'Website',
      field: 'webSite',
      width: 125,
      type: 'text',
      sortable: true,
    },
    {
      headerName: 'ContactName',
      footerName: 'ContactName',
      field: 'contactName',
      width: 100,
      type: 'text',
      sortable: true,
    },
    {
      headerName: 'Email',
      footerName: 'Email',
      field: 'eMail',
      width: 160,
      type: 'text',
      sortable: true,
    },
    {
      headerName: 'Mobile',
      footerName: 'Mobile',
      field: 'mobile',
      width: 100,
      type: 'number',
      sortable: true,
    },
    {
      headerName: 'Address',
      footerName: 'Address',
      field: 'address',
      width: 175,
      type: 'text',
      sortable: true,
    },
    {
      headerName: 'Street',
      footerName: 'Street',
      field: 'street',
      width: 100,
      type: 'text',
      sortable: true,
    },
    {
      headerName: 'City',
      footerName: 'City',
      field: 'city',
      width: 75,
      type: 'text',
      sortable: true,
    },
    {
      headerName: 'OrderVal',
      footerName: 'OrderVal',
      field: 'totalOrdVal',
      width: 100,
      type: 'number',
      sortable: true,
    },
    {
      headerName: 'Orders',
      footerName: 'Orders',
      field: 'noOfOrders',
      width: 60,
      type: 'number',
      sortable: true,
    },
    {
      headerName: 'Upd',
      width: 40,
      field: 'link1',
      renderCell: (params) => <Link to={`./upd/${params.id}`}> 🖍️</Link>,
    },
    {
      headerName: 'del',
      width: 40,
      field: 'link2',
      renderCell: (params) => (
        <Link onClick={() => deleteClientData(`${params.id}`)}> 🗑️</Link>
      ),
    },
  ];

  // State Variables
  const [clients, setClients] = useState([]);
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');

  // fetching rows
  useEffect(() => {
    getAllClients();
  }, []);

  const getAllClients = async () => {
    setStatus('busy');
    try {
      const res = await axios.get(`http://localhost:3000/api/clients`);
      setClients(res.data);
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

  // Handling Delete
  const deleteClientData = async (t) => {
    setStatus('busy');
    try {
      await axios.delete(`http://localhost:3000/api/clients/${t}`);
      setStatus('Deleted');
      setMsg('Successfully Deleted.');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

  // Conditional Rendering
  if (status === 'Error') return <GoHome secs={10000} msg={`Error: ${msg}`} />;
  if (status === 'Deleted') return <GoHome secs={2000} msg={msg} />;
  if (status === 'busy') return <Spinner />;

  // UI
  return (
    <div sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={clients}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
};

export default Clients;
