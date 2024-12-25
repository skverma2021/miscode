import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import { useNavigate } from 'react-router-dom';
import Spinner from '../home/Spinner';
import SelectControl from '../util/SelectControl';

function ClientAdd() {

  // State Variables
  const [client, setClient] = useState({
    shortName: '',
    longName: '',
    website: '',
    contactName: '',
    contactEMail: '',
    contactMobile: '',
    addLine1: '',
    street: '',
    cityId: '',
  });
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const [errNo, setErrNo] = useState(0);
  const [cities, setCities] = useState([]);

  // fetching data for state variables
  useEffect(() => {
    const fetchData = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(`http://localhost:3000/api/cities/select`);
        setCities(res.data);
        setStatus('Success');
      } catch (error) {
        setStatus('Error-City');
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
    if (!client.shortName) return false;
    if (!client.longName) return false;
    if (!client.website) return false;
    if (!client.contactName) return false;
    if (!client.contactEMail) return false;
    if (!client.contactMobile) return false;
    if (!client.addLine1) return false;
    if (!client.cityId) return false;
    if (!client.street) return false;
    return true;
  };
  const onValChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };
  const postClientData = async (event) => {
    event.preventDefault();
    setStatus('busy');
    try {
      await axios.post(`http://localhost:3000/api/clients`, client);
      setStatus('Added');
      setMsg('Added Successfully');
      timeoutId = setTimeout(goHome, 1000);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
    }
  };

  // User Interface
  if (status === 'Error-City') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error Loading Cities</h1>;
  }
  if (status === 'Error' && errNo == 500) {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;
  }
  if (status === 'busy') return <Spinner />;
  if (status === 'Added') return <h1 style={{ color: 'blue' }}>{msg}</h1>;

  return (
    <>
      <h4 style={{ color: 'red' }}>
        {status === 'Error' && errNo !== 500 && msg}
      </h4>
      <div
        style={{
          width: '100%',
          height: '100vh',
          border: '0px solid black',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h2>Add a Client</h2>
        <form onSubmit={postClientData}>
          <table style={{ lineHeight: '3' }}>
            <tbody>
              <tr>
                <td>
                  <label>ShortName:</label>
                </td>
                <td>
                  <input
                    name='shortName'
                    value={client.shortName || ''}
                    required
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>LongName:</label>
                </td>
                <td>
                  <input
                    name='longName'
                    value={client.longName || ''}
                    required
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>WebSite:</label>
                </td>
                <td>
                  <input
                    name='website'
                    type='url'
                    required
                    value={client.website || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>ContactName:</label>
                </td>
                <td>
                  <input
                    name='contactName'
                    value={client.contactName || ''}
                    required
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>ContactEMail:</label>
                </td>
                <td>
                  <input
                    name='contactEMail'
                    value={client.contactEMail || ''}
                    type='email'
                    required
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>ContactMobile:</label>
                </td>
                <td>
                  <input
                    name='contactMobile'
                    value={client.contactMobile || ''}
                    type='number'
                    required
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>AddLine1:</label>
                </td>
                <td>
                  <input
                    name='addLine1'
                    required
                    value={client.addLine1 || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>City:</label>
                </td>
                <td>
                  <SelectControl
                    optionsRows={cities}
                    selectedId={client.cityId}
                    onSelect={(t) => setClient({ ...client, cityId: t })}
                    prompt={'City'}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Street:</label>
                </td>
                <td>
                  <input
                    name='street'
                    value={client.street || ''}
                    required
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
}

export default ClientAdd;
