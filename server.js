const express = require("express");
const app = express();
const https = require("https");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const result = dotenv.config("./.env");
const fs = require("fs");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
var env = process.env.NODE_ENV;
console.log(`env is ${env}`);
const docs = require("@googleapis/docs");
const { google } = require("googleapis");
const { Blob } = require("node:buffer");
const fetch = require("node-fetch"); // To pipe received image back to caller
const cors = require("cors");
var request = require("request").defaults({ encoding: null });
const axios = require("axios");
//const stream = require("stream"); // Added
const { Readable } = require("stream");
//clues link
//https://drive.google.com/drive/folders/1Pc5zamgYqkDYvIRL1jQGmHDp57bxg_tC?usp=share_link

async function driver() {
  //https://docs.google.com/document/d/1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk/edit?usp=sharing
  const auth = new google.auth.GoogleAuth({
    keyFilename: "driveCreds.json",
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  const authClient = await auth.getClient();

  // const client = await docs.docs({
  //   version: "v3",
  //   auth: authClient,
  // });
  const drive = google.drive({
    version: "v2",
    auth: authClient,
  });

  //https://drive.google.com/drive/folders/1Pc5zamgYqkDYvIRL1jQGmHDp57bxg_tC

  let filesList = await drive.files.list({
    fileId: "17Ma6k5lJ7bJ8FrVM-AMNqXhGs49Bwl4T",
    // alt: "media",
    //fields: "id,name",
  });
  console.log(filesList.data.items[0].downloadUrl);

  dlUrl = filesList.data.items[0].downloadUrl;
  //dowlnoad file from dlUrl link
  return "test";
}
//driver();

async function docer(input) {
  //https://docs.google.com/document/d/1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk/edit?usp=sharing
  const auth = new docs.auth.GoogleAuth({
    keyFilename: "credentials.json",
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
    keyFilename: "credentials.json",
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
  //   return createResponse.data.body.content[1].paragraph.elements[0].textRun
  //     .content;

  // let upParsed = "&&" + input;

  // let updateObject = {
  //   documentId: "1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk",
  //   resource: {
  //     requests: [
  //       {
  //         insertText: {
  //           text: upParsed,
  //           location: {
  //             index: 1, // Modified
  //           },
  //         },
  //       },
  //     ],
  //   },
  // };

  // const texttoWrite = await client.documents.batchUpdate(updateObject);
}

async function updateLeaderboard(input) {
  //https://docs.google.com/document/d/1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk/edit?usp=sharing
  const auth = new docs.auth.GoogleAuth({
    keyFilename: "credentials.json",
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

  // console.log("!!!!!!", createResponse.data.body.content);
  let endIndex = createResponse.data.body.content[1].endIndex;
  let startIndex = createResponse.data.body.content[1].paragraph.elements[0];

  //  console.log("startIndex ", startIndex, "endIndex ", endIndex);
  // const createResponse = await client.documents.get({
  //   documentId: "1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk",
  // });
  //make input array into string
  let textInput = "";
  for (let i = 0; i < input.length; i++) {
    if (i != input.length - 1 && input[i] != "") {
      textInput += input[i] + "&&";
    } else {
      textInput += input[i];
    }
  }

  console.log("tester", textInput);
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

            // The first text inserted into the document must create a paragraph,
            // which can't be done with the `location` property.  Use the
            // `endOfSegmentLocation` instead, which assumes the Body if
            // unspecified.
            endOfSegmentLocation: {},
          },
        },
      ],
    },
  });

  // console
  //   .log
  //   (createResponse.data.body.content[1].paragraph.elements[0].textRun.content)

  return;
}

