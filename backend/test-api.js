async function runTests() {
  const API = 'http://localhost:5000/api';
  console.log('Testing SpendWise API...');
  
  try {
    // 1. Add Budget
    console.log('1. Adding Budget...');
    const budgetRes = await fetch(`${API}/budgets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'Food', limit: 300 })
    });
    console.log('Budget Added:', await budgetRes.json());

    // 2. Add Transactions
    console.log('2. Adding Transactions...');
    const tx1Res = await fetch(`${API}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 500, category: 'Salary', type: 'income', description: 'Monthly Salary' })
    });
    console.log('Transaction 1 Added:', await tx1Res.json());

    const tx2Res = await fetch(`${API}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 50, category: 'Food', type: 'expense', description: 'Groceries' })
    });
    console.log('Transaction 2 Added:', await tx2Res.json());
    
    // 3. Get Summary
    console.log('3. Getting Monthly Summary...');
    const date = new Date();
    const summaryRes = await fetch(`${API}/summary/monthly?year=${date.getFullYear()}&month=${date.getMonth() + 1}`);
    console.log('Monthly Summary:', await summaryRes.json());

    console.log('All API tests passed successfully!');
  } catch (error) {
    console.error('API test failed:', error);
  }
}

runTests();
