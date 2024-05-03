import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import ToolBar from './header/ToolBar';
import Home from './home/Home';
import Login from './auth/Login';
import ChangePass from './auth/ChangePass';
import Test from './Test';

function App() {
  return (
    <>
      <header>{<ToolBar />}</header>
      <div><Test /></div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/hr/emp/cp' element={<ChangePass />} />
      </Routes>
    </>
  );
}

export default App;
