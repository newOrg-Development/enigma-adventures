const docs = require("@googleapis/docs");
const { google } = require("googleapis");
//googleCreds
let googleCreds = process.env.GOOGLE_CREDS;
async function docer(input) {
  //https://docs.google.com/document/d/1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk/edit?usp=sharing
  const auth = new docs.auth.GoogleAuth({
    //keyFilename: "credentials.json",
    keyFilename: googleCreds,
    // Scopes can be specified either as an array or as a single, space-delimited string.
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
  //https://docs.google.com/document/d/1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk/edit?usp=sharing
  const auth = new docs.auth.GoogleAuth({
    //keyFilename: "credentials.json",
    keyFilename: googleCreds,
    // Scopes can be specified either as an array or as a single, space-delimited string.
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

  console.log("here here here ", createResponse.data.body.content[1]);
  let fullText = "";
  createResponse.data.body.content[1].paragraph.elements.forEach((element) => {
    fullText += element.textRun.content;
  });

  return fullText;
}

async function updateLeaderboard(input) {
  //https://docs.google.com/document/d/1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk/edit?usp=sharing
  const auth = new docs.auth.GoogleAuth({
    //keyFilename: "credentials.json",
    keyFilename: googleCreds,
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
  let textInput = "";
  for (let i = 0; i < input.length; i++) {
    if (i != input.length - 1 && input[i] != "") {
      textInput += input[i] + "&&";
    } else {
      textInput += input[i];
    }
  }
  const updateResponse = await client.documents.batchUpdate({
    documentId: "1HNawNy2v4WrrOyVCSNH6MIjyzDBClPPaSgf-6mZZ-nw",
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
            text: textInput,
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
    keyFilename: googleCreds,
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

  console.log("here here here ", createResponse.data.body.content[1]);
  let fullText = "";
  createResponse.data.body.content[1].paragraph.elements.forEach((element) => {
    fullText += element.textRun.content;
  });
  return fullText;
}

async function updateGameStates(input) {
  const auth = new docs.auth.GoogleAuth({
    //keyFilename: "credentials.json",
    keyFilename: googleCreds,
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

  let endIndex = createResponse.data.body.content[1].endIndex;
  let textInput = "";
  for (let i = 0; i < input.length; i++) {
    if (i != input.length - 1 && input[i] != "") {
      textInput += input[i] + "&&";
    } else {
      textInput += input[i];
    }
  }
  const updateResponse = await client.documents.batchUpdate({
    documentId: "1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk",
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
            text: textInput,
            endOfSegmentLocation: {},
          },
        },
      ],
    },
  });

  return;
}

module.exports = {
  docer,
  getLeaderboard,
  updateLeaderboard,
  getGameStates,
  updateGameStates,
};