async function getGameStates() {
  //https://docs.google.com/document/d/1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk/edit?usp=sharing
  const auth = new docs.auth.GoogleAuth({
    keyFilename: "credentials.json",
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

  console.log("here here here ", createResponse.data.body.content[1]);
  let fullText = "";
  createResponse.data.body.content[1].paragraph.elements.forEach((element) => {
    fullText += element.textRun.content;
  });

  return fullText;
  //   return createResponse.data.body.content[1].paragraph.elements[0].textRun
  //     .content;

  // let upParsed = "&&" + input;

  // let updateObject = {
  //   documentId: "1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk",
  //   resource: {
  //     requests: [
  //       {
  //         insertText: {
  //           text: upParsed,
  //           location: {
  //             index: 1, // Modified
  //           },
  //         },
  //       },
  //     ],
  //   },
  // };

  // const texttoWrite = await client.documents.batchUpdate(updateObject);
}

async function updateGameStates(input) {
  //https://docs.google.com/document/d/1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk/edit?usp=sharing
  const auth = new docs.auth.GoogleAuth({
    keyFilename: "credentials.json",
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

  // console.log("!!!!!!", createResponse.data.body.content);
  let endIndex = createResponse.data.body.content[1].endIndex;
  let startIndex = createResponse.data.body.content[1].paragraph.elements[0];

  //  console.log("startIndex ", startIndex, "endIndex ", endIndex);
  // const createResponse = await client.documents.get({
  //   documentId: "1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk",
  // });
  //make input array into string
  let textInput = "";
  for (let i = 0; i < input.length; i++) {
    if (i != input.length - 1 && input[i] != "") {
      textInput += input[i] + "&&";
    } else {
      textInput += input[i];
    }
  }

  console.log("tester", textInput);
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

            // The first text inserted into the document must create a paragraph,
            // which can't be done with the `location` property.  Use the
            // `endOfSegmentLocation` instead, which assumes the Body if
            // unspecified.
            endOfSegmentLocation: {},
          },
        },
      ],
    },
  });

  // console
  //   .log
  //   (createResponse.data.body.content[1].paragraph.elements[0].textRun.content)

  return;

  // let upParsed = "&&" + input;

  // let updateObject = {
  //   documentId: "1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk",
  //   resource: {
  //     requests: [
  //       {
  //         insertText: {
  //           text: upParsed,
  //           location: {
  //             index: 1, // Modified
  //           },
  //         },
  //       },
  //     ],
  //   },
  // };

  // const texttoWrite = await client.documents.batchUpdate(updateObject);
}
//docer("tester");
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));
app.use(cookieParser());
app.use(cors()); // Enable cross-origin resource sharing

//username and password
const myusername = "user1";
const mypassword = "mypassword";

// a variable to save a session
var session;
// app.set("trust proxy", 1); // trust first proxy
// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true },
//   })
// );

//app.engine("handlebars", engine());
//code to use hbs instead of handlebars
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("port", process.env.PORT || 3000);
//app.use(express.static(__dirname + "../public"));
app.set("view engine", ".hbs");
//app.set("views", "./views");
//app.set("views", path.resolve(__dirname, "./views"));
//app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
//app.use(cookieParser());

const mainHead = module.require("./views/custom/mainHead.hbs");
const adminHead = module.require("./views/custom/adminHead.hbs");
const leaderboardHead = module.require("./views/custom/leaderboardHead.hbs");
const resetHead = module.require("./views/custom/resetHead.hbs");

const emailRouter = require("./routes/email");
const adminRouter = require("./routes/admin");
const { Session } = require("inspector");
const { file } = require("googleapis/build/src/apis/file");

app.use("/email", emailRouter);

let gameread = fs.readFileSync("./gameData/gameData.txt");

app.get("/", (req, res) => {
  session = req.session;
  if (session.userid) {
    //res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    res.render("home", { customHead: mainHead });
  } else {
    res.render("home", { customHead: mainHead });
  }
});

app.get("/leaderboard", (req, res) => {
  getLeaderboard().then((data) => {
    res.render("leaderboard", {
      customHead: leaderboardHead,
      leaderboardData: data,
    });
  });
});

app.get("/magicLink", (req, res) => {
  getGameStates().then((data) => {
    data.split("&&").forEach((gameState) => {
      if (gameState.includes(req.query.uuid)) {
        let gameStateParams = gameState.split(";");
        console.log("got it");
        session = req.session;
        session.uuid = gameStateParams[0];
        session.teamName = gameStateParams[1];
        session.teamEmail = gameStateParams[2];
        session.cluesUsed = gameStateParams[3];
        session.timestamp = gameStateParams[4];

        res.render("home", {
          customHead: mainHead,
          sessionData: JSON.stringify(req.session),
        });
      }
    });
  });
});

app.post("/updateHint", (req, res) => {
  let uuid = req.body.uuid;
  getGameStates().then((data) => {
    let newHintsNumber = 0;
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
            newGameStateParams += parseInt(param) + 1 + ";" + param;
            newGameStates[index] = newGameStateParams;
            updateGameStates(newGameStates);
          }
        });
      }
    });
  });
});

