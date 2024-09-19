import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../home/Spinner';
import userContext from '../context/appUser/UserContext';
import { errText } from '../util/errMsgText';

const ChangePass = () => {
  const [pass, setPass] = useState({
    email: '',
    oldPass: '',
    newPass: '',
    repeatPass: '',
  });
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const { userId, logOutUser } = useContext(userContext);
  const navigate = useNavigate();

  let timeoutId;
  const goHome = () => {
    navigate('/');
  };

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setPass({
      ...pass,
      email: 'Enter eMail and Password',
      oldPass: 'xxxxxx',
    });
  }, []);

  const onValChange = (e) => {
    setPass({ ...pass, [e.target.name]: e.target.value });
  };

  const handlePassChange = async (event) => {
    setStatus('busy');
    event.preventDefault();
    try {
      const res = await axios.put(`http://localhost:3000/api/emps/cp`, {
        id: parseInt(userId),
        email: pass.email,
        oldPass: pass.oldPass,
        passwd: pass.repeatPass,
      });
      logOutUser();
      setMsg(res.data.msg);
      setStatus('Success');
      timeoutId = setTimeout(goHome, 2000);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      timeoutId = setTimeout(goHome, 2000);
    }
  };

  if (status === 'Error') return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;

  if (status === 'Success') return <h1 style={{ color: 'blue' }}>{msg}</h1>;

  if (status === 'busy') return <Spinner />;

  return (
    <>
      <div
        style={{
          marginTop: '100px',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <div>
          <form onSubmit={handlePassChange}>
            <table style={{ lineHeight: '75px' }}>
              <tbody>
                <tr>
                  <td colSpan={3}>
                    <h2>Login</h2>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <label>eMail</label>
                  </td>
                  <td>:</td>
                  <td>
                    <input
                      type='email'
                      name='email'
                      value={pass.email || ''}
                      onChange={(e) => {
                        return onValChange(e);
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Old Password</label>
                  </td>
                  <td>:</td>
                  <td>
                    <input
                      type='password'
                      name='oldPass'
                      value={pass.oldPass || ''}
                      onChange={(e) => {
                        return onValChange(e);
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>New Password</label>
                  </td>
                  <td>:</td>
                  <td>
                    <input
                      type='password'
                      name='newPass'
                      value={pass.newPass || ''}
                      onChange={(e) => {
                        return onValChange(e);
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Repeat Password</label>
                  </td>
                  <td>:</td>
                  <td>
                    <input
                      type='password'
                      name='repeatPass'
                      value={pass.repeatPass || ''}
                      onChange={(e) => {
                        return onValChange(e);
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <button
                      type='submit'
                      disabled={
                        !pass.email ||
                        !pass.oldPass ||
                        !pass.newPass ||
                        !pass.repeatPass ||
                        pass.newPass !== pass.repeatPass
                      }
                    >
                      Update
                    </button>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePass;
