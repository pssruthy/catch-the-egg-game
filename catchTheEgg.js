const process = require('process');
const { stdout, stdin } = process;
stdin.setRawMode(true);

stdin.setEncoding('utf8');
const row = stdout.rows;
const eggsPositionInfo = [];
const gameProgress = { saved: 0, chances: 5 };
const bucketPosition = { row: row - 3, leftEnd: 5, rightEnd: 15 };
const bucket = '🗑🗑🗑🗑🗑🗑🗑🗑🗑🗑';
const egg = '🥚';

const generateNewEgg = function() {
  const newEgg = {};
  const column = stdout.columns;
  newEgg.egg = egg;
  newEgg.x = Math.floor(Math.random() * column);
  newEgg.y = 2;
  return newEgg;
};

const dropNewEgg = function() {
  eggsPositionInfo.push(generateNewEgg());
};

const displayEggs = function() {
  stdout.moveCursor(0, 1);
  stdout.clearScreenDown();
  eggsPositionInfo.forEach(eggPosition => {
    stdout.cursorTo(eggPosition.x, eggPosition.y);
    console.log('🥚');
    eggPosition.y += 1;
  });
};

const displayGrass = function() {
  stdout.cursorTo(1, row - 2);
  stdout.write('🌵'.repeat(stdout.columns / 2));
};

const displayBucket = function() {
  stdout.cursorTo(bucketPosition.leftEnd, bucketPosition.row);
  stdout.write(bucket);
};

const calculateMarks = function() {
  let eggInfoIndex = 0;
  const bucketRow = bucketPosition.row;
  eggsPositionInfo.forEach(egg => {
    if (egg.y == bucketRow) {
      const { leftEnd, rightEnd } = bucketPosition;
      if (egg.x >= leftEnd && egg.x <= rightEnd) {
        gameProgress.saved += 1;
      } else {
        gameProgress.chances -= 1;
        eggsPositionInfo.egg = '🐣';
      }
      eggsPositionInfo.splice(eggInfoIndex, 1);
    }
    eggInfoIndex++;
  });
};

const setEnv = function() {
  console.clear();
  displayEggs();
  displayBucket();
  displayGrass();
  calculateMarks();
  isGameOver();
  const row = stdout.rows;
  stdout.cursorTo(1, row);
  stdout.write(`Saved eggs :${gameProgress.saved}`);
  stdout.cursorTo(30, row);
  stdout.write(`Remaining Eggs :${gameProgress.chances}`);
};

const isGameOver = function() {
  if (gameProgress.chances == 0) {
    quitGame();
  }
};

const displayMarks = function() {
  console.clear();
  stdout.cursorTo(1, 1);
  stdout.write(`You saved : ${gameProgress.saved}\n`);
};

const quitGame = function() {
  displayMarks();
  process.exit(0);
};

const getGameStatus = function(keyStroke) {
  if (keyStroke == 'q') {
    quitGame();
  }
  moveBucket(keyStroke);
};

const moveBucket = function(keyStroke) {
  const keyStrokes = ['f', 'j'];
  const movementDir = keyStrokes.indexOf(keyStroke);
  if (movementDir != -1) {
    if (movementDir === 0 && bucketPosition.leftEnd >= 1) {
      bucketPosition.leftEnd -= 3;
      bucketPosition.rightEnd -= 3;
    }
    if (movementDir === 1 && bucketPosition.rightEnd <= stdout.columns) {
      bucketPosition.leftEnd += 3;
      bucketPosition.rightEnd += 3;
    }
  }
};

const main = function() {
  setInterval(setEnv, 300);
  setInterval(dropNewEgg, 4000);
  stdin.on('data', getGameStatus);
};

main();
