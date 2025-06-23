import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Spinner from '../home/Spinner';
import userContext from '../context/appUser/UserContext';
import { errText } from '../util/errMsgText';
import GoHome from '../util/GoHome'; // Import GoHome component

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

  useEffect(() => {
    setPass({
      ...pass,
      email: 'Enter eMail and Password',
      oldPass: 'xxxxxx',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch (error) {
      logOutUser();
      setStatus('Error');
      setMsg(errText(error));
    }
  };

  // Replace conditional UI with GoHome for timed redirection
  if (status === 'Error') return <GoHome secs={2000} msg={`Error: ${msg}`} />;
  if (status === 'Success') return <GoHome secs={2000} msg={msg} />;
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
      <div>
        <form onSubmit={handlePassChange}>
          <table style={{ lineHeight: '75px' }}>
            <tbody>
              <tr>
                <td colSpan={3}>
                  <h2>Change Password</h2>
                </td>
              </tr>
              <tr>
                <td><label>eMail</label></td>
                <td>:</td>
                <td>
                  <input
                    type='email'
                    name='email'
                    value={pass.email || ''}
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Old Password</label></td>
                <td>:</td>
                <td>
                  <input
                    type='password'
                    name='oldPass'
                    value={pass.oldPass || ''}
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label>New Password</label></td>
                <td>:</td>
                <td>
                  <input
                    type='password'
                    name='newPass'
                    value={pass.newPass || ''}
                    onChange={onValChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Repeat Password</label></td>
                <td>:</td>
                <td>
                  <input
                    type='password'
                    name='repeatPass'
                    value={pass.repeatPass || ''}
                    onChange={onValChange}
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
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default ChangePass;