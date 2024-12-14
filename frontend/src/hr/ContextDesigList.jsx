import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { errText } from '../util/errMsgText';
import { DesigContext } from '../context/desig/DesigContext';
import ContextDesigEdit from './ContextDesigEdit';

const ContextDesigList = () => {

// State Variables
  const [designations, setDesignations] = useState([]);
  const {
    setDesig,
    setDelFlag,
    discpId,
    delFlag,
    addEditFlag,
    setStatus,
    setMsg,
  } = useContext(DesigContext);

// fetching data for state variables
  useEffect(() => {
    getAllDesignations();
  }, [discpId, addEditFlag, delFlag]);
  const getAllDesignations = useCallback(async () => {
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
  },[discpId]);

// Handling events on the form
  const deleteDesigData = async (t) => {
    setStatus('busy');
    try {
      const res = await axios.delete(`http://localhost:3000/api/designations/${t}`);
      setStatus('Deleted');
      setMsg(res.data.msg);
      setDelFlag();
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

// User Interface
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
