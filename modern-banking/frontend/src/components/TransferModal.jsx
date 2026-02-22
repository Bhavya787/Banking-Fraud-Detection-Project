import { useState } from 'react';
import Modal from './Modal';

export default function TransferModal({ isOpen, onClose, sourceAccount, onRefresh, user }) {
  const [targetAccount, setTargetAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    
    const headers = new Headers();
    headers.set('Authorization', user.token);
    headers.set('Content-Type', 'application/json');

    fetch('http://localhost:8081/api/transactions/transfer', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        sourceAccountNumber: sourceAccount.accountNumber,
        targetAccountNumber: targetAccount,
        amount: parsedAmount
      })
    })
    .then(async res => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || 'Transfer failed');
      }
      return res.json();
    })
    .then(() => {
      onRefresh();
      onClose();
      setTargetAccount('');
      setAmount('');
      setError(null);
    })
    .catch(err => setError(err.message));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Transfer from ${sourceAccount?.ownerName}`}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Target Account Number</label>
          <input 
            type="text" 
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            value={targetAccount}
            onChange={e => setTargetAccount(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input 
            type="number" 
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
        >
          Transfer Funds
        </button>
      </form>
    </Modal>
  );
}
