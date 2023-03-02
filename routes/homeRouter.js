const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");
const googleController = require("./googleContoller.js");

// https://localhost:3000/magicLink?uuid=95b29f81-b57c-4ce0-a72c-4cb2ae9323f0
//  {"cookie":{"originalMaxAge":86400000,"expires":"2023-02-28T19:29:48.185Z",
// "httpOnly":true,"path":"/"},"teamName":"joger","teamEmail":"ste.pend@rcom",
// "timestamp":"1677526206150","cluesUsed":0,"uuid":"95b29f81-b57c-4ce0-a72c-4cb2ae9323f0",
// "env":"development"}
let gameStates = [];
let currentGames = [];
googleController.getGameHints().then((data) => {
  gameStates = data.split("@@");
  currentGames = gameStates[0].split("&&");
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
      //'1E7o8MhhCF9al7htnPtryJvnjbFNBWMnd
      let filesList = await drive.files.list({
        // fileId: "1E7o8MhhCF9al7htnPtryJvnjbFNBWMnd",
        q: `'${"1quubXDC_7Uktspcp-Cjrja1Iwbj3wcBm"}' in parents`,
        // alt: "media",
        // fields: "webContentLink",
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
  let currentGameArr = currentGames[parseInt(req.body.gameNum)];
  let currentGame = JSON.parse(currentGameArr.split(";;")[1]);
  let puzzleId = parseInt(req.body.puzzleId);
  let uuid = req.body.uuid;

  console.log(
    "currentGame: ",
    currentGame + " puzzleId: " + puzzleId + " uuid: " + uuid
  );
  let gameHintsUsed = "";
  if (uuid) {
    googleController.getGameStates().then((data) => {
      let newGameStates = [];
      newGameStates = data.split("&&");

      data.split("&&").forEach((gameState, index) => {
        if (gameState.includes(uuid)) {
          let gameStateParams = gameState.split(";");
          let newGameStateParams = "";
          gameStateParams.forEach((param, index2) => {
            if (index2 != 3) {
              if (gameStateParams.length - 1 == index2) {
                newGameStateParams += param;
              } else {
                newGameStateParams += param + ";";
              }
              newGameStates[index] = newGameStateParams;
            } else {
              let newParam = [];
              console.log("param: ", param);
              param = param.split(",");
              if (param.length == 1) {
                for (let i = 0; i < currentGame.length; i++) {
                  console.log("i: ", i);
                  newParam.push(0);
                }
                newParam[puzzleId] = 1;
              } else {
                param[puzzleId] = parseInt(param[puzzleId]) + 1;
                newParam = param;
              }

              gameHintsUsed = newParam;
              console.log("gameHintsUsed/param: ", gameHintsUsed);
              newGameStateParams += newParam + ";";
              newGameStates[index] = newGameStateParams;
              googleController.updateGameStates(newGameStates);
            }
          });
          async function getGameHint(puzzleNum, gameHintNum, game) {
            console.log(
              "puzzleNum: ",
              puzzleNum + " gameHintNum: " + gameHintNum + " game: " + game
            );
            // let tempGamer = game.split(";;");
            // console.log("tempGamer ", tempGamer);
            let puzzleArr = game;
            if (gameHintNum > puzzleArr[puzzleNum].length) {
              return "No more hints available";
            } else {
              let hint = puzzleArr[puzzleNum][gameHintNum - 1];
              console.log("hint: ", hint);
              let hintSplit = hint.split(",");
              return hintSplit[0];
            }
          }
          console.log("gameHintsUsed: ", gameHintsUsed);

          getGameHint(puzzleId, gameHintsUsed[puzzleId], currentGame).then(
            (data) => {
              //console.log(currentGames);
              res.send(data);
            }
          );
        }
      });
    });
  }
});

router.post("/gameEnd", (req, res) => {
  let uuid = req.body.uuid;
  let timestamp = req.body.timestamp;
  let teamName = req.body.teamName;
  let cluesUsed = req.body.cluesUsed;
  googleController.getGameStates().then((data) => {
    let newGameStates = [];
    let gameStart = timestamp;
    let gameEnd = Date.now();
    let gameDuration = gameEnd - gameStart;
    let seconds = Math.floor(((gameDuration % 360000) % 60000) / 1000); // 1 Second = 1000 Milliseconds
    newGameStates = data.split("&&");
    let newLeaderboardEntry = teamName + ";" + cluesUsed + ";" + seconds;
    googleController.getLeaderboard().then((leaderboardData) => {
      leaderboardData = leaderboardData.split("&&");
      let tempLeaderChange = "";
      let breaker = false;
      leaderboardData.forEach((leaderboardEntry, index) => {
        let leaderboardEntryParams = leaderboardEntry.split(";");
        if (seconds < parseInt(leaderboardEntryParams[2]) && breaker == false) {
          tempLeaderChange = index;
        }
      });
      leaderboardData.splice(tempLeaderChange, 1);
      leaderboardData.splice(tempLeaderChange, 0, newLeaderboardEntry);
      googleController.updateLeaderboard(leaderboardData);
    });

    data.split("&&").forEach((gameState, index) => {
      if (gameState.includes(uuid)) {
        newGameStates[index] = "";
        googleController.updateGameStates(newGameStates);
      }
    });
  });
});

router.post("/signUp", (req, res) => {
  if (req.body.teamName && req.body.teamEmail) {
    req.session.teamName = req.body.teamName;
    req.session.teamEmail = req.body.teamEmail;
    req.session.timestamp = req.body.timestamp;
    req.session.cluesUsed = [];
    let uuid = uuidv4();
    req.session.uuid = uuid;
    req.session.env = process.env.NODE_ENV;
    googleController.docer(
      uuid +
        ";" +
        req.body.teamName +
        ";" +
        req.body.teamEmail +
        ";" +
        req.session.cluesUsed +
        ";" +
        req.body.timestamp
    );
    res.send(req.session);
  } else {
    res.send("Invalid Email or Team Name");
  }
});

module.exports = router;
