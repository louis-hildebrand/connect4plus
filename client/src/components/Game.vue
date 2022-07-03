<template>
  <div class="component-content">
    <header>
      <AppHeader>
        <div class="player-name" :style="playerNameStyle(1)">
          <span class="player-name-text">
            {{ player1Name ? `${player1Name} (host)` : "Host" }}
          </span>
        </div>
        <div class="player-name" :style="playerNameStyle(2)">
          <span class="player-name-text">
            {{ player2Name ? `${player2Name} (guest)` : "Guest" }}
          </span>
        </div>
      </AppHeader>
    </header>
    <div class="msg">{{ message }}</div>
    <div class="game-content">
      <div class="single-cell">
        <img v-if="selectedPiece" :src="image(selectedPiece)" />
      </div>
      <div class="grid" id="playing-board">
        <div class="cell"
          v-for="(piece, index) in playingBoard"
          :key="index"
          @click="placePiece(index)"
          :style="cellBackgroundStyle(true, index)"
        >
          <img v-if="piece" :src="image(piece)" />
        </div>
      </div>
      <div class="grid" id="available-pieces">
        <div class="cell"
          v-for="(piece, index) in availablePieces"
          :key="index"
          @click="choosePiece(index)"
          :style="cellBackgroundStyle(false, index)"
        >
          <img v-if="piece" :src="image(piece)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./game.js">
</script>

<style scoped>
.component-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.player-name {
  padding: 5px 10px 5px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.msg {
  padding: 5px;
  align-self: center;
}

.game-content {
  flex-grow: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.grid {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-auto-columns: 1fr;
  gap: 4px;
  padding: 4px;
  margin: 5px;
}
#playing-board {
  background-color: black;
}
#available-pieces {
  background-color: white;
}

.cell {
  padding: 5%;
}
/* Prevent the cell from turning blue when double-clicked. */
img::selection {
  display: none;
}
.single-cell {
  border-style: solid;
  border-color: lightgrey;
  border-width: 4px;
  margin: 5px;
}

img {
  width: 100%;
  height: 100%;
}

@media (orientation: landscape) {
  .game-content {
    flex-direction: row;
  }

  .cell, .single-cell {
    width: min(9vw, (100vh - 200px) / 5);
    height: min(9vw, (100vh - 200px) / 5);
  }
}

@media (orientation: portrait) {
  .game-content {
    flex-direction: column;
  }
  
  .cell, .single-cell {
    width: min(15vw, (100vh - 200px) / 11);
    height: min(15vw, (100vh - 200px) / 11);
  }
}
</style>
