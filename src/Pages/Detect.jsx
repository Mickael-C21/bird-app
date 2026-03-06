import { useState } from "react";
import { detectBird } from "../services/api";

export default function Detect() {
  const [file, setFile]    = useState(null);
  const [preview, setPrev] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoad] = useState(false);
  const [error, setError]  = useState(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPrev(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  };

  const detect = async () => {
    if (!file) return;
    setLoad(true);
    setError(null);
    const fd = new FormData();
    fd.append("image", file);
    const data = await detectBird(fd);
    setLoad(false);
    if (data) setResult(data);
    else setError(true);
  };

  return (
    <div className="page-wrap">
      <div className="banner">
        <div className="banner-inner">
          <h1>Détection d'espèce</h1>
          <p>Importez une photo pour identifier automatiquement l'oiseau par intelligence artificielle</p>
        </div>
      </div>

      <div className="page-inner-sm">
        <div className="detect-grid">

          {/* Zone upload */}
          <div>
            <label className="upload-zone" htmlFor="det-file">
              {preview
                ? <img src={preview} alt="Aperçu" className="upload-preview" />
                : (
                  <>
                    <svg className="upload-icon" width="48" height="48" viewBox="0 0 24 24"
                      fill="none" stroke="var(--green-light)" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <p>Glissez une image ou cliquez pour choisir</p>
                  </>
                )
              }
              <p className="hint">JPG, PNG, WEBP — max 10 Mo</p>
            </label>
            <input
              id="det-file" type="file" accept="image/*"
              onChange={handleFile} style={{ display: "none" }}
            />

            <button
              className="btn-detect"
              onClick={detect}
              disabled={!file || loading}
            >
              {loading ? "⏳ Analyse en cours..." : "🔍 Identifier l'espèce"}
            </button>
          </div>

          {/* Zone résultat */}
          <div className={`detect-result-box ${result ? "has-result" : ""}`}>
            {error ? (
              <div className="detect-placeholder">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
                  stroke="#e65100" strokeWidth="1.5" style={{ opacity: 0.8 }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <circle cx="12" cy="16" r="0.5" fill="#e65100"/>
                </svg>
                <p style={{ color: "#e65100", marginTop: "0.75rem", fontWeight: 600, fontSize: "0.85rem" }}>
                  Route /api/detect introuvable (404)
                </p>
                <p style={{ fontSize: "0.78rem", marginTop: "0.4rem", maxWidth: 220, color: "var(--text-muted)" }}>
                  Dans ton <code>api.py</code>, vérifie quelle route gère la détection et donne-la moi.
                  Ex : <code>@app.route('/api/predict')</code>
                </p>
              </div>
            ) : result ? (
              <>
                <p className="detect-result-label">Résultat de l'analyse</p>
                <h3 className="detect-result-name">
                  {result.prediction ?? result.species ?? result.classe ?? "Espèce détectée"}
                </h3>
                <p className="detect-result-conf">
                  Confiance : <strong>
                    {Math.round((result.confidence ?? result.score ?? result.probabilite ?? 0) * 100)}%
                  </strong>
                </p>
                <div className="conf-bar">
                  <div
                    className="conf-fill"
                    style={{ width: `${(result.confidence ?? result.score ?? result.probabilite ?? 0) * 100}%` }}
                  />
                </div>
                {(result.nom_commun ?? result.name) && (
                  <div className="detect-species-found">
                    <p>Espèce identifiée</p>
                    <h4>{result.nom_commun ?? result.name}</h4>
                    <span>{result.nom_scientifique ?? result.scientific_name}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="detect-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <p>Le résultat apparaîtra<br />ici après analyse</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}