import React, { useState } from 'react';
import YrMn from './YrMn';
import YrDMn from './YrDMn';
import YrDMnC from './YrDMnC';
import YrDMnA from './YrDMnA';

const ReportsBD = () => {
  const [count, setCount] = useState(0);

  const handleClickRight = () => {
    setCount(count + 1);
  };
  const handleClickLeft = () => {
    setCount(count - 1);
  };

  const showContent = (x) => {
    const y = Math.abs(x);
    switch (y % 4) {
      case 0:
        return <YrMn />;
      case 1:
        return <YrDMn />;
      case 2:
        return <YrDMnC />;
      case 3:
        return <YrDMnA />;
    }
  };
  const showBtnLable = (x) => {
    const y = Math.abs(x);
    switch (y % 4) {
      case 0:
        return 'Year-Month';
      case 1:
        return 'Year-Month-Department';
      case 2:
        return 'Year-Month-Department-Client';
      case 3:
        return 'Year-Month-Department-Allottment';
    }
  };

  return (
    <div>
      <button
        onClick={handleClickLeft}
        style={{
          width: '50%',
          height: '50px',
          textAlign: 'left',
          color: 'blue',
        }}
      >
        <h4>Prev: {showBtnLable(count - 1)}</h4>
      </button>
      <button
        onClick={handleClickRight}
        style={{
          width: '50%',
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

export default ReportsBD;
