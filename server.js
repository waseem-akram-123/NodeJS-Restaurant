require("dotenv").config();

const express = require("express");
const app = express();
// const PORT = 8000;
const PORT = process.env.PORT || 8000;
const path = require("path");

// const mongoURL = process.env.LOCAL_MONGODB_URL;

const mongoURL = process.env.MONGODB_URL;

const personRoute = require("./routes/person");
const menuRoute = require("./routes/menu");
const orderRoute = require ("./routes/order");

const { logReqRes } = require("./middlewares/index");

// authentication using passport
const passport = require("./middlewares/auth");

// Connection
const { connectToMongoDb } = require("./connection");

const cookieParser = require("cookie-parser");
const { checkAuthentication } = require("./middlewares/jwtauth");

connectToMongoDb(mongoURL)
  .then(() => console.log("mongDb is connected !"))
  .catch((err) => console.log("error in mongoose connection", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(logReqRes("log.txt"));

app.use(passport.initialize());

app.use(cookieParser());

app.use (checkAuthentication);

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));


const localAuthMiddleware = passport.authenticate("local", { session: false });
// temporarily we are not using local authentication since it was asking the username and the password
// on each route now we will use tokens so that we can access any routes just after logging in

// Home page
// app.get ("/", (req,res)=> {
//     return res.send ("Welcome To Our Restaurant");
// });

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

// Routes
app.use("/person", personRoute);
app.use("/menu", menuRoute);
app.use ("/", orderRoute)

app.listen(PORT, () => console.log(`server started at PORT ${PORT}`));