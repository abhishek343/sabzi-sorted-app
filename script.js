/* Secure script.js */
const commonIngredients = [
    "Potato (Aloo)", "Onion", "Tomato", "Paneer", "Dal (Lentils)", 
    "Rice", "Garlic", "Ginger", "Green Chili", "Cumin (Jeera)", 
    "Turmeric", "Garam Masala", "Yoghurt (Dahi)", "Chickpeas (Chana)", 
    "Cauliflower", "Spinach (Palak)", "Peas (Matar)", "Chicken", "Eggs", "Atta (Flour)"
];

let selectedIngredients = new Set();

// 1. Render the Grid
const grid = document.getElementById('pantryGrid');

function renderGrid() {
    // If the grid element doesn't exist yet (page loading), stop.
    if (!grid) return; 
    
    grid.innerHTML = "";
    commonIngredients.forEach(ing => createButton(ing));
    selectedIngredients.forEach(ing => {
        if (!commonIngredients.includes(ing)) createButton(ing);
    });
}

function createButton(name) {
    const btn = document.createElement('div');
    btn.className = `ingredient-btn ${selectedIngredients.has(name) ? 'selected' : ''}`;
    btn.innerText = name;
    btn.onclick = () => toggleIngredient(name);
    grid.appendChild(btn);
}

// 2. Interaction Logic
window.toggleIngredient = (name) => {
    if (selectedIngredients.has(name)) selectedIngredients.delete(name);
    else selectedIngredients.add(name);
    renderGrid();
}

window.addCustom = () => {
    const input = document.getElementById('customInput');
    const val = input.value.trim();
    if (val) {
        selectedIngredients.add(val);
        input.value = "";
        renderGrid();
    }
}

// 3. The Secure AI Call (Calls Netlify Backend)
window.generateRecipes = async () => {
    if (selectedIngredients.size < 2) {
        alert("Please select at least 2 ingredients!");
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

        // CALL OUR OWN SERVER (The Proxy)
        const response = await fetch("/.netlify/functions/fetchRecipe", {
            method: "POST",
            body: JSON.stringify({ prompt: promptText })
        });

        const data = await response.json();
        
        // Handle Google's response structure
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

// Initialize
renderGrid();
