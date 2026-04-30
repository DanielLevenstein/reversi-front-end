(async () => {
  const base = 'http://localhost:9000';
  const r1 = await fetch(base + '/games/new-game');
  const id = (await r1.text()).trim().replace(/^"|"$/g, '');

  const r2 = await fetch(base + '/games/' + id);
  const board = await r2.json();

  const r3 = await fetch(base + '/games/' + id + '/valid-moves/' + board.currentTurn);
  const moves = await r3.json();

  console.log(JSON.stringify({
    id,
    boardStatus: r2.status,
    turn: board.currentTurn,
    movesCount: Array.isArray(moves) ? moves.length : -1,
    ok: r1.ok && r2.ok && r3.ok && Array.isArray(moves)
  }, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
