import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllBirds } from "../services/api";

const STATUS_LABELS = {
  LC: "Préoccupation mineure", NT: "Quasi menacé",   VU: "Vulnérable",
  EN: "En danger",             CR: "En danger critique", EX: "Éteint",
};

// Photos Unsplash pour chaque oiseau par nom commun (normalisé)
const BIRD_PHOTOS = {
  "aigle royal":              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/800px-24701-nature-natural-beauty.jpg",
  "ara rouge":                "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Ara_macao_-_Texas_-pair.jpg/800px-Ara_macao_-_Texas_-pair.jpg",
  "ara bleu et jaune":        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Macaw_above_awareness.jpg/800px-Macaw_above_awareness.jpg",
  "bernache du canada":       "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Canada_goose_%28Branta_canadensis%29_in_St_James%27s_Park%2C_London_-_June_2009.jpg/800px-Canada_goose_%28Branta_canadensis%29_in_St_James%27s_Park%2C_London_-_June_2009.jpg",
  "buse variable":            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Buzzard_buteo_buteo.jpg/800px-Buzzard_buteo_buteo.jpg",
  "canard colvert":           "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Anas_platyrhynchos_male_female_quadrat.jpg/800px-Anas_platyrhynchos_male_female_quadrat.jpg",
  "cardinal rouge":           "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Cardinalis_cardinalis_-_Ritch_Grissom_Memorial_Wetlands_at_Viera%2C_Brevard_County%2C_Florida%2C_USA_-male-8_%288337630990%29.jpg/800px-Cardinalis_cardinalis_-_Ritch_Grissom_Memorial_Wetlands_at_Viera%2C_Brevard_County%2C_Florida%2C_USA_-male-8_%288337630990%29.jpg",
  "chouette effraie":         "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Tyto_alba_-_Wikimania_2016_-_0001.jpg/800px-Tyto_alba_-_Wikimania_2016_-_0001.jpg",
  "colibri à gorge rubis":    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Ruby-throated-humming-bird4.jpg/800px-Ruby-throated-humming-bird4.jpg",
  "cygne tuberculé":          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Mute_Swan_at_Hogganfield_Loch.jpg/800px-Mute_Swan_at_Hogganfield_Loch.jpg",
  "effraie des clochers":     "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Tyto_alba_-_Wikimania_2016_-_0001.jpg/800px-Tyto_alba_-_Wikimania_2016_-_0001.jpg",
  "flamant rose":             "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Flamingo_at_Memphis_Zoo.jpg/800px-Flamingo_at_Memphis_Zoo.jpg",
  "geai bleu":                "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Blue_jay_in_PP_%2830960%29.jpg/800px-Blue_jay_in_PP_%2830960%29.jpg",
  "goéland argenté":          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Larus_argentatus_-_resting.jpg/800px-Larus_argentatus_-_resting.jpg",
  "grand corbeau":            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Corvus_corax_-_Yosemite_National_Park_-_0001.jpg/800px-Corvus_corax_-_Yosemite_National_Park_-_0001.jpg",
  "grand-duc d'europe":       "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bubo_bubo_%28Linnaeus%2C_1758%29.jpg/800px-Bubo_bubo_%28Linnaeus%2C_1758%29.jpg",
  "manchot empereur":         "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/South_Pole_Penguin.jpg/800px-South_Pole_Penguin.jpg",
  "martin-pêcheur":           "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/JN27_1145_Alcedo_atthis.jpg/800px-JN27_1145_Alcedo_atthis.jpg",
  "martin-pecheur d'europe":  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/JN27_1145_Alcedo_atthis.jpg/800px-JN27_1145_Alcedo_atthis.jpg",
  "merle noir":               "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Common_Blackbird.jpg/800px-Common_Blackbird.jpg",
  "mésange charbonnière":     "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Parus_major_Mallorca_1.jpg/800px-Parus_major_Mallorca_1.jpg",
  "mesange charbonniere":     "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Parus_major_Mallorca_1.jpg/800px-Parus_major_Mallorca_1.jpg",
  "paon bleu":                "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Peacock_Plumage.jpg/800px-Peacock_Plumage.jpg",
  "perroquet gris":           "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Pet_parrot_listens_to_its_owner_%282%29.jpg/800px-Pet_parrot_listens_to_its_owner_%282%29.jpg",
  "rouge-gorge familier":     "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Erithacus_rubecula_with_cocked_head.jpg/800px-Erithacus_rubecula_with_cocked_head.jpg",
  "sterne pierregarin":       "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Common_Tern_-_natures_pics.jpg/800px-Common_Tern_-_natures_pics.jpg",
  "toucan toco":              "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Ramphastos_toco_-Birdworld%2C_Farnham%2C_Surrey%2C_England-8a.jpg/800px-Ramphastos_toco_-Birdworld%2C_Farnham%2C_Surrey%2C_England-8a.jpg",
};

