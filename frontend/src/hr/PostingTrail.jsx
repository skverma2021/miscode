import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TPContext } from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';

const PostingTrail = () => {

// State Variables
  const [postings, setPostings] = useState([]);
  
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

  const tpContext = useContext(TPContext);
  const { postingFlag, empId } = tpContext.tpState;
  const { togglePostingFlag, setPosting } = tpContext;

// Updating State
  useEffect(() => {
    const fetchData = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(
          `http://localhost:3000/api/tp/empDesig/${empId}`
        );
        setPostings(res.data);
        setStatus('Success');
      } catch (error) {
        setStatus('Error');
        setMsg(errText(error));
      }
    };
    if (empId) fetchData();
  }, [postingFlag]);

// Handling events on the form
  const deletePosting = async (theEmpDesigId) => {
    setStatus('busy');
    try {
      await axios.delete(
        `http://localhost:3000/api/tp/empDesig/${theEmpDesigId}`
      );
      togglePostingFlag();
      setStatus('Success');
      alert('Row Deleted!');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

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
      <h4>Past Promotions</h4>
      <p>
        <i>Journey so far</i>
      </p>
      <div
        style={{
          display: 'flex',
          width: '100%',
          backgroundColor: 'lightslategray',
        }}
      >
        <div style={{ width: '25%', border: '1px solid black' }}>
          Discipline
        </div>
        <div style={{ width: '7%', border: '1px solid black' }}>Grade</div>
        <div style={{ width: '7%', border: '1px solid black' }}>Hr Rate</div>
        <div style={{ width: '36%', border: '1px solid black' }}>
          Designation
        </div>
        <div style={{ width: '15%', border: '1px solid black' }}>from</div>
        <div style={{ width: '5%', border: '1px solid black' }}>upd</div>
        <div style={{ width: '5%', border: '1px solid black' }}>del</div>
      </div>

      {postings.map((t) => {
        return (
          <div key={t.theId} style={{ display: 'flex', width: '100%' }}>
            <div style={{ width: '25%', border: '1px solid black' }}>
              {t.theDiscp}
            </div>
            <div style={{ width: '7%', border: '1px solid black' }}>
              {t.theGrade}
            </div>
            <div style={{ width: '7%', border: '1px solid black' }}>
              {t.theHourlyRate}
            </div>
            <div style={{ width: '36%', border: '1px solid black' }}>
              {t.theDesig}
            </div>
            <div style={{ width: '15%', border: '1px solid black' }}>
              {t.theFromDt}
            </div>
            {/*  to initialize the context with record to be updated */}
            {/*  The record will be made available in the lower edit window */}
            <div style={{ width: '5%', border: '1px solid black' }}>
              <Link onClick={() => setPosting(t.theId, t.theDesigId, t.theFromDt)}>
                🖍️
              </Link>
            </div>
            {/* will execute delete and also reset trail window */}
            <div style={{ width: '5%', border: '1px solid black' }}>
              <Link onClick={() => deletePosting(`${t.theId}`)}> ✖️</Link>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PostingTrail;
