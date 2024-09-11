import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../home/Spinner';
import RadioButton from '../util/RadioButton';
import CityList from '../util/CityList';

const EmpUpd = () => {
  const [emp, setEmp] = useState({});
  const [msg, setMsg] = useState('');
  const [cityStatus, setCityStatus] = useState('');
  const [recStatus, setRecStatus] = useState('');
  const [status, setStatus] = useState('');
  const [errNo, setErrNo] = useState(0);
  const navigate = useNavigate();

  const { id } = useParams();

  const okSubmit = () => {...};

  let timeoutId;
  const goHome = () => {...};

  // Clear timer
  useEffect(() => {...}, []);

  // fetch emp row
  useEffect(() => {...}, []);

  const onValChange = (e) => {...};

  // update the row with user input
  const updEmpData = async (event) => {...};

  if (cityStatus === 'Error') {...}
  if (recStatus === 'Error') {...}

  if (status === 'Error' && errNo == 500) {...}

  if (status === 'Error' && errNo !== 2627 && errNo !== 2601) {...}

  if (status === 'busy') return <Spinner />;

  if (status === 'Updated') return <h1 style={{ color: 'blue' }}>{msg}</h1>;

  return (...);
};

export default EmpUpd;
