import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TPContext } from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';

const TransferTrail = () => {
  const [transfers, setTransfers] = useState([]);
  const tpContext = useContext(TPContext);
  const { depttFlag, empId } = tpContext.tpState;
  const { toggleDepttFlag, setDt, setStatus, setMsg } = tpContext;

  useEffect(() => {
    const fetchData = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(
          `http://localhost:3000/api/tp/empdeptt/${empId}`
        );
        setTransfers(res.data);
        setStatus('Success');
      } catch (error) {
        setStatus('Error');
        setMsg(errText(error));
      }
    };
    if (empId) fetchData();
  }, [depttFlag]);

  const deleteEmpDeptt = async (theEmpDepttId) => {
    setStatus('busy');
    try {
      await axios.delete(
        `http://localhost:3000/api/tp/empdeptt/${theEmpDepttId}`
      );
      toggleDepttFlag();
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

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
              <Link onClick={() => setDt(t.theId, t.theDepttId, t.theFromDt)}>
                🖍️
              </Link>
            </div>
            {/* will execute delete and also reset trail window */}
            <div style={{ width: '5%', border: '1px solid black' }}>
              <Link onClick={() => deleteEmpDeptt(`${t.theId}`)}> ✖️</Link>
            </div>
          </div>
        );
      })}
    </>
  );
};
export default TransferTrail;
