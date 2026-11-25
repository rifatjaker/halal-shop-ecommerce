import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [mode, setMode] = useState('login'); // login | register
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'register' && !form.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    // Mock auth — replace with POST /api/auth/login when backend is ready
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    login({ name: mode === 'register' ? form.name : form.email.split('@')[0], email: form.email });
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="logo-mark" style={{ width: 52, height: 52, fontSize: 26 }}>🌙</div>
          <strong>Halal Mart</strong>
          <span>HALAL FOOD · JAPAN</span>
        </div>

        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Login
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === 'register' && (
            <label>
              Full name
              <input type="text" placeholder="e.g. Abdullah Rahman" value={form.name} onChange={set('name')} required />
            </label>
          )}
          <label>
            Email address
            <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </label>
          <label>
            Password
            <input type="password" placeholder="•••••••• (min 6 chars)" value={form.password} onChange={set('password')} required />
          </label>

          {mode === 'login' && (
            <div className="auth-row">
              <label className="auth-check">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>
          )}

          {error && <div className="auth-error">⚠️ {error}</div>}

          <button className="btn primary btn-block" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Login →' : 'Create Account →'}
          </button>
        </form>

        {mode === 'login' && (
          <div className="auth-demo">
            <strong>Demo mode:</strong> any email + 6+ character password logs you in.
            <br />Backend & real authentication coming soon.
          </div>
        )}

        <p className="auth-switch">
          {mode === 'login' ? (
            <>New to Halal Mart?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); setError(''); }}>Create an account</a>
            </>
          ) : (
            <>Already have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); setError(''); }}>Login</a>
            </>
          )}
        </p>

        <Link to="/" className="auth-back">← Continue as guest / back to store</Link>
      </div>
    </div>
  );
}
