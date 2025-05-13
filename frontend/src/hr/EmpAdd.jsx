import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import RadioButton from '../util/RadioButton';
import SelectControl from '../util/SelectControl';
import GoHome from '../util/GoHome'; // ✅ New import

const EmpAdd = () => {
  // State Variables
  const [emp, setEmp] = useState({
    uId: '',
    fName: '',
    mName: '',
    sName: '',
    title: 'Mr',
    dob: '',
    gender: 'M',
    addLine1: '',
    cityId: '',
    mobile: '',
    eMailId: '',
    passwd: '',
  });

  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const [cityStatus, setCityStatus] = useState('');
  const [errNo, setErrNo] = useState(0);
  const [cities, setCities] = useState([]);

  // Fetch cities
  useEffect(() => {
    const fetchData = async () => {
      setCityStatus('busy');
      try {
        const res = await axios.get(`http://localhost:3000/api/cities/select`);
        setCities(res.data);
        setCityStatus('Success');
      } catch (error) {
        setCityStatus('Error');
      }
    };
    fetchData();
  }, []);

  // Validation before submit
  const okSubmit = () => {
    return (
      emp.uId &&
      emp.fName &&
      emp.title &&
      emp.dob &&
      emp.gender &&
      emp.addLine1 &&
      emp.cityId &&
      emp.mobile &&
      emp.eMailId &&
      emp.passwd
    );
  };

  const onValChange = (e) => {
    setEmp({ ...emp, [e.target.name]: e.target.value });
  };

  const postEmpData = async (event) => {
    event.preventDefault();
    try {
      setStatus('busy');
      const res = await axios.post('http://localhost:3000/api/emps', emp);
      setStatus('Added');
      setMsg(res.data.msg);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
    }
  };

  // Conditional UI
  if (cityStatus === 'Error') return <GoHome secs={5000} msg="Error Loading Cities" />;
  if (status === 'busy') return <Spinner />;
  if (status === 'Added') return <GoHome secs={1000} msg={msg} />;
  if (status === 'Error' && errNo === 500) return <GoHome secs={5000} msg={`Error: ${msg}`} />;
  if (status === 'Error' && errNo !== 2627 && errNo !== 2601)
    return <GoHome secs={5000} msg={`Error ${errNo}: ${msg}`} />;

  // Main Form UI
  return (
    <>
      <h4 style={{ color: 'red' }}>
        {status === 'Error' && (errNo === 2627 || errNo === 2601) && msg}
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
        <form onSubmit={postEmpData}>
          <table style={{ lineHeight: '35px' }}>
            <tbody>
              <tr>
                <td colSpan={3}>
                  <h2>Add an Employee</h2>
                </td>
              </tr>
              <tr>
                <td><strong>Unique ID</strong></td>
                <td>:</td>
                <td><input name='uId' value={emp.uId} onChange={onValChange} /></td>
              </tr>
              <tr>
                <td><strong>First Name</strong></td>
                <td>:</td>
                <td><input name='fName' minLength={3} required value={emp.fName} onChange={onValChange} /></td>
              </tr>
              <tr>
                <td><strong>Middle Name</strong></td>
                <td>:</td>
                <td><input name='mName' value={emp.mName} onChange={onValChange} /></td>
              </tr>
              <tr>
                <td><strong>Surname</strong></td>
                <td>:</td>
                <td><input name='sName' value={emp.sName} onChange={onValChange} /></td>
              </tr>
              <tr>
                <td><strong>Title</strong></td>
                <td>:</td>
                <td>
                  <RadioButton
                    options={[{ value: 'Mr', label: 'Mr' }, { value: 'Ms', label: 'Ms' }]}
                    selectedOption={emp.title}
                    onOptionChange={(v) => setEmp({ ...emp, title: v })}
                    radioName='title'
                  />
                </td>
              </tr>
              <tr>
                <td><strong>Date of Birth</strong></td>
                <td>:</td>
                <td>
                  <input
                    name='dob'
                    type='date'
                    min='1960-01-01'
                    max='2003-12-31'
                    required
                    value={emp.dob}
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><strong>Gender</strong></td>
                <td>:</td>
                <td>
                  <RadioButton
                    options={[{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }]}
                    selectedOption={emp.gender}
                    onOptionChange={(v) => setEmp({ ...emp, gender: v })}
                    radioName='gender'
                  />
                </td>
              </tr>
              <tr>
                <td><strong>Address</strong></td>
                <td>:</td>
                <td><input name='addLine1' value={emp.addLine1} onChange={onValChange} /></td>
              </tr>
              <tr>
                <td><strong>City</strong></td>
                <td>:</td>
                <td>
                  <SelectControl
                    optionsRows={cities}
                    selectedId={emp.cityId}
                    onSelect={(c) => setEmp({ ...emp, cityId: c })}
                    prompt={'City'}
                  />
                </td>
              </tr>
              <tr>
                <td><strong>Mobile</strong></td>
                <td>:</td>
                <td>
                  <input
                    name='mobile'
                    type='number'
                    min='1000000000'
                    max='9999999999'
                    value={emp.mobile}
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><strong>eMail ID</strong></td>
                <td>:</td>
                <td>
                  <input name='eMailId' type='email' value={emp.eMailId} onChange={onValChange} />
                </td>
              </tr>
              <tr>
                <td><strong>Password</strong></td>
                <td>:</td>
                <td><input name='passwd' value={emp.passwd} onChange={onValChange} /></td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right' }}>
                  <input type='submit' disabled={!okSubmit()} />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </>
  );
};

export default EmpAdd;
