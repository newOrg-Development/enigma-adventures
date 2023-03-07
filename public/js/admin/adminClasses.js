class Game {
  constructor(_teamName, _teamEmail, _puzzleCount) {
    this.teamName = _teamName;
    this.teamEmail = _teamEmail;
    this.startTime = new Date().getTime();
    this.finishTime = "initialised";
    this.hintsUsed = new Array(_puzzleCount).fill(7);
    this.puzzleCount = new Array(_puzzleCount).fill(7);
  }

  startGame() {
    this.startTime = new Date().getTime();
    this.finishTime = "running";
    googleController.saveNewGame(this).then(() => {});
  }

  delGame() {
    googleController.delGame(this.uuid).then(() => {});
  }

  async endGame() {
    if (this.finishTime === "running") {
      console.log("this.finishTime", this.finishTime);
      this.finishTime = new Date().getTime();
      await googleController.saveGame(this).then(() => {});
      let newLeaderboardEntry = new LeaderboardEntry();

      return this.finishTime.toString();
    } else {
      return "false";
    }
  }

  async getHintNumber(puzzleNumber) {
    puzzleNumber = parseInt(puzzleNumber);
    if (this.hintsUsed[puzzleNumber] <= 0) {
      return "false";
    } else {
      this.hintsUsed[puzzleNumber]--;
      googleController.saveGame(this).then(() => {});
      let hintNumber =
        parseInt(this.puzzleCount[puzzleNumber]) -
        parseInt(this.hintsUsed[puzzleNumber]);
      return hintNumber;
    }
  }

  async loadGame(uuid) {
    let loadedGame = await googleController.loadGame(uuid);
    Object.keys(loadedGame).forEach((item) => {
      this[item] = loadedGame[item];
    });
  }

  printGame() {
    console.log("Game Data for ", this.uuid, this); //console out!
  }
}

class LeaderboardEntry extends Game {
  constructor(_game) {
    super("", "", 0);
    Object.keys(_game).forEach((item) => {
      this[item] = _game[item];
    });
  }

  async checkForLeader() {
    this.finishTime = 2;
    let leaderboard = await googleController.getLeaderboard();

    let leadBreaker = false;
    leaderboard.forEach((leader, index) => {
      if (
        parseInt(this.finishTime) <= parseInt(leader.finishTime) &&
        leadBreaker === false
      ) {
        leaderboard.splice(index, 0, this);
        leadBreaker = true;
        googleController.updateLeaderboard(leaderboard).then(() => {});
      }
    });
  }

  printLeaderboard() {
    console.log("Leaderboard Data ", this);
  }
}

export class GameStructure {
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

  saveHintTree() {
    let newOjb = { gameName: this.gameName, puzzleArray: this.hintTree };
    googleController.getGameHints().then((gameHintsData) => {
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
      googleController
        .saveGameHints(JSON.stringify(gameHintsData))
        .then((data) => {});
    });
  }

  printTree() {
    console.log("tree", this.hintTree);
  }
}
