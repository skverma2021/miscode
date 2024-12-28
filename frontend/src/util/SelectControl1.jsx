import React from 'react';

// optionRows : [{theId:'', theDes:''}, {}, {}]
// selectedId : value of selected option
// onSelect   : a function that will be executed as onSelect(e.target.value)
// prompt     : the text to appear after 'Select'
// name       : the name attribute to be set in the event-like object


// Using SelectControl1 for cityId in CityAdd or CityUpd
{/* <SelectControl1
  optionsRows={cities}
  selectedId={client.cityId}
  onSelect={onValChange}
  prompt={'City'}
  name={'cityId'}
/> */}


const SelectControl1 = ({ optionsRows, selectedId, onSelect, prompt, name }) => {
  return (
    <select
      onChange={(e) => {
        onSelect({ target: { name, value: e.target.value } });
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

export default SelectControl1;
