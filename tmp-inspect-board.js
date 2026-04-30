(async () => {
  const r = await fetch('http://localhost:9000/games/new-game');
  const id = (await r.text()).trim().replace(/^"|"$/g, '');
  const b = await (await fetch('http://localhost:9000/games/' + id)).json();
  console.log('ID', id);
  console.log('BOARD_RAW_START');
  console.log(b.boardState);
  console.log('BOARD_RAW_END');
})();