app.get("/clue", (req, res) => {
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
    console.log(fileItems);
    let webContentLinkArray = [];
    //  webContentLinkArray.push(fileItems.items[0].embedLink);
    fileItems.forEach((fileItem) => {
      let linkPair = [];
      linkPair.push(fileItem.title);
      linkPair.push(fileItem.embedLink);
      webContentLinkArray.push(linkPair);
    });
    console.log("webContentLinkArray: " + webContentLinkArray);
    res.send(webContentLinkArray);
  }
  getClues();

  console.log("getting clue");
});

app.post("/gameEnd", (req, res) => {
  console.log("uiid" + req.body.uuid);
  let uuid = req.body.uuid;
  let timestamp = req.body.timestamp;
  let teamName = req.body.teamName;
  let cluesUsed = req.body.cluesUsed;
  getGameStates().then((data) => {
    console.log("data: " + data);
    let newHintsNumber = 0;
    let newGameStates = [];
    let gameStart = timestamp;
    let gameEnd = Date.now();
    let gameDuration = gameEnd - gameStart;
    console.log(
      "gameStart: " +
        gameStart +
        " gameEnd: " +
        gameEnd +
        " gameDuration: " +
        gameDuration
    );
    //formate time
    //  let hours = Math.floor(gameDuration / 3600000); // 1 Hour = 36000 Milliseconds
    //let minutes = Math.floor((gameDuration % 3600000) / 60000); // 1 Minutes = 60000 Milliseconds
    let seconds = Math.floor(((gameDuration % 360000) % 60000) / 1000); // 1 Second = 1000 Milliseconds
    console.log("gameDuration: " + seconds);
    newGameStates = data.split("&&");

    let newLeaderboardEntry = teamName + ";" + cluesUsed + ";" + seconds;
    getLeaderboard().then((leaderboardData) => {
      console.log("data: " + leaderboardData);
      leaderboardData = leaderboardData.split("&&");
      let tempLeaderChange = "";
      let breaker = false;
      leaderboardData.forEach((leaderboardEntry, index) => {
        let leaderboardEntryParams = leaderboardEntry.split(";");
        console.log(seconds, "secs ", leaderboardEntryParams[2]);
        if (seconds < parseInt(leaderboardEntryParams[2]) && breaker == false) {
          tempLeaderChange = index;
          breaker = true;
          //delete

          console.log("leaderboardData: " + leaderboardData);
        }
        console.log("tempLeaderChange ", tempLeaderChange);
        console.log("leaderboardData ", leaderboardData[tempLeaderChange]);
      });
      //delete leaderboardData[tempLeaderChange];
      leaderboardData.splice(tempLeaderChange, 1);
      // leaderboardData.splice(tempLeaderChange, 0);
      leaderboardData.splice(tempLeaderChange, 0, newLeaderboardEntry);
      console.log("$$$$leaderboardData: " + leaderboardData);

      updateLeaderboard(leaderboardData);
    });

    // console.log(
    //   "data",
    //   data,
    //   "*3************newGameStates " + newGameStates.length
    // );
    //newGameStates.forEach((gameState) => {
    data.split("&&").forEach((gameState, index) => {
      //console.log("checking", uuid);
      if (gameState.includes(uuid)) {
        //   console.log("found it");
        // console.log("**************newGameStates " + newGameStates);
        newGameStates[index] = "";
        updateGameStates(newGameStates);
      }
    });
  });
});

