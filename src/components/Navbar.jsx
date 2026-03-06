import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/",        label: "Accueil"   },
  { to: "/detect",  label: "Détection" },
  { to: "/oiseaux", label: "Familles"  },
  { to: "/apropos", label: "À propos"  },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={close}>
          🌿 L'<span className="accent">Encyclopédie</span>
        </Link>

        {/* Liens desktop */}
        <div className="navbar-links">
          {LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={pathname === to ? "active" : ""}>
              {label}
            </Link>
          ))}
        </div>

        {/* Bouton desktop */}
        <Link to="/ajouter" className="navbar-cta" onClick={close}>
          + Ajouter un oiseau
        </Link>

        {/* Burger mobile */}
        <button
          className={`navbar-burger ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      
      <div className={`navbar-drawer ${open ? "open" : ""}`}>
        {LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={pathname === to ? "active" : ""}
            onClick={close}
          >
            {label}
          </Link>
        ))}
        <Link to="/ajouter" className="drawer-cta" onClick={close}>
          + Ajouter un oiseau
        </Link>
      </div>
    </>
  );
}