import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import SelectControl from '../util/SelectControl';
import GoHome from '../util/GoHome';

function ClientAdd() {
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

  // Load city options
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

  // Form validation
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

  const postClientData = async (event) => {
    event.preventDefault();
    setStatus('busy');
    try {
      await axios.post(`http://localhost:3000/api/clients`, client);
      setStatus('Added');
      setMsg('Added Successfully');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
    }
  };

  // Conditional renders
  if (status === 'Error-City') {
    return <GoHome msg='Error Loading Cities' secs={5000} />;
  }
  if (status === 'Error' && errNo === 500) {
    return <GoHome msg={`Error: ${msg}`} secs={5000} />;
  }
  if (status === 'Added') {
    return <GoHome msg={msg} secs={1000} />;
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
                    required
                    value={client.website || ''}
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
                    value={client.contactEMail || ''}
                    type='email'
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
                    value={client.contactMobile || ''}
                    type='number'
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
                    required
                    value={client.addLine1 || ''}
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
                    prompt={'City'}
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
