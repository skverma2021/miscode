import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import { useNavigate } from 'react-router-dom';
import { DesigContext } from '../context/desig/DesigContext';
import ContextDesigEdit from './ContextDesigEdit';

const ContextDesigList = () => {

// State Variables
  const [designations, setDesignations] = useState([]);
  const {
    setDesig,
    setDesigFlag,
    discpId,
    desigFlag,
    // addEditFlag,
  } = useContext(DesigContext);
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

// fetching data for state variables
  useEffect(() => {
    getAllDesignations();
  }, [discpId, desigFlag]);
  const getAllDesignations = async () => {
    if (discpId === 0) { 
      setDesignations([]); 
      return;
      }
    setStatus('busy');
    try {
      const res = await axios.get(
        `http://localhost:3000/api/designations/long/${discpId}`
      );
      setDesignations(res.data);
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

// Handling events on the form
  const deleteDesigData = async (t) => {
    setStatus('busy');
    try {
      const res = await axios.delete(`http://localhost:3000/api/designations/${t}`);
      setStatus('Deleted');
      setMsg(res.data.msg);
      setDesigFlag();
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
if (status === 'Error') {
  timeoutId = setTimeout(goHome, 5000);
  return <h1 style={{ color: 'red' }}>Error: [ {msg} ]</h1>;
}
if (status === 'busy') return <Spinner />;
  return (
    <>
      <table style={{ width: '100%', border: '1px solid blue' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Designations</th>
            <th style={{ textAlign: 'left' }}>Grade</th>
            <th style={{ textAlign: 'left' }}>Hourly Rate</th>
            <th style={{ textAlign: 'left' }}>edit</th>
            <th style={{ textAlign: 'left' }}>del</th>
          </tr>
        </thead>
        <tbody>
          {designations.map((t) => {
            return (
              <tr key={t.id}>
                <td>{t.theDesig}</td>
                <td>{t.theGrade}</td>
                <td>{t.theHourlyRate}</td>
                <td>
                  <Link
                    onClick={() => {
                      setDesig(t.id, t.theDesig, t.theGradeId);
                    }}
                  >
                    🖍️
                  </Link>
                </td>
                <td>
                  <Link
                    onClick={() => {
                      deleteDesigData(t.id);
                    }}
                  >
                    ✖️
                  </Link>
                </td>
              </tr>
            );
          })}
          <tr>
            {/*  Designation edit/add window on the bottom right */}
            <td colSpan={5}>{discpId && <ContextDesigEdit />}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default ContextDesigList;
