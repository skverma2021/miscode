import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Spinner from '../home/Spinner';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [emp, setEmp] = useState({
    eMail: '',
    pass: '',
  });
  const [user, setUser] = useState({
    userId:'',
    userName:'',
    userDeptt:''
  })
  const [status, setStatus] = useState('');
  const okSubmit = () => {
    if (emp.eMail.length == 0) return false;
    if (emp.pass.length == 0) return false;
    return true;
  };
  const onValChange = (e) => {
    setEmp({ ...emp, [e.target.name]: e.target.value });
  };
  const logInUser = async (event) => {
    setStatus('busy');
    event.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3000/api/emps/login`, {theEMailId:emp.eMail, thePasswd:emp.pass}
      );
      const decoded = jwtDecode(res.data.token);
      console.log(decoded.eID, decoded.eName, decoded.eDepttID);
      setUser({userId:decoded.eID, userName:decoded.eName, userDeptt:decoded.eDepttID})
      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.log(error);
    }
  };
  if (status === 'error') {
    return <h1 style={{ color: 'red' }}>Error Occured !</h1>;
  }
  if (status === 'busy') return <Spinner />;
  return (
    <div
      style={{
        marginTop: '100px',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <form onSubmit={logInUser}>
        <table style={{ lineHeight: '50px' }}>
          <tbody>
            <tr>
              <td colSpan={2}>
                <h2>LOGIN</h2>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>eMail ID</td>
              <td>
                <input
                  name='eMail'
                  type='email'
                  required
                  value={emp.eMail || ''}
                  onChange={(e) => {
                    return onValChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Password</td>
              <td>
                <input
                  name='pass'
                  type='password'
                  minLength={3}
                  required
                  value={emp.pass || ''}
                  onChange={(e) => {
                    return onValChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <button type='submit' disabled={!okSubmit()}>
                  Login
                </button>
              </td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={2}>
                  <strong>Logged User: </strong>Id: {user.userId}, Name: {user.userName}, Deptt ID: {user.userDeptt}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <br />
      </form>
    </div>
  );
};

export default Login;
