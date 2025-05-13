// Desig1.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { errText, errNumber } from '../util/errMsgText';
import Spinner from '../home/Spinner';

const Desig1 = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [theDiscp, setTheDiscp] = useState(0);
  const [theDiscpName, setTheDiscpName] = useState('');
  const [designations, setDesignations] = useState([]);
  const [grades, setGrades] = useState([]);

  const [theDesig, setTheDesig] = useState({
    id: '',
    description: '',
    gradeId: '',
  });
  const [desigFlag, setDesigFlag] = useState(false);

  const [discpStatus, setDiscpStatus] = useState('');
  const [desigStatus, setDesigStatus] = useState('');
  const [gradeStatus, setGradeStatus] = useState('');
  const [status, setStatus] = useState('');

  const [msg, setMsg] = useState('');
  const [errNo, setErrNo] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
  const shouldRedirect =
    discpStatus === 'Error' ||
    desigStatus === 'Error' ||
    gradeStatus === 'Error' ||
    (status === 'Error' && errNo === 500);

  if (!shouldRedirect) return;

  const id = setTimeout(() => {
    navigate('/');
  }, 5000);

  // Cleanup function to clear timeout
  return () => clearTimeout(id);
}, [discpStatus, desigStatus, gradeStatus, status, errNo]);

  useEffect(() => {
    getAllDisciplines();
  }, []);

  useEffect(() => {
    getAllDesignations();
  }, [theDiscp, desigFlag]);

  useEffect(() => {
    getAllGrades();
  }, []);

  const getAllDisciplines = async () => {
    setDiscpStatus('busy');
    try {
      const res = await axios.get(`http://localhost:3000/api/disciplines`);
      setDisciplines(res.data);
      setDiscpStatus('Success');
    } catch (error) {
      setDiscpStatus('Error');
      setMsg(errText(error));
    }
  };

  const getAllDesignations = async () => {
    setDesigStatus('busy');
    try {
      const res = await axios.get(
        `http://localhost:3000/api/designations/long/${theDiscp}`
      );
      setDesignations(res.data);
      setDesigStatus('Success');
    } catch (error) {
      setDesigStatus('Error');
      setMsg(errText(error));
    }
  };

  const getAllGrades = async () => {
    setGradeStatus('busy');
    try {
      const res = await axios.get(`http://localhost:3000/api/grades`);
      setGrades(res.data);
      setGradeStatus('Success');
    } catch (error) {
      setGradeStatus('Error');
      setMsg(errText(error));
    }
  };

  const onValChange = (e) => {
    setTheDesig({ ...theDesig, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setStatus('busy');
    try {
      if (theDesig.id === '') {
        await axios.post('http://localhost:3000/api/designations', {
          discpId: theDiscp,
          description: theDesig.description,
          gradeId: theDesig.gradeId,
        });
        setStatus('Added');
      } else {
        await axios.put(
          `http://localhost:3000/api/designations/${theDesig.id}`,
          {
            discpId: theDiscp,
            description: theDesig.description,
            gradeId: theDesig.gradeId,
          }
        );
        setStatus('Updated');
      }
      setTheDesig({ id: '', description: '', gradeId: '' });
      setDesigFlag((t) => !t);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
    }
  };

  const deleteDesigData = async (t) => {
    setStatus('busy');
    try {
      await axios.delete(`http://localhost:3000/api/designations/${t}`);
      setStatus('Deleted');
      setMsg('Successfully Deleted.');
      setDesigFlag((t) => !t);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
    }
  };

  if (discpStatus === 'Error') {
    return <h1 style={{ color: 'red' }}>Error: Disciplines could not be loaded</h1>;
  }
  if (desigStatus === 'Error') {
    return <h1 style={{ color: 'red' }}>Error: Designations could not be loaded</h1>;
  }
  if (gradeStatus === 'Error') {
    return <h1 style={{ color: 'red' }}>Error: Grades could not be loaded</h1>;
  }
  if (status === 'Error' && errNo == 500) {
    return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;
  }
  if (status === 'busy') {
    return (
      <>
        <h1>Status: {status}</h1>
        <Spinner />
      </>
    );
  }

  return (
    <>
      <h4 style={{ color: 'red' }}>
        {status === 'Error' && errNo !== 500 && msg}
      </h4>
      <table style={{ width: '100%', height: '80vh' }}>
        <thead>
          <tr>
            <th style={{ width: '50%' }}>DISCIPLINES</th>
            <th style={{ width: '50%' }}>DESIGNATIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'top' }}>
              <table style={{ width: '100%', border: '1px solid red' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Disciplines</th>
                  </tr>
                </thead>
                <tbody>
                  {disciplines.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <Link
                          onClick={() => {
                            setTheDiscp(t.id);
                            setTheDiscpName(t.description);
                            setTheDesig({ id: '', description: '', gradeId: '' });
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
            <td style={{ verticalAlign: 'top' }}>
              <table style={{ width: '100%', border: '1px solid blue' }}>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Grade</th>
                    <th>Hourly Rate</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {designations.map((t) => (
                    <tr key={t.id}>
                      <td>{t.theDesig}</td>
                      <td>{t.theGrade}</td>
                      <td>{t.theHourlyRate}</td>
                      <td>
                        <Link
                          onClick={() =>
                            setTheDesig({
                              id: `${t.id}`,
                              description: `${t.theDesig}`,
                              gradeId: `${t.theGradeId}`,
                            })
                          }
                        >
                          🖍️
                        </Link>
                      </td>
                      <td>
                        <Link onClick={() => deleteDesigData(t.id)}>✖️</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td></td>
            <td style={{ verticalAlign: 'top' }}>
              <form>
                {theDiscp > 0 && (
                  <>
                    <h3>Update or add new Designation in {theDiscpName}</h3>
                    <table style={{ width: '100%', border: '1px solid blue' }}>
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Grade</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input
                              name="description"
                              minLength={3}
                              required
                              value={theDesig.description || ''}
                              onChange={onValChange}
                              type="text"
                              size={45}
                            />
                          </td>
                          <td>
                            <select
                              name="gradeId"
                              value={theDesig.gradeId || ''}
                              onChange={onValChange}
                            >
                              {grades.map((g) => (
                                <option key={g.id} value={g.id}>
                                  {g.description + ' [' + g.hourlyRate + ']'}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <Link onClick={handleSubmit}>💾</Link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                )}
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Desig1;
