import React from 'react'

const RadioButton = ({ options, selectedOption, onChange, radioName }) => {
    return (
        <div>
          {options.map((t) => (
            <label key={t.value}>
              <input
                type="radio"
                name={radioName}
                value={t.value}
                checked={selectedOption === t.value}
                onChange={(e) => onChange(e.target.value)}
              />
              {t.label}
            </label>
          ))}
        </div>
      );
    };


export default RadioButton
