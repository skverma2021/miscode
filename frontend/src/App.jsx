import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import ToolBar from './header/ToolBar';
import Home from './home/Home';
import Login from './auth/Login';
import ChangePass from './auth/ChangePass';
import Emps from './hr/Emps';
import EmpAdd from './hr/EmpAdd';
import EmpUpd from './hr/EmpUpd';
import TransferPosting from './hr/TransferPosting';
import TPState from './context/tp/TPState';

import Test from './Test';
import Disciplines from './hr/Disciplines';
import Desig from './hr/Desig';
import ContextDesig from './hr/ContextDesig';
import {DesigState} from './context/desig/DesigContext';

function App() {
  return (
    <>
      <header>{<ToolBar />}</header>

      {/* for testing only */}
      {/* <div><Test /></div> */}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/hr/emp/cp' element={<ChangePass />} />
        <Route path='/hr/emp/all' element={<Emps />} />
        <Route path='/hr/emp/add' element={<EmpAdd />} />
        <Route path='/hr/emp/all/upd/:id' element={<EmpUpd />} />

        {/* 3 ways to deal with discipline and designations */}
        {/* <Route path='/hr/discp' element={<Disciplines />} /> */}
        {/* <Route path='/hr/discp' element={<Desig />} /> */}
        <Route path='/hr/discp' element={<DesigState><ContextDesig /></DesigState>} />

        <Route path='/hr/emp/all/tp/:id' element={<TPState><TransferPosting /></TPState>}/>
      </Routes>
    </>
  );
}

export default App;
