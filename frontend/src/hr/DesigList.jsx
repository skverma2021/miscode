import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import { useNavigate } from 'react-router-dom';
import DesigEdit from './DesigEdit';

const DesigList = ({ discpId, discp }) => {
  const [designations, setDesignations] = useState([]);
  const [editRow, setEditRow] = useState({
    id: 0,
    description: '',
    gradeId: 0,
  });
  const [desigFlag, setDesigFlag] = useState(0);

  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');
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
    setEditRow({
      id: '',
      description: '',
      gradeId: '',
    });
  }, [discpId, desigFlag]);

  const getAllDesignations = async () => {
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
      await axios.delete(`http://localhost:3000/api/designations/${t}`);
      setStatus('Deleted');
      setMsg('Successfully Deleted.');
      setDesigFlag((t) => !t);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

  if (status === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return (
      <h1 style={{ color: 'red' }}>
        Error: Disciplines could not be loaded [ {msg} ]
      </h1>
    );
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
                      setEditRow({
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
      <div>
        <DesigEdit
          theDiscpId={discpId}
          theDiscp={discp}
          theRow={editRow}
          setFlag={() => setDesigFlag(t => !t)}
        />
      </div>
    </>
  );
};

export default DesigList;
