import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Posting from './Posting';
import Transfer from './Transfer';
import PostingTrail from './PostingTrail';
import TransferTrail from './TransferTrail';
import { TPContext } from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';

const TransferPosting = () => {

// State Variables
  const [empDet, setEmpDet] = useState({});
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');
  
  const tpContext = useContext(TPContext);
  const { postingFlag, transferFlag } = tpContext.tpState;
  const { setEmp } = tpContext;
  
  // Updating State
  const { id } = useParams();
  useEffect(()=>{
    setEmp(id)
  },[id]);

  const getEmpDet = async () => {
    setStatus('busy');
    try {
      const res = await axios.get(
        `http://localhost:3000/api/tp/empheader/${id}`
      );
      setEmpDet(res.data[0]);
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };  
   useEffect(() => {
    getEmpDet();
  }, [postingFlag, transferFlag]); 

// Navigation and TimeOut
  const navigate = useNavigate();
  let timeoutId;
  const goHome = () => {
    navigate('/');
  };
  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

// User Interface
  if (status === 'busy') return <Spinner />;
  if (status === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;
  }
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          marginTop: '50px',
        }}
      >
        <div style={{ marginBottom: '25px' }}>
          {/* empDetails */}
          <div>
            <b>{empDet.theName}</b> {empDet.theDesig}, [{empDet.theGrade}]
          </div>
          <div>
            <i>
              Deptt:[{empDet.theDeptt}] Discipline: [{empDet.theDiscp}] [
              {empDet.theHrRate}Rs/hr]
            </i>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          {/* Postings/Promotions */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'lightblue',
              width: '50%',
              marginTop: '20px',
              height: '50vh',
            }}
          >
            {/* Shows all change in designation */}
            <div style={{ padding: '10px', height: '40vh' }}>
              <PostingTrail />
            </div>
            {/* shows the edit window for adding/updating any change in designation */}
            <div style={{ padding: '10px' }}>
              <Posting />
            </div>
          </div>
          {/* Transfers */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'lightgray',
              width: '50%',
              marginTop: '20px',
              height: '50vh',
            }}
          >
            {/* Shows all change in department */}
            <div style={{ padding: '10px', height: '40vh' }}>
              <TransferTrail />
            </div>
            {/* shows the edit window for adding/updating any change in department */}
            <div style={{ padding: '10px' }}>
              <Transfer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransferPosting;
