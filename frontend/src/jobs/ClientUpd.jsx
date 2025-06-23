// ClientUpd.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import { useParams } from 'react-router-dom';
import Spinner from '../home/Spinner';
import SelectControl from '../util/SelectControl';
import GoHome from '../util/GoHome';

function ClientUpd() {
  const [client, setClient] = useState({});
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const [errNo, setErrNo] = useState(0);
  const [cities, setCities] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const fetchCities = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(`http://localhost:3000/api/cities/select`);
        setCities(res.data);
        setStatus('Success');
      } catch (error) {
        setStatus('Error-City');
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchClient = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(`http://localhost:3000/api/clients/${id}`);
        setClient(res.data[0]);
        setStatus('Success');
      } catch (error) {
        setStatus('Error-Fetch');
        setMsg(errText(error));
      }
    };
    fetchClient();
  }, [id]);

  const okSubmit = () => {
    return (
      client.shortName &&
      client.longName &&
      client.website &&
      client.contactName &&
      client.contactEMail &&
      client.contactMobile &&
      client.addLine1 &&
      client.cityId &&
      client.street
    );
  };

  const onValChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const updClientData = async (event) => {
    event.preventDefault();
    setStatus('busy');
    try {
      await axios.put(`http://localhost:3000/api/clients/${id}`, client);
      setStatus('Updated');
      setMsg('Updated Successfully');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
    }
  };

  // Redirects and Messages
  if (status === 'Error-City') {
    return <GoHome msg='Error Loading Cities' time={5000} />;
  }

  if (status === 'Error-Fetch') {
    return <GoHome msg='Error Fetching record for updations' time={5000} />;
  }

  if (status === 'Error' && errNo === 500) {
    return <GoHome msg={'Error: ' + msg} time={10000} />;
  }

  if (status === 'Updated') {
    return <GoHome msg={msg} time={1000} color='blue' />;
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
        <h2>Edit a Client</h2>
        <form onSubmit={updClientData}>
          <table style={{ lineHeight: '3' }}>
            <tbody>
              <tr>
                <td><label>ShortName:</label></td>
                <td>
                  <input
                    name='shortName'
                    value={client.shortName || ''}
                    required
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label>LongName:</label></td>
                <td>
                  <input
                    name='longName'
                    value={client.longName || ''}
                    required
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label>WebSite:</label></td>
                <td>
                  <input
                    name='website'
                    type='url'
                    value={client.website || ''}
                    required
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label>ContactName:</label></td>
                <td>
                  <input
                    name='contactName'
                    value={client.contactName || ''}
                    required
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label>ContactEMail:</label></td>
                <td>
                  <input
                    name='contactEMail'
                    type='email'
                    value={client.contactEMail || ''}
                    required
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label>ContactMobile:</label></td>
                <td>
                  <input
                    name='contactMobile'
                    type='number'
                    value={client.contactMobile || ''}
                    required
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label>AddLine1:</label></td>
                <td>
                  <input
                    name='addLine1'
                    value={client.addLine1 || ''}
                    required
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label>City:</label></td>
                <td>
                  <SelectControl
                    optionsRows={cities}
                    selectedId={client.cityId}
                    onSelect={(t) => setClient({ ...client, cityId: t })}
                    prompt='City'
                  />
                </td>
              </tr>
              <tr>
                <td><label>Street:</label></td>
                <td>
                  <input
                    name='street'
                    value={client.street || ''}
                    required
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <button type='submit' disabled={!okSubmit()}>Update</button>
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

export default ClientUpd;
