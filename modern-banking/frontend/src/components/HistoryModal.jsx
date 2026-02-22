import { useState, useEffect } from 'react';
import Modal from './Modal';

export default function HistoryModal({ isOpen, onClose, account, user }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (isOpen && account) {
      const headers = new Headers();
      headers.set('Authorization', user.token);

      fetch(`http://localhost:8081/api/transactions/${account.accountNumber}`, { headers })
        .then(res => res.json())
        .then(data => setTransactions(data))
        .catch(console.error);
    }
  }, [isOpen, account, user]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`History: ${account?.ownerName}`}>
      <div className="max-h-96 overflow-y-auto">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {transactions.map(t => (
              <li key={t.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{t.transactionType}</p>
                  <p className="text-xs text-gray-500">{new Date(t.timestamp).toLocaleString()}</p>
                  {t.transactionType === 'TRANSFER' && (
                    <p className="text-xs text-gray-400">
                      {t.sourceAccountNumber === account.accountNumber ? `To: ${t.targetAccountNumber}` : `From: ${t.sourceAccountNumber}`}
                    </p>
                  )}
                </div>
                <span className={`font-bold ${
                  t.transactionType === 'DEPOSIT' || (t.transactionType === 'TRANSFER' && t.targetAccountNumber === account.accountNumber) 
                  ? 'text-green-600' : 'text-red-600'
                }`}>
                  {t.transactionType === 'DEPOSIT' || (t.transactionType === 'TRANSFER' && t.targetAccountNumber === account.accountNumber) ? '+' : '-'}${t.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
