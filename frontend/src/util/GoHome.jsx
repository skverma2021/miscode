import React from 'react';
import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const GoHome = ({secs, msg}) => {

      const navigate = useNavigate();
      let timeoutId;
      const goHome = () => {
          navigate('/');
      };
      useEffect(() => {
          return () => clearTimeout(timeoutId);
      }, []);

      timeoutId = setTimeout(goHome, secs);

      return <h1 style={{ color: 'red' }}>{msg}</h1>;
};

export default GoHome;
