import React from 'react';

const SelectControl = ({ optionsRows, selectedId, onSelect }) => {
  return (
    <select
      onChange={(e) => {
        onSelect(e.target.value);
      }}
      value={selectedId}
    >
      <option value=''>Select </option>
      {optionsRows.map((t) => (
        <option key={t.theId} value={t.theId}>
          {t.theDes}
        </option>
      ))}
    </select>
  );
};

export default SelectControl;
