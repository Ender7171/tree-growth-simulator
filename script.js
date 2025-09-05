// Game state
let currentStage = 0;
let watered = false;
let dug = false;
let saplingPlanted = false;
let treeFullyGrown = false;
let day = true;

const stages = ["sapling", "smallPlant", "bigPlant", "smallTree", "bigTree"];
let cycle;

// DOM elements
const messageEl = document.getElementById("message");
const mudHole = document.getElementById("mudHole");

// Start Game
function startGame() {
  document.getElementById("startPage").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  cycle = setInterval(nextCycle, 5000); // day/night every 5s
}

// Shovel
function useShovel() {
  if (saplingPlanted || treeFullyGrown) {
    messageEl.innerText = "🌳 You can’t dig here, the plant is already growing!";
    return;
  }
  dug = true;
  mudHole.style.display = "block";
  messageEl.innerText = "You dug a hole in the soil!";
}

// Plant sapling
function plantSapling() {
  if (!dug) {
    messageEl.innerText = "Use the shovel first!";
    return;
  }
  if (saplingPlanted) {
    messageEl.innerText = "A plant is already growing!";
    return;
  }
  saplingPlanted = true;
  currentStage = 0;

  // Hide mud hole once sapling is planted
  mudHole.style.display = "none";

  showStage(currentStage);
  messageEl.innerText = "🌱 Sapling planted!";
}

// Water plant
function waterPlant() {
  if (!saplingPlanted) {
    messageEl.innerText = "Plant a sapling first!";
    return;
  }
  if (treeFullyGrown) {
    messageEl.innerText = "🌳 The tree is fully grown!";
    return;
  }
  watered = true;
  messageEl.innerText = "💧 You watered the plant!";

  // Watering animation (pulse effect)
  const stageEl = document.getElementById(stages[currentStage]);
  if (stageEl) {
    stageEl.style.animation = "waterAnim 1s ease";
    setTimeout(() => stageEl.style.animation = "", 1000);
  }

  // Add water drops animation
  spawnWaterDrops(stageEl);
}

// Function to create water drops
function spawnWaterDrops(target) {
  if (!target) return;

  const garden = document.getElementById("garden");
  const dropsContainer = document.createElement("div");
  dropsContainer.classList.add("water-drops");

  // Get the bounding box of the plant image
  const rect = target.getBoundingClientRect();
  const gardenRect = garden.getBoundingClientRect();

  // Center the drops horizontally above the plant
  dropsContainer.style.left = rect.left + rect.width / 2 - gardenRect.left + "px";
  dropsContainer.style.bottom = (gardenRect.bottom - rect.top + 10) + "px";

  // Create 3 drops
  for (let i = 0; i < 3; i++) {
    const drop = document.createElement("div");
    drop.classList.add("drop");
    drop.style.left = (i * 15 - 15) + "px"; // spread horizontally
    drop.style.animationDelay = (i * 0.2) + "s";
    dropsContainer.appendChild(drop);
  }

  garden.appendChild(dropsContainer);

  // Remove drops after animation
  setTimeout(() => {
    if (dropsContainer.parentNode) {
      garden.removeChild(dropsContainer);
    }
  }, 1500);
}

// Show plant stage
function showStage(stageIndex) {
  stages.forEach((id, i) => {
    document.getElementById(id).style.display = i === stageIndex ? "block" : "none";
  });
  if (stageIndex === stages.length - 1) {
    treeFullyGrown = true;
    messageEl.innerText = "🎉 Congratulations! Your tree has fully grown!";
  }
}

// Day/Night cycle
function nextCycle() {
  day = !day;
  if (day) {
    document.body.classList.remove("nighttime");
    document.body.classList.add("daytime");
  } else {
    document.body.classList.remove("daytime");
    document.body.classList.add("nighttime");
  }

  if (saplingPlanted && !treeFullyGrown) {
    if (watered) {
      currentStage++;
      if (currentStage < stages.length) {
        showStage(currentStage);
        messageEl.innerText = "🌱 The plant has grown!";
      }
      watered = false;
    } else {
      messageEl.innerText = "The plant needs water to grow!";
    }
  }
}

// Reset game
function resetGame() {
  clearInterval(cycle);
  dug = false;
  saplingPlanted = false;
  treeFullyGrown = false;
  currentStage = 0;
  watered = false;
  mudHole.style.display = "none";
  stages.forEach(id => document.getElementById(id).style.display = "none");
  messageEl.innerText = "Game reset! Use shovel to start again.";
  cycle = setInterval(nextCycle, 5000);
}
