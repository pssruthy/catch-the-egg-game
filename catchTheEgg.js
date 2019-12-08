'use strict';
const process = require('process');
const { red, greenBright, yellow } = require('chalk');
const { stdout, stdin } = process;
stdin.setRawMode(true);
const readlineSync = require('readline-sync');

stdin.setEncoding('utf8');
const eggsPositionInfo = [];
const egg = '🥚';

const generateNewEgg = function() {
  const newEgg = {};
  const column = stdout.columns;
  newEgg.egg = egg;
  newEgg.x = Math.floor(Math.random() * column);
  newEgg.y = 3;
  return newEgg;
};

const dropNewEgg = function() {
  const newEgg = generateNewEgg();
  eggsPositionInfo.push(newEgg);
};

const displayScreen = function() {
  displayEggs();
  displayBucket();
  displayGrass();
};

const displayEggs = function() {
  console.clear();
  eggsPositionInfo.forEach(eggPosition => {
    stdout.cursorTo(eggPosition.x, eggPosition.y);
    stdout.write(eggPosition.egg);
    eggPosition.y += 1;
  });
};

const displayGrass = function() {
  stdout.cursorTo(1, row - 2);
  stdout.write('🌵'.repeat(stdout.columns / 2));
};

const row = stdout.rows;
const bucketPosition = { row: row - 3, leftEnd: 5, rightEnd: 15 };
const bucket = '🗑🗑🗑🗑🗑🗑🗑🗑🗑🗑';

const displayBucket = function() {
  stdout.cursorTo(bucketPosition.leftEnd, bucketPosition.row);
  stdout.write(bucket);
};

const gameProgress = { savedEggs: 0, chancesLeft: 5 };

const calculateMarks = function() {
  let eggInfoIndex = 0;
  const bucketRow = bucketPosition.row;
  eggsPositionInfo.forEach(egg => {
    const isEggReachedGround = egg.y == bucketRow;

    if (isEggReachedGround) {
      const { leftEnd, rightEnd } = bucketPosition;
      const isPlayerSaveTheEgg = egg.x >= leftEnd && egg.x <= rightEnd;

      if (isPlayerSaveTheEgg) {
        gameProgress.savedEggs += 1;
      } else gameProgress.chancesLeft -= 1;
      eggsPositionInfo.splice(eggInfoIndex, 1);
    }
    eggInfoIndex++;
  });
};

const setEnvironment = function() {
  console.clear();
  displayScreen();
  calculateMarks();
  isGameOver();

  const row = stdout.rows;
  stdout.cursorTo(1, row);
  stdout.write(`${greenBright(`Saved eggs :${gameProgress.savedEggs}`)}`);
  stdout.cursorTo(30, row);
  stdout.write(`${red(`Remaining Eggs :${gameProgress.chancesLeft}`)}`);
};

const isGameOver = function() {
  if (gameProgress.chancesLeft == 0) {
    quitGame();
  }
};

const displayMarks = function() {
  console.clear();
  stdout.cursorTo(1, 1);
  stdout.write(`${yellow(`GAME OVER\n\n`)}`);
  stdout.write(`${greenBright(`You saved : ${gameProgress.savedEggs}\n`)}`);
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
    const isMovementToLeft = movementDir === 0 && bucketPosition.leftEnd >= 1;

    if (isMovementToLeft) {
      bucketPosition.leftEnd -= 3;
      bucketPosition.rightEnd -= 3;
    }
    const isMovementToRight =
      movementDir === 1 && bucketPosition.rightEnd <= stdout.columns;

    if (isMovementToRight) {
      bucketPosition.leftEnd += 3;
      bucketPosition.rightEnd += 3;
    }
  }
};
const getInstructionsForUser = function() {
  const welcome = 'Welcome to Catch The Egg game🐣\n';

  let whatToDo = 'What is the "Catch The Egg game"\n';
  whatToDo += 'Eggs will fall from the top 🥚\n';
  whatToDo += 'you are here to save the egg by moving the bowl.\n';

  const chances = `You will get 5 chances to continue the game`;

  let direction = 'You can move the bowl by clicking f and j keys.\n';
  direction += 'CLick "f" for left and "j" for right';

  const startTheGame = 'Click enter to start the game\n ALL THE BEST';

  const instructions = [welcome, whatToDo, direction, startTheGame].join('\n');
  return instructions;
};

const main = function() {
  console.clear();
  readlineSync.question(yellow(getInstructionsForUser()));
  stdin.resume();
  setInterval(setEnvironment, 300);
  setInterval(dropNewEgg, 4000);
  stdin.on('data', getGameStatus);
};

main();
