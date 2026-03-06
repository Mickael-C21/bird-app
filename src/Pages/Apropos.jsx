import { useNavigate } from "react-router-dom";

const FEATURES = [
  { icon: "🔍", title: "Catalogue complet",    desc: "Explorez des centaines d'espèces du monde entier avec leurs caractéristiques scientifiques : taille, poids, envergure, longévité et statut de conservation." },
  { icon: "🤖", title: "Détection par IA",     desc: "Importez une photo d'un oiseau et notre intelligence artificielle identifie automatiquement l'espèce en quelques secondes avec un score de confiance." },
  { icon: "📊", title: "Tableau comparatif",   desc: "Comparez les espèces grâce à notre vue tableau. Triez par taille, poids, envergure ou longévité pour mieux comprendre la diversité aviaire." },
  { icon: "🛡️", title: "Conservation",        desc: "Chaque espèce est accompagnée de son statut UICN (LC, NT, VU, EN, CR, EX) pour sensibiliser à la protection de la biodiversité aviaire mondiale." },
  { icon: "➕", title: "Contribution ouverte", desc: "Participez à l'enrichissement de la base en ajoutant de nouvelles espèces ou en associant des photos à des espèces existantes." },
  { icon: "📱", title: "Interface moderne",    desc: "Un design épuré et responsive, utilisable sur ordinateur comme sur mobile, pour accéder à toutes les informations où que vous soyez." },
];

const STACK = [
  { name: "Projet académique", role: "TP Web — Développement full-stack" },
  { name: "Backend Flask",     role: "API REST Python avec base de données" },
  { name: "Frontend React",    role: "Interface utilisateur Vite + React" },
  { name: "IA intégrée",       role: "Modèle de classification d'espèces" },
];

const STATS = [
  { v: "500+", l: "Espèces"       },
  { v: "6",    l: "Statuts UICN"  },
  { v: "IA",   l: "Détection auto"},
  { v: "100%", l: "Gratuit"       },
];

export default function APropos() {
  const navigate = useNavigate();

  return (
    <div className="page-wrap">

      <div className="apropos-banner">
        <div className="icon">🌿</div>
        <h1>À propos de L'Encyclopédie</h1>
        <p>
          Une encyclopédie scientifique dédiée à la biodiversité aviaire —
          identifier, comprendre et préserver les oiseaux du monde entier.
        </p>
      </div>

      <div className="apropos-inner">

        {/* Mission */}
        <div className="mission-grid">
          <div className="mission-text">
            <p className="sub">Notre mission</p>
            <h2>Rendre la science aviaire accessible à tous</h2>
            <p>
              L'Encyclopédie des Oiseaux est une plateforme numérique qui centralise les connaissances
              scientifiques sur les espèces aviaires du monde entier. Notre objectif est de rendre
              ces informations accessibles, visuelles et interactives pour le grand public comme
              pour les chercheurs.
            </p>
            <p>
              En combinant une base de données rigoureuse, une interface moderne et une intelligence
              artificielle de détection, nous proposons un outil unique au croisement de la science,
              de la technologie et de la conservation.
            </p>
          </div>
          <div className="mission-stats">
            <div className="bird-icon">🦅</div>
            <div className="stats-2x2">
              {STATS.map(({ v, l }) => (
                <div key={l} className="stats-2x2-item">
                  <div className="v">{v}</div>
                  <div className="l">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fonctionnalités */}
        <p className="features-label">Ce que vous pouvez faire</p>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="ficon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Stack */}
        <div className="stack-card">
          <p className="stack-label">Stack technique</p>
          {STACK.map((s) => (
            <div key={s.name} className="stack-row">
              <span className="name">{s.name}</span>
              <span className="role">{s.role}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="cta-banner">
          <h3>Prêt à explorer ?</h3>
          <p>Parcourez notre catalogue ou identifiez un oiseau dès maintenant</p>
          <div className="cta-btns">
            <button className="btn-cta-white" onClick={() => navigate("/oiseaux")}>
              🦅 Parcourir le catalogue
            </button>
            <button className="btn-cta-outline" onClick={() => navigate("/detect")}>
              🔍 Détecter un oiseau
            </button>
          </div>
        </div>

      </div>

      <div className="footer">© 2025 L'Encyclopédie des Oiseaux — Projet académique TP Web</div>
    </div>
  );
}