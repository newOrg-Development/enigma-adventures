const express = require("express");
const app = express();
const https = require("https");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session");
require("dotenv").config();
const { google } = require("googleapis");
const cors = require("cors");
const axios = require("axios");
const { Readable } = require("stream");
const googleController = require("./routes/googleContoller.js");
const { Game } = require("./resources/classes/gameClass.js");
require("./resources/mongoController.js");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoController = require("./resources/mongoController.js");

const store = new MongoDBStore({
  uri: process.env.MONGO,
  collection: "sessions",
});

const oneDay = 1000 * 60 * 60 * 24;

var env = process.env.NODE_ENV;
console.log(`env is ${env}`);
let googleCreds = "";
if (env === "development") {
  googleCreds = "./credentials.json";
} else {
  googleCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
}

app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
    store: store,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(cors());
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("port", process.env.PORT || 3000);
app.set("view engine", ".hbs");
app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const mainHead = module.require("./views/custom/mainHead.hbs");
const leaderboardHead = module.require("./views/custom/leaderboardHead.hbs");
const resetHead = module.require("./views/custom/resetHead.hbs");
const adminHead = module.require("./views/custom/adminHead.hbs");
const gamesViewerHead = module.require("./views/custom/gamesViewerHead.hbs");
const navbarLoggedIn = module.require("./views/custom/navbarLoggedIn.hbs");
const navbarLoggedOut = module.require("./views/custom/navbarLoggedOut.hbs");

const homeRouter = require("./routes/homeRouter");
const adminRouter = require("./routes/adminRouter");
require("./resources/classes/gameClass");

app.use("/", homeRouter);

app.get("/", (req, res) => {
  if (req.session.uuid) {
    let magicLink;
    if (process.env.NODE_ENV == "production") {
      magicLink =
        "https://enigma-adventures.herokuapp.com/magicLink?uuid=" +
        req.session.uuid;
    } else {
      magicLink = "https://localhost:3000/magicLink?uuid=" + req.session.uuid;
    }
    res.render("home", {
      customHead: mainHead,
      navbar: navbarLoggedIn,
      sessionData: magicLink,
    });
  } else {
    res.render("home", {
      customHead: mainHead,
      navbar: navbarLoggedOut,
    });
  }
});

app.get("/leaderboard", (req, res) => {
  mongoController.loadLeaderBoard().then((data) => {
    if (req.session.uuid) {
      res.render("leaderboard", {
        customHead: leaderboardHead,
        navbar: navbarLoggedIn,
        leaderboardData: JSON.stringify(data),
      });
    } else {
      res.render("leaderboard", {
        customHead: leaderboardHead,
        navbar: navbarLoggedOut,
        leaderboardData: JSON.stringify(data),
      });
    }
  });
});
app.get("/gamesViewer", (req, res) => {
  mongoController.loadAllGames().then((gameStates) => {
    if (req.session.uuid) {
      res.render("gamesViewer", {
        customHead: gamesViewerHead,
        navbar: navbarLoggedIn,
        gameStates: gameStates,
      });
    } else {
      res.render("gamesViewer", {
        customHead: gamesViewerHead,
        navbar: navbarLoggedOut,
        gameStates: gameStates,
      });
    }
  });
});

app.get("/magicLink", (req, res) => {
  req.session.uuid = req.query.uuid;
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/reset", (req, res) => {
  async function driver() {
    const auth = new google.auth.GoogleAuth({
      keyFile: googleCreds,
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
        keyFile: googleCreds,
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

      let dataArray = [];
      filesList.data.items.forEach((fileItem) => {
        async function syncer(fileId) {
          let image = await axios.get(
            "https://docs.google.com/uc?id=" + fileId + "&export=download",
            {
              responseType: "arraybuffer",
            }
          );
          let returnedB64 = Buffer.from(image.data).toString("base64");
          returnedB64 = "data:image/png;base64," + returnedB64;
          let data = returnedB64;
          return dataArray.push(data);
        }
        return syncer(fileItem.id);
      });
    }
    let resetImgs = getResetImages();
    let dlUrl = picturesUrl.toString();
    if (req.session.uuid) {
      res.render("reset", {
        customHead: resetHead,
        navbar: navbarLoggedIn,
        resetImgs: resetImgs,
        dlUrl: dlUrl,
      });
    } else {
      res.render("reset", {
        customHead: resetHead,
        navbar: navbarLoggedOut,
        resetImgs: resetImgs,
        dlUrl: dlUrl,
      });
    }
  }
  driver();
});

app.post("/download", (req, res) => {
  let base64Data = req.body.url.split(",")[1];
  let buff = Buffer.from(base64Data, "base64");

  async function customerImgsToDrive(buffer, number) {
    const auth = new google.auth.GoogleAuth({
      keyFile: googleCreds,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    const authClient = await auth.getClient();
    const drive = google.drive({
      version: "v3",
      auth: authClient,
    });
    const fileMetadata = {
      name: "clientPhoto" + number + ".png",
      parents: ["1ToI5wBPtxi9e0mvoIKzF8u_hB2aFEiGF"],
    };
    const media = {
      mimeType: "image/png",
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
      return file.data.id;
    } catch (err) {
      throw err;
    }
  }
  customerImgsToDrive(buff, req.body.number);
});

app.get("/admin", (req, res) => {
  mongoController.loadGameStructures().then((gameHintsArr) => {
    if (req.session.uuid) {
      res.render("admin", {
        customHead: adminHead,
        navbar: navbarLoggedIn,
        gameData: gameHintsArr,
      });
    } else {
      res.render("admin", {
        customHead: adminHead,
        navbar: navbarLoggedOut,
        gameData: gameHintsArr,
      });
    }
  });
});

app.use("/admin", adminRouter);

if (process.env.NODE_ENV === "development") {
  console.log("development mode");
  options = {
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
