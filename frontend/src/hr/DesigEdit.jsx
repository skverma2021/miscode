import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { errText} from '../util/errMsgText';
import Spinner from '../home/Spinner';
import { useNavigate } from 'react-router-dom';

const DesigEdit = ({theDiscpId, theDiscp, theRow, setFlag}) => {
  const [grades, setGrades] = useState([]); 
  const [theDesig, setTheDesig] = useState({
    id: 0,
    description: '',
    gradeId: '',
  }); 
  const [msg, setMsg] = useState('');
  const [gradeStatus, setGradeStatus] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setTheDesig({id:theRow.id, description:theRow.description, gradeId:theRow.gradeId})
  }, [theDiscp, theRow]);

  let timeoutId;
  const goHome = () => {
    navigate('/');
  };

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    getAllGrades();
  }, []);

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

  const handleSubmit = async () => {
    setStatus('busy');
    try {
      if (theDesig.id == 0) {
        await axios.post('http://localhost:3000/api/designations', {
          // id to be computed by postDesignation stored procedure
          discpId: theDiscpId,
          description: theDesig.description,
          gradeId: theDesig.gradeId,
        });
        setStatus('Added');
      } else {
        await axios.put(
          `http://localhost:3000/api/designations/${theDesig.id}`,
          {
            discpId: theDiscpId,
            description: theDesig.description,
            gradeId: theDesig.gradeId,
          }
        );
        setStatus('Updated');
      }
      setFlag((t) => !t);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

  if (gradeStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: Grades could not be loaded</h1>;
  }

  if (status === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;
  }

  if (status === 'busy') return <Spinner />;

  return (
    <>
      <form>
        <h3>Update or add new Designation in {theDiscp}</h3>
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
                <Link
                  onClick={() =>
                    handleSubmit()
                  }
                >
                  💾
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
  </form>
    </>
  );
};

export default DesigEdit;
