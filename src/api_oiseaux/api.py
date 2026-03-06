from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Mebac2022@localhost:5432/oiseaux_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

def q(sql, params={}):
    return db.session.execute(text(sql), params)

def exists(table, pk, val):
    return q(f"SELECT 1 FROM {table} WHERE {pk} = :v", {'v': val}).fetchone()

# ── GET ──────────────────────────────────────────────────────────────────────

@app.route('/api/oiseaux')
def get_oiseaux():
    sort = request.args.get('sort_by', 'id_espece')
    if sort not in ['id_espece','taille_cm','poids_g','envergure_cm','nom_commun']:
        return jsonify(error="Sort invalide"), 400
    rows = q(f"""
        SELECT e.*, t.ordre, t.famille, t.genre, i.url AS image_url
        FROM espece e
        LEFT JOIN taxonomie t ON e.id_taxonomie = t.id_taxonomie
        LEFT JOIN LATERAL (
            SELECT url FROM image WHERE id_espece = e.id_espece ORDER BY id_image LIMIT 1
        ) i ON true
        ORDER BY e.{sort}
    """)
    data = [dict(r._mapping) for r in rows]
    return jsonify(total=len(data), data=data)

@app.route('/api/oiseaux/<int:id>')
def get_oiseau(id):
    row = q("""
        SELECT e.*, t.ordre, t.famille, t.genre FROM espece e
        JOIN taxonomie t ON e.id_taxonomie = t.id_taxonomie
        WHERE e.id_espece = :id
    """, {'id': id}).fetchone()
    if not row: return jsonify(error="Non trouvé"), 404
    data = dict(row._mapping)
    data['images'] = [dict(r._mapping) for r in q("""
        SELECT i.id_image, i.url, i.date_prise, a.nom, a.prenom
        FROM image i LEFT JOIN auteur a ON i.id_auteur = a.id_auteur
        WHERE i.id_espece = :id ORDER BY i.id_image
    """, {'id': id})]
    data['image_url'] = data['images'][0]['url'] if data['images'] else None
    data['pays'] = [dict(r._mapping) for r in q("""
        SELECT p.* FROM pays p JOIN espece_pays ep ON ep.id_pays = p.id_pays
        WHERE ep.id_espece = :id
    """, {'id': id})]
    return jsonify(data)

@app.route('/api/images')
def get_images():
    rows = q("""
        SELECT i.*, e.nom_commun, e.nom_scientifique, a.nom, a.prenom
        FROM image i
        JOIN espece e ON i.id_espece = e.id_espece
        JOIN auteur a ON i.id_auteur = a.id_auteur
        ORDER BY i.date_prise DESC
    """)
    data = [dict(r._mapping) for r in rows]
    return jsonify(total=len(data), data=data)

@app.route('/api/taxonomie')
def get_taxonomie():
    data = [dict(r._mapping) for r in q("SELECT * FROM taxonomie ORDER BY id_taxonomie")]
    return jsonify(total=len(data), data=data)

@app.route('/api/auteurs')
def get_auteurs():
    data = [dict(r._mapping) for r in q("SELECT * FROM auteur ORDER BY id_auteur")]
    return jsonify(total=len(data), data=data)

# ── POST ─────────────────────────────────────────────────────────────────────

@app.route('/api/oiseaux', methods=['POST'])
def create_oiseau():
    d = request.get_json()
    if not all(f in d for f in ['nom_scientifique','nom_commun','id_taxonomie']):
        return jsonify(error="Champs requis manquants"), 400
    if not exists('taxonomie','id_taxonomie', d['id_taxonomie']):
        return jsonify(error="Taxonomie introuvable"), 404
    new_id = q("""
        INSERT INTO espece (nom_scientifique,nom_commun,taille_cm,poids_g,
            envergure_cm,habitat,statut_conservation,description,id_taxonomie)
        VALUES (:nom_scientifique,:nom_commun,:taille_cm,:poids_g,
            :envergure_cm,:habitat,:statut_conservation,:description,:id_taxonomie)
        RETURNING id_espece
    """, {**{f: d.get(f) for f in ['nom_scientifique','nom_commun','taille_cm','poids_g',
        'envergure_cm','habitat','description']},
        'statut_conservation': d.get('statut_conservation','LC'),
        'id_taxonomie': d['id_taxonomie']
    }).scalar()
    db.session.commit()
    return jsonify(message="Créé", id_espece=new_id), 201

