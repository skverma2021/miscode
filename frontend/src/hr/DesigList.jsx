import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { errText } from '../util/errMsgText';
import DesigEdit from './DesigEdit';

const DesigList = ({ discpId, discp, reportStatus, reportMsg }) => {
  const [designations, setDesignations] = useState([]);
  const [editRow, setEditRow] = useState({
    id: 0,
    description: '',
    gradeId: 0,
  });
  const [delFlag, setDelFlag] = useState(0);
  const [addEditFlag, setAddEditFlag] = useState(0);

  useEffect(() => {
    getAllDesignations();
    setEditRow({
      id: '',
      description: '',
      gradeId: '',
    });
  }, [discpId, addEditFlag, delFlag]);

  const getAllDesignations = async () => {
    reportStatus('busy');
    try {
      const res = await axios.get(
        `http://localhost:3000/api/designations/long/${discpId}`
      );
      setDesignations(res.data);
      reportStatus('Success');
    } catch (error) {
      reportStatus('Error');
      reportMsg(errText(error));
    }
  };

  const deleteDesigData = async (t) => {
    reportStatus('busy');
    try {
      await axios.delete(`http://localhost:3000/api/designations/${t}`);
      reportStatus('Deleted');
      reportMsg('Successfully Deleted.');
      setDelFlag((t) => !t);
    } catch (error) {
      reportStatus('Error');
      reportMsg(errText(error));
    }
  };

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
          setFlag={setAddEditFlag}
          reportStatus1={(s) => reportStatus(s)}
          reportMsg1={(m) => reportMsg(m)}
        />
      </div>
    </>
  );
};

export default DesigList;
