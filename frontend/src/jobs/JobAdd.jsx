import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import { useNavigate } from 'react-router-dom';
import Spinner from '../home/Spinner';
import SelectControl from '../util/SelectControl';
import GoHome from '../util/GoHome';

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

  // Form validation
  const okSubmit = () => {
    if (!job.description || !job.clientId || !job.ordDateStart || !job.ordDateEnd || !job.ordValue)
      return false;
    if (Date.parse(job.ordDateEnd) < Date.parse(job.ordDateStart)) return false;
    return true;
  };

  const onValChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const postJobData = async (event) => {
    event.preventDefault();
    setStatus('busy');
    try {
      await axios.post('http://localhost:3000/api/jobs', job);
      setStatus('Added');
      setMsg('Record added successfully!');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
    }
  };

  // Conditional UI Rendering
  if (status === 'Error-Client') {
    return <GoHome wait={5000} msg="Error loading clients!" color="red" />;
  }

  if (status === 'Error' && errNo === 500) {
    return <GoHome wait={10000} msg={`Server Error: ${msg}`} color="red" />;
  }

  if (status === 'Added') {
    return <GoHome wait={5000} msg={msg} color="blue" />;
  }

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
                <td><label>Description:</label></td>
                <td>
                  <input
                    name="description"
                    size="60"
                    value={job.description}
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Client:</label></td>
                <td>
                  <SelectControl
                    optionsRows={clients}
                    selectedId={job.clientId}
                    onSelect={(t) => setJob({ ...job, clientId: t })}
                    prompt="Client"
                  />
                </td>
              </tr>
              <tr>
                <td><label>StartDate:</label></td>
                <td>
                  <input
                    name="ordDateStart"
                    type="date"
                    value={job.ordDateStart}
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label>EndDate:</label></td>
                <td>
                  <input
                    name="ordDateEnd"
                    type="date"
                    value={job.ordDateEnd}
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label>OrderValue:</label></td>
                <td>
                  <input
                    name="ordValue"
                    value={job.ordValue}
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <button type="submit" disabled={!okSubmit()}>
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

export default JobAdd;
