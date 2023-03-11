const { v4: uuidv4 } = require("uuid");
const mongoController = require("../mongoController.js");

class Game {
  constructor(_teamName, _teamEmail, _puzzleCount) {
    this.uuid = uuidv4();
    this.teamName = _teamName;
    this.teamEmail = _teamEmail;
    this.startTime = new Date().getTime();
    this.finishTime = "initialised";
    this.hintsAvailable = _puzzleCount;
    this.puzzleCount = _puzzleCount;
    this.hintsUsed = [];
  }

  startGame() {
    this.startTime = new Date().getTime();
    this.finishTime = "running";
    mongoController.saveGame(this).then(() => {});
  }

  async saveGame() {
    await mongoController.saveGame(this);
  }

  async loadGame(uuid) {
    let loadedGame = await mongoController.loadGame(uuid);
    Object.keys(loadedGame).forEach((item) => {
      this[item] = loadedGame[item];
    });
  }

  delGame() {
    mongoController.delGame(this.uuid).then(() => {});
  }

  async endGame() {
    if (this.finishTime === "running") {
      this.finishTime = "finished";
      this.finishTime = new Date().getTime();

      for (let i = 0; i < this.hintsAvailable.length; i++) {
        const el = Math.abs(
          (this.hintsAvailable[i] || 0) - (this.puzzleCount[i] || 0)
        );
        this.hintsUsed[i] = el;
      }
      return this.finishTime.toString();
    } else {
      return "false";
    }
  }

  async getHintNumber(puzzleNumber) {
    puzzleNumber = parseInt(puzzleNumber);
    if (this.hintsAvailable[puzzleNumber] <= 0) {
      return "false";
    } else {
      this.hintsAvailable[puzzleNumber]--;
      mongoController.saveGame(this).then(() => {});
      let hintNumber =
        parseInt(this.puzzleCount[puzzleNumber]) -
        parseInt(this.hintsAvailable[puzzleNumber]);
      return hintNumber;
    }
  }

  printGame() {
    console.log("Game Data for ", this.uuid, this); //console out!
  }
}

class LeaderboardEntry extends Game {
  constructor(_game) {
    super("", "", 0);
    if (_game) {
      Object.keys(_game).forEach((item) => {
        this[item] = _game[item];
      });
    }
  }

  async checkForLeader(_finishTime) {
    this.finishTime = _finishTime;
    let timeTaken = parseInt(this.finishTime) - parseInt(this.startTime);
    let leaderboard = await mongoController.loadLeaderBoard();
    let leaderMaker = false;
    let leadBreaker = false;
    leaderboard.forEach((leader, index) => {
      let leaderTimeTaken =
        parseInt(leader.finishTime) - parseInt(leader.startTime);
      if (
        parseInt(timeTaken) <= parseInt(leaderTimeTaken) &&
        leadBreaker === false
      ) {
        leaderboard.splice(index, 0, this);
        leadBreaker = true;
        mongoController.saveLeaderBoard(leaderboard).then(() => {});
        leaderMaker = true;
      }
    });
    return leaderMaker;
  }

  async saveLeaderBoard() {
    await mongoController.saveLeaderBoard(this);
  }
  async loadLeaderBoard() {
    return await mongoController.loadLeaderBoard();
  }

  printLeaderboard() {
    console.log("Leaderboard Data ", this);
  }
}

class GameStructure {
  constructor(_game, _gameName) {
    if (_game === "newGame") {
      this.gameName = _gameName;
      this.hintTree = [[{ hint: "<empty>", qrCode: "<empty>" }]];
    } else {
      this.gameName = _game.gameName;
      this.hintTree = _game.hintTree;
    }
  }
  populatePuzzle(hintsArray, puzzleNumber) {
    for (let i = 0; i < hintsArray.length; i++) {
      let hint = hintsArray[i].hint || "<empty>";
      let qrCode = hintsArray[i].qrCode || "<empty>";
      let newOjb = { hint, qrCode };
      this.hintTree[puzzleNumber].push(newOjb);
    }
  }
  populateHintTree(hintTreeData) {
    this.gameName = hintTreeData.gameName;
    let puzzleStructureArr = hintTreeData.puzzleArray;
    for (let i = 0; i < puzzleStructureArr.length; i++) {
      this.hintTree.push([[]]);
      this.populatePuzzle(puzzleStructureArr[i], i);
    }
  }

  addPuzzle() {
    this.hintTree.push([]);
    this.populatePuzzle([[]], this.hintTree.length - 1);
  }

  delPuzzle(doomedPuzzle) {
    this.hintTree.splice(doomedPuzzle, 1);
  }
  addHint(puzzleNumber) {
    let hint = "<empty>";
    let qrCode = "<empty>";
    let newOjb = { hint, qrCode };
    this.hintTree[puzzleNumber].push(newOjb);
  }

  delHint(puzzleNumber, doomedHint) {
    this.hintTree[puzzleNumber].splice(doomedHint, 1);
  }

  getPuzzleCount() {
    return this.hintTree.length;
  }
  getHintCount(_puzzleNumber) {
    if (_puzzleNumber === undefined) {
      return this.hintTree.length;
    } else {
      return this.hintTree[_puzzleNumber].length;
    }
  }
  setHint(_puzzleNumber, _hintNumber, _hint) {
    this.hintTree[_puzzleNumber][_hintNumber].hint = _hint;
  }
  getHint(_puzzleNumber, _hintNumber) {
    return this.hintTree[_puzzleNumber][_hintNumber].hint;
  }
  setQrcode(_puzzleNumber, _hintNumber, _qrCode) {
    this.hintTree[_puzzleNumber][_hintNumber].qrCode = _qrCode;
  }
  getQrcode(_puzzleNumber, _hintNumber) {
    return this.hintTree[_puzzleNumber][_hintNumber].qrCode;
  }

  getPuzzleHintArray(_puzzleNumber) {
    return JSON.stringify(this.hintTree[_puzzleNumber]);
  }

  getClueCountArr() {
    let clueCount = [];
    for (let i = 0; i < this.getPuzzleCount(); i++) {
      clueCount.push(0);
      for (let j = 0; j < this.getHintCount(i); j++) {
        clueCount[i] += 1;
      }
    }

    return clueCount;
  }

  saveHintTree() {
    let newOjb = { gameName: this.gameName, puzzleArray: this.hintTree };
    mongoController.getGameHints().then((gameHintsData) => {
      gameHintsData = JSON.parse(gameHintsData);
      let breaker = false;
      gameHintsData.forEach((game, index) => {
        if (game.gameName === this.gameName && breaker === false) {
          gameHintsData.splice(index, 1);
          breaker = true;
          gameHintsData[i].push(newOjb);
        }
      });
      if (breaker === false) {
        gameHintsData.push(newOjb);
      }
      mongoController
        .saveGameHints(JSON.stringify(gameHintsData))
        .then((data) => {});
    });
  }

  printTree() {
    console.log("tree", this.hintTree);
  }
}

module.exports = { Game, LeaderboardEntry, GameStructure };
