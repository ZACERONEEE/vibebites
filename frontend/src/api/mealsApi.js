const API_BASE = "https://vibebites-backend.onrender.com";

export async function fetchGroupedMeals({ mood, hungerLevel, preference }) {
  const params = new URLSearchParams({
    mood,
    hungerLevel,
    preference
  });

  const res = await fetch(`${API_BASE}/api/meals/grouped?${params}`);
  if (!res.ok) {
    throw new Error("Failed to fetch meals");
  }
  return res.json();
}
