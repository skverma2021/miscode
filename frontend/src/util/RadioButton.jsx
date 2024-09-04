import React from 'react';

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

export default RadioButton;
