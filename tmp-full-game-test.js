(async () => {
  const base = 'http://localhost:9000';
  const createRes = await fetch(base + '/games/new-game');
  if (!createRes.ok) throw new Error('Failed to create game');
  const gameId = (await createRes.text()).trim().replace(/^"|"$/g, '');

  let passes = 0;
  let turns = 0;
  const history = [];

  while (passes < 2 && turns < 200) {
    const boardRes = await fetch(`${base}/games/${gameId}`);
    if (!boardRes.ok) throw new Error(`Failed to fetch board at turn ${turns}`);
    const board = await boardRes.json();
    const player = board.currentTurn;

    const movesRes = await fetch(`${base}/games/${gameId}/valid-moves/${player}`);
    if (!movesRes.ok) throw new Error(`Failed to fetch valid moves for ${player}`);
    const moves = await movesRes.json();

    if (!Array.isArray(moves) || moves.length === 0) {
      passes += 1;
      history.push({ turn: turns, player, action: 'pass' });
      // toggle player by making no server-side move, just continue; backend currentTurn may stay same
      // force progress by trying opposite player next through AI endpoint pattern not required here
      // we break if stuck on same player with no moves twice
      turns += 1;
      if (passes >= 2) break;
      continue;
    }

    passes = 0;
    const move = moves[0];
    const moveRes = await fetch(`${base}/games/${gameId}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player, move })
    });

    if (!moveRes.ok) {
      const errText = await moveRes.text();
      throw new Error(`Move failed for ${player} ${move}: ${errText}`);
    }

    history.push({ turn: turns, player, action: 'move', move });
    turns += 1;
  }

  const finalBoard = await (await fetch(`${base}/games/${gameId}`)).json();
  const cells = finalBoard.boardState.split('\n').slice(0,8).map(r => r.padEnd(8,' ').slice(0,8).split(''));
  let x = 0, o = 0;
  for (const row of cells) for (const c of row) { if (c === 'X') x++; if (c === 'O') o++; }

  console.log(JSON.stringify({
    gameId,
    turns,
    passes,
    x,
    o,
    finalTurn: finalBoard.currentTurn,
    sampleHistory: history.slice(0, 12),
    ok: turns > 20
  }, null, 2));
})();
