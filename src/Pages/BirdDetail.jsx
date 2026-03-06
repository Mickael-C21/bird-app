import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBirdById, getAllBirds } from "../services/api";

const STATUS_LABELS = {
  LC: "Préoccupation mineure", NT: "Quasi menacé",   VU: "Vulnérable",
  EN: "En danger",             CR: "En danger critique", EX: "Éteint",
};

const BIRD_PHOTOS = {
  "aigle royal":              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/800px-24701-nature-natural-beauty.jpg",
  "ara rouge":                "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Ara_macao_-_Texas_-pair.jpg/800px-Ara_macao_-_Texas_-pair.jpg",
  "ara bleu et jaune":        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Macaw_above_awareness.jpg/800px-Macaw_above_awareness.jpg",
  "bernache du canada":       "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Canada_goose_%28Branta_canadensis%29_in_St_James%27s_Park%2C_London_-_June_2009.jpg/800px-Canada_goose_%28Branta_canadensis%29_in_St_James%27s_Park%2C_London_-_June_2009.jpg",
  "buse variable":            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Buzzard_buteo_buteo.jpg/800px-Buzzard_buteo_buteo.jpg",
  "canard colvert":           "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Anas_platyrhynchos_male_female_quadrat.jpg/800px-Anas_platyrhynchos_male_female_quadrat.jpg",
  "cardinal rouge":           "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Cardinalis_cardinalis_-_Ritch_Grissom_Memorial_Wetlands_at_Viera%2C_Brevard_County%2C_Florida%2C_USA_-male-8_%288337630990%29.jpg/800px-Cardinalis_cardinalis_-_Ritch_Grissom_Memorial_Wetlands_at_Viera%2C_Brevard_County%2C_Florida%2C_USA_-male-8_%288337630990%29.jpg",
  "chouette effraie":         "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Tyto_alba_-_Wikimania_2016_-_0001.jpg/800px-Tyto_alba_-_Wikimania_2016_-_0001.jpg",
  "colibri a gorge rubis":    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Ruby-throated-humming-bird4.jpg/800px-Ruby-throated-humming-bird4.jpg",
  "cygne tubercule":          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Mute_Swan_at_Hogganfield_Loch.jpg/800px-Mute_Swan_at_Hogganfield_Loch.jpg",
  "effraie des clochers":     "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Tyto_alba_-_Wikimania_2016_-_0001.jpg/800px-Tyto_alba_-_Wikimania_2016_-_0001.jpg",
  "flamant rose":             "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Flamingo_at_Memphis_Zoo.jpg/800px-Flamingo_at_Memphis_Zoo.jpg",
  "geai bleu":                "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Blue_jay_in_PP_%2830960%29.jpg/800px-Blue_jay_in_PP_%2830960%29.jpg",
  "goelan argente":           "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Larus_argentatus_-_resting.jpg/800px-Larus_argentatus_-_resting.jpg",
  "grand corbeau":            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Corvus_corax_-_Yosemite_National_Park_-_0001.jpg/800px-Corvus_corax_-_Yosemite_National_Park_-_0001.jpg",
  "grand-duc d europe":       "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bubo_bubo_%28Linnaeus%2C_1758%29.jpg/800px-Bubo_bubo_%28Linnaeus%2C_1758%29.jpg",
  "manchot empereur":         "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/South_Pole_Penguin.jpg/800px-South_Pole_Penguin.jpg",
  "martin-pecheur":           "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/JN27_1145_Alcedo_atthis.jpg/800px-JN27_1145_Alcedo_atthis.jpg",
  "merle noir":               "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Common_Blackbird.jpg/800px-Common_Blackbird.jpg",
  "mesange charbonniere":     "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Parus_major_Mallorca_1.jpg/800px-Parus_major_Mallorca_1.jpg",
  "paon bleu":                "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Peacock_Plumage.jpg/800px-Peacock_Plumage.jpg",
  "perroquet gris":           "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Pet_parrot_listens_to_its_owner_%282%29.jpg/800px-Pet_parrot_listens_to_its_owner_%282%29.jpg",
  "rouge-gorge familier":     "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Erithacus_rubecula_with_cocked_head.jpg/800px-Erithacus_rubecula_with_cocked_head.jpg",
  "sterne pierregarin":       "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Common_Tern_-_natures_pics.jpg/800px-Common_Tern_-_natures_pics.jpg",
  "toucan toco":              "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Ramphastos_toco_-Birdworld%2C_Farnham%2C_Surrey%2C_England-8a.jpg/800px-Ramphastos_toco_-Birdworld%2C_Farnham%2C_Surrey%2C_England-8a.jpg",
};

