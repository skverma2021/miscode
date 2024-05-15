import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../home/Spinner';

function JobUpd() {
  const [job, setJob] = useState({});
  const [clients, setClients] = useState([]);
  // const [formTouched, setFormTouched] = useState(false);
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const [clientStatus, setClientStatus] = useState('');
  const [errNo, setErrNo] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

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

  let timeoutId;
  const goHome = () => {
    navigate('/');
  };

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(`http://localhost:3000/api/jobs/${id}`);
        setJob(res.data[0]);
        setStatus('Success');
      } catch (error) {
        setStatus('Error');
        setMsg(errText(error));
        setErrNo(500);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setClientStatus('busy');
      try {
        const res = await axios.get(`http://localhost:3000/api/clients/short`);
        setClients(res.data);
        setClientStatus('Success');
      } catch (error) {
        setClientStatus('Error');
        setMsg(errText(error));
      }
    };
    fetchData();
  }, []);

  const onValChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
    // setFormTouched(true);
  };

  const updJobData = async (event) => {
    event.preventDefault();
    setStatus('busy');
    try {
      await axios.put(`http://localhost:3000/api/jobs/${id}`, job);
      setStatus('Updated');
      setMsg('Updated Successfully');
      timeoutId = setTimeout(goHome, 1000);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
    }
  };

  if (clientStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: Clients could not be loaded</h1>;
  }
  if (status === 'Error' && errNo == 500) {
    timeoutId = setTimeout(goHome, 10000);
    return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;
  }

  if (status === 'busy') return <Spinner />;

  if (status === 'Updated') return <h1 style={{ color: 'blue' }}>{msg}</h1>;

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
        <h2>Edit a Job</h2>
        <form onSubmit={updJobData}>
          <table style={{ lineHeight: '3' }}>
            <tbody>
              <tr>
                <td>
                  <label>JobDescription:</label>
                </td>
                <td>
                  <input
                    name='description'
                    size='50'
                    value={job.description || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                    // labelProps={{ shrink: !!job.description }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Client:</label>
                </td>
                <td>
                  <select
                    name='clientId'
                    id='clientId'
                    value={job.clientId || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  >
                    {/* <option value=''>Select Client</option> */}
                    {clients.map((c) => {
                      return (
                        <option key={c.id} value={c.id}>
                          {c.shortName}
                        </option>
                      );
                    })}
                  </select>
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
                    value={job.ordDateStart || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                    // labelProps={{ shrink: !!job.ordDateStart }}
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
                    value={job.ordDateEnd || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                    // labelProps={{ shrink: !!job.ordDateEnd }}
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
                    value={job.ordValue || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                    // labelProps={{ shrink: !!job.ordValue }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <button type='submit' disabled={!okSubmit() }>
                    Update
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
}

export default JobUpd;
