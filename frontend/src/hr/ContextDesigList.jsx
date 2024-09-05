import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import { useNavigate } from 'react-router-dom';
import ContextDesigEdit from './ContextDesigEdit';
import { DesigContext } from '../context/desig/DesigContext';

const ContextDesigList = () => {
  const [designations, setDesignations] = useState([]);
  const [desigStatus, setDesigStatus] = useState('');
  const [delStatus, setDelStatus] = useState('');
  const [msg, setMsg] = useState('');
  const { setDesig, setDelFlag, discpId, delFlag, addEditFlag } =
    useContext(DesigContext);
  const navigate = useNavigate();

  let timeoutId;
  const goHome = () => {
    navigate('/');
  };

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    getAllDesignations();
  }, [discpId, addEditFlag, delFlag]);

  const getAllDesignations = async () => {
    setDesigStatus('busy');
    try {
      const res = await axios.get(
        `http://localhost:3000/api/designations/long/${discpId}`
      );
      setDesignations(res.data);
      setDesigStatus('Success');
    } catch (error) {
      setDesigStatus('Error');
      setMsg(errText(error));
      timeoutId = setTimeout(goHome, 10000);
    }
  };

  const deleteDesigData = async (t) => {
    setDelStatus('busy');
    try {
      await axios.delete(`http://localhost:3000/api/designations/${t}`);
      setDelStatus('Deleted');
      setMsg('Successfully Deleted.');
      setDelFlag();
    } catch (error) {
      setDelStatus('Error');
      setMsg(errText(error));
    }
  };

  if (desigStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return (
      <h1 style={{ color: 'red' }}>
        Error: Designations could not be loaded [ {msg} ]
      </h1>
    );
  }
  if (delStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return (
      <h1 style={{ color: 'red' }}>
        Error: Designation could not be deleted [ {msg} ]
      </h1>
    );
  }

  if (desigStatus === 'busy' || delStatus == 'busy') return <Spinner />;

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
        </tbody>
      </table>

      <div>
        <ContextDesigEdit />
      </div>
    </>
  );
};

export default ContextDesigList;
