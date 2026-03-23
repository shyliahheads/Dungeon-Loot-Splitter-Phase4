function saveState() {

    // Construct a single object representing application state
    const state = {
        loot: loot,
        partySize: partySize
    };

    // Convert object to string and store it
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

}

function restoreState() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {

        const parsed = JSON.parse(saved);

        // Ensure parsed value is an object
        if (typeof parsed !== "object") return;

        // Validate party size
        if (Number.isInteger(parsed.partySize) && parsed.partySize >= 1) {
            partySize = parsed.partySize;
        }

        // Validate loot array
        if (Array.isArray(parsed.loot)) {

            parsed.loot.forEach(item => {

                if (
                    item.name &&
                    typeof item.name === "string" &&
                    item.name.trim() !== "" &&
                    typeof item.value === "number" &&
                    item.value >= 0 &&
                    typeof item.quantity === "number" &&
                    item.quantity >= 1
                ) {

                    loot.push({
                        name: item.name,
                        value: item.value,
                        quantity: item.quantity
                    });

                }

            });

        }

    } catch (error) {

        console.log("Invalid saved data. Using default state.");

    }

}



// Persistent loot array
let lootArray = [];

// DOM Elements
let partySizeInput = document.getElementById("partySize");
let lootNameInput = document.getElementById("lootName");
let lootValueInput = document.getElementById("lootValue");

let lootList = document.getElementById("lootList");
let runningTotalDisplay = document.getElementById("runningTotal");

let finalTotalDisplay = document.getElementById("finalTotal");
let perMemberDisplay = document.getElementById("perMember");

let lootError = document.getElementById("lootError");
let splitError = document.getElementById("splitError");

// Event Listeners
document.getElementById("addLootBtn").addEventListener("click", addLoot);
document.getElementById("splitLootBtn").addEventListener("click", splitLoot);

// Add Loot Function
function addLoot() {

    lootError.textContent = "";

    let name = lootNameInput.value.trim();
    let value = parseFloat(lootValueInput.value);

    if (name === "") {
        lootError.textContent = "Loot name cannot be empty.";
        return;
    }

    if (isNaN(value) || value < 0) {
        lootError.textContent = "Loot value must be a valid non-negative number.";
        return;
    }

    let lootObject = {
        name: name,
        value: value
    };

    lootArray.push(lootObject);

    renderLoot();

    lootNameInput.value = "";
    lootValueInput.value = "";
}

// Render Loot Function
function renderLoot() {

    lootList.innerHTML = "";

    let total = 0;

    // Traditional for loop
    for (let i = 0; i < lootArray.length; i++) {

        let li = document.createElement("li");
        li.textContent = lootArray[i].name + " - $" + lootArray[i].value.toFixed(2);
        lootList.appendChild(li);

        total += lootArray[i].value;
    }

    runningTotalDisplay.textContent = total.toFixed(2);
}

// Split Loot Function
function splitLoot() {

    splitError.textContent = "";

    if (lootArray.length === 0) {
        splitError.textContent = "No loot has been added.";
        return;
    }

    let partySize = parseInt(partySizeInput.value);

    if (isNaN(partySize) || partySize < 1) {
        splitError.textContent = "Party size must be at least 1.";
        return;
    }

    let total = 0;

    for (let i = 0; i < lootArray.length; i++) {
        total += lootArray[i].value;
    }

    let perMember = total / partySize;

    finalTotalDisplay.textContent = total.toFixed(2);
    perMemberDisplay.textContent = perMember.toFixed(2);
}


document.addEventListener("DOMContentLoaded", () => {

    restoreState();

    // restore party size into input field
    document.getElementById("partySize").value = partySize;
    
function showMessage(msg) {
    document.getElementById("message").textContent = msg;
}
    

    updateUI();

});

