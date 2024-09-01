import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { errText, errNumber } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import { useNavigate } from 'react-router-dom';

// [id] ,[discpId] ,[description] ,[gradeId]

const Desig1 = () => {
  const [disciplines, setDisciplines] = useState([]); // for the discipline window
  const [theDiscp, setTheDiscp] = useState(0); // for designation window - both edit and browse window - foreign key
  const [theDiscpName, setTheDiscpName] = useState(''); // for display in the designation edit window
  const [designations, setDesignations] = useState([]); // all designations belonging to the discipline
  const [grades, setGrades] = useState([]); // for the select control in edit window
  // the designation record to be edited
  // the foreign key is available as theDiscp
  const [theDesig, setTheDesig] = useState({
    id: '',
    description: '',
    gradeId: '',
  });
  const [desigFlag, setDesigFlag] = useState(false);

  const [discpStatus, setDiscpStatus] = useState('');
  const [desigStatus, setDesigStatus] = useState('');
  const [gradeStatus, setGradeStatus] = useState('');

  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const [errNo, setErrNo] = useState(0);
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
      timeoutId = setTimeout(goHome, 10000);
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
      timeoutId = setTimeout(goHome, 10000);
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
      timeoutId = setTimeout(goHome, 10000);
    }
  };
  const onValChange = (e) => {
    setTheDesig({ ...theDesig, [e.target.name]: e.target.value });
  };

  // [id] ,[discpId] ,[description] ,[gradeId]
  const handleSubmit = async () => {
    setStatus('busy');
    try {
      if (theDesig.id == 0) {
        await axios.post('http://localhost:3000/api/designations', {
          // id to be computed by postDesignation stored procedure
          // id: theDesig.id,
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
    timeoutId = setTimeout(goHome, 5000);
    return (
      <h1 style={{ color: 'red' }}>Error: Disciplines could not be loaded</h1>
    );
  }
  if (desigStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return (
      <h1 style={{ color: 'red' }}>Error: Designations could not be loaded</h1>
    );
  }
  if (gradeStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: Grades could not be loaded</h1>;
  }

  if (status === 'Error' && errNo == 500) {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;
  }

  if (status === 'busy')
    return (
      <>
        <h1>Status: {status}</h1>
        <Spinner />
      </>
    );

  return (
    <>
      <h4 style={{ color: 'red' }}>
        {status === 'Error' && errNo !== 500 && msg}
      </h4>
      <table
        style={{
          width: '100%',
          height: '80vh',
        }}
      >
        <thead>
          <tr>
            <th style={{ width: '50%' }}>DISCIPLINES</th>
            <th style={{ width: '50%' }}>DESIGNATIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/*  Discipline window on the left */}
            <td style={{ verticalAlign: 'top' }}>
              <table style={{ width: '100%', border: '1px solid red' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Disciplines</th>
                  </tr>
                </thead>
                <tbody>
                  {disciplines.map((t) => {
                    return (
                      <tr>
                        <td>
                          <Link
                            onClick={() => {
                              setTheDiscp(t.id);
                              setTheDiscpName(t.description);
                              setTheDesig({
                                id: '',
                                description: '',
                                gradeId: '',
                              });
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
            {/*  Designation window on the right */}
            <td style={{ verticalAlign: 'top' }}>
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
                      <tr>
                        <td>{t.theDesig}</td>
                        <td>{t.theGrade}</td>
                        <td>{t.theHourlyRate}</td>
                        <td>
                          <Link
                            onClick={() => {
                              setTheDesig({
                                id: `${t.id}`,
                                description: `${t.theDesig}`,
                                gradeId: `${t.theGradeId}`,
                              });
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
            </td>
          </tr>
          <tr>
            {/*  Blank */}
            <td style={{ verticalAlign: 'top', border: '0px solid gray' }}>
              {/* Blank */}
            </td>
            {/* // edit window on bottom right */}
            <td style={{ verticalAlign: 'top' }}>
              <form>
                {theDiscp > 0 && (
                  <>
                    <h3>Update or add new Designation in {theDiscpName}</h3>
                    <table style={{ width: '100%', border: '1px solid blue' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left' }}>Description</th>
                          <th style={{ textAlign: 'left' }}>Grade</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input
                              name='description'
                              minLength={3}
                              required
                              value={theDesig.description || ''}
                              onChange={(e) => {
                                return onValChange(e);
                              }}
                              type='text'
                              size={45}
                            />
                          </td>
                          <td>
                            <select
                              name='gradeId'
                              id='gradeId'
                              value={theDesig.gradeId || ''}
                              onChange={(e) => {
                                return onValChange(e);
                              }}
                            >
                              {grades.map((g) => {
                                return (
                                  <option key={g.id} value={g.id}>
                                    {g.description + ' [' + g.hourlyRate + ']'}
                                  </option>
                                );
                              })}
                            </select>
                          </td>
                          <td>
                            {' '}
                            <Link onClick={() => handleSubmit()}>💾</Link>
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
// [id] ,[discpId] ,[description] ,[gradeId]

export default Desig1;
