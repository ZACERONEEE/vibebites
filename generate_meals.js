const fs = require("fs");

const moods = ["Happy", "Sad", "Stressed", "Tired", "Energetic", "Bored"];
const hungerLevels = ["Light", "Moderate", "Very Hungry"];
const preferences = ["Healthy", "Comfort", "Balanced"];
const mealTimes = ["Breakfast", "Lunch", "Dinner"];
const categories = ["Full Meal", "Appetizer", "Dessert", "Drink", "Snack"];

const ALLERGEN_KEYS = ["seafood", "dairy", "nuts", "egg", "soy", "gluten", "chicken"];

// ✅ How many results you want per category per exact combination
const PER_CATEGORY = 5;

// ✅ Split of SAFE vs REAL inside those 5
const SAFE_PER_COMBO = 3;
const REAL_PER_COMBO = 2;

// ✅ One-sentence “real” descriptions per food name
// Note: if a food isn't listed here, it will fall back to FOOD_DESC.default
const FOOD_DESC = {
  // --- SAFE Healthy ---
  "Pinakbet": "Vegetable stew with squash, eggplant, okra, and local vegetables.",
  "Ginisang Monggo": "Mung bean stew sautéed with garlic and leafy greens.",
  "Ginisang Pechay": "Bok choy sautéed with garlic for a light and healthy dish.",
  "Nilagang Gulay": "Boiled mixed vegetables served in a clear, mild broth.",
  "Ginataang Kalabasa": "Squash and string beans simmered in creamy coconut milk.",
  "Adobong Kangkong": "Water spinach cooked adobo-style with garlic and soy-vinegar taste.",
  "Chopsuey (Veg)": "Mixed vegetables stir-fried in a light savory sauce.",
  "Ensaladang Pako": "Fresh fiddlehead fern salad with a tangy vinegar dressing.",
  "Ginisang Upo": "Bottle gourd sautéed with garlic and onions for a mild meal.",
  "Ampalaya with Eggless Tofu": "Bitter melon sautéed with tofu for a protein-friendly veggie dish.",

  "Atchara": "Pickled green papaya relish with a sweet-sour crunch.",
  "Ensaladang Talong": "Grilled eggplant salad mixed with tomatoes and onions.",
  "Ensaladang Pipino": "Refreshing cucumber salad with vinegar and light seasoning.",
  "Singkamas Sticks": "Crunchy jicama sticks served fresh and lightly seasoned.",
  "Ensaladang Lato": "Sea grapes salad with a clean, briny bite and vinegar dip.",
  "Fresh Lumpia Wrapper Veg": "Soft fresh wrap filled with vegetables and a light sweet sauce.",
  "Kangkong Chips (Homestyle)": "Crispy fried kangkong leaves for a light crunchy snack.",
  "Kamatis + Sibuyas Salad": "Simple tomato-onion salad with a tangy dressing.",

  "Fresh Fruit Cup": "A chilled mix of fresh seasonal fruits.",
  "Mango Slices": "Sweet ripe mango slices served fresh.",
  "Pineapple Slices": "Juicy pineapple slices with a bright tropical taste.",
  "Watermelon Cubes": "Chilled watermelon cubes for a refreshing sweet bite.",
  "Papaya Slices": "Fresh papaya slices that are naturally sweet and soft.",
  "Banana Slices": "Banana slices for quick natural energy.",
  "Melon Cubes": "Cool melon cubes with a light, sweet flavor.",
  "Fruit Salad (No Cream)": "Mixed fruits served fresh without added cream.",

  "Salabat": "Warm ginger tea with a soothing spicy aroma.",
  "Calamansi Juice": "Citrus calamansi drink that’s bright and refreshing.",
  "Buko Juice": "Fresh coconut water that’s naturally hydrating.",
  "Pandan Tea": "Mild pandan leaf tea with a soft herbal aroma.",
  "Cucumber Water": "Infused water with cucumber for a clean refreshing sip.",
  "Lemongrass Tea": "Light herbal tea brewed from lemongrass.",
  "Guyabano Juice (Diluted)": "Lightly sweet guyabano drink diluted for a gentle taste.",
  "Mint Calamansi": "Calamansi juice blended with mint for a cooling finish.",

  "Nilagang Mais": "Boiled corn on the cob, simple and filling.",
  "Boiled Kamote": "Boiled sweet potato that’s naturally sweet and satisfying.",
  "Pandesal": "Soft Filipino bread roll, great for light snacking.",
  "Suman": "Steamed sticky rice cake with a mild sweetness.",
  "Boiled Saging na Saba": "Boiled saba banana that’s soft and naturally sweet.",
  "Singkamas + Salt": "Fresh jicama slices with a pinch of salt for crunch.",
  "Puto (Plain)": "Steamed rice cake that’s soft, light, and slightly sweet.",
  "Kutsinta (Plain)": "Chewy rice cake with a mild sweetness.",

  // --- SAFE Comfort ---
  "Lugaw": "Warm rice porridge that’s gentle and comforting.",
  "Arroz Caldo (Veg)": "Vegetable arroz caldo with ginger for a soothing bowl.",
  "Laing (Veg)": "Taro leaves cooked in coconut milk for a rich comforting dish.",
  "Pancit Gulay": "Vegetable noodle stir-fry that’s light yet satisfying.",
  "Ginisang Bihon (Veg)": "Rice noodles sautéed with vegetables and mild seasoning.",
  "Champorado (Light)": "Chocolate rice porridge served in a lighter portion.",
  "Sopas (Veg)": "Creamy-style vegetable macaroni soup for comfort.",
  "Ginataang Gulay": "Mixed vegetables simmered in coconut milk for a cozy meal.",

  "Lumpiang Gulay": "Fried vegetable spring rolls with a crunchy bite.",
  "Tokwa (Plain)": "Simple tofu bites that are mild and filling.",
  "Atchara (Extra)": "Extra serving of pickled papaya relish for a sweet-sour side.",
  "Fried Tofu Bites": "Crispy tofu cubes that are warm and satisfying.",
  "Lumpiang Toge (Veg)": "Bean sprout spring rolls with a light savory taste.",
  "Okoy (Veg Style)": "Vegetable fritters fried until crisp and golden.",

  "Turon": "Banana spring roll fried until caramelized and crisp.",
  "Banana Cue": "Caramelized banana skewers for a sweet comforting snack.",
  "Camote Cue": "Caramelized sweet potato skewers with a chewy bite.",
  "Ginataang Bilo-Bilo (Small)": "Small serving of rice balls in coconut milk dessert soup.",
  "Maja Blanca (Small)": "Small serving of coconut pudding with a soft creamy texture.",

  "Salabat (Warm)": "Warm ginger tea served hot for comfort.",
  "Calamansi Honey Tea": "Calamansi drink sweetened with honey for a soothing sip.",
  "Iced Calamansi": "Chilled calamansi juice for a refreshing comfort drink.",
  "Warm Cocoa (Dairy-Free)": "Warm cocoa drink made without dairy for a cozy taste.",
  "Barley Tea (Warm)": "Warm roasted barley tea with a toasty aroma.",

  "Pandesal (Sweet)": "Slightly sweet pandesal that pairs well with warm drinks.",
  "Suman (Small)": "Small sticky rice cake for a light comforting bite.",
  "Boiled Kamote (Small)": "Small serving of boiled sweet potato for gentle fullness.",
  "Bibingka (Small)": "Small rice cake with a soft, warm bakery feel.",
  "Puto (Chewy)": "Chewy steamed rice cake for a simple sweet snack.",

  // --- SAFE Balanced ---
  "Ginisang Repolyo": "Cabbage sautéed with garlic for a simple balanced dish.",
  "Ginisang Sitaw": "String beans sautéed with garlic for a light veggie meal.",
  "Ginisang Sayote": "Chayote sautéed with garlic for a mild balanced dish.",

  "Fruit Cup": "Mixed fruit serving for a light sweet balance.",
  "Gelatin (Plain)": "Simple gelatin dessert that’s light and refreshing.",
  "Minatamis na Saging": "Sweetened banana dessert served warm or chilled.",
  "Buko Strips (Plain)": "Tender coconut strips served plain for a light dessert.",
  "Mais (Boiled) Cup": "Boiled corn kernels served in a small cup.",

  "Calamansi Juice (Cold)": "Cold calamansi drink for a refreshing citrus taste.",
  "Buko Juice (Cold)": "Cold coconut water served chilled for hydration.",
  "Gulaman Drink": "Gelatin drink with a sweet refreshing taste.",
  "Iced Tea (Light)": "Light iced tea with a mild sweetness.",
  "Pandan Iced Tea": "Chilled pandan tea with a soft herbal aroma.",

  "Puto": "Steamed rice cake that’s soft and mildly sweet.",
  "Kutsinta": "Chewy rice cake with a light caramel flavor.",
  "Boiled Saba": "Boiled saba bananas for a naturally sweet snack.",

  // --- REAL Healthy ---
  "Chicken Tinola": "Chicken soup with ginger and green papaya for a clean, comforting meal.",
  "Sinigang na Isda": "Tamarind-based sour fish soup served with vegetables.",
  "Tortang Talong": "Grilled eggplant omelette that’s savory and filling.",
  "Laing (Traditional)": "Spicy taro leaves in coconut milk with a rich flavor.",
  "Inihaw na Bangus": "Grilled milkfish with a smoky savory taste.",
  "Ginisang Ampalaya": "Bitter melon sautéed for a simple vegetable dish.",

  "Lumpiang Sariwa": "Fresh vegetable spring roll served with sweet peanut sauce.",
  "Kinilaw": "Filipino ceviche-style dish using vinegar-cured seafood.",
  "Ensaladang Talong (Eggplant Salad)": "Eggplant salad mixed with tomatoes and onions for a smoky bite.",
  "Seaweed Salad (Lato)": "Sea grapes salad served fresh with a tangy dip.",

  "Mais Con Yelo": "Sweet corn dessert with shaved ice and milk.",
  "Buko Salad": "Young coconut dessert mixed with cream and fruits.",
  "Fruit Salad (Cream)": "Mixed fruits combined with cream for a sweet dessert.",

  "Sago't Gulaman": "Sweet drink with tapioca pearls and gelatin cubes.",
  "Buko Pandan Drink": "Creamy coconut drink flavored with pandan.",
  "Calamansi Juice": "Fresh calamansi juice with a bright citrus flavor.",

  "Taho": "Soft tofu snack topped with syrup and tapioca pearls.",
  "Tokwa't Baboy": "Tofu and pork mix served with a savory vinegar dressing.",
  "Fresh Lumpia (Veg)": "Fresh vegetable wrap served with a light sweet sauce.",

  // --- REAL Comfort ---
  "Pork Adobo": "Pork braised in soy sauce and vinegar until tender.",
  "Chicken Adobo": "Chicken braised in soy sauce and vinegar for a classic savory dish.",
  "Bulalo": "Slow-cooked beef shank soup with corn and greens.",
  "Kare-Kare": "Peanut-based stew commonly served with vegetables.",
  "Sinigang na Baboy": "Sour pork soup with vegetables in tamarind broth.",
  "Bicol Express": "Spicy coconut-based dish with pork and chili.",

  "Kwek-Kwek": "Deep-fried quail eggs coated in orange batter.",
  "Siomai": "Steamed dumplings served with soy sauce and chili.",
  "Fish Ball": "Street-style fish balls served with sweet or spicy sauce.",

  "Leche Flan": "Smooth caramel custard dessert.",
  "Halo-Halo": "Shaved ice dessert with mixed toppings and milk.",
  "Ube Halaya": "Purple yam jam dessert with a creamy texture.",

  "Tsokolate": "Traditional hot chocolate drink with a rich taste.",
  "Coffee (Barako)": "Strong local coffee with a bold aroma.",
  "Milk Tea (Classic)": "Sweet milk tea drink served chilled.",

  "Empanada": "Stuffed pastry snack fried until crisp and golden.",
  "Pancit Canton (Small)": "Small serving of stir-fried noodles with savory seasoning.",
  "Turon (Snack)": "Snack-sized banana spring roll fried until crisp.",

  // --- REAL Balanced ---
  "Tapsilog": "Beef tapa served with garlic rice and egg.",
  "Tocilog": "Sweet cured pork served with garlic rice and egg.",
  "Longsilog": "Filipino sausage served with garlic rice and egg.",
  "Pancit Canton": "Stir-fried noodles with vegetables and savory sauce.",
  "Sisig": "Chopped meat dish served sizzling and often topped with egg.",

  "Lumpiang Shanghai": "Crispy meat spring rolls served with dipping sauce.",
  "Kikiam": "Street-style fried roll served with savory sauce.",
  "Tokneneng": "Deep-fried battered eggs served with spicy-sweet sauce.",

  "Pichi-Pichi": "Chewy cassava dessert coated with grated coconut.",
  "Buchi": "Fried sesame balls filled with sweet mung bean paste.",
  "Palitaw": "Rice cake coated with coconut and sugar.",

  "Iced Tea (House)": "House iced tea served chilled and lightly sweetened.",
  "Gulaman": "Sweet gelatin drink served cold.",

  "Pugo Egg": "Quail egg snack served fried or boiled.",

  default: "Traditional Filipino dish."
};

