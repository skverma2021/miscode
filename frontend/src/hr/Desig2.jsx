import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import DesigList from './DesigList';
import GoHome from '../util/GoHome'; // ✅ imported

const Desig2 = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [theDiscpId, setTheDiscpId] = useState('');
  const [theDiscp, setTheDiscp] = useState('');
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getAllDisciplines();
  }, []);

  const getAllDisciplines = async () => {
    setStatus('busy');
    try {
      const res = await axios.get(`http://localhost:3000/api/disciplines`);
      setDisciplines(res.data);
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

  if (status === 'Error') {
    return <GoHome secs={5000} msg={`Error: Disciplines could not be loaded [ ${msg} ]`} />;
  }

  if (status === 'busy') return <Spinner />;

  return (
    <table style={{ width: '100%', height: '80vh' }}>
      <thead>
        <tr>
          <th style={{ width: '50%' }}>DISCIPLINES</th>
          <th style={{ width: '50%' }}>
            DESIGNATIONS {theDiscpId && ` in ${theDiscp}`}
          </th>
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
                {disciplines.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <Link
                        onClick={() => {
                          setTheDiscpId(t.id);
                          setTheDiscp(t.description);
                        }}
                      >
                        {t.description}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
          {/*  Designation window on the right */}
          <td style={{ verticalAlign: 'top' }}>
            {theDiscpId && (
              <DesigList
                discpId={theDiscpId}
                discp={theDiscp}
              />
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Desig2;
