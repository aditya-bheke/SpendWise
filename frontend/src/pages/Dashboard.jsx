import React, { useEffect, useState } from 'react';
import { getMonthlySummary, getBudgets } from '../api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
  const [summary, setSummary] = useState({ income: 0, expense: 0, breakdown: [] });
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, budgetsRes] = await Promise.all([
        getMonthlySummary(currentYear, currentMonth),
        getBudgets()
      ]);
      
      // Formatting for pie chart
      const chartData = summaryRes.data.breakdown.map(item => ({
        name: item.category,
        value: item.amount
      }));
      
      setSummary({ ...summaryRes.data, breakdown: chartData });
      setBudgets(budgetsRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const balance = summary.income - summary.expense;

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Overview of your finances for {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}</p>
      </header>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Balance</p>
          <h3 style={{ fontSize: '2rem', color: balance >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>${balance.toFixed(2)}</h3>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Income</p>
          <h3 style={{ fontSize: '2rem', color: 'var(--success-color)' }}>${summary.income.toFixed(2)}</h3>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Expense</p>
          <h3 style={{ fontSize: '2rem', color: 'var(--danger-color)' }}>${summary.expense.toFixed(2)}</h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Category Breakdown */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Expense Breakdown</h3>
          {summary.breakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={summary.breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {summary.breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              No expenses this month
            </div>
          )}
        </div>

        {/* Budget Progress */}
        <div className="glass-panel" style={{ padding: '1.5rem', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Budget Tracking</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {budgets.map(budget => {
              const spent = summary.breakdown.find(b => b.name === budget.category)?.value || 0;
              const percent = Math.min((spent / budget.limit) * 100, 100);
              const isOver = spent > budget.limit;
              
              return (
                <div key={budget._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>{budget.category}</span>
                    <span style={{ color: isOver ? 'var(--danger-color)' : 'var(--text-secondary)' }}>
                      ${spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${percent}%`, 
                      backgroundColor: isOver ? 'var(--danger-color)' : 'var(--primary-color)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              );
            })}
            {budgets.length === 0 && (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>
                No budgets set. Head to Budgets page to create them.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
