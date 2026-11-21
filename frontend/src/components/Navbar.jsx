import { Menu, ArrowLeft } from 'lucide-react';

export default function Navbar({ onOpenMenu, onGoHome, showBack, onBack }) {
  return (
    <header className="navbar">
      {showBack ? (
        <button className="icon-btn" onClick={onBack} aria-label="Go Back" title="Back">
          <ArrowLeft size={20} color="var(--gold)" />
        </button>
      ) : (
        <div className="brand-badge" onClick={onGoHome} title="Nandhu's Home">
          N
        </div>
      )}

      <h2
        className="serif-title"
        onClick={onGoHome}
        style={{ fontSize: '1.65rem', color: 'var(--gold)', cursor: 'pointer' }}
      >
        Nandhu’s
      </h2>

      <button className="icon-btn" onClick={onOpenMenu} aria-label="Open Menu">
        <Menu size={22} />
      </button>
    </header>
  );
}