import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBird } from "../services/api";

export default function AddBird() {
  const [form, setForm]   = useState({});
  const [loading, setLoad] = useState(false);
  const navigate          = useNavigate();

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true);
    const res = await createBird(form);
    setLoad(false);
    if (res) { alert("✅ Espèce ajoutée !"); navigate("/oiseaux"); }
    else alert("❌ Erreur : vérifie que le serveur est démarré.");
  };

  return (
    <div className="page-wrap">
      <div className="page-inner-md">
        <div className="page-header">
          <h2>Nouvelle Espèce</h2>
          <p>Renseignez les informations de la nouvelle espèce d'oiseau</p>
        </div>

        <div className="form-card">
          <form onSubmit={submit}>

            <p className="section-label">Identification</p>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Nom commun *</label>
                <input name="nom_commun" placeholder="ex : Aigle royal" onChange={set} required />
              </div>
              <div className="form-group">
                <label>Nom scientifique *</label>
                <input name="nom_scientifique" placeholder="ex : Aquila chrysaetos" onChange={set} required />
              </div>
            </div>

            <p className="section-label">Caractéristiques physiques</p>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Taille (cm)</label>
                <input name="taille_cm" type="number" placeholder="ex : 90" onChange={set} />
              </div>
              <div className="form-group">
                <label>Poids (g)</label>
                <input name="poids_g" type="number" placeholder="ex : 4500" onChange={set} />
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Envergure (cm)</label>
                <input name="envergure_cm" type="number" placeholder="ex : 210" onChange={set} />
              </div>
              <div className="form-group">
                <label>Longévité (ans)</label>
                <input name="longevite_ans" type="number" placeholder="ex : 25" onChange={set} />
              </div>
            </div>

            <p className="section-label">Conservation & Habitat</p>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Statut de conservation</label>
                <select name="statut_conservation" onChange={set}>
                  <option value="">-- Choisir --</option>
                  <option value="LC">LC – Préoccupation mineure</option>
                  <option value="NT">NT – Quasi menacé</option>
                  <option value="VU">VU – Vulnérable</option>
                  <option value="EN">EN – En danger</option>
                  <option value="CR">CR – En danger critique</option>
                  <option value="EX">EX – Éteint</option>
                </select>
              </div>
              <div className="form-group">
                <label>Habitat</label>
                <input name="habitat" placeholder="ex : Montagne, forêt..." onChange={set} />
              </div>
            </div>

            <p className="section-label">Taxonomie</p>
            <div className="form-group">
              <label>ID Taxonomie *</label>
              <input name="id_taxonomie" type="number" placeholder="ex : 12" onChange={set} required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" placeholder="Décrivez l'espèce..." onChange={set} />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate("/oiseaux")}>Annuler</button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Ajout en cours..." : "✓ Ajouter l'espèce"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}