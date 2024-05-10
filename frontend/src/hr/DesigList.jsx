import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { errText} from '../util/errMsgText';
import Spinner from '../home/Spinner';
import { useNavigate } from 'react-router-dom';
import DesigEdit from './DesigEdit';

const DesigList = ({discpId, discp}) => {
  const [designations, setDesignations] = useState([]);
  const [editRow, setEditRow] = useState({id:0, description:'', gradeId:0})
  const [desigStatus, setDesigStatus] = useState('');
  const [delStatus, setDelStatus] = useState('');
  const [msg, setMsg] = useState('');
  const [delFlag, setDelFlag] = useState(0);
  const [addEditFlag, setAddEditFlag] = useState(0);
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
    gradeId: ''})
    
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
      const res = await axios.delete(
        `http://localhost:3000/api/designations/${t}`
      );
      setDelStatus('Deleted');
      setMsg('Successfully Deleted.');
      setDelFlag((t) => !t);
    } catch (error) {
      setDelStatus('Error');
      setMsg(errText(error));
    }
  };

  if (desigStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: Designations could not be loaded [ {msg} ]</h1>;
  }
  if (delStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: Designation could not be deleted [ {msg} ]</h1>;
  }

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
          <tr key = {t.id}>
            <td>{t.theDesig}</td>
            <td>{t.theGrade}</td>
            <td>{t.theHourlyRate}</td>
            <td>
              <Link
                onClick={() => {
                  setEditRow({
                    id: `${t.id}`,
                  description: `${t.theDesig}`,
                  gradeId: `${t.theGradeId}`})
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
  <DesigEdit theDiscpId = {discpId} theDiscp = {discp} theRow = {editRow} setFlag = {setAddEditFlag} />
</div>
  </>
  );
};

export default DesigList;
