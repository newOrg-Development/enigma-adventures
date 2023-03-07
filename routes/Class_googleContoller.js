const docs = require("@googleapis/docs");
const { google } = require("googleapis");

//googleCreds

let googleCreds = "";
if (process.env.NODE_ENV == "development") {
  googleCreds = "./credentials.json";
} else {
  googleCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
}

async function docer(input) {
  //https://docs.google.com/document/d/1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk/edit?usp=sharing

  const authClient = await auth.getClient();

  const client = await docs.docs({
    version: "v1",
    auth: authClient,
  });

  const createResponse = await client.documents.get({
    documentId: "1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk",
  });

  let upParsed = input + "&&";

  let updateObject = {
    documentId: "1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk",
    resource: {
      requests: [
        {
          insertText: {
            text: upParsed,
            location: {
              index: 1, // Modified
            },
          },
        },
      ],
    },
  };

  const texttoWrite = await client.documents.batchUpdate(updateObject);
}

async function getLeaderboard() {
  const auth = new docs.auth.GoogleAuth({
    keyFile: googleCreds,
    scopes: ["https://www.googleapis.com/auth/documents"],
  });
  const authClient = await auth.getClient();
  const client = await docs.docs({
    version: "v1",
    auth: authClient,
  });

  const createResponse = await client.documents.get({
    documentId: "1HNawNy2v4WrrOyVCSNH6MIjyzDBClPPaSgf-6mZZ-nw",
  });

  let fullText = "";
  createResponse.data.body.content[1].paragraph.elements.forEach((element) => {
    fullText += element.textRun.content;
  });
  //console.log(fullText);
  return JSON.parse(fullText);
}

async function updateLeaderboard(leadboardData) {
  const auth = new docs.auth.GoogleAuth({
    keyFile: googleCreds,
    scopes: ["https://www.googleapis.com/auth/documents"],
  });
  const authClient = await auth.getClient();

  const client = await docs.docs({
    version: "v1",
    auth: authClient,
  });

  const createResponse = await client.documents.get({
    documentId: "1HNawNy2v4WrrOyVCSNH6MIjyzDBClPPaSgf-6mZZ-nw",
  });
  let endIndex = createResponse.data.body.content[1].endIndex;

  const updateResponse = await client.documents.batchUpdate({
    documentId: "1HNawNy2v4WrrOyVCSNH6MIjyzDBClPPaSgf-6mZZ-nw",
    requestBody: {
      requests: [
        {
          deleteContentRange: {
            range: {
              segmentId: "",
              startIndex: 1,
              endIndex: endIndex - 1,
            },
          },
        },
        {
          insertText: {
            text: JSON.stringify(leadboardData),
            endOfSegmentLocation: {},
          },
        },
      ],
    },
  });
  return;
}

async function getGameStates() {
  //https://docs.google.com/document/d/1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk/edit?usp=sharing
  const auth = new docs.auth.GoogleAuth({
    //keyFilename: "credentials.json",
    keyFile: googleCreds,
    scopes: ["https://www.googleapis.com/auth/documents"],
  });
  const authClient = await auth.getClient();

  const client = await docs.docs({
    version: "v1",
    auth: authClient,
  });

  const createResponse = await client.documents.get({
    documentId: "1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk",
  });

  let fullText = "";
  createResponse.data.body.content[1].paragraph.elements.forEach((element) => {
    fullText += element.textRun.content;
  });
  return fullText;
}

async function updateGameStates(input) {
  const auth = new docs.auth.GoogleAuth({
    //keyFilename: "credentials.json",
    keyFile: googleCreds,
    scopes: ["https://www.googleapis.com/auth/documents"],
  });
  const authClient = await auth.getClient();

  const client = await docs.docs({
    version: "v1",
    auth: authClient,
  });

  const createResponse = await client.documents.get({
    documentId: "1m5BbeqhT7qZoNlzcBUmz-dMQySdsyXF7z7FH-md1b_0",
  });

  let endIndex = createResponse.data.body.content[1].endIndex;

  let allGames = "";
  createResponse.data.body.content[1].paragraph.elements.forEach((element) => {
    allGames += element.textRun.content;
  });
  //console.log("allGames: ", allGames);
  await client.documents.batchUpdate({
    documentId: "1m5BbeqhT7qZoNlzcBUmz-dMQySdsyXF7z7FH-md1b_0",
    requestBody: {
      requests: [
        {
          deleteContentRange: {
            range: {
              segmentId: "",
              startIndex: 1,
              endIndex: endIndex,
            },
          },
        },
        {
          insertText: {
            text: input,
            endOfSegmentLocation: {},
          },
        },
      ],
    },
  });

  return;
}