// SAFE: vegetarian + allergenTags []
const SAFE = {
  Healthy: {
    "Full Meal": [
      "Pinakbet",
      "Ginisang Monggo",
      "Ginisang Pechay",
      "Nilagang Gulay",
      "Ginataang Kalabasa",
      "Adobong Kangkong",
      "Chopsuey (Veg)",
      "Ensaladang Pako",
      "Ginisang Upo",
      "Ampalaya with Eggless Tofu"
    ],
    "Appetizer": [
      "Atchara",
      "Ensaladang Talong",
      "Ensaladang Pipino",
      "Singkamas Sticks",
      "Ensaladang Lato",
      "Fresh Lumpia Wrapper Veg",
      "Kangkong Chips (Homestyle)",
      "Kamatis + Sibuyas Salad"
    ],
    "Dessert": [
      "Fresh Fruit Cup",
      "Mango Slices",
      "Pineapple Slices",
      "Watermelon Cubes",
      "Papaya Slices",
      "Banana Slices",
      "Melon Cubes",
      "Fruit Salad (No Cream)"
    ],
    "Drink": [
      "Salabat",
      "Calamansi Juice",
      "Buko Juice",
      "Pandan Tea",
      "Cucumber Water",
      "Lemongrass Tea",
      "Guyabano Juice (Diluted)",
      "Mint Calamansi"
    ],
    "Snack": [
      "Nilagang Mais",
      "Boiled Kamote",
      "Pandesal",
      "Suman",
      "Boiled Saging na Saba",
      "Singkamas + Salt",
      "Puto (Plain)",
      "Kutsinta (Plain)"
    ]
  },
  Comfort: {
    "Full Meal": [
      "Lugaw",
      "Arroz Caldo (Veg)",
      "Laing (Veg)",
      "Pancit Gulay",
      "Ginisang Bihon (Veg)",
      "Champorado (Light)",
      "Sopas (Veg)",
      "Ginataang Gulay"
    ],
    "Appetizer": [
      "Lumpiang Gulay",
      "Tokwa (Plain)",
      "Atchara (Extra)",
      "Fried Tofu Bites",
      "Lumpiang Toge (Veg)",
      "Okoy (Veg Style)"
    ],
    "Dessert": [
      "Turon",
      "Banana Cue",
      "Camote Cue",
      "Ginataang Bilo-Bilo (Small)",
      "Maja Blanca (Small)"
    ],
    "Drink": [
      "Salabat (Warm)",
      "Calamansi Honey Tea",
      "Iced Calamansi",
      "Warm Cocoa (Dairy-Free)",
      "Barley Tea (Warm)"
    ],
    "Snack": [
      "Pandesal (Sweet)",
      "Suman (Small)",
      "Boiled Kamote (Small)",
      "Bibingka (Small)",
      "Puto (Chewy)"
    ]
  },
  Balanced: {
    "Full Meal": [
      "Pancit Gulay",
      "Pinakbet",
      "Ginisang Monggo",
      "Nilagang Gulay",
      "Ginisang Repolyo",
      "Chopsuey (Veg)",
      "Ginisang Sitaw",
      "Ginisang Sayote"
    ],
    "Appetizer": [
      "Ensaladang Pipino",
      "Atchara",
      "Singkamas Sticks",
      "Ensaladang Talong",
      "Kamatis + Sibuyas Salad"
    ],
    "Dessert": [
      "Fruit Cup",
      "Gelatin (Plain)",
      "Minatamis na Saging",
      "Buko Strips (Plain)",
      "Mais (Boiled) Cup"
    ],
    "Drink": [
      "Calamansi Juice (Cold)",
      "Buko Juice (Cold)",
      "Gulaman Drink",
      "Iced Tea (Light)",
      "Pandan Iced Tea"
    ],
    "Snack": [
      "Puto",
      "Kutsinta",
      "Pandesal",
      "Suman",
      "Boiled Saba"
    ]
  }
};

