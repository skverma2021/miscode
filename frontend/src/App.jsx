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

// BD related
import Clients from './jobs/Clients';
import ClientUpd from './jobs/ClientUpd';
import ClientAdd from './jobs/ClientAdd';
import JobAll from './jobs/JobAll';
import JobUpd from './jobs/JobUpd';
import JobAdd from './jobs/JobAdd'; 
import JobExPlan from './jobs/JobExPlan';
import JobExPlanAdd from './jobs/JobExPlanAdd';

// Booking related
import BookMonthYear from './book/BookMonthYear';
import BookHead from './book/BookHead';

// Reports
import ReportsHR from './hr/ReportsHR';

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

        {/* BD related */}
        <Route path='/bd/clients/all' element={<Clients />} />
        <Route path='/bd/clients/all/upd/:id' element={<ClientUpd />} />
        <Route path='/bd/clients/add' element={<ClientAdd />} />
        <Route path='/bd/jobs/all' element={<JobAll />} />
        <Route path='/bd/jobs/all/upd/:id' element={<JobUpd />} />
        <Route path='/bd/jobs/add' element={<JobAdd />} />
        <Route path='/bd/jobs/all/exPlan/:jobId' element={<JobExPlan />} />
        <Route path='/bd/jobs/all/exAdd/:jobId' element={<JobExPlanAdd />} />

        {/* Booking related */}
        <Route path='/booking' element={<BookMonthYear />} />
        <Route path='/booking/:m/:y' element={<BookHead />} />

        {/* Reports related */}
        <Route path='/hr/reports' element={<ReportsHR />} />
      </Routes>
    </>
  );
}

// TO RUN LoginCopy

// import LoginCopy from './auth/LoginCopy';

// function App(){
//   return <LoginCopy />
// }

export default App;