import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import GoHome from '../util/GoHome';

const JobAll = () => {
  // Columns for DataGrid
  const columns = [
    { headerName: 'JobID', field: 'id', width: 50, type: 'number', sortable: true },
    { headerName: 'JobDescription', field: 'description', width: 350, type: 'text', sortable: true },
    { headerName: 'Client', field: 'shortName', width: 100, type: 'text', sortable: true },
    { headerName: 'StartDate', field: 'theStart', width: 140, type: 'text', sortable: true },
    { headerName: 'EndDate', field: 'theEnd', width: 140, type: 'text', sortable: true },
    { headerName: 'OrdValue', field: 'ordValue', width: 100, type: 'text', sortable: true },
    { headerName: 'Allotted', field: 'allotted', width: 100, type: 'text', sortable: true },
    { headerName: 'Booked', field: 'bookedSoFar', width: 100, type: 'text', sortable: true },
    {
      headerName: 'Status',
      field: 'link1',
      width: 80,
      renderCell: (params) => <Link to={`./exPlan/${params.id}`}>status</Link>,
    },
    {
      headerName: 'upd',
      field: 'link2',
      width: 80,
      renderCell: (params) => <Link to={`./upd/${params.id}`}>updJob</Link>,
    },
    {
      headerName: 'ExPlan',
      field: 'link3',
      width: 100,
      renderCell: (params) => <Link to={`./workPlan/${params.id}`}>WorkPlans</Link>,
    },
    {
      headerName: 'Del',
      field: 'link4',
      width: 80,
      renderCell: (params) => (
        <Link onClick={() => deleteJobData(`${params.id}`)}>🗑️</Link>
      ),
    },
  ];

  // State
  const [jobs, setJobs] = useState([]);
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');

  // Fetch all jobs
  useEffect(() => {
    getAllJobs();
  }, []);

  const getAllJobs = async () => {
    setStatus('busy');
    try {
      const res = await axios.get(`http://localhost:3000/api/jobs`);
      setJobs(res.data);
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

  // Handle Delete
  const deleteJobData = async (t) => {
    setStatus('busy');
    try {
      await axios.delete(`http://localhost:3000/api/jobs/${t}`);
      setStatus('Deleted');
      setMsg('Successfully Deleted.');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

  // UI
  if (status === 'Error') return <GoHome wait={3000} msg={`Error: ${msg}`} color="red" />;
  if (status === 'Deleted') return <GoHome wait={2000} msg={msg} color="blue" />;
  if (status === 'busy') return <Spinner />;

  return (
    <div sx={{ height: 700, width: '100%' }}>
      <DataGrid
        rows={jobs}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[5, 10, 15]}
      />
    </div>
  );
};

export default JobAll;

