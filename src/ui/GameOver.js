const GameOver = {
  show() { const ov = document.getElementById('game-over-overlay'); if (ov) ov.style.display = 'flex'; },
  hide() { const ov = document.getElementById('game-over-overlay'); if (ov) ov.style.display = 'none'; }
};
export default GameOver;
