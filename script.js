function fetchMeals(event) {
    event.preventDefault();
    let inputValue = document.getElementById('inputName').value;

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`)
        .then(response => response.json())
        .then(data => {
            const items = document.getElementById("items");
            items.innerHTML = "";

            if (!data.meals) {
                document.getElementById("msg").style.display = "block";
            } else {
                document.getElementById("msg").style.display = "none";
                data.meals.forEach(meal => {
                    let itemDiv = document.createElement("div");
                    itemDiv.className = "recipe-card";
                    itemDiv.innerHTML = `
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="filtered-image">
                        <h2>${meal.strMeal}</h2>
                        <button class="filtered-button" onclick="fetchDetails('${meal.idMeal}')">View Recipe</button>
                    `;
                    items.appendChild(itemDiv);
                });
            }
            applyVisionFilter();  // Apply filter after images and buttons load
        });
}

function fetchDetails(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(detail => {
            let meal = detail.meals[0];
            let recipeWindow = window.open("", "_blank");

            recipeWindow.document.write(`
                <html>
                <head>
                    <title>${meal.strMeal}</title>
                    <link rel="stylesheet" href="styles.css">
                </head>
                <body>
                    <h1>${meal.strMeal}</h1>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="filtered-image">
                    
                    <div class="details-container">
                        <h2>Ingredients</h2>
                        <ul>
                            ${[...Array(20)].map((_, i) => meal[`strIngredient${i+1}`] ? `<li>${meal[`strIngredient${i+1}`]}</li>` : '').join('')}
                        </ul>
                    </div>
                    
                    <div class="details-container">
                        <h2>Instructions</h2>
                        <p id="instructions">${meal.strInstructions}</p>
                    </div>
                    
                    <div class="details-container">
                        <h2>Recipe Video</h2>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${meal.strYoutube.split('=')[1]}" frameborder="0" allowfullscreen></iframe>
                    </div>
                    
                    <div class="details-container">
                        <h2>Text-to-Speech</h2>
                        <button class="filtered-button" onclick="speakText()">Listen</button>
                    </div>
                    
                    <script>
                        function speakText() {
                            let text = document.getElementById('instructions').innerText;
                            if (text.trim() === "") {
                                alert("No instructions available for this recipe.");
                                return;
                            }
                            let speech = new SpeechSynthesisUtterance(text);
                            speech.rate = 1;
                            speech.pitch = 1;
                            speech.volume = 1;
                            window.speechSynthesis.speak(speech);
                        }
                        function applyVisionFilter() {
                            let mode = "${document.getElementById("visionSelector") ? document.getElementById("visionSelector").value : 'normal'}";
                            document.querySelectorAll(".filtered-image").forEach(img => img.className = \`filtered-image \${mode}\`);
                            document.querySelectorAll(".filtered-button").forEach(btn => btn.className = \`filtered-button \${mode}\`);
                        }
                        applyVisionFilter();
                    </script>
                </body>
                </html>
            `);

            recipeWindow.document.close();
        });
}

// Apply Vision Filter to All Images & Buttons
function applyVisionFilter() {
    let mode = document.getElementById("visionSelector").value;
    document.querySelectorAll(".filtered-image").forEach(img => img.className = `filtered-image ${mode}`);
    document.querySelectorAll(".filtered-button").forEach(btn => btn.className = `filtered-button ${mode}`);
}

document.getElementById("visionSelector").addEventListener("change", applyVisionFilter);
cument.getElementById("visionSelector").addEventListener("change", applyVisionFilter);

