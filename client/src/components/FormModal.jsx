import { useEffect, useState } from 'react';
import api from '../api';

export default function FormModal({ resource, cfg, initial, onClose, onSaved }) {
  const [form, setForm] = useState(() => Object.fromEntries(cfg.fields.map(field => [field.name, initial[field.name] ?? ''])));
  const [options, setOptions] = useState({});
  const [error, setError] = useState('');
  useEffect(() => {
    cfg.fields.filter(field => field.type === 'ref').forEach(async field => {
      try { const response = await api.get(`/${field.resource}`); setOptions(old => ({ ...old, [field.name]: response.data })); }
      catch { setError('Could not load dropdown options.'); }
    });
  }, [cfg]);
  function updateField(name, value) { setForm(old => ({ ...old, [name]: value })); }
  async function save(event) {
    event.preventDefault();
    try { if (initial.id) await api.put(`/${resource}/${initial.id}`, form); else await api.post(`/${resource}`, form); onSaved(); }
    catch (e) { setError(e.response?.data?.message || 'Could not save this record.'); }
  }
  function fieldInput(field) {
    const common = { value: form[field.name] ?? '', required: field.required, onChange: event => updateField(field.name, event.target.value) };
    if (field.type === 'textarea') return <textarea rows="3" {...common}/>;
    if (field.type === 'select' || field.type === 'ref') {
      const choices = field.type === 'ref' ? (options[field.name] || []).map(item => ({ value: item.id, label: item.name })) : field.options.map(item => ({ value: item, label: item }));
      return <select {...common}><option value="">Select...</option>{choices.map(choice => <option key={choice.value} value={choice.value}>{choice.label}</option>)}</select>;
    }
    return <input type={field.type || 'text'} step={field.type === 'number' ? 'any' : undefined} {...common}/>;
  }
  return <div className="overlay" onClick={onClose}><form className="modal" onSubmit={save} onClick={event => event.stopPropagation()}><h2>{initial.id ? 'Edit' : 'Add'} {cfg.title}</h2>{error && <div className="alert">{error}</div>}{cfg.fields.map(field => <label key={field.name}>{field.label}{fieldInput(field)}</label>)}<div className="modal-actions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button type="submit">Save</button></div></form></div>;
}
