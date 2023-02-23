const express = require("express");
const app = express();
const https = require("https");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const result = dotenv.config("./.env");
const fs = require("fs");
var env = process.env.NODE_ENV;
console.log(`env is ${env}`);

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

app.use("/email", emailRouter);

let gameread = fs.readFileSync("./gameData/gameData.txt");
//gameread = JSON.parse(gameread);
console.log("gameread: " + gameread);

app.get("/", (req, res) => {
  res.render("home", { customHead: mainHead });
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
