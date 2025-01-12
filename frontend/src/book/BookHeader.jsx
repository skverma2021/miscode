import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import GoHome from '../util/GoHome';

const BookHeader = ({ empId, month, year }) => {

    // State Variables  
    const [wpDet, setWpDet] = useState([]);
    const [msg, setMsg] = useState('');
    const [status, setStatus] = useState('');

    // get employee's workplans for the selected month
    useEffect(() => {
        getWpDet();
    }, [empId, month, year]);

    const getWpDet = async () => {
        setStatus('busy');
        try {
            const res = await axios.get(
                `http://localhost:3000/api/bookings/bookheader/${empId}/${month}/${year}`
            );
            setWpDet(res.data);
            setStatus('Success');
        } catch (error) {
            setStatus('Error');
            setMsg(`[Error loading workplans: ${errNumber(error)} - ${errText(error)}] `);
        }
    };

    if (wpDet.length == 0) {
        return <h1>Getting Work Plans ... [{wpDet.length}]</h1>;
    }

    if (status === 'Error') {
        return <GoHome secs={5000} msg={msg} />
    }

    return (
        <tr>
            <td style={{ background: 'lightgray', border: '1px solid' }}>
                <small>
                    <table>
                        <tbody>
                            <tr>
                                <td>Job</td>
                                <td>:</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>Workplan</b>
                                </td>
                                <td>:</td>
                            </tr>
                            <tr>
                                <td>Schedule</td>
                                <td>:</td>
                            </tr>
                            <tr>
                                <td>total/used</td>
                                <td>:</td>
                            </tr>
                        </tbody>
                    </table>
                </small>
            </td>
            {wpDet.map((t) => {
                return (
                    <td
                        key={t.wpId}
                        style={{ border: '1px solid', background: 'lightblue' }}
                    >
                        <small>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>{t.nameJob}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>{t.nameStage}</b>[{t.wpId}]
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {t.dtStart} to {t.dtEnd}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Rs.{t.workPlanDepttShare}/{t.consumed}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </small>
                    </td>
                );
            })}
            {/* <td style={{ border: '1px solid', background: 'lightgray' }}>
                <strong>save</strong>
            </td> */}
        </tr>
    );
};

export default BookHeader;