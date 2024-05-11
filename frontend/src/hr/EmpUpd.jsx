import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../home/Spinner';

const EmpUpd = () => {
  const [emp, setEmp] = useState({});
  const [cities, setCities] = useState([]);
  const [msg, setMsg] = useState('');
  const [cityStatus, setCityStatus] = useState('');
  const [recStatus, setRecStatus] = useState('');
  const [status, setStatus] = useState('');
  const [errNo, setErrNo] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();

  const okSubmit = () => {
    if (!emp.uId) return false;
    if (!emp.fName) return false;
    if (!emp.title) return false;
    if (!emp.dob) return false;
    if (!emp.gender) return false;
    if (!emp.addLine1) return false;
    if (!emp.cityId) return false;
    if (!emp.mobile) return false;
    if (!emp.eMailId) return false;
    if (!emp.passwd) return false;
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
    const fetchCityData = async () => {
      try {
        setCityStatus('busy');
        const res = await axios.get(`http://localhost:3000/api/cities`);
        setCities(res.data);
        setCityStatus('Success');
      } catch (error) {
        setCityStatus('Error');
      }
    };
    fetchCityData();
  }, []);

  useEffect(() => {
    const fetchEmpData = async () => {
      try {
        setRecStatus('busy');
        const res = await axios.get(`http://localhost:3000/api/emps/${id}`);
        setEmp(res.data[0]);
        setRecStatus('Success');
        console.log(recStatus)
      } catch (error) {
        setRecStatus('Error');
        setMsg(errText(error));
        setErrNo(errNumber(error));
      }
    };
    fetchEmpData();
  }, []);


  const onValChange = (e) => {
    setEmp({ ...emp, [e.target.name]: e.target.value });
  };

  const updEmpData = async (event) => {
    event.preventDefault();
    try {
      setStatus('busy');
      const res = await axios.put(`http://localhost:3000/api/emps/${id}`, emp);
      setStatus('Updated');
      setMsg(res.data.msg);
      timeoutId = setTimeout(goHome, 500);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
    }
  };

  if (cityStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: City Names could not be loaded</h1>;
  }
  if (recStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: Record for updation could not be loaded</h1>;
  }

  if (status === 'Error' && errNo == 500) {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;
  }

  if (status === 'Error' && errNo !== 2627 && errNo !== 2601) {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error {errNo}: {msg}</h1>;
  }

  if (status === 'busy') return <Spinner />;

  if (status === 'Updated') return <h1 style={{ color: 'blue' }}>{msg}</h1>;

  return (
    <>
      <h4 style={{ color: 'red' }}>
        {status === 'Error' && (errNo == 2627 || errNo == 2601) && msg}
      </h4>
      <div
        style={{
          marginTop: '50px',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <form onSubmit={updEmpData}>
          <table style={{ lineHeight: '35px', tableLayout: 'fixed' }}>
            <tbody>
              <tr>
                <td colSpan={3}>
                  <h2>Edit an Employee</h2>
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <strong>Unique ID</strong>
                </td>
                <td>:</td>
                <td>
                  <input
                    name='uId'
                    value={emp.uId || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>First Name:</strong>
                </td>
                <td>:</td>
                <td>
                  <input
                    name='fName'
                    minLength={3}
                    required
                    value={emp.fName || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Middle Name</strong>
                </td>
                <td>:</td>
                <td>
                  <input
                    name='mName'
                    value={emp.mName || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Surname</strong>
                </td>
                <td>:</td>
                <td>
                  <input
                    name='sName'
                    value={emp.sName || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Title</strong>
                </td>
                <td>:</td>
                <td>
                  <div style={{ display: 'flex' }}>
                    <input
                      type='radio'
                      id='Mr'
                      name='title'
                      value='Mr'
                      checked={emp.title == 'Mr'}
                      onChange={(e) => {
                        return onValChange(e);
                      }}
                    />
                      <label htmlFor='Mr'>Mr</label>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <input
                      type='radio'
                      id='Ms'
                      name='title'
                      value='Ms'
                      checked={emp.title == 'Ms'}
                      onChange={(e) => {
                        return onValChange(e);
                      }}
                    />
                      <label htmlFor='Ms'>Ms</label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Date of Birth</strong>
                </td>
                <td>:</td>
                <td>
                  <input
                    name='dob'
                    type='date'
                    min='1960-01-01'
                    max='2004-12-31'
                    value={emp.dob || ''}
                    //   value={moment(emp.dob).format('YYYY-MM-DD')}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Gender</strong>
                </td>
                <td>:</td>
                <td>
                  <div style={{ display: 'flex' }}>
                    <input
                      type='radio'
                      id='male'
                      name='gender'
                      value='M'
                      checked={emp.gender == 'M'}
                      onChange={(e) => {
                        return onValChange(e);
                      }}
                    />
                      <label htmlFor='male'>Male</label>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <input
                      type='radio'
                      id='female'
                      name='gender'
                      value='F'
                      checked={emp.gender == 'F'}
                      onChange={(e) => {
                        return onValChange(e);
                      }}
                    />
                      <label htmlFor='female'>Female</label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Address</strong>
                </td>
                <td>:</td>
                <td>
                  <input
                    name='addLine1'
                    value={emp.addLine1 || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>City</strong>
                </td>
                <td>:</td>
                <td>
                  {' '}
                  <select
                    name='cityId'
                    id='cityId'
                    value={emp.cityId || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  >
                    {cities.map((c) => {
                      return (
                        <option key={c.id} value={c.id}>
                          {c.cityName}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Mobile</strong>
                </td>
                <td>:</td>
                <td>
                  <input
                    name='mobile'
                    type='number'
                    min='1000000000'
                    max='9999999999'
                    value={emp.mobile || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>eMail ID</strong>
                </td>
                <td>:</td>
                <td>
                  <input
                    name='eMailId'
                    type='email'
                    value={emp.eMailId || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Password</strong>
                </td>
                <td>:</td>
                <td>
                  <input
                    name='passwd'
                    type='password'
                    value={emp.passwd || ''}
                    onChange={(e) => {
                      return onValChange(e);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={'3'} style={{ textAlign: 'right' }}>
                  {/* <input type='submit' disabled={status !== 'typing'} /> */}
                  <input type='submit' disabled={!okSubmit()} />
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </>
  );
};

export default EmpUpd;
