import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import ToolBar from './header/ToolBar';
import Home from './home/Home';
import Login from './auth/Login';

function App() {
  return (
    <>
      <header>{<ToolBar />}</header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
