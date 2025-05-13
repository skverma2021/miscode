import React, { useState, useContext } from 'react';
import Spinner from '../home/Spinner';
import userContext from '../context/appUser/UserContext';
import GoHome from '../util/GoHome'; 

const Login = () => {
  const { authUser } = useContext(userContext);
  const [emp, setEmp] = useState({ eMail: '', pass: '' });
  const [status, setStatus] = useState('');

  const okSubmit = () => emp.eMail.length > 0 && emp.pass.length > 0;

  const onValChange = (e) => {
    setEmp({ ...emp, [e.target.name]: e.target.value });
  };

  const logInUser = async (event) => {
    event.preventDefault();
    setStatus('busy');
    try {
      await authUser(emp.eMail, emp.pass);
      setStatus('Success'); // New status
    } catch (error) {
      setStatus('Error');
      console.log(error);
    }
  };

  if (status === 'Error') {
    return <GoHome secs={1000} msg="Error Occurred!" />;
  }

  if (status === 'Success') {
    return <GoHome secs={100} msg="Logging in..." />;
  }

  if (status === 'busy') return <Spinner />;

  return (
    <div
      style={{
        marginTop: '100px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <form onSubmit={logInUser}>
        <table style={{ lineHeight: '50px' }}>
          <tbody>
            <tr>
              <td colSpan={2}>
                <h2>LOGIN</h2>
              </td>
            </tr>
            <tr>
              <td>eMail ID</td>
              <td>
                <input
                  name="eMail"
                  type="email"
                  required
                  value={emp.eMail}
                  onChange={onValChange}
                />
              </td>
            </tr>
            <tr>
              <td>Password</td>
              <td>
                <input
                  name="pass"
                  type="password"
                  minLength={3}
                  required
                  value={emp.pass}
                  onChange={onValChange}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <button type="submit" disabled={!okSubmit()}>
                  Login
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default Login;