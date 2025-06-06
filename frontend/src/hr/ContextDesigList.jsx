import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import { DesigContext } from '../context/desig/DesigContext';
import ContextDesigEdit from './ContextDesigEdit';
import GoHome from '../util/GoHome';

const ContextDesigList = () => {
  const [designations, setDesignations] = useState([]);
  const {
    setDesig,
    setDesigFlag,
    discpId,
    desigFlag,
  } = useContext(DesigContext);
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

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

  if (status === 'Error') {
    return <GoHome secs={5000} msg={`Error: [ ${msg} ]`} />;
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
            <td colSpan={5}>{designations.length > 0 && <ContextDesigEdit />}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default ContextDesigList;
