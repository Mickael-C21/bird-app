import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createImage } from "../services/api";

export default function AddImage() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();

  // ✅ Initialisation avec les valeurs par défaut dès le départ
  const [form, setForm] = useState({
    url:        "",
    date_prise: new Date().toISOString().split("T")[0],
    id_espece:  params.get("espece") ?? "",
    id_auteur:  "",
  });
  const [loading, setLoad] = useState(false);
  const [error,   setError] = useState(null);

  const set = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true);
    setError(null);

    const payload = {
      url:        form.url,
      date_prise: form.date_prise || null,
      id_espece:  parseInt(form.id_espece, 10),
      id_auteur:  parseInt(form.id_auteur, 10),
    };

    // Vérifie que les IDs sont des nombres valides avant d'envoyer
    if (isNaN(payload.id_espece) || isNaN(payload.id_auteur)) {
      setError("L'ID espèce et l'ID auteur doivent être des nombres valides.");
      setLoad(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/images", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? `Erreur HTTP ${res.status}`);
      } else {
        alert("✅ Image ajoutée avec succès !");
        navigate("/oiseaux");
      }
    } catch (err) {
      setError("Impossible de joindre le serveur.");
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-inner-md">
        <div className="page-header">
          <h2>Ajouter une image</h2>
          <p>Associez une photo à une espèce existante</p>
        </div>

        {error && (
          <div style={{
            background: "#fce4ec", border: "1px solid #f48fb1",
            borderRadius: "var(--r)", padding: "0.85rem 1.1rem",
            marginBottom: "1.25rem", color: "#c62828", fontSize: "0.875rem",
            display: "flex", gap: "0.6rem", alignItems: "flex-start",
          }}>
            <span>❌</span>
            <div>
              <strong>Erreur :</strong> {error}
            </div>
          </div>
        )}

        <div className="form-card">
          <form onSubmit={submit}>

            <p className="section-label">Aperçu</p>
            {form.url ? (
              <img
                src={form.url}
                alt="Aperçu"
                onError={(e) => e.target.style.display = "none"}
                style={{ width:"100%", height:200, objectFit:"cover", borderRadius:"var(--r-lg)", marginBottom:"1.5rem" }}
              />
            ) : (
              <div className="upload-zone" style={{ marginBottom:"1.5rem", cursor:"default", pointerEvents:"none" }}>
                <p>L'aperçu apparaîtra dès que vous saisissez une URL</p>
              </div>
            )}

            <p className="section-label">Informations</p>

            <div className="form-group">
              <label>URL de l'image *</label>
              <input
                name="url"
                value={form.url}
                placeholder="https://..."
                onChange={set}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Date de prise</label>
                <input
                  name="date_prise"
                  type="date"
                  value={form.date_prise}
                  onChange={set}
                />
              </div>
              <div className="form-group">
                <label>ID espèce *</label>
                <input
                  name="id_espece"
                  type="number"
                  min="1"
                  value={form.id_espece}  // ✅ value au lieu de defaultValue
                  placeholder="ex : 18"
                  onChange={set}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>ID auteur *</label>
              <input
                name="id_auteur"
                type="number"
                min="1"
                value={form.id_auteur}  // ✅ value au lieu de defaultValue
                placeholder="ex : 1"
                onChange={set}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
                Annuler
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Ajout en cours..." : "✓ Ajouter l'image"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}