async function loadGame(uuidToLoad) {
  let loadData = {};

  const auth = new docs.auth.GoogleAuth({
    keyFile: googleCreds,
    scopes: ["https://www.googleapis.com/auth/documents"],
  });
  const authClient = await auth.getClient();

  const client = await docs.docs({
    version: "v1",
    auth: authClient,
  });

  const createResponse = await client.documents.get({
    documentId: "1m5BbeqhT7qZoNlzcBUmz-dMQySdsyXF7z7FH-md1b_0",
  });

  let allGames =
    createResponse.data.body.content[1].paragraph.elements[0].textRun.content;
  let gamesBool = false;

  allGames = JSON.parse(allGames);
  allGames.forEach((game, index) => {
    if (uuidToLoad === game.uuid) {
      loadData = allGames[index];
      gamesBool = true;
    }
  });

  return loadData;
}

async function saveGame(saveGame) {
  const auth = new docs.auth.GoogleAuth({
    //keyFilename: "credentials.json",
    keyFile: googleCreds,
    scopes: ["https://www.googleapis.com/auth/documents"],
  });
  const authClient = await auth.getClient();

  const client = await docs.docs({
    version: "v1",
    auth: authClient,
  });

  const createResponse = await client.documents.get({
    documentId: "1m5BbeqhT7qZoNlzcBUmz-dMQySdsyXF7z7FH-md1b_0",
  });

  let endIndex = createResponse.data.body.content[1].endIndex;
  let allGames =
    createResponse.data.body.content[1].paragraph.elements[0].textRun.content;
  let gamesBool = false;

  allGames = JSON.parse(allGames);
  allGames.forEach((game, index) => {
    if (saveGame.uuid === game.uuid && gamesBool === false) {
      allGames[index] = saveGame;
      gamesBool = true;
    }
  });

  await client.documents.batchUpdate({
    documentId: "1m5BbeqhT7qZoNlzcBUmz-dMQySdsyXF7z7FH-md1b_0",
    requestBody: {
      requests: [
        {
          deleteContentRange: {
            range: {
              segmentId: "",
              startIndex: 1,
              endIndex: endIndex - 1,
            },
          },
        },
        {
          insertText: {
            text: JSON.stringify(allGames),
            endOfSegmentLocation: {},
          },
        },
      ],
    },
  });

  return;
}

async function saveNewGame(newGame) {
  const auth = new docs.auth.GoogleAuth({
    //keyFilename: "credentials.json",
    keyFile: googleCreds,
    scopes: ["https://www.googleapis.com/auth/documents"],
  });
  const authClient = await auth.getClient();

  const client = await docs.docs({
    version: "v1",
    auth: authClient,
  });

  const createResponse = await client.documents.get({
    documentId: "1m5BbeqhT7qZoNlzcBUmz-dMQySdsyXF7z7FH-md1b_0",
  });

  let endIndex = createResponse.data.body.content[1].endIndex;
  let allGamesData = "";
  allGamesData =
    createResponse.data.body.content[1].paragraph.elements[0].textRun.content;
  // createResponse.data.body.content[1].paragraph.elements.forEach((element) => {
  //   allGamesData += element.textRun.content;
  // });
  //console.log("allGamesData: ", allGamesData, allGamesData.length);
  let allGames = JSON.parse(allGamesData);

  allGames.push(newGame);
  await client.documents.batchUpdate({
    documentId: "1m5BbeqhT7qZoNlzcBUmz-dMQySdsyXF7z7FH-md1b_0",
    requestBody: {
      requests: [
        {
          deleteContentRange: {
            range: {
              segmentId: "",
              startIndex: 1,
              endIndex: endIndex - 1,
            },
          },
        },
        {
          insertText: {
            text: JSON.stringify(allGames),
            endOfSegmentLocation: {},
          },
        },
      ],
    },
  });

  return;
}

async function delGame(doomedGame) {
  const auth = new docs.auth.GoogleAuth({
    //keyFilename: "credentials.json",
    keyFile: googleCreds,
    scopes: ["https://www.googleapis.com/auth/documents"],
  });
  const authClient = await auth.getClient();

  const client = await docs.docs({
    version: "v1",
    auth: authClient,
  });

  const createResponse = await client.documents.get({
    documentId: "1m5BbeqhT7qZoNlzcBUmz-dMQySdsyXF7z7FH-md1b_0",
  });

  let endIndex = createResponse.data.body.content[1].endIndex;
  // console.log(
  //   "endIndex: ",
  //   createResponse.data.body.content[1].paragraph.elements.length
  // );

  let allGames = "";
  createResponse.data.body.content[1].paragraph.elements.forEach((element) => {
    allGames += element.textRun.content;
  });
  let gamesBool = false;

  allGames = JSON.parse(allGames);
  allGames.forEach((game, index) => {
    if (game.uuid === doomedGame) {
      allGames.splice(index, 1);
      gamesBool = true;
    }
  });
  if (gamesBool) {
    await client.documents.batchUpdate({
      documentId: "1m5BbeqhT7qZoNlzcBUmz-dMQySdsyXF7z7FH-md1b_0",
      requestBody: {
        requests: [
          {
            deleteContentRange: {
              range: {
                segmentId: "",
                startIndex: 1,
                endIndex: endIndex - 1,
              },
            },
          },
          {
            insertText: {
              text: JSON.stringify(allGames),
              endOfSegmentLocation: {},
            },
          },
        ],
      },
    });

    return "deleted";
  } else {
    return "not found";
  }
}

