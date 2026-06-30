import React, { useState, useEffect } from 'react';
import { getBudgets, addBudget } from '../api';
import { Plus } from 'lucide-react';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({ category: '', limit: '' });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await getBudgets();
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.limit) return;
    
    try {
      await addBudget(formData);
      setFormData({ category: '', limit: '' });
      fetchBudgets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Budgets</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Set monthly spending limits for categories.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Add/Edit Budget Form */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Set Budget</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Category</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})} 
                placeholder="e.g. Food"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Monthly Limit ($)</label>
              <input 
                type="number" 
                className="input-field" 
                value={formData.limit} 
                onChange={(e) => setFormData({...formData, limit: e.target.value})} 
                placeholder="0.00"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <Plus size={18} style={{ marginRight: '0.5rem' }} /> Save Budget
            </button>
          </form>
        </div>

        {/* Budgets List */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Current Limits</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {budgets.map(b => (
              <div key={b._id} style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{b.category}</p>
                <h4 style={{ fontSize: '1.5rem' }}>${b.limit.toFixed(2)}</h4>
              </div>
            ))}
            {budgets.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>No budget limits set yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
