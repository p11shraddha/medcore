import { Routes, Route } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Doctors from './pages/Doctors';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import Prescriptions from './pages/Prescriptions';
import LabOrders from './pages/LabOrders';
import Pharmacy from './pages/Pharmacy';
import Billing from './pages/Billing';

export default function App() {
  return <div className="app-shell"><Sidebar/><main className="main-area"><Topbar/><div className="page-content">
    <Routes>
      <Route path="/" element={<Dashboard/>}/><Route path="/departments" element={<Departments/>}/>
      <Route path="/doctors" element={<Doctors/>}/><Route path="/patients" element={<Patients/>}/>
      <Route path="/appointments" element={<Appointments/>}/><Route path="/records" element={<MedicalRecords/>}/>
      <Route path="/prescriptions" element={<Prescriptions/>}/><Route path="/lab-orders" element={<LabOrders/>}/>
      <Route path="/medicines" element={<Pharmacy/>}/><Route path="/invoices" element={<Billing/>}/>
    </Routes><footer className="app-footer"><span>© 2026 MedCore</span><span>Care, connected. <HeartPulse size={13}/></span></footer>
  </div></main></div>;
}
