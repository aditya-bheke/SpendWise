import React, { useState, useEffect } from 'react';
import { getTransactions, addTransaction, deleteTransaction } from '../api';
import { Trash2, Plus } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ amount: '', category: '', type: 'expense', description: '' });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;
    
    try {
      await addTransaction(formData);
      setFormData({ amount: '', category: '', type: 'expense', description: '' });
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Transactions</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your income and expenses.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Add Transaction Form */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Add New</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Type</label>
              <select 
                className="input-field" 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Amount ($)</label>
              <input 
                type="number" 
                className="input-field" 
                value={formData.amount} 
                onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Category</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})} 
                placeholder="e.g. Food, Salary"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Optional notes"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Transaction
            </button>
          </form>
        </div>

        {/* Transactions List */}
        <div className="glass-panel" style={{ padding: '1.5rem', overflow: 'hidden' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Transactions</h3>
          <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'rgba(30, 41, 59, 0.9)', zIndex: 1 }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Description</th>
                  <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Amount</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>{new Date(t.date).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>{t.category}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{t.description || '-'}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: t.type === 'income' ? 'var(--success-color)' : 'var(--text-primary)' }}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button onClick={() => handleDelete(t._id)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '0.5rem' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
