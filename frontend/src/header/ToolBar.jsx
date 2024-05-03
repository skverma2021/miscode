import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userContext from '../context/appUser/UserContext';

function ToolBar() {
  const [theDeptt, setTheDeptt] = useState('');
  const { userId, user, deptt, logOutUser } = useContext(userContext);

  useEffect(() => {
    setTheDeptt(deptt);
  },[deptt]);
  
  const renderHRToolbar = () => (
    <div>
      <Link to='/hr/discp' style={{ marginRight: '15px' }}>
        {' '}
        Discipline
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
      <Link to='/bd/job/all' style={{ marginRight: '15px' }}>
        {' '}
        allJobs
      </Link>
      {` `}
      <Link to='/bd/job/add' style={{ marginRight: '15px' }}>
        {' '}
        addJobs
      </Link>
      {` `}
      <Link to='/bd/reports' style={{ marginRight: '15px' }}>
        {' '}
        Reports
      </Link>
      {` `}
      <Link to={`/booking/${userId}`} style={{ marginRight: '15px' }}>
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
    // console.log('reached here')
    <div>
      <Link to={`/booking/${userId}`} style={{ marginRight: '15px' }}>
        {' '}
        bookings
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
        break;
      case 6:
        return renderBDToolbar();
        break;
      case 13:
        return renderHRToolbar();
        break;
      case -1:
        return renderFailedAuthToolbar();
        break;
      default:
        return renderDefaultToolbar(); // Unknown department
        break;
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
            <font size='5'>🧮</font>
          </div>
          <div style={{ marginLeft: '10px', marginTop: '6px' }}>
            <font size='4'>Consultancy Jobs - MIS</font>
          </div>
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