app.post("/signUp", (req, res) => {
  if (
    req.body.username == myusername &&
    req.body.password == mypassword &&
    req.body.teamName &&
    req.body.teamEmail
  ) {
    session = req.session;
    //session.userid = req.body.username;
    session.teamName = req.body.teamName;
    session.teamEmail = req.body.teamEmail;
    session.timestamp = req.body.timestamp;
    session.cluesUsed = 0;
    let uuid = uuidv4();
    session.uuid = uuid;
    session.env = process.env.NODE_ENV;
    docer(
      uuid +
        ";" +
        req.body.teamName +
        ";" +
        req.body.teamEmail +
        ";" +
        session.cluesUsed +
        ";" +
        req.body.timestamp
    );
    res.send(req.session);
  } else {
    res.send("Invalid Email or Team Name");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/reset", (req, res) => {
  //get all of the names of the images in the folder resetImgs
  async function driver() {
    //https://docs.google.com/document/d/1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk/edit?usp=sharing
    const auth = new google.auth.GoogleAuth({
      keyFilename: "driveCreds.json",
      // Scopes can be specified either as an array or as a single, space-delimited string.
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });
    const authClient = await auth.getClient();

    // const client = await docs.docs({
    //   version: "v3",
    //   auth: authClient,
    // });
    const drive = google.drive({
      version: "v2",
      auth: authClient,
    });
    //https://stackoverflow.com/questions/49099248/upload-image-to-heroku-with-node-and-get-its-url
    //https://drive.google.com/drive/folders/1Pc5zamgYqkDYvIRL1jQGmHDp57bxg_tC

    // https://gist.github.com/Musinux/9945da1a2afd284cef5ec0377f4b2460
    let filesList = await drive.files.list({
      // fileId: "1cJZYX4DXZkQN3O55r53WtA4kZzavJ6rf",
      q: `'${"1mOyL_hVrm5YQSQ3wP2iWXfbkZwnuO91s"}' in parents`,
      // alt: "media",
      //fields: "id,name, webContentLink",
    });
    let fileItems = filesList.data.items;
    let filesGet = await drive.files.get({
      fileId: "1cJZYX4DXZkQN3O55r53WtA4kZzavJ6rf",
    });

    let picturesUrl = [];
    fileItems.forEach((fileItem) => {
      picturesUrl.push(
        " https://docs.google.com/uc?id=" + fileItem.id + "&export=download"
      );
    });

    async function getResetImages() {
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
        q: `'${"1mOyL_hVrm5YQSQ3wP2iWXfbkZwnuO91s"}' in parents`,
      });

      // console.log(filesList.data.items[0].downloadUrl);
      //let picturesUrl = [];
      let dataArray = [];
      filesList.data.items.forEach((fileItem) => {
        //console.log("dl ", i, " ", fileItem);
        // picturesUrl.push(
        //   "https://docs.google.com/uc?id=" + fileItem.id + "&export=download"
        // );
        //"https://docs.google.com/uc?id=1zfzYmgZEUf__eSawVwsJHQlQ0ZpfOwWt&export=download",
        async function syncer(fileId) {
          let image = await axios.get(
            "https://docs.google.com/uc?id=" + fileId + "&export=download",
            {
              responseType: "arraybuffer",
            }
          );
          let returnedB64 = Buffer.from(image.data).toString("base64");
          returnedB64 = "data:image/png;base64," + returnedB64;
          //   console.log("returnedB64 ", returnedB64);
          let data = returnedB64;
          //res.send(data);
          //return data

          return dataArray.push(data);
        }
        return syncer(fileItem.id);
      });
    }
    let resetImgs = getResetImages();

    // console.log("resetImgs ", resetImgs[0]);
    let dlUrl = picturesUrl.toString();
    // let resetImgs = fs.readdirSync("./public/images/resetImgs");
    // console.log(resetImgs[0]);
    //  console.log("dlurl", dlUrl);
    res.render("reset", {
      customHead: resetHead,
      resetImgs: resetImgs,
      dlUrl: dlUrl,
    });
    // return filesList.data.items[0].downloadUrl;
  }
  driver();
});

