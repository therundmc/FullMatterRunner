const GameState = {
  isGameOver: false,
  // (no pending state here; GameOverController handles freeze/delay)
  init() { window.gameState = this; }
};
export default GameState;