@app.route('/api/images', methods=['POST'])
def create_image():
    d = request.get_json()
    if not all(f in d for f in ['url','id_espece','id_auteur']):
        return jsonify(error="Champs requis manquants"), 400
    if not exists('espece','id_espece', d['id_espece']):
        return jsonify(error="Espèce introuvable"), 404
    if not exists('auteur','id_auteur', d['id_auteur']):
        return jsonify(error="Auteur introuvable"), 404
    new_id = q("""
        INSERT INTO image (url, date_prise, id_espece, id_auteur)
        VALUES (:url, :date_prise, :id_espece, :id_auteur)
        RETURNING id_image
    """, {'url': d['url'], 'date_prise': d.get('date_prise'),
          'id_espece': d['id_espece'], 'id_auteur': d['id_auteur']}).scalar()
    db.session.commit()
    return jsonify(message="Ajouté", id_image=new_id), 201

# ── PUT ──────────────────────────────────────────────────────────────────────

@app.route('/api/oiseaux/<int:id>', methods=['PUT'])
def update_oiseau(id):
    if not exists('espece','id_espece', id): return jsonify(error="Non trouvé"), 404
    d      = request.get_json()
    fields = ['nom_scientifique','nom_commun','taille_cm','poids_g',
              'envergure_cm','habitat','statut_conservation','description']
    sets   = {f: d[f] for f in fields if f in d}
    if not sets: return jsonify(error="Aucun champ"), 400
    q(f"UPDATE espece SET {', '.join(f'{k}=:{k}' for k in sets)} WHERE id_espece=:id",
      {**sets, 'id': id})
    db.session.commit()
    return jsonify(message="Mis à jour", id_espece=id)

# ── DELETE ───────────────────────────────────────────────────────────────────

@app.route('/api/oiseaux/<int:id>', methods=['DELETE'])
def delete_oiseau(id):
    if not exists('espece','id_espece', id): return jsonify(error="Non trouvé"), 404
    q("DELETE FROM detection  WHERE id_image IN (SELECT id_image FROM image WHERE id_espece=:id)", {'id':id})
    q("DELETE FROM image       WHERE id_espece=:id", {'id':id})
    q("DELETE FROM espece_pays WHERE id_espece=:id", {'id':id})
    q("DELETE FROM espece      WHERE id_espece=:id", {'id':id})
    db.session.commit()
    return jsonify(message="Supprimé", id_espece=id)

@app.route('/api/images/<int:id>', methods=['DELETE'])
def delete_image(id):
    if not exists('image','id_image', id): return jsonify(error="Non trouvé"), 404
    q("DELETE FROM detection WHERE id_image=:id", {'id':id})
    q("DELETE FROM image     WHERE id_image=:id", {'id':id})
    db.session.commit()
    return jsonify(message="Supprimé", id_image=id)

# ── HEALTH ───────────────────────────────────────────────────────────────────

@app.route('/api/health')
def health():
    try:
        q("SELECT 1")
        return jsonify(status="OK", database="connected", timestamp=datetime.now().isoformat())
    except Exception as e:
        return jsonify(status="ERROR", message=str(e)), 500

@app.errorhandler(404)
def not_found(e):          return jsonify(error="Endpoint non trouvé"), 404
@app.errorhandler(405)
def method_not_allowed(e): return jsonify(error="Méthode non autorisée"), 405
@app.errorhandler(500)
def internal_error(e):
    db.session.rollback()
    return jsonify(error="Erreur serveur"), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)