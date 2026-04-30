(async () => {
  const base = 'http://localhost:9000';
  const gid = (await (await fetch(base + '/games/new-game')).text()).trim().replace(/^"|"$/g,'');
  console.log('gid', gid);

  async function turnInfo(tag){
    const b = await (await fetch(`${base}/games/${gid}`)).json();
    const m = await (await fetch(`${base}/games/${gid}/valid-moves/${b.currentTurn}`)).json();
    const other = b.currentTurn === 'X' ? 'O':'X';
    const om = await (await fetch(`${base}/games/${gid}/valid-moves/${other}`)).json();
    console.log(tag, 'turn', b.currentTurn, 'moves', m.length, 'other', other, om.length, 'last', b.lastMove);
    return {b,m,other,om};
  }

  let t = await turnInfo('start');
  const hm = t.m[0];
  await fetch(`${base}/games/${gid}/move`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({player:t.b.currentTurn, move:hm})});
  t = await turnInfo('after human');
  await fetch(`${base}/games/${gid}/ai-move`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({'ai-player':'O'})});
  t = await turnInfo('after ai');
})();