"""
fetch_wikimedia_urls.py
=======================
Récupère les vraies URLs d'images Wikimedia Commons pour chaque espèce
via l'API Wikipedia, puis génère le SQL INSERT prêt à l'emploi.

Dépendances : requests  (pip install requests)
Usage       : python fetch_wikimedia_urls.py
"""

import requests
import time
import json

# ---------------------------------------------------------------------------
# Liste des 25 espèces  (id_espece, nom_scientifique, nom_commun)
# ---------------------------------------------------------------------------
SPECIES = [
    (1,  "Corvus corax",          "Grand corbeau"),
    (2,  "Turdus merula",         "Merle noir"),
    (3,  "Parus major",           "Mésange charbonnière"),
    (4,  "Aquila chrysaetos",     "Aigle royal"),
    (5,  "Buteo buteo",           "Buse variable"),
    (6,  "Bubo bubo",             "Grand-duc d'Europe"),
    (7,  "Tyto alba",             "Chouette effraie"),
    (8,  "Ara macao",             "Ara rouge"),
    (9,  "Psittacus erithacus",   "Perroquet gris"),
    (10, "Anas platyrhynchos",    "Canard colvert"),
    (11, "Cygnus olor",           "Cygne tuberculé"),
    (12, "Branta canadensis",     "Bernache du Canada"),
    (13, "Larus argentatus",      "Goéland argenté"),
    (14, "Sterna hirundo",        "Sterne pierregarin"),
    (15, "Alcedo atthis",         "Martin-pêcheur"),
    (16, "Falco peregrinus",      "Faucon pèlerin"),
    (17, "Pica pica",             "Pie bavarde"),
    (18, "Upupa epops",           "Huppe fasciée"),
    (19, "Ciconia ciconia",       "Cigogne blanche"),
    (20, "Phoenicopterus roseus", "Flamant rose"),
    (21, "Phasianus colchicus",   "Faisan de Colchide"),
    (22, "Ardea cinerea",         "Héron cendré"),
    (23, "Hirundo rustica",       "Hirondelle rustique"),
    (24, "Regulus regulus",       "Roitelet huppé"),
    (25, "Columba palumbus",      "Pigeon ramier"),
]

DATES = [
    "2020-05-01", "2019-04-12", "2021-03-18", "2020-06-22", "2018-07-11",
    "2019-11-05", "2020-02-14", "2021-01-17", "2019-09-23", "2019-03-03",
    "2018-05-25", "2020-07-14", "2019-10-19", "2021-02-21", "2020-09-09",
    "2019-06-30", "2020-08-08", "2018-04-16", "2021-04-03", "2020-03-12",
    "2019-10-01", "2020-11-18", "2021-05-22", "2020-12-05", "2021-07-14",
]

AUTHORS = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1]

WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php"
HEADERS = {"User-Agent": "BirdDBBot/1.0 (educational project)"}

# ---------------------------------------------------------------------------

def fetch_image_url(scientific_name: str, thumb_size: int = 1200) -> str | None:
    """
    Interroge l'API Wikipedia pour récupérer l'URL de la photo principale
    de la page correspondant au nom scientifique donné.

    Retourne l'URL de l'image ou None si introuvable.
    """
    params = {
        "action":      "query",
        "titles":      scientific_name,
        "prop":        "pageimages",
        "pithumbsize": thumb_size,
        "format":      "json",
    }
    try:
        response = requests.get(WIKIPEDIA_API, params=params, headers=HEADERS, timeout=10)
        response.raise_for_status()
        data = response.json()

        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            thumbnail = page.get("thumbnail")
            if thumbnail:
                return thumbnail["source"]
    except requests.RequestException as e:
        print(f"    ⚠️  Erreur réseau : {e}")

    return None


def fetch_all_images(species_list: list) -> list[dict]:
    """Parcourt toutes les espèces et retourne une liste de résultats."""
    results = []
    total = len(species_list)

    print(f"{'─'*65}")
    print(f"  {'ID':>2}  {'Nom scientifique':<25}  {'Statut'}")
    print(f"{'─'*65}")

    for i, (id_espece, sci_name, common_name) in enumerate(species_list):
        url = fetch_image_url(sci_name)
        status = f"✅  {url[:45]}..." if url else "❌  Non trouvée"
        print(f"  {id_espece:>2}  {sci_name:<25}  {status}")

        results.append({
            "id_espece":   id_espece,
            "sci_name":    sci_name,
            "common_name": common_name,
            "url":         url,
            "date":        DATES[i],
            "id_auteur":   AUTHORS[i],
        })

        time.sleep(0.3)   # respect du rate-limit Wikipedia

    print(f"{'─'*65}")
    return results


def generate_sql(results: list[dict]) -> str:
    """Génère le INSERT SQL à partir des résultats."""
    found    = [r for r in results if r["url"]]
    missing  = [r for r in results if not r["url"]]

    lines = []
    for r in found:
        safe_url = r["url"].replace("'", "''")
        lines.append(
            f"('{safe_url}', '{r['date']}', {r['id_espece']}, {r['id_auteur']})"
        )

    sql = "INSERT INTO image (url, date_prise, id_espece, id_auteur) VALUES\n"
    sql += ",\n".join(lines) + ";"

    if missing:
        sql += "\n\n-- ⚠️  Images non trouvées (à renseigner manuellement) :\n"
        for r in missing:
            sql += f"-- {r['id_espece']}. {r['sci_name']} ({r['common_name']})\n"

    return sql


def save_results(results: list[dict], sql: str) -> None:
    """Sauvegarde le SQL et un rapport JSON."""

    # Fichier SQL
    with open("images_insert.sql", "w", encoding="utf-8") as f:
        f.write(sql)
    print("\n💾  SQL sauvegardé dans : images_insert.sql")

    # Rapport JSON (optionnel, utile pour debug)
    with open("images_report.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("📄  Rapport JSON sauvegardé dans : images_report.json")


# ---------------------------------------------------------------------------

def main():
    print("\n🐦  Récupération des URLs Wikimedia Commons\n")

    results = fetch_all_images(SPECIES)

    found   = sum(1 for r in results if r["url"])
    missing = len(results) - found
    print(f"\n📊  Résultat : {found}/{len(results)} images trouvées", end="")
    print(f"  |  {missing} manquante(s)" if missing else "  |  Tout trouvé ✅")

    sql = generate_sql(results)
    save_results(results, sql)

    print("\n✅  Terminé !\n")


if __name__ == "__main__":
    main()