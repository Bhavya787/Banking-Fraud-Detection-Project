import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import CreateAccountModal from './components/CreateAccountModal'
import TransactionModal from './components/TransactionModal'
import HistoryModal from './components/HistoryModal'
import TransferModal from './components/TransferModal'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  const [user, setUser] = useState(null) // Auth state
  const [showRegister, setShowRegister] = useState(false)
  
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Modal States
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [transactionType, setTransactionType] = useState(null) // 'DEPOSIT' | 'WITHDRAWAL'
  const [isHistoryOpen, setHistoryOpen] = useState(false)
  const [isTransferOpen, setTransferOpen] = useState(false)

  const fetchAccounts = () => {
    if (!user) return;
    setLoading(true)
    setError(null)
    
    // Create headers with Basic Auth
    const headers = new Headers();
    headers.set('Authorization', user.token);
    headers.set('Content-Type', 'application/json');

    fetch('http://localhost:8081/api/accounts', { headers })
      .then(response => {
        if (response.status === 401) {
          setUser(null); // Logout if unauthorized
          throw new Error("Session expired. Please login again.");
        }
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setAccounts(data)
        } else {
          console.error("API returned non-array data:", data)
          setAccounts([])
          setError("Received invalid data from server")
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching accounts:", err)
        setError(err.message)
        setAccounts([])
        setLoading(false)
      })
  }

  useEffect(() => {
    if (user) {
      fetchAccounts()
    }
  }, [user])

  if (!user) {
    if (showRegister) {
      return <Register onRegister={() => setShowRegister(false)} onSwitchToLogin={() => setShowRegister(false)} />
    }
    return <Login onLogin={setUser} onSwitchToRegister={() => setShowRegister(true)} />
  }

  const openTransaction = (account, type) => {
    setSelectedAccount(account)
    setTransactionType(type)
  }

  const openHistory = (account) => {
    setSelectedAccount(account)
    setHistoryOpen(true)
  }

  const openTransfer = (account) => {
    setSelectedAccount(account)
    setTransferOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <Navbar />
      <div className="bg-white shadow p-4 mb-4 flex justify-between items-center px-8">
        <span className="font-semibold text-gray-700">Welcome, {user.email} ({user.role})</span>
        <button onClick={() => setUser(null)} className="text-red-600 hover:underline">Logout</button>
      </div>

      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <button 
            onClick={() => setCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition transform hover:scale-105"
          >
            + Open New Account
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map(acc => (
              <div key={acc.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{acc.ownerName}</h3>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                      {acc.accountType}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Balance</p>
                    <p className="text-2xl font-bold text-green-600">${acc.balance.toLocaleString()}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-6 font-mono bg-gray-50 p-2 rounded">
                  {acc.accountNumber}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => openTransaction(acc, 'DEPOSIT')}
                    className="bg-green-50 text-green-700 hover:bg-green-100 py-2 rounded text-sm font-medium transition"
                  >
                    Deposit
                  </button>
                  <button 
                    onClick={() => openTransaction(acc, 'WITHDRAWAL')}
                    className="bg-red-50 text-red-700 hover:bg-red-100 py-2 rounded text-sm font-medium transition"
                  >
                    Withdraw
                  </button>
                  <button 
                    onClick={() => openTransfer(acc)}
                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-2 rounded text-sm font-medium transition"
                  >
                    Transfer
                  </button>
                  <button 
                    onClick={() => openHistory(acc)}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 rounded text-sm font-medium transition"
                  >
                    History
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {accounts.length === 0 && !loading && !error && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No accounts found. Create one to get started!</p>
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateAccountModal 
        isOpen={isCreateOpen} 
        onClose={() => setCreateOpen(false)} 
        onRefresh={fetchAccounts}
        user={user}
      />
      
      {selectedAccount && (
        <>
          <TransactionModal
            isOpen={!!transactionType}
            onClose={() => { setSelectedAccount(null); setTransactionType(null) }}
            account={selectedAccount}
            type={transactionType}
            onRefresh={fetchAccounts}
            user={user}
          />
          <HistoryModal
            isOpen={isHistoryOpen}
            onClose={() => { setSelectedAccount(null); setHistoryOpen(false) }}
            account={selectedAccount}
            user={user}
          />
          <TransferModal
            isOpen={isTransferOpen}
            onClose={() => { setSelectedAccount(null); setTransferOpen(false) }}
            sourceAccount={selectedAccount}
            onRefresh={fetchAccounts}
            user={user}
          />
        </>
      )}
    </div>
  )
}

export default App
