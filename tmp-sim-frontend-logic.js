(async () => {
  const state = { apiBase:'http://localhost:9000', gameId:null, currentTurn:'X', aiPlayer:'O', gameOverShown:false };
  const api = async (path, options={}) => {
    const method = (options.method || 'GET').toUpperCase();
    const headers = { ...(options.headers||{}) };
    if (method !== 'GET' && method !== 'HEAD' && !headers['Content-Type']) headers['Content-Type']='application/json';
    const res = await fetch(state.apiBase + path, {...options, headers});
    const raw = await res.text();
    if (!res.ok) throw new Error(raw || `HTTP ${res.status}`);
    try { return raw ? JSON.parse(raw) : null; } catch { return raw; }
  };

  const gidRes = await fetch(state.apiBase + '/games/new-game');
  state.gameId = (await gidRes.text()).trim().replace(/^"|"$/g,'');

  async function refreshBoard(tag){
    const board = await api(`/games/${state.gameId}`);
    state.currentTurn = board.currentTurn;
    state.aiPlayer = board.aiPlayer || 'O';
    const moves = await api(`/games/${state.gameId}/valid-moves/${state.currentTurn}`);
    console.log(tag, 'turn', state.currentTurn, 'moves', moves.length, 'last', board.lastMove);
    if (moves.length === 0) {
      const otherPlayer = state.currentTurn === 'X' ? 'O' : 'X';
      const otherMoves = await api(`/games/${state.gameId}/valid-moves/${otherPlayer}`);
      console.log('  other', otherPlayer, otherMoves.length);
      if (otherMoves.length === 0) {
        console.log('GAME OVER WOULD TRIGGER');
        return;
      }
      state.currentTurn = otherPlayer;
      if (state.currentTurn === state.aiPlayer) {
        await playAIMove('auto-pass-ai');
      }
      return;
    }
    if (state.currentTurn === state.aiPlayer) {
      await playAIMove('auto-ai');
    }
  }

  async function playMove(move){
    await api(`/games/${state.gameId}/move`, {method:'POST', body:JSON.stringify({player: state.currentTurn, move})});
    await refreshBoard('after human move');
  }
  async function playAIMove(tag){
    await api(`/games/${state.gameId}/ai-move`, {method:'POST', body:JSON.stringify({'ai-player': state.aiPlayer})});
    await refreshBoard(`after ${tag}`);
  }

  await refreshBoard('start');
  const startMoves = await api(`/games/${state.gameId}/valid-moves/${state.currentTurn}`);
  await playMove(startMoves[0]);
})();