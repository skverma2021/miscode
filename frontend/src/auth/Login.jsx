import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../home/Spinner';
import userContext from '../context/appUser/UserContext';
import Home from '../home/Home'

const Login = () => {
  // State Variables
  const { authUser } = useContext(userContext);
  const [emp, setEmp] = useState({
    eMail: '',
    pass: '',
  });
  const [status, setStatus] = useState('');

  // Navigation and TimeOut
  const navigate = useNavigate();
  const goHome = () => {
    navigate('/');
  };
  useEffect(() => {
    let timeoutId;

    if (status === 'busy') {
      // Successful login triggers a short delay
      timeoutId = setTimeout(() => navigate('/'), 500);
    } else if (status === 'error') {
      // Error case triggers a longer delay
      timeoutId = setTimeout(() => navigate('/'), 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [status, navigate]);

  // Handling Events on the Form
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
      await authUser(emp.eMail, emp.pass);
      setStatus('Success');
      // timeoutId = setTimeout(goHome, 500);
    } catch (error) {
      setStatus('error');
      // timeoutId = setTimeout(goHome, 1000);
      console.log(error);
    }
  };

  // User Interface
  if (status === 'error') {
    return <h1 style={{ color: 'blue' }}>Error Occured !</h1>;
  }
  if (status === 'busy') return <Spinner />;
  if (status === 'Success') return <Home />;

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
          </tbody>
        </table>
        <br />
      </form>
    </div>
  );
};

export default Login;
