import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Posting from './Posting';
import Transfer from './Transfer';
import PostingTrail from './PostingTrail';
import TransferTrail from './TransferTrail';
import { TPContext } from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import GoHome from '../util/GoHome';

const TransferPosting = () => {
  const [empDet, setEmpDet] = useState({});
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

  const tpContext = useContext(TPContext);
  const { postingFlag, transferFlag } = tpContext.tpState;
  const { setEmp } = tpContext;

  const { id } = useParams();

  useEffect(() => {
    setEmp(id);
  }, [id]);

  useEffect(() => {
    getEmpDet();
  }, [postingFlag, transferFlag]);

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

  if (status === 'busy') return <Spinner />;
  if (status === 'Error') {
    return <GoHome secs={5000} msg={`Error: ${msg}`} />;
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
            <div style={{ padding: '10px', height: '40vh' }}>
              <PostingTrail />
            </div>
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
            <div style={{ padding: '10px', height: '40vh' }}>
              <TransferTrail />
            </div>
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
