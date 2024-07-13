import React, { useState } from 'react';
import DepttGradeXtab from './DepttGradeXtab';
import DepttAgeXtab from './DepttAgeXtab';

const ReportsHR = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  const showContent = (x) => {
    switch (x % 2) {
      case 0:
        return <DepttGradeXtab />;
      case 1:
        return <DepttAgeXtab />;
    }
  };
  const showBtnLable = (x) => {
    switch (x % 2) {
      case 0:
        return 'Department-Grade';
      case 1:
        return 'Department-Age';
    }
  };
  return (
    <div>
      <button
        onClick={handleClick}
        style={{
          width: '100%',
          height: '50px',
          textAlign: 'right',
          color: 'blue',
        }}
      >
        <h4>Next: {showBtnLable(count + 1)}</h4>
      </button>
      <div>{showContent(count)}</div>
    </div>
  );
};

export default ReportsHR;
