const fs = require("fs");

const moods = ["Happy", "Sad", "Stressed", "Tired", "Energetic", "Bored"];
const hungerLevels = ["Light", "Moderate", "Very Hungry"];
const preferences = ["Healthy", "Comfort", "Balanced"];
const mealTimes = ["Breakfast", "Lunch", "Dinner"];
const categories = ["Full Meal", "Appetizer", "Dessert", "Drink", "Snack"];

const ALLERGEN_KEYS = ["seafood", "dairy", "nuts", "egg", "soy", "gluten", "chicken"];

// SAFE: vegetarian + allergenTags []
const SAFE = {
  Healthy: {
    "Full Meal": ["Pinakbet", "Ginisang Monggo", "Ginisang Pechay", "Nilagang Gulay", "Ginataang Kalabasa", "Adobong Kangkong"],
    "Appetizer": ["Atchara", "Ensaladang Talong", "Ensaladang Pipino", "Singkamas Sticks"],
    "Dessert": ["Fresh Fruit Cup", "Mango Slices", "Pineapple Slices", "Watermelon Cubes"],
    "Drink": ["Salabat", "Calamansi Juice", "Buko Juice", "Pandan Tea"],
    "Snack": ["Nilagang Mais", "Boiled Kamote", "Pandesal", "Suman"]
  },
  Comfort: {
    "Full Meal": ["Lugaw", "Arroz Caldo (Veg)", "Laing (Veg)", "Pancit Gulay"],
    "Appetizer": ["Lumpiang Gulay", "Tokwa (Plain)", "Atchara (Extra)"],
    "Dessert": ["Turon", "Banana Cue", "Camote Cue"],
    "Drink": ["Salabat (Warm)", "Calamansi Honey Tea", "Iced Calamansi"],
    "Snack": ["Pandesal (Sweet)", "Suman (Small)", "Boiled Kamote (Small)"]
  },
  Balanced: {
    "Full Meal": ["Pancit Gulay", "Pinakbet", "Ginisang Monggo", "Nilagang Gulay"],
    "Appetizer": ["Ensaladang Pipino", "Atchara", "Singkamas Sticks"],
    "Dessert": ["Fruit Cup", "Gelatin (Plain)", "Minatamis na Saging"],
    "Drink": ["Calamansi Juice (Cold)", "Buko Juice (Cold)", "Gulaman Drink"],
    "Snack": ["Puto", "Kutsinta", "Pandesal"]
  }
};

// REAL: more realistic meals (mix veg/non-veg + allergens)
const REAL = {
  Healthy: {
    "Full Meal": [
      { name: "Chicken Tinola", veg: false, tags: ["chicken"] },
      { name: "Sinigang na Isda", veg: false, tags: ["seafood"] },
      { name: "Tortang Talong", veg: true, tags: ["egg"] },
      { name: "Laing (Traditional)", veg: true, tags: [] }
    ],
    "Appetizer": [
      { name: "Lumpiang Sariwa", veg: true, tags: ["soy"] },
      { name: "Kinilaw", veg: false, tags: ["seafood"] }
    ],
    "Dessert": [
      { name: "Mais Con Yelo", veg: true, tags: ["dairy"] },
      { name: "Buko Salad", veg: true, tags: ["dairy"] }
    ],
    "Drink": [
      { name: "Sago't Gulaman", veg: true, tags: [] },
      { name: "Buko Pandan Drink", veg: true, tags: ["dairy"] }
    ],
    "Snack": [
      { name: "Taho", veg: true, tags: ["soy"] },
      { name: "Tokwa't Baboy", veg: false, tags: ["soy"] }
    ]
  },

  Comfort: {
    "Full Meal": [
      { name: "Pork Adobo", veg: false, tags: ["soy"] },
      { name: "Chicken Adobo", veg: false, tags: ["chicken", "soy"] },
      { name: "Bulalo", veg: false, tags: [] },
      { name: "Kare-Kare", veg: false, tags: ["nuts"] }
    ],
    "Appetizer": [
      { name: "Kwek-Kwek", veg: false, tags: ["egg", "gluten"] },
      { name: "Siomai", veg: false, tags: ["soy", "gluten"] }
    ],
    "Dessert": [
      { name: "Leche Flan", veg: true, tags: ["egg", "dairy"] },
      { name: "Halo-Halo", veg: true, tags: ["dairy"] }
    ],
    "Drink": [
      { name: "Tsokolate", veg: true, tags: ["dairy"] },
      { name: "Coffee (Barako)", veg: true, tags: [] }
    ],
    "Snack": [
      { name: "Empanada", veg: false, tags: ["gluten", "egg"] },
      { name: "Pancit Canton (Small)", veg: false, tags: ["gluten", "soy"] }
    ]
  },

  Balanced: {
    "Full Meal": [
      { name: "Tapsilog", veg: false, tags: ["egg"] },
      { name: "Tocilog", veg: false, tags: ["egg"] },
      { name: "Longsilog", veg: false, tags: ["egg"] },
      { name: "Pancit Canton", veg: false, tags: ["gluten", "soy"] }
    ],
    "Appetizer": [
      { name: "Lumpiang Shanghai", veg: false, tags: ["soy", "gluten"] },
      { name: "Fish Ball", veg: false, tags: ["seafood", "gluten"] }
    ],
    "Dessert": [
      { name: "Pichi-Pichi", veg: true, tags: [] },
      { name: "Buchi", veg: true, tags: ["nuts"] }
    ],
    "Drink": [
      { name: "Iced Tea (House)", veg: true, tags: [] },
      { name: "Calamansi Juice", veg: true, tags: [] }
    ],
    "Snack": [
      { name: "Kikiam", veg: false, tags: ["gluten", "soy"] },
      { name: "Kwek-Kwek", veg: false, tags: ["egg", "gluten"] }
    ]
  }
};

