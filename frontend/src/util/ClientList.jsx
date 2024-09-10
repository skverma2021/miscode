import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ClientList = ({ onSelectClient, theClientId, reportStatus }) => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    reportStatus('busy');
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/clients/short`);
        setClients(res.data);
        reportStatus('Success');
      } catch (error) {
        reportStatus('Error');
      }
    };
    fetchData();
  }, []);

  const handleClientChange = (e) => {
    const selectedClientId = parseInt(e.target.value, 10);
    onSelectClient(selectedClientId);
  };

  return (
    <select onChange={handleClientChange} value={theClientId}>
      <option value=''>Select a Client</option>
      {clients.map((t) => (
        <option key={t.id} value={t.id}>
          {t.shortName}
        </option>
      ))}
    </select>
  );
};

export default ClientList;