// REAL: more realistic meals (mix veg/non-veg + allergens)
const REAL = {
  Healthy: {
    "Full Meal": [
      { name: "Chicken Tinola", veg: false, tags: ["chicken"] },
      { name: "Sinigang na Isda", veg: false, tags: ["seafood"] },
      { name: "Tortang Talong", veg: true, tags: ["egg"] },
      { name: "Laing (Traditional)", veg: true, tags: [] },
      { name: "Inihaw na Bangus", veg: false, tags: ["seafood"] },
      { name: "Ginisang Ampalaya", veg: true, tags: [] }
    ],
    "Appetizer": [
      { name: "Lumpiang Sariwa", veg: true, tags: ["soy"] },
      { name: "Kinilaw", veg: false, tags: ["seafood"] },
      { name: "Ensaladang Talong (Eggplant Salad)", veg: true, tags: [] },
      { name: "Seaweed Salad (Lato)", veg: true, tags: [] }
    ],
    "Dessert": [
      { name: "Mais Con Yelo", veg: true, tags: ["dairy"] },
      { name: "Buko Salad", veg: true, tags: ["dairy"] },
      { name: "Fruit Salad (Cream)", veg: true, tags: ["dairy"] }
    ],
    "Drink": [
      { name: "Sago't Gulaman", veg: true, tags: [] },
      { name: "Buko Pandan Drink", veg: true, tags: ["dairy"] },
      { name: "Calamansi Juice", veg: true, tags: [] }
    ],
    "Snack": [
      { name: "Taho", veg: true, tags: ["soy"] },
      { name: "Tokwa't Baboy", veg: false, tags: ["soy"] },
      { name: "Fresh Lumpia (Veg)", veg: true, tags: ["soy"] }
    ]
  },

  Comfort: {
    "Full Meal": [
      { name: "Pork Adobo", veg: false, tags: ["soy"] },
      { name: "Chicken Adobo", veg: false, tags: ["chicken", "soy"] },
      { name: "Bulalo", veg: false, tags: [] },
      { name: "Kare-Kare", veg: false, tags: ["nuts"] },
      { name: "Sinigang na Baboy", veg: false, tags: [] },
      { name: "Bicol Express", veg: false, tags: [] }
    ],
    "Appetizer": [
      { name: "Kwek-Kwek", veg: false, tags: ["egg", "gluten"] },
      { name: "Siomai", veg: false, tags: ["soy", "gluten"] },
      { name: "Fish Ball", veg: false, tags: ["seafood", "gluten"] }
    ],
    "Dessert": [
      { name: "Leche Flan", veg: true, tags: ["egg", "dairy"] },
      { name: "Halo-Halo", veg: true, tags: ["dairy"] },
      { name: "Ube Halaya", veg: true, tags: ["dairy"] }
    ],
    "Drink": [
      { name: "Tsokolate", veg: true, tags: ["dairy"] },
      { name: "Coffee (Barako)", veg: true, tags: [] },
      { name: "Milk Tea (Classic)", veg: true, tags: ["dairy"] }
    ],
    "Snack": [
      { name: "Empanada", veg: false, tags: ["gluten", "egg"] },
      { name: "Pancit Canton (Small)", veg: false, tags: ["gluten", "soy"] },
      { name: "Turon (Snack)", veg: true, tags: ["gluten"] }
    ]
  },

  Balanced: {
    "Full Meal": [
      { name: "Tapsilog", veg: false, tags: ["egg"] },
      { name: "Tocilog", veg: false, tags: ["egg"] },
      { name: "Longsilog", veg: false, tags: ["egg"] },
      { name: "Pancit Canton", veg: false, tags: ["gluten", "soy"] },
      { name: "Sisig", veg: false, tags: ["egg"] }
    ],
    "Appetizer": [
      { name: "Lumpiang Shanghai", veg: false, tags: ["soy", "gluten"] },
      { name: "Kikiam", veg: false, tags: ["gluten", "soy"] },
      { name: "Tokneneng", veg: false, tags: ["egg", "gluten"] }
    ],
    "Dessert": [
      { name: "Pichi-Pichi", veg: true, tags: [] },
      { name: "Buchi", veg: true, tags: ["nuts"] },
      { name: "Palitaw", veg: true, tags: [] }
    ],
    "Drink": [
      { name: "Iced Tea (House)", veg: true, tags: [] },
      { name: "Calamansi Juice", veg: true, tags: [] },
      { name: "Gulaman", veg: true, tags: [] }
    ],
    "Snack": [
      { name: "Pugo Egg", veg: false, tags: ["egg"] },
      { name: "Kwek-Kwek", veg: false, tags: ["egg", "gluten"] },
      { name: "Fish Ball", veg: false, tags: ["seafood", "gluten"] }
    ]
  }
};

