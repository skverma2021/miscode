import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TPContext } from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';

const PostingTrail = ({ theEmp, reportStatus, reportMsg }) => {
  const [postings, setPostings] = useState([]);
  const tpContext = useContext(TPContext);
  const { desigFlag } = tpContext.tpState;
  const { toggleDesigFlag, setDg } = tpContext;

  useEffect(() => {
    const fetchData = async () => {
      reportStatus('busy')
      try {
        const res = await axios.get(
          `http://localhost:3000/api/tp/empDesig/${theEmp}`
        );
        setPostings(res.data);
        reportStatus('Success');
      } catch (error) {
        reportStatus('Error');
        reportMsg(errText(error));
      }
    };
    fetchData();
  }, [desigFlag]);

  const deleteEmpDesig = async (theEmpDesigId) => {
    reportStatus('busy');
    try {
      await axios.delete(
        `http://localhost:3000/api/tp/empDesig/${theEmpDesigId}`
      );
      toggleDesigFlag();
      reportStatus('Success');
      alert('Row Deleted!');
    } catch (error) {
      reportStatus('Error');
      reportMsg(errText(error));
    }
  };

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
              <Link onClick={() => setDg(t.theId, t.theDesigId, t.theFromDt)}>
                🖍️
              </Link>
            </div>
            {/* will execute delete and also reset trail window */}
            <div style={{ width: '5%', border: '1px solid black' }}>
              <Link onClick={() => deleteEmpDesig(`${t.theId}`)}> ✖️</Link>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PostingTrail;