app.post("/download", (req, res) => {
  //console.log("download", req.body.url);
  let base64Data = req.body.url.split(",")[1];
  console.log("type " + req.body.url.split(",")[0]);
  let buff = Buffer.from(base64Data, "base64");
  //   const bs = new stream.PassThrough(); // Added
  //   bs.end(buff);
  //fs.writeFileSync("./resources/newfile.png", buff);

  async function customerImgsToDrive(buffer, number) {
    //let buff = Buffer.from(data64, "base64");
    // const bs = new stream.PassThrough(); // Added
    // bs.end(buff);

    //https://docs.google.com/document/d/1oCS5mNAmeq8Xpp6mEXvg5K1kP_i9Ey3zr8x6XvXKRpk/edit?usp=sharing
    const auth = new google.auth.GoogleAuth({
      keyFilename: "driveCreds.json",
      // Scopes can be specified either as an array or as a single, space-delimited string.
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    const authClient = await auth.getClient();

    // const client = await docs.docs({
    //   version: "v3",
    //   auth: authClient,
    // });
    const drive = google.drive({
      version: "v3",
      auth: authClient,
    });
    //1ToI5wBPtxi9e0mvoIKzF8u_hB2aFEiGF
    const fileMetadata = {
      name: "clientPhoto" + number + ".png",
      //q: `'${"1ToI5wBPtxi9e0mvoIKzF8u_hB2aFEiGF"}' in parents`,
      parents: ["1ToI5wBPtxi9e0mvoIKzF8u_hB2aFEiGF"],
    };
    const media = {
      mimeType: "image/png",
      //body: fs.createReadStream("./resources/newfile.png"),
      //https://stackoverflow.com/questions/13230487/converting-a-buffer-into-a-readablestream-in-node-js
      body: Readable.from(buffer),
    };
    try {
      const file = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id",
      });
      console.log("File Id:", file.data.id);
      let sender = file.data;

      //   let filesList = await drive.files.get({
      //     fileId: "16kYnpSOFnSK-a0o4guIFCbReRuvFwlIA",
      //     // alt: "media",
      //     fields: "id,name,parents",
      //   });

      //   res.send(filesList);
      return file.data.id;
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }
  customerImgsToDrive(buff, req.body.number);
});
//1cJZYX4DXZkQN3O55r53WtA4kZzavJ6rf
// GET request to serve as proxy for images
// app.get("/proxy", (req, res) => {
//   console.log("proxy");

//   const auth = new google.auth.GoogleAuth({
//     keyFilename: "driveCreds.json",
//     scopes: ["https://www.googleapis.com/auth/drive.readonly"],
//   });
//   const authClient = await auth.getClient();

//   const drive = google.drive({
//     version: "v2",
//     auth: authClient,
//   });
//    let filesList = await drive.files.list({
//     q: `'${"1mOyL_hVrm5YQSQ3wP2iWXfbkZwnuO91s"}' in parents`,
//     });

//   console.log(filesList.data.items[0].downloadUrl)
// let picturesUrl = [];
// let dataArray = [];
//   filesList.data.items.forEach((fileItem) => {
//     console.log('dl ', i, " ", fileItem.downloadUrl);
//     picturesUrl.push(
//       " https://docs.google.com/uc?id=" + fileItem.id + "&export=download"
//     );

//   async function syncer() {
//     let image = await axios.get(
//       "https://docs.google.com/uc?id=1zfzYmgZEUf__eSawVwsJHQlQ0ZpfOwWt&export=download",
//       {
//         responseType: "arraybuffer",
//       }
//     );
//     let returnedB64 = Buffer.from(image.data).toString("base64");
//     returnedB64 = "data:image/png;base64," + returnedB64;
//     console.log("returnedB64 ", returnedB64);
//     let data = returnedB64;
//     res.send(data);
//   }
//   syncer();
// });
//   // res.send(data);
//   //  }
// });
// let trimmedUrl = req.query.url.replace(" ", "");
//console.log("proxy", req.query.url);
//   const url = req.query.url;
//   if (url && url.length > 0) {
//     fetch(tester)
//       .then((response) => {
//         let testData = "";
//         response.body.pipe(testData);
//         let buff = Buffer.from(testData, "base64");
//         console.log(buff);
//         res.send(buff);
//       })
//       .catch((err) => console.log(err));
//   }
//});

// console.log("proxy");
// let tester =
//   "https://docs.google.com/uc?id=1zfzYmgZEUf__eSawVwsJHQlQ0ZpfOwWt&export=download";
//let tester =
//  "https://docs.google.com/uc?id=1cJZYX4DXZkQN3O55r53WtA4kZzavJ6rf&export=download";
// request.get(tester, function (error, response, body) {
//   //let buffy = Buffer.from(body, "base64");
//   //  console.log(buffy);
//   //   if (!error && response.statusCode == 200) {
//   console.log("ining");

//   let data =
//     "data:" +
//     response.headers["content-type"] +
//     ";base64," +
//     Buffer.from(body, "base64");
//   console.log("ten", data);
//});

app.get("/admin", (req, res) => {
  res.render("admin", { customHead: adminHead, gameData: gameread });
});

app.use("/admin", adminRouter);
if (process.env.NODE_ENV === "development") {
  console.log("development mode");
  options = {
    // key: fs.readFileSync("./localhost-key.pem"),
    //cert: fs.readFileSync("./localhost.pem"),
    key: fs.readFileSync("./cert.key"),
    cert: fs.readFileSync("./cert.crt"),
  };

  https.createServer(options, app).listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
  });
} else {
  app.listen(app.get("port"), function () {
    console.log("Server started on port " + app.get("port"));
  });
}