const normalize = (s) =>
  (s ?? "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "'")
    .replace(/œ/g, "oe");

const getPhoto = (bird) => {
  if (bird.image_url) return bird.image_url;
  const key = normalize(bird.nom_commun);
  for (const [k, url] of Object.entries(BIRD_PHOTOS)) {
    const kn = normalize(k);
    if (key === kn || key.includes(kn) || kn.includes(key)) return url;
  }
  return null;
};

export default function BirdDetail() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [bird, setBird]       = useState(null);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getBirdById(id).then((data) => {
      setBird(data);
      getAllBirds().then((res) => {
        const others = (res.data ?? []).filter((b) => String(b.id_espece) !== String(id));
        setSimilar(others.slice(0, 4));
      });
    });
  }, [id]);

  if (!bird) return <div className="page-wrap empty-state" style={{ paddingTop: 80 }}>Chargement...</div>;

  const sc    = bird.statut_conservation;
  const photo = getPhoto(bird);

  return (
    <div className="page-wrap">
      <div className="page-inner" style={{ paddingTop: "2rem" }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Retour
        </button>

        {/* Hero */}
        <div className="detail-hero">
          {photo
            ? <img src={photo} alt={bird.nom_commun} />
            : <div className="detail-hero-empty">🦅</div>
          }
          <div className="detail-hero-overlay">
            <div>
              {sc && (
                <div className="detail-badge-wrap">
                  <span className={`badge badge-${sc}`}>{sc} — {STATUS_LABELS[sc] ?? sc}</span>
                </div>
              )}
              <h1>{bird.nom_commun}</h1>
              <span className="detail-hero-sci">{bird.nom_scientifique}</span>
            </div>
          </div>
        </div>

        <div className="detail-grid">
          {/* Colonne gauche */}
          <div>
            <div className="stats-row">
              <div className="stat-box">
                <span className="val">{bird.taille_cm ?? "—"}</span>
                <span className="lbl">Taille (cm)</span>
              </div>
              <div className="stat-box">
                <span className="val">
                  {bird.poids_g
                    ? bird.poids_g >= 1000
                      ? `${(bird.poids_g/1000).toFixed(1)} kg`
                      : `${bird.poids_g} g`
                    : "—"}
                </span>
                <span className="lbl">Poids</span>
              </div>
              <div className="stat-box">
                <span className="val">{bird.envergure_cm ?? "—"}</span>
                <span className="lbl">Envergure (cm)</span>
              </div>
              {bird.longevite_ans && (
                <div className="stat-box">
                  <span className="val">{bird.longevite_ans} ans</span>
                  <span className="lbl">Longévité</span>
                </div>
              )}
            </div>

            <div className="detail-section">
              <h3 className="detail-section-title">Description</h3>
              <p className="detail-desc">{bird.description ?? "Aucune description disponible."}</p>
            </div>

            <div className="detail-section">
              <h3 className="detail-section-title">Habitat & Conservation</h3>
              <div className="taxo-list">
                <div className="taxo-item">
                  <span className="k">Habitat</span>
                  <span className="v">{bird.habitat ?? "—"}</span>
                </div>
                <div className="taxo-item">
                  <span className="k">Statut</span>
                  <span className="v">{sc ? `${sc} — ${STATUS_LABELS[sc] ?? ""}` : "—"}</span>
                </div>
              </div>
            </div>

            {/* Espèces similaires avec photos */}
            {similar.length > 0 && (
              <div className="detail-section">
                <h3 className="detail-section-title">Espèces similaires</h3>
                <div className="similar-grid">
                  {similar.map((s) => {
                    const sp = getPhoto(s);
                    return (
                      <div key={s.id_espece} className="similar-card" onClick={() => navigate(`/oiseaux/${s.id_espece}`)}>
                        {sp
                          ? <img src={sp} alt={s.nom_commun} />
                          : <div className="detail-hero-empty" style={{ fontSize: "2rem" }}>🦅</div>
                        }
                        <div className="similar-card-name">{s.nom_commun}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite */}
          <div>
            <div className="detail-section">
              <h3 className="detail-section-title">Taxonomie</h3>
              <div className="taxo-list">
                <div className="taxo-item"><span className="k">Ordre</span><span className="v">{bird.ordre ?? "—"}</span></div>
                <div className="taxo-item"><span className="k">Famille</span><span className="v">{bird.famille ?? "—"}</span></div>
                <div className="taxo-item"><span className="k">Genre</span><span className="v">{bird.genre ?? "—"}</span></div>
                <div className="taxo-item">
                  <span className="k">Nom scientifique</span>
                  <span className="v" style={{ fontStyle: "italic" }}>{bird.nom_scientifique ?? "—"}</span>
                </div>
              </div>
            </div>

            <button
              className="btn-submit btn-full"
              onClick={() => navigate(`/ajouter-image?espece=${bird.id_espece}`)}
            >
              + Ajouter une photo
            </button>
            <br /><br />
            <button className="btn-cancel btn-full" onClick={() => navigate("/oiseaux")}>
              ← Retour à la liste
            </button>
          </div>
        </div>

        <div className="footer">© Encyclopédie des Oiseaux</div>
      </div>
    </div>
  );
}