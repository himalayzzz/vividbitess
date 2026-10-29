// Fetch and display meals based on search
function fetchMeals(event) {
    event.preventDefault();
    let inputValue = document.getElementById('inputName').value;
// Get the search input value
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
            applyVisionFilter();
        });
}
// Fetch and display detailed recipe information
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
                        <button class="filtered-button" id="pauseResumeButton" onclick="toggleSpeech()">Pause</button>
                    </div>
                    
                    <script>
                        let currentSpeech = null;

                        function speakText() {
                            let text = document.getElementById('instructions').innerText;
                            if (text.trim() === "") {
                                alert("No instructions available for this recipe.");
                                return;
                            }
                            window.speechSynthesis.cancel();
                            currentSpeech = new SpeechSynthesisUtterance(text);
                            currentSpeech.rate = 1;
                            currentSpeech.pitch = 1;
                            currentSpeech.volume = 1;
                            currentSpeech.onend = resetPauseResumeButton;
                            currentSpeech.onerror = resetPauseResumeButton;
                            document.getElementById('pauseResumeButton').textContent = 'Pause';
                            window.speechSynthesis.speak(currentSpeech);
                        }

                        function toggleSpeech() {
                            if (!currentSpeech) {
                                return;
                            }

                            if (window.speechSynthesis.paused) {
                                window.speechSynthesis.resume();
                                document.getElementById('pauseResumeButton').textContent = 'Pause';
                            } else {
                                window.speechSynthesis.pause();
                                document.getElementById('pauseResumeButton').textContent = 'Resume';
                            }
                        }

                        function resetPauseResumeButton() {
                            document.getElementById('pauseResumeButton').textContent = 'Pause';
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
