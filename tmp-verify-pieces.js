(async () => {
  const parseBoard = (boardState) =>
    boardState
      .split("\n")
      .slice(0, 8)
      .map((row) => row.padEnd(8, " ").slice(0, 8).split(""));

  const id = (await (await fetch('http://localhost:9000/games/new-game')).text()).trim().replace(/^"|"$/g, '');
  const board = await (await fetch('http://localhost:9000/games/' + id)).json();
  const rows = parseBoard(board.boardState);
  let x = 0, o = 0;
  for (const r of rows) for (const c of r) { if (c === 'X') x++; if (c === 'O') o++; }
  console.log(JSON.stringify({ id, x, o, ok: x === 2 && o === 2 }, null, 2));
})();
