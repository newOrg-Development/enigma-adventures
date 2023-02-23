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
var env = process.env.NODE_ENV;
console.log(`env is ${env}`);

const docs = require("@googleapis/docs");

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

  let upParsed = "&&" + input;

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
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
//app.use(cookieParser());

const mainHead = module.require("./views/custom/mainHead.hbs");
const adminHead = module.require("./views/custom/adminHead.hbs");

const emailRouter = require("./routes/email");
const adminRouter = require("./routes/admin");
const { Session } = require("inspector");

app.use("/email", emailRouter);

let gameread = fs.readFileSync("./gameData/gameData.txt");
//gameread = JSON.parse(gameread);
console.log("gameread: " + gameread);

app.get("/", (req, res) => {
  session = req.session;
  if (session.userid) {
    //res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    res.render("home", { customHead: mainHead });
  } else {
    res.render("home", { customHead: mainHead });
  }
});

// teamName: teamName,
// teamEmail: teamEmail,
// teamPassword: teamPassword,
// qrCodeData: qrCodeData,
// username: "user1",
// password: "mypassword",

app.post("/signUp", (req, res) => {
  if (req.body.username == myusername && req.body.password == mypassword) {
    session = req.session;
    session.userid = req.body.username;
    session.teamName = req.body.teamName;
    session.teamEmail = req.body.teamEmail;
    docer("GAME STARTED" + req.body.teamName + " " + req.body.teamEmail);
    console.log(req.session);
    res.send(req.session);
  } else {
    res.send("Invalid username or password");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

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
