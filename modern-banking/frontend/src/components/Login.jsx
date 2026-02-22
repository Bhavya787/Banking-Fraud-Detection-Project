import { useState } from 'react';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      onLogin(data);
    } catch (err) {
      setError(err.message);
    }
  };
 
   const loginAsAdmin = async () => {
     setEmail('admin@gmail.com');
     setPassword('admin@123');
     try {
       const res = await fetch('http://localhost:8081/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin@123' })
       });
       const data = await res.json();
       if (!res.ok) throw new Error(data.message || 'Login failed');
       onLogin(data);
     } catch (err) {
       setError(err.message);
     }
   };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login to Banking System</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" required
              className="mt-1 block w-full border rounded p-2"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" required
              className="mt-1 block w-full border rounded p-2"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
           <button type="button" onClick={loginAsAdmin} className="w-full mt-2 bg-gray-800 text-white py-2 rounded hover:bg-gray-900">
             Login as Admin
           </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-blue-600 hover:underline">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}
