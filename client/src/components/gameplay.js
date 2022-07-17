export function choosePiece(gameState, index) {
  const newGameState = deepCopy(gameState);

  newGameState.selectedPiece = newGameState.availablePieces[index];
  newGameState.availablePieces[index] = null;

  newGameState.currentPlayerId = nextPlayerId(newGameState.playerIds, newGameState.currentPlayerId);

  newGameState.placingPiece = true;

  return newGameState;
}

export function initialAvailablePieces() {
  return [
    {color: "dark",  shape: "square", mark: "o", border: "thick"},
    {color: "dark",  shape: "square", mark: "o", border: "thin"},
    {color: "dark",  shape: "circle", mark: "o", border: "thin"},
    {color: "dark",  shape: "circle", mark: "o", border: "thick"},
    {color: "dark",  shape: "square", mark: "x", border: "thick"},
    {color: "dark",  shape: "square", mark: "x", border: "thin"},
    {color: "dark",  shape: "circle", mark: "x", border: "thin"},
    {color: "dark",  shape: "circle", mark: "x", border: "thick"},
    {color: "light", shape: "square", mark: "x", border: "thick"},
    {color: "light", shape: "square", mark: "x", border: "thin"},
    {color: "light", shape: "circle", mark: "x", border: "thin"},
    {color: "light", shape: "circle", mark: "x", border: "thick"},
    {color: "light", shape: "square", mark: "o", border: "thick"},
    {color: "light", shape: "square", mark: "o", border: "thin"},
    {color: "light", shape: "circle", mark: "o", border: "thin"},
    {color: "light", shape: "circle", mark: "o", border: "thick"}
  ];
}

export function nextPlayerId(playerIds, currentPlayerId) {
  const currentPlayerIndex = playerIds.indexOf(currentPlayerId);
  
  const nextPlayerIndex = (currentPlayerIndex + 1) % playerIds.length;

  return playerIds[nextPlayerIndex];
}

export function placePiece(gameState, index) {
  const newGameState = deepCopy(gameState);

  newGameState.playingBoard[index] = newGameState.selectedPiece;
  newGameState.selectedPiece = null;

  newGameState.placingPiece = false;

  newGameState.winningCells = tryGetWinningIndices(newGameState.playingBoard);
  if (newGameState.winningCells.length > 0) {
    newGameState.gameOver = true;
  }
  else {
    newGameState.gameOver = isTie(newGameState.playingBoard);
  }

  return newGameState;
}

// -----------------------------------------------------------------------------
// Private helper methods
// -----------------------------------------------------------------------------
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function haveCommonCharacteristics(pieces) {
  if (pieces.some((x) => !x)) {
    return false;
  }

  const common = {
    color: pieces[0].color,
    shape: pieces[0].shape,
    mark: pieces[0].mark,
    border: pieces[0].border
  };
  for (var i = 1; i < pieces.length; i++) {
    if (pieces[i].color !== common.color) common.color = false;
    if (pieces[i].shape !== common.shape) common.shape = false;
    if (pieces[i].mark !== common.mark) common.mark = false;
    if (pieces[i].border !== common.border) common.border = false;
  }

  return common.color || common.shape || common.mark || common.border;
}

function isTie(playingBoard) {
  return playingBoard.every((x) => x);
}

export function tryGetWinningIndices(playingBoard) {
  const winConfigurations = [
    // Horizontal
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    // Vertical
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    // Diagonal
    [0, 5, 10, 15],
    [3, 6, 9, 12]
  ];

  for (const indices of winConfigurations) {
    const pieces = indices.map((i) => playingBoard[i]);
    if (haveCommonCharacteristics(pieces)) {
      return indices;
    }
  }

  return [];
}