// Normalise le nom pour trouver la photo
const getPhoto = (bird) => {
  if (bird.image_url) return bird.image_url;
  const key = (bird.nom_commun ?? "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // enlève accents
    .replace(/['']/g, "'");                            // normalise apostrophes
  // Cherche correspondance exacte ou partielle
  for (const [k, url] of Object.entries(BIRD_PHOTOS)) {
    const kn = k.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (key === kn || key.includes(kn) || kn.includes(key)) return url;
  }
  return null;
};

export default function BirdsList() {
  const [birds, setBirds]   = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("tous");
  const [sort, setSort]     = useState("nom");
  const [params]            = useSearchParams();
  const navigate            = useNavigate();

  useEffect(() => {
    getAllBirds().then((res) => setBirds(res.data ?? []));
    const q = params.get("search");
    if (q)
      setSearch(q);
  }, [params]);

  const filtered = birds
    .filter((b) => {
      const q = search.toLowerCase();
      return (
        (b.nom_commun?.toLowerCase().includes(q) ||
         b.nom_scientifique?.toLowerCase().includes(q) ||
         b.famille?.toLowerCase().includes(q)) &&
        (status === "tous" || b.statut_conservation === status)
      );
    })
    .sort((a, b) => {
      if (sort === "taille") return (a.taille_cm ?? 0) - (b.taille_cm ?? 0);
      if (sort === "poids")  return (a.poids_g  ?? 0) - (b.poids_g  ?? 0);
      return (a.nom_commun ?? "").localeCompare(b.nom_commun ?? "");
    });

  return (
    <div className="page-wrap">
      <div className="banner">
        <div className="banner-inner">
          <h1>Guide Encyclopédique des Oiseaux</h1>
          <p>Découvrez et explorez les espèces avec leurs caractéristiques détaillées</p>
        </div>
      </div>

      <div className="page-inner">
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-bar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                placeholder="Rechercher par nom, nom scientifique ou famille..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="toolbar-right">
            <select className="s-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="nom">Nom (A-Z)</option>
              <option value="taille">Taille</option>
              <option value="poids">Poids</option>
            </select>
            <select className="s-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="tous">Tous les statuts</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{k} – {v}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="count">{filtered.length} espèce(s) trouvée(s)</p>

        {filtered.length === 0 ? (
          <div className="empty-state">Aucune espèce trouvée.</div>
        ) : (
          <div className="birds-grid">
            {filtered.map((bird) => {
              const photo = getPhoto(bird);
              return (
                <div
                  key={bird.id_espece}
                  className="bird-card"
                  onClick={() => navigate(`/oiseaux/${bird.id_espece}`)}
                >
                  <div className="bird-card-img">
                    {photo
                      ? <img src={photo} alt={bird.nom_commun} onError={(e) => { e.target.style.display = "none"; e.target.parentNode.querySelector(".fallback-emoji").style.display = "flex"; }} />
                      : null
                    }
                    <span className="fallback-emoji" style={{ display: photo ? "none" : "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "3rem" }}>🦅</span>
                    {bird.statut_conservation && (
                      <span className="bird-card-badge">
                        {STATUS_LABELS[bird.statut_conservation] ?? bird.statut_conservation}
                      </span>
                    )}
                  </div>
                  <div className="bird-card-body">
                    <h3>{bird.nom_commun}</h3>
                    <p className="bird-card-sci">{bird.nom_scientifique}</p>
                    <div className="bird-card-meta">
                      {bird.taille_cm && (
                        <span>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M3 12h18M3 18h18"/>
                          </svg>
                          {bird.taille_cm} cm
                        </span>
                      )}
                      {bird.poids_g && (
                        <span>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="5" r="3"/>
                            <path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.9-2.54L19.4 9.46A2 2 0 0 0 17.48 8Z"/>
                          </svg>
                          {bird.poids_g >= 1000 ? `${(bird.poids_g/1000).toFixed(1)} kg` : `${bird.poids_g} g`}
                        </span>
                      )}
                    </div>
                    {bird.habitat && (
                      <div className="bird-card-loc">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {bird.habitat}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="footer">© Encyclopédie des Oiseaux</div>
      </div>
    </div>
  );
}