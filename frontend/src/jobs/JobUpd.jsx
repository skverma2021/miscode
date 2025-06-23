import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import { useParams } from 'react-router-dom';
import Spinner from '../home/Spinner';
import SelectControl from '../util/SelectControl';
import GoHome from '../util/GoHome';

function JobUpd() {
  const [job, setJob] = useState({});
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const [errNo, setErrNo] = useState(0);
  const [clients, setClients] = useState([]);

  const { jobId: id } = useParams();

  useEffect(() => {
    const fetchClients = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(`http://localhost:3000/api/clients/select`);
        setClients(res.data);
        setStatus('Success');
      } catch {
        setStatus('Error-Client');
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
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
    fetchJob();
  }, [id]);

  const okSubmit = () => {
    if (!job.description || !job.clientId || !job.ordDateStart || !job.ordDateEnd || !job.ordValue)
      return false;
    return Date.parse(job.ordDateEnd) >= Date.parse(job.ordDateStart);
  };

  const onValChange = ({ propName, propValue }) => {
    setJob({ ...job, [propName]: propValue });
  };

  const updJobData = async (event) => {
    event.preventDefault();
    setStatus('busy');
    try {
      await axios.put(`http://localhost:3000/api/jobs/${id}`, job);
      setStatus('Updated');
      setMsg('Updated Successfully');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
    }
  };

  // Conditional UI rendering
  if (status === 'Error-Client') return <GoHome seconds={5} msg="Error Loading Clients" />;
  if (status === 'Error' && errNo === 500) return <GoHome seconds={10} msg={`Error: ${msg}`} />;
  if (status === 'Updated') return <GoHome seconds={1} msg={msg} />;
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
        <h2>Edit a Job</h2>
        <form onSubmit={updJobData}>
          <table style={{ lineHeight: '3' }}>
            <tbody>
              <tr>
                <td><label>JobDescription:</label></td>
                <td>
                  <input
                    name='description'
                    size='50'
                    value={job.description || ''}
                    onChange={(e) =>
                      onValChange({ propName: 'description', propValue: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td><label>Client:</label></td>
                <td>
                  <SelectControl
                    optionsRows={clients}
                    selectedId={job.clientId}
                    onSelect={(t) =>
                      onValChange({ propName: 'clientId', propValue: t })
                    }
                    prompt={'Client'}
                  />
                </td>
              </tr>
              <tr>
                <td><label>StartDate:</label></td>
                <td>
                  <input
                    name='ordDateStart'
                    type='date'
                    value={job.ordDateStart || ''}
                    onChange={(e) =>
                      onValChange({ propName: 'ordDateStart', propValue: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td><label>EndDate:</label></td>
                <td>
                  <input
                    name='ordDateEnd'
                    type='date'
                    value={job.ordDateEnd || ''}
                    onChange={(e) =>
                      onValChange({ propName: 'ordDateEnd', propValue: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td><label>OrderValue:</label></td>
                <td>
                  <input
                    name='ordValue'
                    value={job.ordValue || ''}
                    onChange={(e) =>
                      onValChange({ propName: 'ordValue', propValue: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <button type='submit' disabled={!okSubmit()}>
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