function normalizeTags(tags) {
  return (tags || [])
    .map((t) => String(t).toLowerCase())
    .filter((t) => ALLERGEN_KEYS.includes(t));
}

// Since your unique index likely doesn't include mealTime,
// we ensure names differ per mealTime.
function withMealTimeSuffix(baseName, mealTime) {
  return `${baseName} (${mealTime})`;
}

function nutrition(hungerLevel, category, preference, isReal) {
  const base = {
    "Full Meal": { c: 420, p: 16, carb: 55, f: 14 },
    "Appetizer": { c: 220, p: 7, carb: 24, f: 9 },
    "Dessert": { c: 280, p: 4, carb: 50, f: 7 },
    "Drink": { c: 120, p: 1, carb: 26, f: 1 },
    "Snack": { c: 210, p: 6, carb: 28, f: 7 }
  }[category];

  const hungerMult = hungerLevel === "Light" ? 0.75 : hungerLevel === "Moderate" ? 1.0 : 1.35;
  const prefMult = preference === "Healthy" ? 0.92 : preference === "Comfort" ? 1.1 : 1.0;
  const realMult = isReal ? 1.05 : 0.95;

  const mult = hungerMult * prefMult * realMult;

  return {
    calories: Math.round(base.c * mult),
    protein_g: Math.round(base.p * mult),
    carbs_g: Math.round(base.carb * mult),
    fat_g: Math.round(base.f * mult)
  };
}

function pick(list, seed) {
  return list[seed % list.length];
}

const meals = [];

for (const mood of moods) {
  for (const hungerLevel of hungerLevels) {
    for (const preference of preferences) {
      for (const mealTime of mealTimes) {
        for (const category of categories) {
          const seed =
            moods.indexOf(mood) * 97 +
            hungerLevels.indexOf(hungerLevel) * 41 +
            preferences.indexOf(preference) * 29 +
            mealTimes.indexOf(mealTime) * 13 +
            categories.indexOf(category) * 7;

          // ✅ SAFE 1 per combo
          const safeBase = pick(SAFE[preference][category], seed);
          const safeN = nutrition(hungerLevel, category, preference, false);
          meals.push({
            name: withMealTimeSuffix(safeBase, mealTime),
            description: `Safe fallback Filipino ${category.toLowerCase()} for ${mood.toLowerCase()} mood (${preference.toLowerCase()}).`,
            mood,
            category,
            hungerLevel,
            preference,
            mealTime,
            isVegetarian: true,
            allergenTags: [],
            calories: safeN.calories,
            protein_g: safeN.protein_g,
            carbs_g: safeN.carbs_g,
            fat_g: safeN.fat_g,
            imageUrl: "" // not used (Option A)
          });

          // ✅ REAL 1 per combo
          const realEntry = pick(REAL[preference][category], seed);
          const realN = nutrition(hungerLevel, category, preference, true);
          meals.push({
            name: withMealTimeSuffix(realEntry.name, mealTime),
            description: `Realistic Filipino ${category.toLowerCase()} suggestion for ${mood.toLowerCase()} mood (${preference.toLowerCase()}).`,
            mood,
            category,
            hungerLevel,
            preference,
            mealTime,
            isVegetarian: !!realEntry.veg,
            allergenTags: normalizeTags(realEntry.tags),
            calories: realN.calories,
            protein_g: realN.protein_g,
            carbs_g: realN.carbs_g,
            fat_g: realN.fat_g,
            imageUrl: "" // not used (Option A)
          });
        }
      }
    }
  }
}

fs.writeFileSync("meals_generated.json", JSON.stringify(meals, null, 2), "utf-8");
console.log(`✅ Generated ${meals.length} meals into meals_generated.json`);
