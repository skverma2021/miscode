import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import { DesigContext } from '../context/desig/DesigContext';
import GoHome from '../util/GoHome';

const ContextDesigEdit = () => {
  const [grades, setGrades] = useState([]);
  const [theDesig, setTheDesig] = useState({
    id: 0,
    description: '',
    gradeId: '',
  });
  const {
    setDesigFlag,
    setDesig,
    discpId,
    discp,
    desigId,
    desigDes,
    desigGrade,
  } = useContext(DesigContext);
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setTheDesig({ id: desigId, description: desigDes, gradeId: desigGrade });
  }, [desigId, desigDes, desigGrade]);

  useEffect(() => {
    getAllGrades();
  }, []);

  const getAllGrades = async () => {
    setStatus('busy');
    try {
      const res = await axios.get(`http://localhost:3000/api/grades`);
      setGrades(res.data);
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

  const onValChange = (e) => {
    setTheDesig({ ...theDesig, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setStatus('busy');
    try {
      if (!theDesig.id) {
        await axios.post('http://localhost:3000/api/designations', {
          discpId: discpId,
          description: theDesig.description,
          gradeId: theDesig.gradeId,
        });
        setStatus('Added');
      } else {
        await axios.put(
          `http://localhost:3000/api/designations/${theDesig.id}`,
          {
            discpId: discpId,
            description: theDesig.description,
            gradeId: theDesig.gradeId,
          }
        );
        setStatus('Updated');
      }
      setDesigFlag((t) => !t);
      setDesig('', '', '');
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
      <form>
        <h3>
          <i>
            <u>
              {theDesig.id ? 'Update the selected' : 'Add a new'} Designation in {discp} Discipline
            </u>
          </i>
        </h3>
        <p style={{ textAlign: 'right' }}>
          {theDesig.id ? (
            <Link onClick={() => setDesig('', '', '')}>Initialize</Link>
          ) : (
            'New Designation'
          )}
        </p>

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
                  onChange={onValChange}
                  type='text'
                  size={45}
                />
              </td>
              <td>
                <select
                  name='gradeId'
                  id='gradeId'
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
                <Link onClick={handleSubmit}>
                  {theDesig.id ? 'Update' : 'Add'}
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
};

export default ContextDesigEdit;
