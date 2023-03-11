//const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
//const { FinishedGame } = require("./models/game.models");
const {
  LeaderBoard,
  GameStructure,
  Game_mongo,
} = require("./models/game.models");
const uri =
  "mongodb+srv://nxtguser:0zZrhxLZ4tUvMvy7@cluster0.ijg3k.mongodb.net/?retryWrites=true&w=majority";

let servercreds = process.env.MONGO;
mongoose.connect(servercreds, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function saveLeaderBoard(leaderBoardSave) {
  const prevLbs = await LeaderBoard.deleteMany({});
  let leaderBoard = new LeaderBoard();
  leaderBoard.leaderBoard = leaderBoardSave;
  const result = await leaderBoard.save();
}
async function loadLeaderBoard() {
  const result = await LeaderBoard.find({});
  console.log("ack", result);
  return result[0].leaderBoard;
}

async function saveGame(gameobj) {
  let gameSave = new Game_mongo();
  const prevSave = await Game_mongo.findOne({ uuid: gameobj.uuid });

  if (prevSave) {
    prevSave.game = gameobj;
    prevSave.uuid = gameobj.uuid;
    const result = await prevSave.save();
  } else {
    gameSave.game = gameobj;
    gameSave.uuid = gameobj.uuid;
    const result = await gameSave.save();
  }
}
async function loadGame(gameUuid) {
  const result = await Game_mongo.find({
    uuid: gameUuid,
  });
  let game = result[0].game;
  return game;
}

async function loadAllGames(gameUuid) {
  const result = await Game_mongo.find();
  let games = [];
  result.forEach((item) => {
    games.push(item.game);
  });
  return JSON.stringify(games);
}

async function saveGameStructures(gameobj) {
  //   const result = await GameStructure.findOne({
  //     _id: "640b913bc40aafbf55579eaa",
  //   });
  const prevGameStructure = await GameStructure.deleteMany({});
  let gameStructure = new GameStructure();
  gameStructure.gameStructure = gameobj;
  gameStructure.save();
}
async function loadGameStructures() {
  const result = await GameStructure.find({}).limit(1).sort({ $natural: -1 });
  return result;
}

module.exports = {
  saveLeaderBoard,
  loadLeaderBoard,
  saveGame,
  loadGame,
  saveGameStructures,
  loadGameStructures,
  loadAllGames,
};
