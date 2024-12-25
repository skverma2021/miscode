import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import { useNavigate } from 'react-router-dom';
import Spinner from '../home/Spinner';
import SelectControl from '../util/SelectControl';

const JobAdd = () => {

  // State Variables
  const [job, setJob] = useState({
    description: '',
    clientId: '',
    ordDateStart: '',
    ordDateEnd: '',
    ordValue: '',
  });
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const [errNo, setErrNo] = useState(0);
  const [clients, setClients] = useState([]);

  // fetching data for state variables
  useEffect(() => {
    const fetchData = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(`http://localhost:3000/api/clients/select`);
        setClients(res.data);
        setStatus('Success');
      } catch (error) {
        setStatus('Error-Client');
      }
    };
    fetchData();
  }, []);

  // Navigation and TimeOut
  const navigate = useNavigate();
  let timeoutId;
  const goHome = () => {
    navigate('/');
  };
  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  // Handling events on the form
  const okSubmit = () => {
    if (!job.description) return false;
    if (!job.clientId) return false;
    if (!job.ordDateStart) return false;
    if (!job.ordDateEnd) return false;
    if (!job.ordValue) return false;
    if (Date.parse(job.ordDateEnd) - Date.parse(job.ordDateStart) < 0)
      return false;
    return true;
  };
  const onValChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };
  const postJobData = async (event) => {
    setStatus('busy');
    event.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/jobs', job);
      setStatus('Added');
      setMsg('Added Successfully');
      timeoutId = setTimeout(goHome, 10000);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
    }
  };

  // User Interface
  if (status === 'Error-Client') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error Loading Clients</h1>;
  }
  if (status === 'Error' && errNo == 500) {
    timeoutId = setTimeout(goHome, 10000);
    return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;
  }
  if (status === 'Added')
    return <h1 style={{ color: 'blue' }}>Record added successfully !</h1>;
  if (status === 'busy') return <Spinner />;
  return (
    <>
      <h4 style={{ color: 'red' }}>
        {status === 'Error' && errNo !== 500 && msg}
      </h4>
      <div
        style={{
          width: '100%',
          height: '100vh',
          border: '1px solid black',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h2>Add a Job</h2>
        <form onSubmit={postJobData}>
          <table style={{ lineHeight: '3' }}>
            <tbody>
              <tr>
                <td>
                  <label>Description:</label>
                </td>
                <td>
                  <input
                    name='description'
                    size={'60'}
                    value={job.description}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Client:</label>
                </td>
                <td>
                  <SelectControl
                    optionsRows={clients}
                    selectedId={job.clientId}
                    onSelect={(t) => setJob({ ...job, clientId: t })}
                    prompt={'Client'}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>StartDate:</label>
                </td>
                <td>
                  <input
                    name='ordDateStart'
                    type='date'
                    value={job.ordDateStart}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>EndDate:</label>
                </td>
                <td>
                  <input
                    name='ordDateEnd'
                    type='date'
                    value={job.ordDateEnd}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>OrderValue:</label>
                </td>
                <td>
                  <input
                    name='ordValue'
                    value={job.ordValue}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <button type='submit' disabled={!okSubmit()}>
                    Add
                  </button>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </>
  );
};

export default JobAdd;
