const users = document.querySelector(".cards");
const userName = document.querySelector("#user");
const searchIcon = document.querySelector(".search-icon");

const modal = document.getElementById("mealModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const closeBtn = document.querySelector(".close-btn");

const userArr = [];

const getUserData = async () => {
  try {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
    const data = await res.json();

    users.innerHTML = ""; // clear existing

    if (data.meals) {
      userArr.length = 0;

      data.meals.forEach((meal) => {
        const cardWrapper = document.createElement("div");
        cardWrapper.classList.add("card-container");

        const shortDesc = meal.strInstructions
          ? meal.strInstructions.substring(0, 100) + "..."
          : "No description available.";

        cardWrapper.innerHTML = `
          <div class="card-1">
            <div class="card-image">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            </div>
            <div class="card-text">
              <h4>${meal.strMeal}</h4>
              <p>${shortDesc}</p>
              <button class="view-details">VIEW DETAILS</button>
            </div>
          </div>
        `;

        users.appendChild(cardWrapper);
        userArr.push(cardWrapper);

        const viewBtn = cardWrapper.querySelector(".view-details");
        viewBtn.addEventListener("click", () => {
          modalImage.src = meal.strMealThumb;
          modalTitle.textContent = meal.strMeal;
          modalDescription.textContent = meal.strInstructions;
          modal.classList.remove("hide");
        });
      });
    } else {
      const noData = document.createElement("div");
      noData.innerHTML = `<h1 style="text-align:center;">No Data Found</h1>`;
      users.appendChild(noData);
    }
  } catch (error) {
    console.log("Fetch error:", error);
  }
};

getUserData();

closeBtn.addEventListener("click", () => {
  modal.classList.add("hide");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hide");
  }
});

searchIcon.addEventListener("click", () => {
  const query = userName.value.trim().toLowerCase();
  let hasMatch = false;

  // Remove previous message
  const noDataMsg = document.querySelector(".no-data");
  if (noDataMsg) noDataMsg.remove();

  // Hide/show cards
  userArr.forEach((card) => {
    const title = card.querySelector("h4").innerText.toLowerCase();
    if (title.includes(query)) {
      card.classList.remove("hide");
      hasMatch = true;
    } else {
      card.classList.add("hide");
    }
  });

  // Show "No Data Found" if nothing matches
  if (!hasMatch) {
    const noData = document.createElement("div");
    noData.className = "no-data";
    noData.innerHTML = `<h1 style="grid-column: 1 / -1; text-align: center;">No Data Found</h1>`;
    users.appendChild(noData);
  }

  // Show all again if input is cleared
  if (query === "") {
    userArr.forEach((card) => card.classList.remove("hide"));
    const noData = document.querySelector(".no-data");
    if (noData) noData.remove();
  }
});

// Scroll button
const scrollUpBtn = document.getElementById("scrollUpBtn");

window.addEventListener("scroll", () => {
  scrollUpBtn.style.display = document.documentElement.scrollTop > 500 ? "block" : "none";
});

scrollUpBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
