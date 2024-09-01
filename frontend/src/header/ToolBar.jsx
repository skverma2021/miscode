import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userContext from '../context/appUser/UserContext';

function ToolBar() {
  const [theDeptt, setTheDeptt] = useState('');
  const { user, deptt, logOutUser, expMsg } = useContext(userContext);

  useEffect(() => {
    setTheDeptt(deptt);
  }, [deptt]);

  const renderHRToolbar = () => (
    <div>
      <Link to='/hr/desig' style={{ marginRight: '15px' }}>
        {' '}
        Discp-Desig
      </Link>
      <Link to='/hr/emp/all' style={{ marginRight: '15px' }}>
        {' '}
        AllEmp
      </Link>
      {` `}
      <Link to='/hr/emp/add' style={{ marginRight: '15px' }}>
        {' '}
        NewEmp
      </Link>
      {` `}
      <Link to='/hr/reports' style={{ marginRight: '15px' }}>
        {' '}
        Reports
      </Link>
      {` `}
      <Link to='/hr/emp/cp' style={{ marginRight: '15px' }}>
        {' '}
        ChangePassword
      </Link>
      {` `}
      <Link to='/' onClick={() => logOutUser()}>
        {' '}
        Logout
      </Link>
    </div>
  );
  const renderBDToolbar = () => (
    <div>
      <Link to='/bd/clients/all' style={{ marginRight: '15px' }}>
        {' '}
        Clients
      </Link>
      <Link to='/bd/clients/add' style={{ marginRight: '15px' }}>
        {' '}
        AddClient
      </Link>
      <Link to='/bd/jobs/all' style={{ marginRight: '15px' }}>
        {' '}
        allJobs
      </Link>
      {` `}
      <Link to='/bd/jobs/add' style={{ marginRight: '15px' }}>
        {' '}
        addJobs
      </Link>
      {` `}
      <Link to='/bd/reports' style={{ marginRight: '15px' }}>
        {' '}
        Reports
      </Link>
      {` `}
      <Link to={`/booking`} style={{ marginRight: '15px' }}>
        {' '}
        bookings
      </Link>
      {` `}
      <Link to='/hr/emp/cp' style={{ marginRight: '15px' }}>
        {' '}
        ChangePassword
      </Link>
      {` `}
      <Link to='/' onClick={logOutUser}>
        {' '}
        Logout
      </Link>
    </div>
  );
  const renderBookingToolbar = () => (
    <div>
      <Link to={`/booking`} style={{ marginRight: '15px' }}>
        {' '}
        bookings
      </Link>
      {` `}
      <Link to='/hr/reports' style={{ marginRight: '15px' }}>
        {' '}
        Reports
      </Link>
      <Link to='/hr/emp/cp' style={{ marginRight: '15px' }}>
        {' '}
        ChangePassword
      </Link>
      {` `}
      <Link to='/' onClick={() => logOutUser()}>
        {' '}
        Logout
      </Link>
    </div>
  );
  const renderDefaultToolbar = () => (
    <div>
      <Link to='/login'>Login</Link>
    </div>
  );
  const renderFailedAuthToolbar = () => (
    <div>
      <Link to='/login'>
        <b>Login Again</b>
      </Link>
    </div>
  );
  const renderToolbar = () => {
    switch (parseInt(theDeptt)) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        return renderBookingToolbar();

      case 6:
        return renderBDToolbar();

      case 13:
        return renderHRToolbar();

      case -1:
        return renderFailedAuthToolbar();

      default:
        return renderDefaultToolbar(); // Unknown department
    }
  };
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: 'lightblue',
          height: '10%',
        }}
      >
        <div style={{ display: 'flex', marginTop: '0px' }}>
          <div>
            {/* window + . search for abacus */}
            <font size='5'>🧮</font>
          </div>
          <div style={{ marginLeft: '10px', marginTop: '6px' }}>
            <font size='4'>Consultancy Jobs - MIS</font>
          </div>
        </div>
        <div style={{ marginTop: '6px' }}>
          <small>[{expMsg}]</small>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ textAlign: 'right' }}>{renderToolbar()}</div>
          <div style={{ textAlign: 'right' }}>
            <small>
              User
              <strong>
                <i> {user ? user : 'Not Logged in'}</i>
              </strong>
            </small>
          </div>
        </div>
      </div>
    </>
  );
}

export default ToolBar;
