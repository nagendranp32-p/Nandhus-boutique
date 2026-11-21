import { useState } from 'react';
import { Lock } from 'lucide-react';
import { verifyAdminPin } from '../services/api';

export default function AdminLogin({ onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verifyAdminPin(pin);
      if (res.data.authenticated) {
        onSuccess();
      }
    } catch {
      setError('Wrong Admin PIN. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: 50 }}>
      <div className="panel-card" style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'rgba(212,175,55,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
          }}
        >
          <Lock size={24} color="var(--gold)" />
        </div>

        <h2 className="serif-title" style={{ fontSize: '1.7rem', marginBottom: 6 }}>
          Admin Access
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
          Enter 4-digit store PIN to manage catalogs & sales
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="password"
            maxLength={6}
            placeholder="••••"
            className="input-field"
            style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.4em' }}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />

          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</p>}

          <button type="submit" className="btn-gold" disabled={loading}>
            {loading ? 'Verifying...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}