async function endGame(finishedGame) {
  const auth = new docs.auth.GoogleAuth({
    //keyFilename: "credentials.json",
    keyFile: googleCreds,
    scopes: ["https://www.googleapis.com/auth/documents"],
  });
  const authClient = await auth.getClient();

  const client = await docs.docs({
    version: "v1",
    auth: authClient,
  });

  const createResponse = await client.documents.get({
    documentId: "1m5BbeqhT7qZoNlzcBUmz-dMQySdsyXF7z7FH-md1b_0",
  });

  let endIndex = createResponse.data.body.content[1].endIndex;

  let allGames = "";
  createResponse.data.body.content[1].paragraph.elements.forEach((element) => {
    allGames += element.textRun.content;
  });
  let gamesBool = false;

  allGames = JSON.parse(allGames);
  allGames.forEach((game, index) => {
    if (game.uuid === finishedGame) {
      allGames[index].finishedTime = new Date().getTime();
      gamesBool = true;
    }
  });
  if (gamesBool) {
    await client.documents.batchUpdate({
      documentId: "1m5BbeqhT7qZoNlzcBUmz-dMQySdsyXF7z7FH-md1b_0",
      requestBody: {
        requests: [
          {
            deleteContentRange: {
              range: {
                segmentId: "",
                startIndex: 1,
                endIndex: endIndex - 1,
              },
            },
          },
          {
            insertText: {
              text: JSON.stringify(allGames),
              endOfSegmentLocation: {},
            },
          },
        ],
      },
    });

    return "deleted";
  } else {
    return "not found";
  }
}

async function saveGameHints(input) {
  //[[["g1p1h1","g1p1h2"],["g1p2h1","g1p2h2"]],[["g2p1h1","g2p1h2"],["g2p2h1","g2p2h2"]],[["g3p1h1","g3p1h2"],["g3p2h1","g3p2h2"]]]
  const auth = new docs.auth.GoogleAuth({
    //keyFilename: "credentials.json",
    keyFile: googleCreds,
    scopes: ["https://www.googleapis.com/auth/documents"],
  });
  const authClient = await auth.getClient();

  const client = await docs.docs({
    version: "v1",
    auth: authClient,
  });

  const createResponse = await client.documents.get({
    documentId: "1Le8FKzt_BdJ_OAboPQ7Sqgu8sQ5O8aD4GF9e9el1000",
  });

  let endIndex = createResponse.data.body.content[1].endIndex;

  const updateResponse = await client.documents.batchUpdate({
    documentId: "1Le8FKzt_BdJ_OAboPQ7Sqgu8sQ5O8aD4GF9e9el1000",
    requestBody: {
      requests: [
        {
          deleteContentRange: {
            range: {
              segmentId: "",
              startIndex: 1,
              endIndex: endIndex - 1,
            },
          },
        },
        {
          insertText: {
            text: input,
            // endOfSegmentLocation: {},
            location: {
              index: 1,
            },
          },
        },
      ],
    },
  });

  return;
}

async function getGameHints() {
  //https://docs.google.com/document/d/1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk/edit?usp=sharing
  const auth = new docs.auth.GoogleAuth({
    //keyFilename: "credentials.json",
    keyFile: googleCreds,
    scopes: ["https://www.googleapis.com/auth/documents"],
  });
  const authClient = await auth.getClient();

  const client = await docs.docs({
    version: "v1",
    auth: authClient,
  });

  const createResponse = await client.documents.get({
    documentId: "1Le8FKzt_BdJ_OAboPQ7Sqgu8sQ5O8aD4GF9e9el1000",
  });

  let fullText = "";
  createResponse.data.body.content[1].paragraph.elements.forEach((element) => {
    fullText += element.textRun.content;
  });
  return fullText;
}

module.exports = {
  docer,
  getLeaderboard,
  updateLeaderboard,
  getGameStates,
  updateGameStates,
  saveGameHints,
  getGameHints,
  saveNewGame,
  delGame,
  saveGame,
  loadGame,
  endGame,
};
