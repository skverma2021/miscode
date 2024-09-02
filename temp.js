import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const CityList = ({ onSelectCity, theCityId, reportCityStatus }) => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      reportCityStatus('busy');
      try {
        const res = await axios.get(`http://localhost:3000/api/cities`);
        setCities(res.data);
        reportCityStatus('Success');
      } catch (error) {
        reportCityStatus('Error');
      }
    };
    fetchData();
  }, []);

  const handleCityChange = (e) => {
    const selectedCityId = parseInt(e.target.value, 10);
    onSelectCity(selectedCityId);
  };

  return (
    <select onChange={handleCityChange} value={theCityId}>
      <option value=''>Select a City</option>
      {cities.map((t) => (
        <option key={t.id} value={t.id}>
          {t.cityName}
        </option>
      ))}
    </select>
  );
};

export default CityList;