function normalizeTags(tags) {
  return (tags || [])
    .map((t) => String(t).toLowerCase())
    .filter((t) => ALLERGEN_KEYS.includes(t));
}

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

function pickN(list, seed, n) {
  if (!Array.isArray(list) || list.length === 0) return [];
  const out = [];
  const used = new Set();
  for (let i = 0; i < n; i++) {
    const idx = (seed + i * 11) % list.length;
    const item = list[idx];
    const key = typeof item === "string" ? item : item?.name;
    if (!key) continue;
    if (used.has(key)) continue;
    used.add(key);
    out.push(item);
    if (out.length >= n) break;
  }

  let guard = 0;
  while (out.length < n && guard < 200) {
    const idx = (seed + guard * 7) % list.length;
    const item = list[idx];
    const key = typeof item === "string" ? item : item?.name;
    if (key && !used.has(key)) {
      used.add(key);
      out.push(item);
    }
    guard++;
  }
  return out.slice(0, n);
}

// ✅ Helper: normalize base name used for description lookup
// (because you append " (Breakfast)" etc.)
function baseNameFromGenerated(fullName) {
  return String(fullName || "").replace(/\s*\((Breakfast|Lunch|Dinner)\)\s*$/i, "").trim();
}

function descriptionForMealName(fullName) {
  const base = baseNameFromGenerated(fullName);
  return FOOD_DESC[base] || FOOD_DESC["default"];
}

