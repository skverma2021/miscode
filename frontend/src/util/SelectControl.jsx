import React from 'react';

// optionRows : [{theId:'', theDes:''}, {}, {}]
// selectedId : value of selected option
// onSelect   : a function that will be executed as onSelect(e.target.value)
// prompt     : the text to appear after 'Select'

const SelectControl = ({ optionsRows, selectedId, onSelect, prompt }) => {
  return (
    <select
      onChange={(e) => {
        onSelect(e.target.value);
      }}
      value={selectedId}
    >
      <option value=''>Select {prompt}</option>
      {optionsRows.map((t) => (
        <option key={t.theId} value={t.theId}>
          {t.theDes}
        </option>
      ))}
    </select>
  );
};

export default SelectControl;
