const BASE_URL = "http://localhost:5000/api";

// GET ALL
export const getAllBirds = async (sort = "id_espece") => {
  try {
    const res = await fetch(`${BASE_URL}/oiseaux?sort_by=${sort}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error("getAllBirds:", e.message);
    return { data: [] };   // ← retourne un tableau vide au lieu de crasher
  }
};

// GET ONE
export const getBirdById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/oiseaux/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error("getBirdById:", e.message);
    return null;
  }
};

// CREATE BIRD
export const createBird = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/oiseaux`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error("createBird:", e.message);
    return null;
  }
};

// CREATE IMAGE
export const createImage = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error("createImage:", e.message);
    return null;
  }
};

// DETECT

export const detectBird = async (formData) => {
  const endpoints = ["/detection", "/detect", "/predict", "/classify"];
  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BASE_URL}${ep}`, { method: "POST", body: formData });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(`detectBird: tentative sur ${ep} échouée (${e.message})`);
    }
  }
  console.error("detectBird: aucun endpoint de détection trouvé");
  return null;
};