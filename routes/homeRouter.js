const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");
const googleController = require("./googleContoller.js");
const { Game, GameStructure, LeaderboardEntry } = require("../gameClass");

let currentGames = [];
googleController.getGameHints().then((data) => {
  let parsedData = JSON.parse(data);
  parsedData.forEach((game) => {
    let gameStructure = new GameStructure(game);
    currentGames.push(gameStructure);
  });
});

router.get("/clue", (req, res) => {
  if (req.session.uuid) {
    async function getClues() {
      const auth = new google.auth.GoogleAuth({
        keyFilename: "driveCreds.json",
        scopes: ["https://www.googleapis.com/auth/drive.readonly"],
      });
      const authClient = await auth.getClient();
      const drive = google.drive({
        version: "v2",
        auth: authClient,
      });
      let filesList = await drive.files.list({
        q: `'${"1quubXDC_7Uktspcp-Cjrja1Iwbj3wcBm"}' in parents`,
      });
      let fileItems = filesList.data.items;
      let webContentLinkArray = [];
      fileItems.forEach((fileItem) => {
        let linkPair = [];
        linkPair.push(fileItem.title);
        linkPair.push(fileItem.embedLink);
        webContentLinkArray.push(linkPair);
      });
      return webContentLinkArray;
    }
    getClues().then((cluesArray) => {
      res.send(cluesArray);
    });
  } else {
    res.send("false");
  }
});

router.post("/getHint", (req, res) => {
  let uuid = req.body.uuid;
  let gameId = parseInt(req.body.gameId);
  let puzzleNum = parseInt(req.body.puzzleNum);
  let game = new Game();
  game.loadGame(uuid).then((data) => {
    game.getHintNumber(puzzleNum).then((hintNum) => {
      if (hintNum === "false") {
        res.send("false");
      } else {
        googleController.getGameHints().then((data) => {
          let parsedData = JSON.parse(data);
          let gameStructure = new GameStructure(parsedData[gameId]);
          let clueCount = gameStructure.getClueCountArr();

          let hint = gameStructure.getHint(puzzleNum - 1, hintNum - 1);
          console.log(
            "gameStructure " + JSON.stringify(gameStructure),
            "hintNum " + hintNum,
            "puzzleNum " + puzzleNum,
            "gameId " + gameId
          );
          res.send(hint);
        });
      }
    });
  });
});

router.post("/gameEnd", (req, res) => {
  let uuid = req.body.uuid;
  let finishedGame = new Game();
  finishedGame.loadGame(uuid).then(() => {
    let claimedFinishTime = req.body.timestamp; //in Case server lags
    finishedGame.endGame().then((finishResults) => {
      let leaderBoardCheck = new LeaderboardEntry(finishedGame);
      leaderBoardCheck.checkForLeader(finishResults).then(() => {
        res.send(finishResults);
      });
    });
  });
});
router.post("/signUp", (req, res) => {
  currentGames[parseInt(req.body.gameNumber)].printTree();
  if (req.body.teamName && req.body.teamEmail) {
    let game = new Game(
      req.body.teamName,
      req.body.teamEmail,

      currentGames[parseInt(req.body.gameNumber)].getClueCountArr()
    );
    game.startGame();
    let msg = {};
    msg.uuid = game.uuid;
    msg.env = process.env.NODE_ENV;
    res.send(msg);
  } else {
    res.send("failed");
  }
});

module.exports = router;
