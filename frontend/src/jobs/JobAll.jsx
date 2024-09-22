import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import { useNavigate } from 'react-router-dom';

const JobAll = () => {
  const columns = [
    {
      headerName: 'JobID',
      footerName: 'JobID',
      field: 'id',
      width: 50,
      type: 'number',
      sortable: true,
    },
    {
      headerName: 'JobDescription',
      footerName: 'JobDescription',
      field: 'description',
      width: 350,
      type: 'text',
      sortable: true,
    },
    {
      headerName: 'Client',
      footerName: 'Client',
      field: 'shortName',
      width: 100,
      type: 'text',
      sortable: true,
    },
    {
      headerName: 'StartDate',
      footerName: 'StartDate',
      field: 'theStart',
      width: 140,
      type: 'text',
      sortable: true,
    },
    {
      headerName: 'EndDate',
      footerName: 'EndDate',
      field: 'theEnd',
      width: 140,
      type: 'text',
      sortable: true,
    },
    {
      headerName: 'OrdValue',
      footerName: 'OrdValue',
      field: 'ordValue',
      width: 100,
      type: 'text',
      sortable: true,
    },
    {
      headerName: 'Allotted',
      footerName: 'Allotted',
      field: 'allotted',
      width: 100,
      type: 'text',
      sortable: true,
    },
    {
      headerName: 'Booked',
      footerName: 'Booked',
      field: 'bookedSoFar',
      width: 100,
      type: 'text',
      sortable: true,
    },
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
      width: 80,
      renderCell: (params) => <Link to={`./exAdd/${params.id}`}>WorkPlans</Link>
      ,
    },
    {
      headerName: 'Del',
      field: 'link4',
      width: 80,
      renderCell: (params) => <Link onClick={() => deleteJobData(`${params.id}`)}> 🗑️</Link>
      ,
    },
  ];
  const [jobs, setJobs] = useState([]);
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  let timeoutId;
  const goHome = () => {
    navigate('/');
  };

  // Clear the timer
  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  // get all jobs when the component mounts
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
      timeoutId = setTimeout(goHome, 2000);
    }
  };

  const deleteJobData = async (t) => {
    setStatus('busy');
    try {
      await axios.delete(`http://localhost:3000/api/jobs/${t}`);
      setStatus('Deleted');
      setMsg('Successfully Deleted.');
      timeoutId = setTimeout(goHome, 2000);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      timeoutId = setTimeout(goHome, 10000);
    }
  };

  if (status === 'Error') return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;
  if (status === 'Deleted') return <h1 style={{ color: 'blue' }}>{msg}</h1>;
  if (status === 'busy') return <Spinner />;

  return (
    <div sx={{ height: 700, width: '100%' }}>
      <DataGrid
        rows={jobs}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 15]}
      />
    </div>
  );
};

export default JobAll;
