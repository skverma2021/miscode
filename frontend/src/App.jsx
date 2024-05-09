import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import ToolBar from './header/ToolBar';
import Home from './home/Home';
import Login from './auth/Login';
import ChangePass from './auth/ChangePass';
import Emps from './hr/Emps';
import EmpAdd from './hr/EmpAdd';
import EmpUpd from './hr/EmpUpd';
import Disciplines from './hr/Disciplines';
import TransferPosting from './hr/TransferPosting';
import TPState from './context/tp/TPState';
import Test from './Test';

function App() {
  return (
    <>
      <header>{<ToolBar />}</header>
      {/* <div><Test /></div> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/hr/emp/cp' element={<ChangePass />} />
        <Route path='/hr/emp/all' element={<Emps />} />
        <Route path='/hr/emp/add' element={<EmpAdd />} />
        <Route path='/hr/emp/all/upd/:id' element={<EmpUpd />} />
        <Route path='/hr/discp' element={<Disciplines />} />
        <Route
          path='/hr/emp/all/tp/:id'
          element={
            <TPState>
              <TransferPosting />
            </TPState>
          }
        />
      </Routes>
    </>
  );
}

export default App;
