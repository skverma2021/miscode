import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { errText, errNumber } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import { useNavigate } from 'react-router-dom';

// npm i @mui/material @emotion/react @emotion/styled
// npm i @mui/x-data-grid

const Emps = () => {
  
  // Column definitions for the Data Grid
  const columns = [
    {
      headerName: 'ID',
      width: 40,
      field: 'id',
      type: 'number',
    },
    {
      headerName: 'Name',
      width: 175,
      field: 'empFullName',
      sortable: true,
    },
    {
      headerName: 'Designation',
      width: 200,
      field: 'theDesig',
      sortable: true,
    },
    {
      headerName: 'Department',
      width: 200,
      field: 'theDeptt',
      sortable: true,
    },
    {
      headerName: 'DOB',
      width: 100,
      field: 'theDob',
    },
    {
      headerName: 'Address',
      width: 150,
      field: 'addLine1',
    },
    {
      headerName: 'City',
      width: 75,
      field: 'theCity',
      sortable: true,
    },
    {
      headerName: 'Mobile',
      width: 125,
      field: 'mobile',
      sortable: true,
    },
    {
      headerName: 'EMail',
      width: 175,
      field: 'eMailId',
    },
    {
      headerName: 'update',
      width: 50,
      field: 'link1',
      renderCell: (params) => <Link to={`./upd/${params.id}`}> 🖍️</Link>,
    },
    {
      headerName: 'del',
      width: 50,
      field: 'link2',
      renderCell: (params) => (
        <Link onClick={() => deleteEmpData(`${params.id}`)}> 🗑️</Link>
      ),
    },
    {
      headerName: 'PT',
      width: 50,
      field: 'link3',
      renderCell: (params) => <Link to={`./tp/${params.id}`}> ↗️</Link>,
    },
  ];

  // State Variables
  const [emps, setEmps] = useState([]);
  const [msg, setMsg] = useState('');
  const [errNo, setErrNo] = useState(0);
  const [status, setStatus] = useState('');
  
  // fetching rows
  const getAllEmps = async () => {
    setStatus('busy');
    try {
      const res = await axios.get(`http://localhost:3000/api/emps`);
      setEmps(res.data);
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
      timeoutId = setTimeout(goHome, 10000);
    }
  }; 
  useEffect(() => {
    getAllEmps();
  }, []); // Run the function when the component mounts
  
  // Navigation and TimeOut
  const navigate = useNavigate();
  let timeoutId;
  const goHome = () => {
    navigate('/');
  };
  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  // Handling Events on the Form
  const deleteEmpData = async (t) => {
    setStatus('busy');
    try {
      const res = await axios.delete(`http://localhost:3000/api/emps/${t}`);
      setStatus('Deleted');
      setMsg(res.data.msg);
      timeoutId = setTimeout(goHome, 2000);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
      timeoutId = setTimeout(goHome, 10000);
    }
  };

// User Interface
  if (status === 'Error') return <h1 style={{ color: 'red' }}>Error {errNo}: {msg}</h1>;
  if (status === 'Deleted') return <h1 style={{ color: 'blue' }}>{msg}</h1>;
  if (status === 'busy') return <Spinner />;

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={emps}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 15, 20, 25]}
      />
    </div>
  );
};

export default Emps;
