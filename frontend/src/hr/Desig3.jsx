import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import { useNavigate } from 'react-router-dom';
import { DesigContext } from '../context/desig/DesigContext';
import ContextDesigList from './ContextDesigList';

const Desig3 = () => {
  const [disciplines, setDisciplines] = useState([]);
  const { setDiscp, setDesig, discpId, setStatus, setMsg, getStatus, getMsg } =
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
    getAllDisciplines();
  }, []);

  const getAllDisciplines = useCallback(async () => {
    setStatus('busy');
    try {
      const res = await axios.get(`http://localhost:3000/api/disciplines`);
      setDisciplines(res.data);
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      timeoutId = setTimeout(goHome, 10000);
    }
  },[]);

  if (getStatus() === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: [ {getMsg()} ]</h1>;
  }

  if (getStatus() === 'busy') return <Spinner />;

  return (
    <>
      <table
        style={{
          width: '100%',
          height: '80vh',
        }}
      >
        <thead>
          <tr>
            <th style={{ width: '50%' }}>DISCIPLINES</th>
            <th style={{ width: '50%' }}>DESIGNATIONS </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/*  Discipline window on the left */}
            <td style={{ verticalAlign: 'top' }}>
              <table style={{ width: '100%', border: '1px solid red' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Select Discipline</th>
                  </tr>
                </thead>
                <tbody>
                  {disciplines.map((t) => {
                    return (
                      <tr key={t.id}>
                        <td>
                          <Link
                            onClick={() => {
                              setDiscp(t.id, t.description);
                              setDesig('', '', '');
                            }}
                          >
                            {' '}
                            {t.description}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </td>
            {/*  Designation rows for edit and delete on right */}
            <td style={{ verticalAlign: 'top' }}>
              {discpId && <ContextDesigList />}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
// [id] ,[discpId] ,[description] ,[gradeId]

export default Desig3;
