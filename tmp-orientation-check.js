(async () => {
  const base = 'http://localhost:9000';
  const id = (await (await fetch(base + '/games/new-game')).text()).trim().replace(/^"|"$/g, '');
  const board0 = await (await fetch(base + '/games/' + id)).json();
  const moves = await (await fetch(base + '/games/' + id + '/valid-moves/X')).json();
  const move = moves[0];
  await fetch(base + '/games/' + id + '/move', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({player:'X', move})});
  const board1 = await (await fetch(base + '/games/' + id)).json();

  const rows0 = board0.boardState.split('\n').slice(0,8).map(r=>r.padEnd(8,' ').slice(0,8).split(''));
  const rows1 = board1.boardState.split('\n').slice(0,8).map(r=>r.padEnd(8,' ').slice(0,8).split(''));

  const added = [];
  for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
    if (rows0[r][c] !== rows1[r][c]) added.push({r,c,from:rows0[r][c],to:rows1[r][c],a1Top:`${'ABCDEFGH'[c]}${r+1}`,a1Bottom:`${'ABCDEFGH'[c]}${8-r}`});
  }
  console.log(JSON.stringify({id, moveTried: move, diffs: added}, null, 2));
})();