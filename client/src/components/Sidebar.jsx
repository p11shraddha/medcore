import { NavLink } from 'react-router-dom';
import { HeartPulse, LayoutDashboard, CalendarDays, Users, Stethoscope, Building2, ClipboardList, Pill, FlaskConical, ReceiptText } from 'lucide-react';

const links = [
  ['/', 'Overview', LayoutDashboard], ['/appointments', 'Appointments', CalendarDays],
  ['/patients', 'Patients', Users], ['/doctors', 'Doctors', Stethoscope],
  ['/departments', 'Departments', Building2], ['/records', 'Medical records', ClipboardList],
  ['/prescriptions', 'Prescriptions', Pill], ['/lab-orders', 'Laboratory', FlaskConical],
  ['/medicines', 'Pharmacy', HeartPulse], ['/invoices', 'Billing', ReceiptText],
];

export default function Sidebar() {
  return <aside className="sidebar">
    <div className="brand"><span className="brand-mark"><HeartPulse size={23}/></span><span>med<span className="brand-light">core</span><small>Hospital Management System</small></span></div>
    <div className="nav-caption">WORKSPACE</div>
    <nav className="nav-list">{links.map(([path, label, Icon]) => <NavLink key={path} to={path} end={path === '/'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
    <div className="sidebar-bottom"><div className="help-card"><strong>Need a hand?</strong><p>Your care team is one click away.</p><span>Help center →</span></div><div className="profile-mini"><div className="avatar">MC</div><div><strong>MedCore Admin</strong><small>Administrator</small></div></div></div>
  </aside>;
}
