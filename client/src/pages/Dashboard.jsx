import { useEffect, useState } from 'react';
import { Users, Stethoscope, CalendarCheck, IndianRupee, ArrowRight, CalendarPlus, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import doctorsTeam from '../assets/doctors-team.jpg';
import patientsImage from '../assets/patients-illustration.jpg';
import staffImage from '../assets/staff-illustration.jpg';
import appointmentsImage from '../assets/appointments-illustration.jpg';
import revenueImage from '../assets/revenue-illustration.jpg';
import api from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/dashboard').then(response => setData(response.data)).catch(() => setError('Could not load data. Please check that the server is running.')); }, []);
  if (error) return <div className="alert">{error}</div>;
  if (!data) return <div className="loading-card">Loading hospital overview...</div>;

  const cards = [
    { title: 'Total patients', value: data.patients, image: patientsImage, Icon: Users, color: 'blue' },
    { title: 'Medical staff', value: data.doctors, image: staffImage, Icon: Stethoscope, color: 'teal' },
    { title: 'Appointments today', value: data.appointmentsToday, image: appointmentsImage, Icon: CalendarCheck, color: 'violet' },
    { title: 'Revenue collected', value: `₹${Number(data.revenue).toLocaleString('en-IN')}`, image: revenueImage, Icon: IndianRupee, color: 'mint' },
  ];
  return <div className="dashboard-page">
    <section className="welcome-row"><div><div className="eyebrow">YOUR HEALTHCARE AT A GLANCE</div><h1>Good day, Admin</h1><p>Here is what is happening across your healthcare center today.</p></div><div className="welcome-date"><CalendarPlus size={17}/>{new Date().toLocaleDateString('en-IN')}</div></section>
    <section className="hero-banner"><div className="hero-copy"><span className="hero-tag"><Activity size={13}/> MEDCORE OVERVIEW</span><h2>Better care starts<br/>with better insights.</h2><p>Keep your team, patients and daily operations in sync.</p><Link to="/appointments" className="hero-button">Manage appointments <ArrowRight size={16}/></Link></div><div className="hero-doctors-wrap"><img className="hero-doctors-image" src={doctorsTeam} alt="Doctors working together"/></div></section>
    <section className="section-heading"><div><h2>Overview</h2><p>Key numbers for your hospital</p></div><span className="section-chip">Live summary</span></section>
    <section className="kpi-grid">{cards.map(({title,value,image,Icon,color}) => <article className={`stat-card stat-${color}`} key={title}><div className="stat-top"><span className={`stat-icon ${color}`}><Icon size={20}/></span><img className="stat-illustration" src={image} alt=""/></div><p>{title}</p><strong>{value}</strong><small>Updated from hospital records</small></article>)}</section>
	<section className="section-heading"><div><h2>Quick actions</h2><p>Open a section to manage hospital information</p></div></section>
    <section className="quick-grid"><Link to="/patients" className="quick-card"><span className="quick-icon blue"><Users size={20}/></span><span><strong>Patient records</strong><small>View and add patients</small></span><ArrowRight size={16}/></Link><Link to="/appointments" className="quick-card"><span className="quick-icon cyan"><CalendarPlus size={20}/></span><span><strong>Appointments</strong><small>Manage scheduled visits</small></span><ArrowRight size={16}/></Link><Link to="/doctors" className="quick-card"><span className="quick-icon violet"><Stethoscope size={20}/></span><span><strong>Doctors</strong><small>View medical staff</small></span><ArrowRight size={16}/></Link></section>
  </div>;
}
