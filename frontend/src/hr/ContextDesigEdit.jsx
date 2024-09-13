import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { errText } from '../util/errMsgText';
import { DesigContext } from '../context/desig/DesigContext';

const ContextDesigEdit = () => {
  const [grades, setGrades] = useState([]);
  const [theDesig, setTheDesig] = useState({
    id: 0,
    description: '',
    gradeId: '',
  });

  const {
    setAddEditFlag,
    setDesig,
    discpId,
    discp,
    desigId,
    desigDes,
    desigGrade,
    setStatus,
    setMsg,
  } = useContext(DesigContext);

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
      if (theDesig.id == 0) {
        await axios.post('http://localhost:3000/api/designations', {
          // id to be computed by postDesignation stored procedure
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
      setAddEditFlag((t) => !t);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

  return (
    <>
      <form>
        <h3>Update Designation in {discp}</h3>
        <p style={{ textAlign: 'right' }}>
          <Link onClick={() => setDesig('', '', '')}>AddNew</Link>
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
      </form>
    </>
  );
};

export default ContextDesigEdit;
