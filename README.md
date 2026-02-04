# Sabzi Sorted 🍛
**An AI-Powered "What to Cook" Decision Engine for Busy Professionals.**

### 🚀 The Problem
Busy professionals often suffer from "Dinner Decision Fatigue." They have ingredients in the fridge (Aloo, Gobi, Paneer) but lack the energy to search for recipes, leading to excessive food delivery orders.

### 💡 The Solution
A "Pantry-First" web app that uses **Google Gemini 2.0 Flash** to instantly generate 3 culturally authentic Indian recipes based *only* on what the user currently has in stock.

**Live App:** [https://subzi-sorted.netlify.app/](https://subzi-sorted.netlify.app/)

---

### 🛠 Technical Architecture
This project was built to learn the end-to-end flow of shipping an LLM-powered product.
* **Frontend:** Vanilla JS / HTML5 / CSS3 (No framework overhead).
* **Backend:** Netlify Serverless Functions (Node.js) to proxy API calls and secure credentials.
* **AI Model:** Google Gemini 3 Flash (via REST API).
* **CI/CD:** Automated deployment pipeline from GitHub Main $\rightarrow$ Netlify Edge.

### 🔄 Product Iterations (User Feedback Loop)
**v1.0 (MVP):**
* Simple grid of 30 ingredients.
* **User Feedback:** "Selecting 20 spices every time is too much friction."

**v2.0 (Current):**
* **Smart Defaults:** Implemented a "Standard Masala Dabba" toggle that pre-selects common spices (Salt, Turmeric, Cumin), reducing user clicks by 80%.
* **Categorized UI:** Split interface into "Fresh" vs. "Pantry" for faster scanning.
* **Security Patch:** Migrated API Key from client-side to server-side environment variables.

### 🔮 Future Roadmap
* **Dietary Filters:** Toggle for Vegan / Jain / Gluten-Free.
* **"Sad Fridge" Mode:** Generate a recipe from just ONE hero ingredient.
* **Save Favorites:** LocalStorage implementation to save best recipes.

---
*Built by AN as a Product Management technical challenge.*
