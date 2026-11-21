import { X, Settings, User, ShieldCheck, Moon, Sun, LogOut } from 'lucide-react';

export default function MenuDrawer({
  isOpen,
  onClose,
  darkMode,
  onToggleDarkMode,
  isAdmin,
  onNavigate,
  onLogout,
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span className="serif-title" style={{ fontSize: '1.4rem', color: 'var(--gold)' }}>
            Menu
          </span>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <button className="drawer-item" onClick={() => { onNavigate('home'); onClose(); }}>
          <Settings size={18} color="var(--gold)" /> 1. Store Catalog
        </button>

        <button className="drawer-item" onClick={() => { alert("Nandhu's Boutique • Verified Store Account"); onClose(); }}>
          <User size={18} color="var(--gold)" /> 2. Accounts
        </button>

        <button className="drawer-item" onClick={() => { onNavigate('admin'); onClose(); }}>
          <ShieldCheck size={18} color="var(--gold)" /> 3. Admin Page
        </button>

        <button className="drawer-item" onClick={onToggleDarkMode}>
          {darkMode ? <Sun size={18} color="var(--gold)" /> : <Moon size={18} color="var(--gold)" />}
          4. {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {isAdmin && (
          <button
            className="drawer-item"
            style={{ marginTop: 'auto', color: 'var(--danger)' }}
            onClick={() => { onLogout(); onClose(); }}
          >
            <LogOut size={18} /> 5. Log Out
          </button>
        )}
      </aside>
    </>
  );
}