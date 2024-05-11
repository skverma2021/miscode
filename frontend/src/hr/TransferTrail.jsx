import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TPContext from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';

const TransferTrail = ({ theEmp }) => {
  const [transfers, setTransfers] = useState([]);
  const tpContext = useContext(TPContext);
  const { newRecDeptt, updRecDeptt } = tpContext.tpState;
  const { resetTP, updDepttRec, setDp } = tpContext;
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');

  const navigate = useNavigate();
  let timeoutId;
  const goHome = () => {
    navigate('/');
  };

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(
          `http://localhost:3000/api/tp/empdeptt/${theEmp}`
        );
        setTransfers(res.data);
        setStatus('Success');
      } catch (error) {
        setStatus('Error');
        setMsg(errText(error));
        timeoutId = setTimeout(goHome, 10000);
      }
    };
    fetchData();
  }, [newRecDeptt, updRecDeptt]);

  const deleteEmpDeptt = async (theEmpDepttId) => {
    // if (transfers.length == 1) return;
    setStatus('busy');
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/tp/empdeptt/${theEmpDepttId}`
      );
      resetTP();
      // will cause the trail window to refresh because of useEffect
      updDepttRec();
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      timeoutId = setTimeout(goHome, 10000);
    }
  };

  if (status === 'busy') return <Spinner />;

  if (status === 'Error') return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;

  return (
    <>
      <h4>Past Transfers</h4>
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
        <div style={{ width: '45%', border: '1px solid black' }}>
          Department
        </div>
        <div style={{ width: '45%', border: '1px solid black' }}>from</div>
        <div style={{ width: '5%', border: '1px solid black' }}>upd</div>
        <div style={{ width: '5%', border: '1px solid black' }}>del</div>
      </div>
      {transfers.map((t) => {
        return (
          <div key={t.theId} style={{ display: 'flex', width: '100%' }}>
            <div style={{ width: '45%', border: '1px solid black' }}>
              {t.theDeptt}
            </div>
            <div style={{ width: '45%', border: '1px solid black' }}>
              {t.theFromDt}
            </div>
            {/*  to initialize the context with record to be updated */}
            {/*  The record will be made available in the lower edit window */}
            <div style={{ width: '5%', border: '1px solid black' }}>
              <Link onClick={() => setDp(t.theId, t.theDepttId, t.theFromDt)}>
                🖍️
              </Link>
            </div>
            {/* will execute delete and also reset trail window */}
            <div style={{ width: '5%', border: '1px solid black' }}>
              <Link onClick={() => deleteEmpDeptt(`${t.theId}`)}> 🗑️</Link>
            </div>
          </div>
        );
      })}
    </>
  );
};
export default TransferTrail;