const meals = [];
const uniqueCombo = new Set();

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

          // ✅ SAFE N per combo
          const safeList = SAFE[preference][category];
          const safePicked = pickN(safeList, seed, SAFE_PER_COMBO);

          for (let i = 0; i < safePicked.length; i++) {
            const safeBase = safePicked[i];
            const safeName = withMealTimeSuffix(safeBase, mealTime);

            const key = `${safeName}|${mood}|${category}|${hungerLevel}|${preference}|${mealTime}`;
            if (uniqueCombo.has(key)) continue;
            uniqueCombo.add(key);

            const safeN = nutrition(hungerLevel, category, preference, false);

            meals.push({
              name: safeName,
              description: descriptionForMealName(safeName), // ✅ 1-sentence real description
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
              imageUrl: ""
            });
          }

          // ✅ REAL N per combo
          const realList = REAL[preference][category];
          const realPicked = pickN(realList, seed + 5, REAL_PER_COMBO);

          for (let i = 0; i < realPicked.length; i++) {
            const entry = realPicked[i];
            const realName = withMealTimeSuffix(entry.name, mealTime);

            const key = `${realName}|${mood}|${category}|${hungerLevel}|${preference}|${mealTime}`;
            if (uniqueCombo.has(key)) continue;
            uniqueCombo.add(key);

            const realN = nutrition(hungerLevel, category, preference, true);

            meals.push({
              name: realName,
              description: descriptionForMealName(realName), // ✅ 1-sentence real description
              mood,
              category,
              hungerLevel,
              preference,
              mealTime,
              isVegetarian: !!entry.veg,
              allergenTags: normalizeTags(entry.tags),
              calories: realN.calories,
              protein_g: realN.protein_g,
              carbs_g: realN.carbs_g,
              fat_g: realN.fat_g,
              imageUrl: ""
            });
          }
        }
      }
    }
  }
}

fs.writeFileSync("meals_generated.json", JSON.stringify(meals, null, 2), "utf-8");
console.log(`✅ Generated ${meals.length} meals into meals_generated.json`);