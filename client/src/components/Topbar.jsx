import { useLocation } from 'react-router-dom';
import { Search, Bell, ChevronRight } from 'lucide-react';
import { modules } from '../config';

export default function Topbar() {
  const location = useLocation();
  const page = modules[location.pathname.slice(1)]?.title || 'Overview';
  return <header className="topbar"><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14}/><strong>{page}</strong></div><div className="topbar-actions">{/* <div className="search-global"><Search size={16}/><span>Search anything...</span></div><button className="icon-button" aria-label="Notifications"><Bell size={19}/></button><div className="top-avatar">A</div> */}</div></header>;
}
