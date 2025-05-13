import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { errText, errNumber } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import GoHome from '../util/GoHome'; // imported for error/success transitions

const Emps = () => {
  // Column definitions for the Data Grid
  const columns = [
    { headerName: 'ID', width: 40, field: 'id', type: 'number' },
    { headerName: 'Name', width: 175, field: 'empFullName', sortable: true },
    { headerName: 'Designation', width: 200, field: 'theDesig', sortable: true },
    { headerName: 'Department', width: 200, field: 'theDeptt', sortable: true },
    { headerName: 'DOB', width: 100, field: 'theDob' },
    { headerName: 'Address', width: 150, field: 'addLine1' },
    { headerName: 'City', width: 75, field: 'theCity', sortable: true },
    { headerName: 'Mobile', width: 125, field: 'mobile', sortable: true },
    { headerName: 'EMail', width: 175, field: 'eMailId' },
    {
      headerName: 'update',
      width: 50,
      field: 'link1',
      renderCell: (params) => <Link to={`./upd/${params.id}`}>🖍️</Link>,
    },
    {
      headerName: 'del',
      width: 50,
      field: 'link2',
      renderCell: (params) => (
        <Link onClick={() => deleteEmpData(`${params.id}`)}>🗑️</Link>
      ),
    },
    {
      headerName: 'PT',
      width: 50,
      field: 'link3',
      renderCell: (params) => <Link to={`./tp/${params.id}`}>↗️</Link>,
    },
  ];

  // State Variables
  const [emps, setEmps] = useState([]);
  const [msg, setMsg] = useState('');
  const [errNo, setErrNo] = useState(0);
  const [status, setStatus] = useState('');

  // Fetching all employees
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
    }
  };

  useEffect(() => {
    getAllEmps();
  }, []);

  // Delete an employee
  const deleteEmpData = async (id) => {
    setStatus('busy');
    try {
      const res = await axios.delete(`http://localhost:3000/api/emps/${id}`);
      setMsg(res.data.msg);
      setStatus('Deleted');
    } catch (error) {
      setMsg(errText(error));
      setErrNo(errNumber(error));
      setStatus('Error');
    }
  };

  // Conditional UI
  if (status === 'Error') return <GoHome secs={10000} msg={`Error ${errNo}: ${msg}`} />;
  if (status === 'Deleted') return <GoHome secs={2000} msg={msg} />;
  if (status === 'busy') return <Spinner />;

  // Main UI
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
