const playersDiv = document.getElementById("players");
const matchesDiv = document.getElementById("matches");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const addMatchBtn = document.getElementById("addMatchBtn");
const clearMatchesBtn = document.getElementById("clearMatchesBtn");
const resetPlayersBtn = document.getElementById("resetPlayersBtn");

let players = [
  { id: 1, name: "Player A", rating: 1000, sd: 33 },
  { id: 2, name: "Player B", rating: 1000, sd: 33 },
];

let matches = [];

function renderPlayers() {
  playersDiv.innerHTML = "";

  players.forEach((p) => {
    const div = document.createElement("div");
    div.className = "player";

    // Create HTML for inputs
    div.innerHTML = `
      <input type="text" value="${p.name}" data-id="${p.id}" class="p-name">
      Rating: <input type="number" value="${p.rating}" data-id="${p.id}" class="p-rating">
      ± <input type="number" value="${p.sd}" data-id="${p.id}" class="p-sd">
    `;

    // --- CREATE REMOVE BUTTON ---
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "–";
    removeBtn.className = "removePlayerBtn";
    removeBtn.dataset.id = p.id;   // store which player it belongs to
    div.appendChild(removeBtn);

    playersDiv.appendChild(div);

    // UPDATE DATA WHEN USER EDITS
    const nameInput = div.querySelector(".p-name");
    const ratingInput = div.querySelector(".p-rating");
    const sdInput = div.querySelector(".p-sd");

    nameInput.addEventListener("input", () => {
      p.name = nameInput.value;
      renderMatches(); // keep dropdown names in sync
    });

    ratingInput.addEventListener("input", () => {
      p.rating = Number(ratingInput.value);
    });

    sdInput.addEventListener("input", () => {
      p.sd = Number(sdInput.value);
    });

    // --- DELETE PLAYER LOGIC ---
    removeBtn.addEventListener("click", () => {
      // Remove this player
      players = players.filter(player => player.id !== p.id);

      // Remove matches involving this player
      matches = matches.filter(m => m.pA !== p.id && m.pB !== p.id);

      renderPlayers();
      renderMatches();
    });
  });
}


function renderMatches() {
  matchesDiv.innerHTML = "";

  matches.forEach((m, index) => {
    const playerA = players.find(p => p.id === m.pA);
    const playerB = players.find(p => p.id === m.pB);

    const div = document.createElement("div");
    div.className = "match";

    div.innerHTML = `
      <select class="playerA">
        ${players.map(p => `<option value="${p.id}" ${p.id === m.pA ? "selected" : ""}>${p.name}</option>`).join("")}
      </select>
      vs
      <select class="playerB">
        ${players.map(p => `<option value="${p.id}" ${p.id === m.pB ? "selected" : ""}>${p.name}</option>`).join("")}
      </select>
      <select class="result">
        <option value="A">${playerA.name} wins</option>
        <option value="B">${playerB.name} wins</option>
      </select>
    `;

    // --- CREATE REMOVE BUTTON ---
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "–";
    removeBtn.className = "removeMatchBtn";
    removeBtn.dataset.index = index;
    div.appendChild(removeBtn);

    matchesDiv.appendChild(div);

    // UPDATE DATA WHEN USER EDITS
    const playerASelect = div.querySelector(".playerA");
    const playerBSelect = div.querySelector(".playerB");
    const resultSelect = div.querySelector(".result");

    playerASelect.addEventListener("change", () => {
      m.pA = Number(playerASelect.value);
      renderMatches();  // update result names dynamically
    });

    playerBSelect.addEventListener("change", () => {
      m.pB = Number(playerBSelect.value);
      renderMatches();  // update result names dynamically
    });

    resultSelect.addEventListener("change", () => {
      m.result = resultSelect.value;
    });

    // --- DELETE MATCH LOGIC ---
    removeBtn.addEventListener("click", () => {
      matches.splice(index, 1);   // remove match by index
      renderMatches();
    });
  });
}


// Add Player
addPlayerBtn.onclick = () => {
  const newId = players.length ? players[players.length - 1].id + 1 : 1;

  players.push({
    id: newId,
    name: `Player ${String.fromCharCode(64 + newId)}`,
    rating: 1000,
    sd: 33
  });

  renderPlayers();
  renderMatches();
};

// Add Match
addMatchBtn.onclick = () => {
  if (players.length < 2) {
    alert("Need at least two players!");
    return;
  }

  matches.push({
    pA: players[0].id,
    pB: players[1].id,
    result: "A"
  });

  renderMatches();
};

// Clear Matches
clearMatchesBtn.onclick = () => {
  matches = [];
  renderMatches();
};

// Reset Players (keep only Player A & B)
resetPlayersBtn.onclick = () => {
  players = [
    { id: 1, name: "Player A", rating: 1000, sd: 33 },
    { id: 2, name: "Player B", rating: 1000, sd: 33 }
  ];
  matches = [];

  renderPlayers();
  renderMatches();
};

// Initial render
renderPlayers();
renderMatches();
