import { Route, Routes } from 'react-router-dom';

// Common
import ToolBar from './header/ToolBar';
import Home from './home/Home';
import Login from './auth/Login';
import ChangePass from './auth/ChangePass';

// HR
import Emps from './hr/Emps';
import EmpAdd from './hr/EmpAdd';
import EmpUpd from './hr/EmpUpd';
import { TPState } from './context/tp/TPContext';
import TransferPosting from './hr/TransferPosting';
// import Desig1 from './hr/Desig1';
// import Desig2 from './hr/Desig2';
import { DesigState } from './context/desig/DesigContext';
import Desig3 from './hr/Desig3';

// BD
import Clients from './jobs/Clients';
import ClientUpd from './jobs/ClientUpd';
import ClientAdd from './jobs/ClientAdd';
import JobAll from './jobs/JobAll';
import JobUpd from './jobs/JobUpd';
import JobAdd from './jobs/JobAdd';
import JobExPlan from './jobs/JobExPlan';
import JobExPlanAdd from './jobs/JobExPlanAdd';

// Booking
import BookMonthYear from './book/BookMonthYear';
import BookHead from './book/BookHead';

// Reports
import ReportsHR from './hr/ReportsHR';

function App() {
  return (
    <>
      <header>{<ToolBar />}</header>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/hr/emp/cp' element={<ChangePass />} />
        {/* HR  */}
        <Route path='/hr/emp/all' element={<Emps />} />
        <Route path='/hr/emp/add' element={<EmpAdd />} />
        <Route path='/hr/emp/all/upd/:id' element={<EmpUpd />} />
        {/* 3 ways to deal with discipline and designations */}
        {/* <Route path='/hr/desig' element={<Desig1 />} /> */}
        {/* <Route path='/hr/desig' element={<Desig2 />} /> */}
        <Route
          path='/hr/desig'
          element={
            <DesigState>
              <Desig3 />
            </DesigState>
          }
        />
        <Route
          path='/hr/emp/all/tp/:id'
          element={
            <TPState>
              <TransferPosting />
            </TPState>
          }
        />

        {/* BD  */}
        <Route path='/bd/clients/all' element={<Clients />} />
        <Route path='/bd/clients/all/upd/:id' element={<ClientUpd />} />
        <Route path='/bd/clients/add' element={<ClientAdd />} />
        <Route path='/bd/jobs/all' element={<JobAll />} />
        <Route path='/bd/jobs/all/upd/:id' element={<JobUpd />} />
        <Route path='/bd/jobs/add' element={<JobAdd />} />
        <Route path='/bd/jobs/all/exPlan/:jobId' element={<JobExPlan />} />
        <Route path='/bd/jobs/all/exAdd/:jobId' element={<JobExPlanAdd />} />

        {/* Booking */}
        <Route path='/booking' element={<BookMonthYear />} />
        <Route path='/booking/:m/:y' element={<BookHead />} />

        {/* Reports */}
        <Route path='/hr/reports' element={<ReportsHR />} />
      </Routes>
    </>
  );
}

export default App;
