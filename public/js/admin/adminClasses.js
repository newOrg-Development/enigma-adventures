// const { google } = require("googleapis");
// const { v4: uuidv4 } = require("uuid");
// const googleController = require("./routes/Class_googleContoller.js");
// // class MyReadable extends Rectangle {
//   constructor(options) {
//     super(options);
//   }

//   _read() {
//     this.push("hello world");
//     this.push(null);
//   }
// }

//51c47bfb-360c-4472-85c4-2e511f446947;jonkers;bo@seven.com;0,1,2,1,0,0,3,0;1677744685150

//bfc16610-2e40-45a1-ae4f-91a9e219448e;chckers;too@dot.com;;1677833054549&&51c47bfb-360c-4472-85c4-2e511f446947;jonkers;bo@seven.com;0,1,2,1,0,0,3,0;1677744685150&&101c9133-8d4e-4032-b645-7c6375bcf618;Craigerrrr;tcraigscott@gmail.com;[];01677625887893&&e1fb5c0c-3336-4230-9d6b-3a957a161182;3teamName3;email3@address3.com;[];01677609645846&&9ad96a64-e06b-4f81-ae91-6960cc116e58;2teamName2;email2@address2.com;[];1677609631415&&479e4bc6-a8ef-426b-9975-58a0c1d9b00f;teamName;email@address.com;[];1677609613664

class Game {
  constructor(_teamName, _teamEmail, _puzzleCount) {
    // this.uuid = uuidv4();
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

let leaderboard = new LeaderboardEntry(
  JSON.parse(
    '{"uuid":"56b4fba5-ed94-463c-9b84-becf8e56f045","teamName":"jonkers","teamEmail":"tel@email.com","startTime":1677839445822,"finishTime":1677884416947,"hintsUsed":[6,7,7,7,7,7,7]}'
  )
);

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
      //search data arr for game name
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

// export class GameStore extends HintTree {
//   constructor(_gameStore) {
//     super();
//     // Object.keys(_game).forEach((item) => {
//     //   this[item] = _game[item];
//     // });
//     // console.log("gamestore", _gameStore);
//     this.gameName = _gameStore.gameName;
//     // this.puzzleArray = _gameStore.puzzleArray;
//     //  console.log("gamestore", this.puzzleArray);
//     //  GameStore.prototype.populateHintTree(this.puzzleArray);
//   }
//}

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

//module.exports = { Game, LeaderboardEntry, HintTree };
