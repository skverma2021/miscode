import React from 'react';
import PropTypes from 'prop-types';

const RadioButton = ({
  options,
  selectedOption,
  onOptionChange,
  radioName,
}) => {
  return (
    <div>
      {options.map((t) => (
        <label key={t.value}>
          <input
            type='radio'
            name={radioName}
            value={t.value}
            checked={selectedOption === t.value}
            onChange={(e) => onOptionChange(e.target.value)}
          />
          {t.label}
        </label>
      ))}
    </div>
  );
};

// Key Points About PropTypes:

  // Validation: PropTypes help validate the types of props passed to a component. 
  // For example, you can specify that a prop should be a string, a number, an array, an object, etc.

  // Debugging: It aids in debugging by providing warnings in the console if the props do not match the specified types. 
  // This can help catch errors early in development.

  // Documentation: It serves as a form of documentation by clearly defining the expected prop types, 
  // making it easier for other developers to understand how to use the component.

RadioButton.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedOption: PropTypes.string.isRequired,
  onOptionChange: PropTypes.func.isRequired,
  radioName: PropTypes.string,
};

RadioButton.defaultProps = {
  radioName: 'defaultRadioName',
};

export default RadioButton;
