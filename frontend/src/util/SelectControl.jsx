import React from 'react';
import PropTypes from 'prop-types';

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

// Key Points About PropTypes:

  // Validation: PropTypes help validate the types of props passed to a component. 
  // For example, you can specify that a prop should be a string, a number, an array, an object, etc.

  // Debugging: It aids in debugging by providing warnings in the console if the props do not match the specified types. 
  // This can help catch errors early in development.

  // Documentation: It serves as a form of documentation by clearly defining the expected prop types, 
  // making it easier for other developers to understand how to use the component.

SelectControl.propTypes = {
  optionsRows: PropTypes.arrayOf(
    PropTypes.shape({
      theId: PropTypes.string.isRequired,
      theDes: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  prompt: PropTypes.string,
};

SelectControl.defaultProps = {
  selectedId: '',
  prompt: '',
};

export default SelectControl;

