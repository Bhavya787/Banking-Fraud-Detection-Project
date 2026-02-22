import { useState } from 'react';
import Modal from './Modal';

export default function TransactionModal({ isOpen, onClose, account, type, onRefresh, user }) {
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

    const endpoint = type === 'DEPOSIT' ? 'deposit' : 'withdraw';
    
    const headers = new Headers();
    headers.set('Authorization', user.token);
    headers.set('Content-Type', 'application/json');

    fetch(`http://localhost:8081/api/transactions/${account.accountNumber}/${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ amount: parsedAmount })
    })
    .then(async res => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || 'Transaction failed');
      }
      return res.json();
    })
    .then(() => {
      onRefresh();
      onClose();
      setAmount('');
      setError(null);
    })
    .catch(err => setError(err.message));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${type === 'DEPOSIT' ? 'Deposit to' : 'Withdraw from'} ${account?.ownerName}`}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          className={`w-full text-white py-2 px-4 rounded-md transition ${
            type === 'DEPOSIT' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          Confirm {type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
        </button>
      </form>
    </Modal>
  );
}
