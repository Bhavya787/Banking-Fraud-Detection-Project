import { useState } from 'react';
import Modal from './Modal';

export default function CreateAccountModal({ isOpen, onClose, onRefresh, user }) {
  const [form, setForm] = useState({ ownerName: '', accountType: 'SAVINGS', balance: '0' });
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    const balance = parseFloat(form.balance);
    if (isNaN(balance)) {
      setError('Please enter a valid balance');
      return;
    }

    const headers = new Headers();
    headers.set('Authorization', user.token);
    headers.set('Content-Type', 'application/json');

    fetch('http://localhost:8081/api/accounts', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ ...form, balance })
    })
    .then(async res => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to create account');
      }
      return res.json();
    })
    .then(() => {
      onRefresh();
      onClose();
      setForm({ ownerName: '', accountType: 'SAVINGS', balance: '0' });
      setError(null);
    })
    .catch(err => setError(err.message));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Open New Account">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Owner Name</label>
          <input 
            type="text" 
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            value={form.ownerName}
            onChange={e => setForm({...form, ownerName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Account Type</label>
          <select 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            value={form.accountType}
            onChange={e => setForm({...form, accountType: e.target.value})}
          >
            <option value="SAVINGS">Savings</option>
            <option value="CURRENT">Current</option>
            <option value="STUDENT">Student</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Initial Balance</label>
          <input 
            type="number" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            value={form.balance}
            onChange={e => setForm({...form, balance: e.target.value})}
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Create Account
        </button>
      </form>
    </Modal>
  );
}
