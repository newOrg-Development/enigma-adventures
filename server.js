const express = require("express");
const app = express();
const https = require("https");
const exphbs = require("express-handlebars");

const dotenv = require("dotenv");
const result = dotenv.config("./.env");
const fs = require("fs");
var env = process.env.NODE_ENV;
console.log(`env is ${env}`);

//app.engine("handlebars", engine());
//code to use hbs instead of handlebars

app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("port", process.env.PORT || 3000);
//app.use(express.static(__dirname + "../public"));
app.set("view engine", ".hbs");
//app.set("views", "./views");
//app.set("views", path.resolve(__dirname, "./views"));
//app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

const mainHead = module.require("./views/custom/mainHead.hbs");

app.get("/", (req, res) => {
  res.render("home", { customHead: mainHead });
});

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
