import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const go = () => navigate(`/oiseaux?search=${search}`);

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        <h1>L'Encyclopédie des Oiseaux</h1>
        <p>
          Explorez la biodiversité aviaire à travers notre catalogue
          scientifique premium. Identifiez, étudiez et préservez.
        </p>
        <div className="hero-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            placeholder="Tapez un nom, une espèce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
          />
          <button onClick={go}>Rechercher</button>
        </div>
      </div>
    </section>
  );
}