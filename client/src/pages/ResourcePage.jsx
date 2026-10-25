import { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import api from '../api';
import { modules } from '../config';
import FormModal from '../components/FormModal';

const pretty = text => text.replace(/_/g, ' ');
export default function ResourcePage({ resource }) {
  const settings = modules[resource];
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadRows() {
    setLoading(true);
    try { const response = await api.get(`/${resource}`, { params: { search } }); setRows(response.data); setError(''); }
    catch (e) { setError(e.response?.data?.message || 'Could not load records.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadRows(); }, [resource, search]);

  async function deleteRow(id) {
    if (!window.confirm('Delete this record?')) return;
    try { await api.delete(`/${resource}/${id}`); loadRows(); }
    catch (e) { setError(e.response?.data?.message || 'Could not delete record.'); }
  }
  async function changeStatus(id, status) {
    try { await api.patch(`/${resource}/${id}/status`, { status }); loadRows(); }
    catch (e) { setError(e.response?.data?.message || 'Could not update status.'); }
  }

  return <div className="resource-page">
    <div className="resource-intro"><div><div className="eyebrow">HOSPITAL MANAGEMENT</div><h1>{settings.title}</h1><p>Add, edit, search or remove {settings.title.toLowerCase()}.</p></div></div>
    {error && <div className="alert">{error}</div>}
    <section className="panel data-panel"><div className="data-toolbar"><div><h3>{settings.title}</h3><p>{rows.length} record(s)</p></div><button className="primary-button" onClick={() => setEditing({})}><Plus size={17}/> Add record</button></div>
      <div className="table-tools"><label className="search-field"><Search size={17}/><input placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)}/></label></div>
      <div className="table-wrap"><table><thead><tr><th>ID</th>{settings.columns.map(column => <th key={column}>{pretty(column)}</th>)}<th>Actions</th></tr></thead><tbody>
        {loading ? <tr><td colSpan={settings.columns.length + 2}>Loading...</td></tr> : rows.map(row => <tr key={row.id}><td>#{row.id}</td>{settings.columns.map(column => <td key={column}>{column === 'status' ? pretty(String(row[column] || '—')) : String(row[column] ?? '—')}</td>)}<td><div className="row-actions">{settings.statusFlow?.[row.status]?.map(status => <button className="table-action status-action" key={status} onClick={() => changeStatus(row.id, status)}>{pretty(status)}</button>)}<button className="table-action edit-action" onClick={() => setEditing(row)} title="Edit"><Pencil size={15}/></button><button className="table-action delete-action" onClick={() => deleteRow(row.id)} title="Delete"><Trash2 size={15}/></button></div></td></tr>)}
        {!loading && rows.length === 0 && <tr><td className="empty-state" colSpan={settings.columns.length + 2}>No records found.</td></tr>}
      </tbody></table></div></section>
    {editing && <FormModal resource={resource} cfg={settings} initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); loadRows(); }}/>}
  </div>;
}
