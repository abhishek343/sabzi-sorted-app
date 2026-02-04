/* Secure script.js - v2.0 Categorized */

// 1. DATA CONFIGURATION
const freshIngredients = [
    "Potato (Aloo)", "Onion", "Tomato", "Paneer", "Green Chili",
    "Ginger", "Garlic", "Cauliflower (Gobi)", "Spinach (Palak)", 
    "Peas (Matar)", "Yoghurt (Dahi)", "Chicken", "Eggs", "Okra (Bhindi)", "Capsicum"
];

const pantrySpices = [
    "Salt", "Oil/Ghee", "Turmeric (Haldi)", "Red Chili Powder", "Cumin (Jeera)", 
    "Coriander Powder", "Garam Masala", "Mustard Seeds", "Dal (Lentils)", "Rice", "Atta (Flour)"
];

// 2. STATE MANAGEMENT
// We pre-select the "Essentials" based on your spec
let selectedIngredients = new Set([
    "Onion", "Tomato", "Green Chili", // The Holy Trinity
    "Salt", "Oil/Ghee", "Turmeric (Haldi)", "Red Chili Powder", "Cumin (Jeera)" // The Masala Dabba
]);

// 3. RENDER LOGIC
const freshGrid = document.getElementById('freshGrid');
const spiceGrid = document.getElementById('spiceGrid');
const spiceToggle = document.getElementById('spiceToggle');

function renderGrids() {
    if (!freshGrid || !spiceGrid) return; // Safety check

    freshGrid.innerHTML = "";
    spiceGrid.innerHTML = "";

    // Render Fresh
    freshIngredients.forEach(ing => createButton(ing, freshGrid));
    
    // Render Spices
    pantrySpices.forEach(ing => createButton(ing, spiceGrid));

    // Render Custom items (User added via search)
    selectedIngredients.forEach(ing => {
        // If it's not in our known lists, add it to Fresh grid by default
        if (!freshIngredients.includes(ing) && !pantrySpices.includes(ing)) {
            createButton(ing, freshGrid);
        }
    });
}

function createButton(name, container) {
    const btn = document.createElement('div');
    btn.className = `ingredient-btn ${selectedIngredients.has(name) ? 'selected' : ''}`;
    btn.innerText = name;
    
    btn.onclick = () => {
        if (selectedIngredients.has(name)) {
            selectedIngredients.delete(name);
            // If user manually unchecks a spice, we should probably uncheck the "Master Toggle" visually
            if (pantrySpices.includes(name)) spiceToggle.checked = false;
        } else {
            selectedIngredients.add(name);
        }
        renderGrids();
    };
    container.appendChild(btn);
}

// 4. SMART ACTIONS
window.toggleStandardSpices = () => {
    const isChecked = document.getElementById('spiceToggle').checked;
    const standardSpices = ["Salt", "Oil/Ghee", "Turmeric (Haldi)", "Red Chili Powder", "Cumin (Jeera)"];

    if (isChecked) {
        // Add them all
        standardSpices.forEach(s => selectedIngredients.add(s));
    } else {
        // Remove them all
        standardSpices.forEach(s => selectedIngredients.delete(s));
    }
    renderGrids();
}

window.addCustom = () => {
    const input = document.getElementById('customInput');
    const val = input.value.trim();
    if (val) {
        selectedIngredients.add(val);
        input.value = "";
        renderGrids();
    }
}

// 5. GENERATE (AI Call)
window.generateRecipes = async () => {
    // Note: We lowered the limit to 1 because spices are usually selected now
    if (selectedIngredients.size < 1) {
        alert("Please select at least some ingredients!");
        return;
    }

    const btn = document.getElementById('generateBtn');
    const loader = document.getElementById('loader');
    const results = document.getElementById('results');
    const skill = document.querySelector('input[name="skill"]:checked').value;

    btn.disabled = true;
    loader.style.display = "block";
    results.innerHTML = "";

    try {
        const promptText = `
            Act as an Indian Chef. User has these ingredients: ${Array.from(selectedIngredients).join(", ")}.
            User skill level: ${skill}.
            Goal: Suggest 3 distinct Indian recipes that can be made in <20 mins.
            Strictly follow this JSON structure (return ONLY raw JSON, no markdown):
            [{"emoji": "🍛", "name": "Recipe Name", "time": "15 mins", "instructions": "..."}]
        `;

        const response = await fetch("/.netlify/functions/fetchRecipe", {
            method: "POST",
            body: JSON.stringify({ prompt: promptText })
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error.message || "API Error");

        const text = data.candidates[0].content.parts[0].text;
        const cleanJson = text.replace(/```json/g, "").replace(/```/g, "");
        const recipes = JSON.parse(cleanJson);

        recipes.forEach(recipe => {
            results.innerHTML += `
                <div class="recipe-card">
                    <div class="recipe-title">${recipe.emoji} ${recipe.name}</div>
                    <span class="meta">⏱️ ${recipe.time} • Skill: ${skill}</span>
                    <div class="instructions">${recipe.instructions.replace(/\n/g, "<br>")}</div>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);
        results.innerHTML = `<div style="color:red; text-align:center;">Error: ${error.message}</div>`;
    }

    btn.disabled = false;
    loader.style.display = "none";
}

// Initial Render
renderGrids();
