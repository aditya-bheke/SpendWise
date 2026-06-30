import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const getTransactions = () => API.get('/transactions');
export const addTransaction = (data) => API.post('/transactions', data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

export const getBudgets = () => API.get('/budgets');
export const addBudget = (data) => API.post('/budgets', data);

export const getMonthlySummary = (year, month) => API.get(`/summary/monthly?year=${year}&month=${month}`);
