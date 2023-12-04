var fieldContainer = document.querySelector(".field");
var tileSize = 25; // размер каждого тайла
var numRows = 24; // количество строк
var numCols = 40; // количество столбцов
var playerHp = 100; // жизни героя
var playerDamage = 40; // урон героя
var enemyHP = {}; // жизни врагов массив
var enemyDamage = 10; // урон врага
var arrayMap = []; // двумерный массив игрового поля

//Функция для получения рандомного числа
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Генирвация двумерного массива карты и заполенние его нулями
for (var i = 0; i < numRows; i++) {
  arrayMap[i] = [];
  for (var j = 0; j < numCols; j++) {
    arrayMap[i].push(0);
  }
}

function Game() {
  this.init = function () {
    generateMap();
    render();
  };

  function generateHallway(asix, maxCell, useAsix) {
    var startAsix;

    do {
      startAsix = getRandomInt(1, maxCell - 1);
    } while (
      useAsix.indexOf(startAsix + 1) !== -1 ||
      useAsix.indexOf(startAsix - 1) !== -1 ||
      useAsix.indexOf(startAsix) !== -1
    );
    useAsix.push(startAsix);

    if (asix === 1) {
      createHallwayVertical(startAsix);
    } else if (asix === 2) {
      createHallwayHorizontal(startAsix);
    }

    return useAsix;
  }

  function generateMap() {
    var useRowsHr = [];
    var useRowsVr = [];

    //генерация коридоров
    for (var i = 0; i < getRandomInt(3, 5); i++) {
      useRowsVr = generateHallway(1, numCols, useRowsVr);
    }
    for (var i = 0; i < getRandomInt(3, 5); i++) {
      useRowsHr = generateHallway(2, numRows, useRowsHr);
    }

    createRoom();
    createPlayer();

    for (var i = 0; i < 10; i++) {
      enemyHP[i + 1] = 100;
      createEnemy();
      createHP();
    }

    for (var i = 0; i < 2; i++) {
      createSword();
    }

    movePlayer();
  }

  function createRoom() {
    for (var i = 0; i < getRandomInt(5, 10); i++) {
      var width = getRandomInt(3, 8);
      var height = getRandomInt(3, 8);
      var startRow = getRandomInt(2, numRows - width);
      var startCol = getRandomInt(2, numCols - height);
      for (var row = 0; row < width; row++) {
        for (var col = 0; col < height; col++) {
          arrayMap[startRow + row][startCol + col] = 1;
        }
      }
    }
  }

  function createHallwayVertical(startNumberCol) {
    for (var row = 0; row < numRows; row++) {
      for (var col = startNumberCol; col < startNumberCol + 1; col++) {
        arrayMap[row][col] = 1;
      }
    }
  }

  function createHallwayHorizontal(startNumberRow) {
    for (var row = startNumberRow; row < startNumberRow + 1; row++) {
      for (var col = 0; col < numCols; col++) {
        arrayMap[row][col] = 1;
      }
    }
  }

  function createTile(idTile) {
    var cordsSpawnPlayerRow, cordsSpawnPlayerCol;
    do {
      cordsSpawnPlayerRow = getRandomInt(1, numRows - 1);
      cordsSpawnPlayerCol = getRandomInt(1, numCols - 1);
    } while (arrayMap[cordsSpawnPlayerRow][cordsSpawnPlayerCol] !== 1);
    arrayMap[cordsSpawnPlayerRow][cordsSpawnPlayerCol] = idTile;
  }

  function createPlayer() {
    createTile(2);
  }

  function createEnemy() {
    createTile(3);
  }

  function createSword() {
    createTile(4);
  }

  function createHP() {
    createTile(5);
  }

  function swapTile(asixY, asixX, currentPositionRow, currentPositionCol) {
    var temp = arrayMap[currentPositionRow][currentPositionCol];
    arrayMap[currentPositionRow][currentPositionCol] =
      arrayMap[currentPositionRow + asixY][currentPositionCol + asixX];
    arrayMap[currentPositionRow + asixY][currentPositionCol + asixX] = temp;
  }

  function checkTile(asixY, asixX, currentPositionRow, currentPositionCol) {
    try {
      return (
        arrayMap[currentPositionRow + asixY][currentPositionCol + asixX] ===
          1 ||
        arrayMap[currentPositionRow + asixY][currentPositionCol + asixX] ===
          5 ||
        arrayMap[currentPositionRow + asixY][currentPositionCol + asixX] === 8
      );
    } catch (error) {}
  }

  function checkHP(OsiY, OsiX, currentPositionRow, currentPositionCol) {
    try {
      if (
        arrayMap[currentPositionRow + OsiY][currentPositionCol + OsiX] === 5 &&
        playerHp < 100
      ) {
        arrayMap[currentPositionRow + OsiY][currentPositionCol + OsiX] = 1;
        playerHill();
        return true;
      }
      return false;
    } catch (error) {}
  }

  function checkSword(OsiY, OsiX, currentPositionRow, currentPositionCol) {
    try {
      if (
        arrayMap[currentPositionRow + OsiY][currentPositionCol + OsiX] === 4
      ) {
        playerAppDamage();
        arrayMap[currentPositionRow + OsiY][currentPositionCol + OsiX] = 1;
        return true;
      }
      return false;
    } catch (error) {}
  }

  function checkEnemy(currentPositionRow, currentPositionCol) {
    try {
      return (
        arrayMap[currentPositionRow + 1][currentPositionCol] === 3 ||
        arrayMap[currentPositionRow - 1][currentPositionCol] === 3 ||
        arrayMap[currentPositionRow][currentPositionCol + 1] === 3 ||
        arrayMap[currentPositionRow][currentPositionCol - 1] === 3
      );
    } catch (error) {}
  }

  function parsePosition(player) {
    var position = player.attributes.style.nodeValue
      .replace(/[^\d\s_]/g, "")
      .split(" ");
    position = position.filter(function (item) {
      if (item.length) {
        return item;
      }
    });
    return position;
  }

  function playerHill() {
    if (playerHp + 15 > 100) {
      playerHp = 100;
    } else {
      playerHp += 15;
    }
  }

  function playerAppDamage() {
    playerDamage += 15;
  }

  function hitEnemy() {
    var enemy = document.querySelectorAll(".tileE");
    var player = document.querySelector(".tileP");
    var playerPosition = parsePosition(player);
    for (var i = 0; i < enemy.length; i++) {
      var enemyPosition = parsePosition(enemy[i]);
      if (
        (parseInt(playerPosition[0]) + 25 === parseInt(enemyPosition[0]) &&
          parseInt(playerPosition[1]) === parseInt(enemyPosition[1])) ||
        (parseInt(playerPosition[0]) - 25 === parseInt(enemyPosition[0]) &&
          parseInt(playerPosition[1]) === parseInt(enemyPosition[1])) ||
        (parseInt(playerPosition[1]) + 25 === parseInt(enemyPosition[1]) &&
          parseInt(playerPosition[0]) === parseInt(enemyPosition[0])) ||
        (parseInt(playerPosition[1]) - 25 === parseInt(enemyPosition[1]) &&
          parseInt(playerPosition[0]) === parseInt(enemyPosition[0]))
      ) {
        enemyHP[enemy[i].id] = enemyHP[enemy[i].id] - playerDamage;
      }
    }
  }

  function movePlayer() {
    document.addEventListener("keydown", function (event) {
      var currentPositionRow = 0;
      var currentPositionCol = 0;
      var randomArray = [1, 2];
      for (var i = 0; i < numRows; i++) {
        for (var j = 0; j < numCols; j++) {
          if (arrayMap[i][j] === 2) {
            currentPositionRow = i;
            currentPositionCol = j;
          }
        }
      }
      if (checkWin()) {
        alert("Вы победили");
        return;
      }

      if (checkLose()) {
        alert("Вы проиграли");
        return;
      }

      if (checkEnemy(currentPositionRow, currentPositionCol)) {
        playerHp = playerHp - enemyDamage;
      }

      var arrayCurrentEnemyPos = [];
      for (var i = 0; i < numRows; i++) {
        for (var j = 0; j < numCols; j++) {
          if (arrayMap[i][j] === 3) {
            arrayCurrentEnemyPos.push([i, j]);
          }
        }
      }

      if (event.code === "KeyW") {
        if (
          checkHP(-1, 0, currentPositionRow, currentPositionCol) ||
          checkSword(-1, 0, currentPositionRow, currentPositionCol) ||
          checkTile(-1, 0, currentPositionRow, currentPositionCol)
        ) {
          swapTile(-1, 0, currentPositionRow, currentPositionCol);
          moveEnemy(randomArray[getRandomInt(0, 1)], arrayCurrentEnemyPos);
        }
      } else if (event.code === "KeyS") {
        if (
          checkHP(1, 0, currentPositionRow, currentPositionCol) ||
          checkSword(1, 0, currentPositionRow, currentPositionCol) ||
          checkTile(1, 0, currentPositionRow, currentPositionCol)
        ) {
          swapTile(1, 0, currentPositionRow, currentPositionCol);
          moveEnemy(randomArray[getRandomInt(0, 1)], arrayCurrentEnemyPos);
        }
      } else if (event.code === "KeyD") {
        if (
          checkHP(0, 1, currentPositionRow, currentPositionCol) ||
          checkSword(0, 1, currentPositionRow, currentPositionCol) ||
          checkTile(0, 1, currentPositionRow, currentPositionCol)
        ) {
          swapTile(0, 1, currentPositionRow, currentPositionCol);
          moveEnemy(randomArray[getRandomInt(0, 1)], arrayCurrentEnemyPos);
        }
      } else if (event.code === "KeyA") {
        if (
          checkHP(0, -1, currentPositionRow, currentPositionCol) ||
          checkSword(0, -1, currentPositionRow, currentPositionCol) ||
          checkTile(0, -1, currentPositionRow, currentPositionCol)
        ) {
          swapTile(0, -1, currentPositionRow, currentPositionCol);
          moveEnemy(randomArray[getRandomInt(0, 1)], arrayCurrentEnemyPos);
        }
      } else if (
        event.code === "Space" &&
        checkEnemy(currentPositionRow, currentPositionCol)
      ) {
        hitEnemy(currentPositionRow, currentPositionCol);
      }
      render();
    });
  }

  function moveEnemy(currentAsix, currentPosition) {
    var randomArray = [-1, 1];
    var randomAxios;
    var countMove = 0;
    var currentPositionRow, currentPositionCol;
    for (var key in currentPosition) {
      currentPositionRow = currentPosition[key][0];
      currentPositionCol = currentPosition[key][1];
      if (currentAsix === 1) {
        if (
          checkTile(1, 0, currentPositionRow, currentPositionCol) ||
          checkTile(-1, 0, currentPositionRow, currentPositionCol)
        ) {
          do {
            countMove++;
            randomAxios = randomArray[getRandomInt(0, 1)];
            if (countMove > 10) {
              randomAxios = 0;
              break;
            }
          } while (
            !checkTile(randomAxios, 0, currentPositionRow, currentPositionCol)
          );
          swapTile(randomAxios, 0, currentPositionRow, currentPositionCol);
        }
      } else if (currentAsix === 2) {
        if (
          checkTile(0, 1, currentPositionRow, currentPositionCol) ||
          checkTile(0, -1, currentPositionRow, currentPositionCol)
        ) {
          do {
            countMove++;
            randomAxios = randomArray[getRandomInt(0, 1)];
            if (countMove > 10) {
              randomAxios = 0;
              break;
            }
          } while (
            !checkTile(0, randomAxios, currentPositionRow, currentPositionCol)
          );
          swapTile(0, randomAxios, currentPositionRow, currentPositionCol);
        }
      }
    }
  }

  function checkLose() {
    if (playerHp <= 0) {
      return true;
    }
    return false;
  }

  function checkWin() {
    for (var key in enemyHP) {
      if (Object.hasOwnProperty.call(enemyHP, key)) {
        if (enemyHP[key] > 0) {
          return false;
        }
      }
    }
    return true;
  }

  function deleteEmeny(EnemyHp) {
    for (var key in EnemyHp) {
      if (EnemyHp.hasOwnProperty(key) && EnemyHp[key] < 0) {
        delete EnemyHp[key];
      }
    }
    var shiftedObject = {};
    var newIndex = 1;
    for (var currentKey in EnemyHp) {
      shiftedObject[newIndex] = EnemyHp[currentKey];
      newIndex++;
    }

    return shiftedObject;
  }

  function render() {
    fieldContainer.innerHTML = "";
    var numberEnemy = 1;
    for (var i = 0; i < numRows; i++) {
      for (var j = 0; j < numCols; j++) {
        var div = document.createElement("div");
        div.style.cssText = `top: ${i * tileSize + 1}px; left: ${
          j * tileSize + 1
        }px;`;
        if (arrayMap[i][j] === 0) {
          div.className = "tileW";
        }
        if (arrayMap[i][j] === 1) {
          div.className = "tile";
        }
        if (arrayMap[i][j] === 2) {
          var hp = document.createElement("div");
          hp.className = "health";
          hp.style = `width: ${playerHp}%`;
          div.appendChild(hp);
          div.className = "tileP";
        }

        if (arrayMap[i][j] === 3) {
          if (enemyHP[numberEnemy] <= 0) {
            arrayMap[i][j] = 1;
            enemyHP = deleteEmeny(enemyHP);
            render();
          } else {
            var hp = document.createElement("div");
            hp.className = "health";
            hp.style = `width: ${enemyHP[numberEnemy]}%`;
            div.appendChild(hp);
            div.id = numberEnemy;
            div.className = "tileE";
            numberEnemy++;
          }
        }
        if (arrayMap[i][j] === 4) {
          div.className = "tileSW";
        }
        if (arrayMap[i][j] === 5) {
          div.className = "tileHP";
        }
        fieldContainer.append(div);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var game = new Game();
  game.init();
});
