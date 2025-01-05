import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../home/Spinner';
import SelectControl from '../util/SelectControl';

function JobUpd() {

  // State Variables
  const [job, setJob] = useState({});
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const [errNo, setErrNo] = useState(0);
  const [clients, setClients] = useState([]);

  // fetching data for state variables
  const { jobId:id } = useParams();
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
  const onValChange = (rec) => {
    setJob({ ...job, [rec.propName]: rec.propValue });
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

  // User Interface
  if (status === 'Error-Client') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error Loading Clients</h1>;
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
                      return onValChange({
                        propName: 'description',
                        propValue: e.target.value,
                      });
                    }}
                  />
{/* Closure: The arrow function (e) => { ... } creates a closure that captures the onValChange function 
and the current state of job.description.

Access to onValChange: When the event occurs, the arrow function executes and 
uses the captured onValChange function to update the state.

Access to job.description: The function also has access to the current state of job.description, 
ensuring it reads the latest value when the event handler executes.

This closure ensures that the event handler retains access to onValChange and can 
update the state accurately, regardless of when the event occurs. 
It allows the event handler to "remember" the environment in which it was created, 
making it a powerful tool in React for managing state and handling events.

In React, JSX elements like <input /> are essentially syntactic sugar for React.createElement(). 
When you use JSX, it gets transpiled into React.createElement calls by tools like Babel.

In this context:

React.createElement generates a React element that describes what should be rendered.

The onChange attribute is assigned a function, creating a closure over its enclosing scope.

The closure ensures that the onChange function retains access to the job object 
and the onValChange function when the event occurs.

By returning React.createElement, React effectively maintains the connection 
between the event handler and its surrounding scope, 
enabling the input element to use the state and functions defined outside the React.createElement call.

This approach allows React to manage the rendering of elements and the creation of closures, 
facilitating consistent and predictable handling of events, state, and props within your components*/}

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
                    onSelect={(t) =>
                      onValChange({ propName: 'clientId', propValue: t })
                    }
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
                    value={job.ordDateStart || ''}
                    onChange={(e) => {
                      return onValChange({
                        propName: 'ordDateStart',
                        propValue: e.target.value,
                      });
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
                    value={job.ordDateEnd || ''}
                    onChange={(e) => {
                      return onValChange({
                        propName: 'ordDateEnd',
                        propValue: e.target.value,
                      });
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
                    value={job.ordValue || ''}
                    onChange={(e) => {
                      return onValChange({
                        propName: 'ordValue',
                        propValue: e.target.value,
                      });
                    }}
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
