import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import GoHome from '../util/GoHome';
import Spinner from '../home/Spinner';
import { WPContext } from '../context/wp/WPContext';

const WorkPlanJob = () => {

    // State Variables  
    const [theJob, setTheJob] = useState({});
    const [status, setStatus] = useState('');
    const [msg, setMsg] = useState('');

    const wpContext = useContext(WPContext);
    const { jobId } = wpContext.wpState;
    const { setJobVal, setJobTimeline } = wpContext;

    // Job attributes
    useEffect(() => {
        const fetchData = async () => {
            setStatus('busy');
            try {
                const res = await axios.get(
                    `http://localhost:3000/api/jobs/client/${jobId}`
                );
                setTheJob(res.data[0]);
                setJobTimeline(res.data[0].jobStart, res.data[0].jobEnd)
                setJobVal(res.data[0].jobValue)
                setStatus('Success');
            } catch (error) {
                setStatus('Error');
                setMsg(`[Error loading Job Details: ${errNumber(error)} - ${errText(error)}] `);
            }
        };
        if (jobId) fetchData();
    }, [jobId]);

    // User Interfaces
    if (status === 'Error') {
        return <GoHome secs={5000} msg={msg} />
    }
    if (status === 'busy') return <Spinner />;
    return (
        <div
            style={{
                width: '100%',
                height: '15vh',
                display: 'flex',
            }}
        >
            <table
                style={{
                    marginTop: '15px',
                    lineHeight: '25px',
                }}
            >
                <tbody>
                    <tr>
                        <td>Client:</td>
                        <td>
                            <b>{theJob.jobClient}</b>
                        </td>
                    </tr>
                    <tr>
                        <td>Job:</td>
                        <td>
                            <b>{theJob.jobDes}</b>
                        </td>
                    </tr>
                    <tr>
                        <td>Value Rs.</td>
                        <td>
                            {' '}
                            <b>
                                {theJob.jobValue}
                            </b>
                        </td>
                    </tr>
                    <tr>
                        <td>From:</td>
                        <td>
                            <b>
                                <u>{theJob.jobStart}</u>
                            </b>
                            {` to `}
                            <b>
                                <u>{theJob.jobEnd}</u>
                            </b>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default WorkPlanJob;