const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");
const googleController = require("./routes/Class_googleContoller.js");

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
    googleController.saveNewGame(this).then(() => {});
  }

  delGame() {
    googleController.delGame(this.uuid).then(() => {});
  }

  async endGame() {
    if (this.finishTime === "running") {
      console.log("this.finishTime", this.finishTime);
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
      googleController.saveGame(this).then(() => {});
      let hintNumber =
        parseInt(this.puzzleCount[puzzleNumber]) -
        parseInt(this.hintsAvailable[puzzleNumber]);
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
    if (_game) {
      Object.keys(_game).forEach((item) => {
        this[item] = _game[item];
      });
    }
  }

  async checkForLeader(_finishTime) {
    this.finishTime = _finishTime;
    let leaderboard = await googleController.getLeaderboard();
    let leaderMaker = false;
    let leadBreaker = false;
    leaderboard.forEach((leader, index) => {
      if (
        parseInt(this.finishTime) <= parseInt(leader.finishTime) &&
        leadBreaker === false
      ) {
        leaderboard.splice(index, 0, this);
        leadBreaker = true;
        googleController.updateLeaderboard(leaderboard).then(() => {});
        leaderMaker = true;
      }
    });
    return leaderMaker;
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
    console.log("getClueCountArr");
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

// class HintTree {
//   constructor() {
//     this.gameName = "";
//     this.puzzleCount = 0;
//     this.hintTree = [];
//   }
//   populatePuzzle(hintsArray, puzzleNumber) {
//     for (let i = 0; i < hintsArray; i++) {
//       // const element = array[hintsArray];
//       // hintsArray.forEach((hint) => {
//       let newOjb = { hint: "", qrCode: i };
//       this.hintTree[puzzleNumber].push(newOjb);
//       // });
//     }
//   }
//   populateHintTree(puzzleStructureArr) {
//     for (let i = 0; i < puzzleStructureArr.length; i++) {
//       this.hintTree.push([]);
//       this.populatePuzzle(puzzleStructureArr[i], i);
//     }
//   }

//   // addHint(hint, puzzleNumber, hintNumber){
//   //     this.hintTree[puzzleNumber][hintNumber][this.hintTree[puzzleNumber][hintNumber].indexof()].push(hint);
//   // }

//   getPuzzleCount() {
//     return this.hintTree.length;
//   }
//   getHintCount(_puzzleNumber) {
//     if (_puzzleNumber === undefined) {
//       return this.hintTree.length;
//     } else {
//       return this.hintTree[_puzzleNumber].length;
//     }
//   }
//   setHint(_puzzleNumber, _hintNumber, _hint) {
//     this.hintTree[_puzzleNumber][_hintNumber].hint = _hint;
//   }
//   getHint(_puzzleNumber, _hintNumber, _hint) {
//     return this.hintTree[_puzzleNumber][_hintNumber].hint;
//   }
//   setQrcode(_puzzleNumber, _hintNumber, _qrCode) {
//     this.hintTree[_puzzleNumber][_hintNumber].qrCode = _qrCode;
//   }
//   getQrcode(_puzzleNumber, _hintNumber, _hint) {
//     return this.hintTree[_puzzleNumber][_hintNumber].qrCode;
//   }

//   getPuzzleHintArray(_puzzleNumber) {
//     return JSON.stringify(this.hintTree[_puzzleNumber]);
//   }
//   loadHintTree(_gameName) {
//     googleController.getGameHints(_gameName).then((data) => {
//       data = JSON.parse(data);
//       //search data arr for game name
//       let breaker = false;
//       data.forEach((game) => {
//         if (game.gameName === _gameName && breaker === false) {
//           this.hintTree = game.puzzleArray;
//           //this.printTree();
//           breaker = true;
//         }
//       });
//     });
//   }
//   saveHintTree() {
//     let newOjb = { gameName: this.gameName, puzzleArray: this.hintTree };
//     googleController.getGameHints().then((gameHintsData) => {
//       gameHintsData = JSON.parse(gameHintsData);
//       //search data arr for game name
//       let breaker = false;
//       gameHintsData.forEach((game, index) => {
//         if (game.gameName === this.gameName && breaker === false) {
//           gameHintsData.splice(index, 1);
//           breaker = true;
//           gameHintsData[i].push(newOjb);
//         }
//       });
//       if (breaker === false) {
//         gameHintsData.push(newOjb);
//       }
//       googleController
//         .saveGameHints(JSON.stringify(gameHintsData))
//         .then((data) => {});
//     });
//   }

//   printTree() {
//     console.log("tree", this.hintTree);
//   }
// }

// let gameHintTree = new HintTree();
// gameHintTree.setGameName("test");
// let array = [2, 3, 4, 5, 6, 7, 8];
// gameHintTree.populateHintTree(array);
// // console.log("hintcount", gameHintTree.getHintCount(6));
// // console.log("puzzlecount", gameHintTree.getPuzzleCount());
// // console.log("name", gameHintTree.getName());
// gameHintTree.setHint(0, 0, "hint 0 0");
// //console.log("hint 0 0", gameHintTree.getHint(0, 0));
// gameHintTree.setHint(0, 1, "hint 0 1");
// //console.log(" getPuzzleHintArray(0)", gameHintTree.getPuzzleHintArray(0));

// gameHintTree.loadHintTree("craigsGame");
// //console.log("hint 0 0", gameHintTree.getHint(0, 0));
// //gameHintTree.printTree();
// gameHintTree.setHint(0, 1, "boongiE");
// //gameHintTree.saveHintTree();

// // leaderboard.printLeaderboard();
// leaderboard.checkForLeader();

module.exports = { Game, LeaderboardEntry, GameStructure };
