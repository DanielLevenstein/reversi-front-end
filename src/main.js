const state = {
  apiBase: "http://localhost:9000",
  gameId: null,
  boardRows: [],
  currentTurn: "X",
  lastMove: "",
  aiPlayer: "O",
  validMoves: new Set(),
  gameOverShown: false,
  isBusy: false,
};

const els = {
  apiBase: document.getElementById("apiBase"),
  newGameBtn: document.getElementById("newGameBtn"),
  board: document.getElementById("board"),
  gameId: document.getElementById("gameId"),
  turn: document.getElementById("turn"),
  lastMove: document.getElementById("lastMove"),
  status: document.getElementById("status"),
};

const FILES = ["A", "B", "C", "D", "E", "F", "G", "H"];

const setStatus = (text) => (els.status.textContent = text);

const api = (path, options = {}) => {
  const method = (options.method || "GET").toUpperCase();
  const headers = { ...(options.headers || {}) };

  if (method !== "GET" && method !== "HEAD" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`${state.apiBase}${path}`, {
    ...options,
    headers,
  }).then(async (res) => {
    const raw = await res.text();
    if (!res.ok) {
      throw new Error(raw || `HTTP ${res.status}`);
    }
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return raw;
    }
  });
};

const algebraFromIndex = (r, c) => `${FILES[c]}${8 - r}`;

const parseBoard = (boardState) =>
  boardState
    .split("\n")
    .slice(0, 8)
    .map((row) => row.padEnd(8, " ").slice(0, 8).split(""));

const countPieces = () => {
  let x = 0;
  let o = 0;
  for (const row of state.boardRows) {
    for (const cell of row) {
      if (cell === "X") x += 1;
      if (cell === "O") o += 1;
    }
  }
  return { x, o };
};

function showFinalScore() {
  if (state.gameOverShown) return;
  state.gameOverShown = true;
  const { x, o } = countPieces();
  const winner = x === o ? "Draw" : x > o ? "X wins" : "O wins";
  setStatus(`Game over. X: ${x}, O: ${o}. ${winner}`);
  alert(`Game Over\nX: ${x}\nO: ${o}\n${winner}`);
}

function renderBoard() {
  els.board.innerHTML = "";

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = document.createElement("button");
      cell.className = "cell";
      const algebra = algebraFromIndex(r, c);
      const piece = state.boardRows[r]?.[c] || " ";
      const isValid = state.validMoves.has(algebra);

      if (isValid && !state.isBusy && state.currentTurn !== state.aiPlayer) {
        cell.classList.add("valid");
        cell.onclick = () => playMove(algebra);
      }

      if (piece === "X" || piece === "O") {
        const disk = document.createElement("div");
        disk.className = `piece ${piece}`;
        cell.appendChild(disk);
      } else if (isValid) {
        const dot = document.createElement("div");
        dot.className = "dot";
        cell.appendChild(dot);
      }

      els.board.appendChild(cell);
    }
  }

  els.gameId.textContent = state.gameId ?? "-";
  els.turn.textContent = state.currentTurn || "-";
  els.lastMove.textContent = state.lastMove || "-";
}

async function refreshBoard() {
  if (!state.gameId) return;

  const board = await api(`/games/${state.gameId}`);
  state.boardRows = parseBoard(board.boardState);
  state.currentTurn = board.currentTurn;
  state.lastMove = board.lastMove;
  state.aiPlayer = board.aiPlayer || "O";

  const moves = await api(`/games/${state.gameId}/valid-moves/${state.currentTurn}`);
  state.validMoves = new Set(moves);
  renderBoard();

  if (moves.length === 0) {
    const otherPlayer = state.currentTurn === "X" ? "O" : "X";
    const otherMoves = await api(`/games/${state.gameId}/valid-moves/${otherPlayer}`);

    if (otherMoves.length === 0) {
      showFinalScore();
      return;
    }

    state.currentTurn = otherPlayer;
    state.validMoves = new Set(otherMoves);
    setStatus(`${board.currentTurn} has no valid moves. Passing turn to ${otherPlayer}.`);
    renderBoard();

    if (state.currentTurn === state.aiPlayer) {
      await playAIMove(true);
    }
    return;
  }

  if (state.currentTurn === state.aiPlayer) {
    await playAIMove(true);
  }
}

async function playMove(move) {
  if (state.isBusy) return;
  state.isBusy = true;
  renderBoard();

  try {
    setStatus(`Playing ${move}...`);
    await api(`/games/${state.gameId}/move`, {
      method: "POST",
      body: JSON.stringify({
        player: state.currentTurn,
        move,
      }),
    });
    await refreshBoard();
    setStatus(`Played ${move}`);
  } catch (err) {
    setStatus(`Move failed: ${err.message}`);
  } finally {
    state.isBusy = false;
    renderBoard();
  }
}

async function playAIMove(allowWhenBusy = false) {
  if (state.isBusy && !allowWhenBusy) return;
  state.isBusy = true;
  renderBoard();

  try {
    setStatus("AI is thinking...");
    await api(`/games/${state.gameId}/ai-move`, {
      method: "POST",
      body: JSON.stringify({ "ai-player": state.aiPlayer }),
    });
    await refreshBoard();
    setStatus("AI played.");
  } catch (err) {
    setStatus(`AI move failed: ${err.message}`);
  } finally {
    state.isBusy = false;
    renderBoard();
  }
}

async function newGame() {
  try {
    state.apiBase = els.apiBase.value.trim().replace(/\/$/, "");
    setStatus("Creating game...");

    const res = await fetch(`${state.apiBase}/games/new-game`);
    if (!res.ok) {
      throw new Error((await res.text()) || `HTTP ${res.status}`);
    }

    const rawId = (await res.text()).trim();
    state.gameId = rawId.replace(/^"|"$/g, "");

    state.gameOverShown = false;
    await refreshBoard();
    setStatus("Game ready.");
  } catch (err) {
    setStatus(`Failed to create game: ${err.message}`);
  }
}

els.newGameBtn.addEventListener("click", newGame);
renderBoard();
