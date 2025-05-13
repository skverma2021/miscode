import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TPContext } from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import GoHome from '../util/GoHome';

const PostingTrail = () => {
  const [postings, setPostings] = useState([]);
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

  const tpContext = useContext(TPContext);
  const { postingFlag, empId } = tpContext.tpState;
  const { togglePostingFlag, setPosting } = tpContext;

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

  if (status === 'busy') return <Spinner />;
  if (status === 'Error') {
    return <GoHome secs={5000} msg={`Error: ${msg}`} />;
  }

  return (
    <>
      <h4>Past Promotions</h4>
      <p><i>Journey so far</i></p>
      <div
        style={{
          display: 'flex',
          width: '100%',
          backgroundColor: 'lightslategray',
        }}
      >
        <div style={{ width: '25%', border: '1px solid black' }}>Discipline</div>
        <div style={{ width: '7%', border: '1px solid black' }}>Grade</div>
        <div style={{ width: '7%', border: '1px solid black' }}>Hr Rate</div>
        <div style={{ width: '36%', border: '1px solid black' }}>Designation</div>
        <div style={{ width: '15%', border: '1px solid black' }}>from</div>
        <div style={{ width: '5%', border: '1px solid black' }}>upd</div>
        <div style={{ width: '5%', border: '1px solid black' }}>del</div>
      </div>

      {postings.map((t) => (
        <div key={t.theId} style={{ display: 'flex', width: '100%' }}>
          <div style={{ width: '25%', border: '1px solid black' }}>{t.theDiscp}</div>
          <div style={{ width: '7%', border: '1px solid black' }}>{t.theGrade}</div>
          <div style={{ width: '7%', border: '1px solid black' }}>{t.theHourlyRate}</div>
          <div style={{ width: '36%', border: '1px solid black' }}>{t.theDesig}</div>
          <div style={{ width: '15%', border: '1px solid black' }}>{t.theFromDt}</div>
          <div style={{ width: '5%', border: '1px solid black' }}>
            <Link onClick={() => setPosting(t.theId, t.theDesigId, t.theFromDt)}>🖍️</Link>
          </div>
          <div style={{ width: '5%', border: '1px solid black' }}>
            <Link onClick={() => deletePosting(`${t.theId}`)}>✖️</Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default PostingTrail;
