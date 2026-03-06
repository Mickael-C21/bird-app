import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createImage } from "../services/api";

export default function AddImage() {
  const [form, setForm]    = useState({});
  const [preview, setPrev] = useState(null);
  const [loading, setLoad] = useState(false);
  const navigate           = useNavigate();
  const [params]           = useSearchParams();

  const set = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "url") setPrev(value);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true);
    const res = await createImage(form);
    setLoad(false);
    if (res) { alert("✅ Image ajoutée !"); navigate("/oiseaux"); }
    else alert("❌ Erreur : vérifie que le serveur est démarré.");
  };

  return (
    <div className="page-wrap">
      <div className="page-inner-md">
        <div className="page-header">
          <h2>Ajouter une image</h2>
          <p>Associez une photo à une espèce existante</p>
        </div>

        <div className="form-card">
          <form onSubmit={submit}>

            <p className="section-label">Aperçu</p>
            {preview
              ? <img src={preview} alt="Aperçu" className="upload-preview" style={{ marginBottom: "1.5rem", borderRadius: "var(--r-lg)", width: "100%", height: 200, objectFit: "cover" }} />
              : (
                <div className="upload-zone" style={{ marginBottom: "1.5rem", cursor: "default", pointerEvents: "none" }}>
                  <p>L'aperçu apparaîtra automatiquement</p>
                </div>
              )
            }

            <p className="section-label">Informations</p>
            <div className="form-group">
              <label>URL de l'image *</label>
              <input name="url" placeholder="https://..." onChange={set} required />
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Date de prise</label>
                <input name="date_prise" type="date" onChange={set} />
              </div>
              <div className="form-group">
                <label>ID espèce *</label>
                <input name="id_espece" type="number" defaultValue={params.get("espece") ?? ""} placeholder="ex : 3" onChange={set} required />
              </div>
            </div>
            <div className="form-group">
              <label>ID auteur *</label>
              <input name="id_auteur" type="number" placeholder="ex : 1" onChange={set} required />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Annuler</button>
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