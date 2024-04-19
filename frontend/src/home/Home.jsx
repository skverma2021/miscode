import React from 'react';
// import HomeImage from '../img/Designer.png';
import HomeImage from '../img/mis2.jpg';
const Home = () => {
  return (
    <>
      <div style={{ width: '100%', height: '100vh', alignContent: 'center' }}>
        <img
          src={HomeImage}
          alt='Consultancy job management'
          width='100%/'
          height='100%'
        />
      </div>
    </>
  );
};

export default Home;
