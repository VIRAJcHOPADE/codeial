const express = require("express");
const app = express();
const port = 8000;

const env = require("./config/environment");
const logger = require("morgan");

//for view-helper
require("./config/view-helper")(app);

const path = require("path");

//importing cookie parser
const cookieParser = require("cookie-parser");

//passport setup
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");

//passport-jwt-setup
const passportJwt = require("./config/passport-jwt-strategy");

//passport google auth
const passportGoogle = require("./config/passport-google-oauth2-strategy");

//configuring the database
const db = require("./config/mongoose");

const MongoStore = require('connect-mongo');
//importing express-ejs-layout for same layout in each page install express-ejs-layouts for this
const expressLayouts = require("express-ejs-layouts");

//importing sass middleware
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

//setting chat engine
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log("chat server is listening on port 5000");

//middleware for sass
app.use(
  sassMiddleware({
    src: path.join(__dirname, env.asset_path, "scss"),
    dest: path.join(__dirname, env.asset_path, "css"),
    debug: true,
    outputStyle: "extended",
    prefix: "/css",
  })
);

//middleware for form parser
app.use(express.urlencoded({ extended: false }));

//middleware for cookie parser install cookie-parser for this
app.use(cookieParser());

//importing the assets folder----above than ./routes file
app.use(express.static(env.asset_path));
//make the uploades path available to browser
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongoUrl:'mongodb://localhost/codeial_development',
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

//made in config file
app.use(passportLocal.setAuthenticatedUser);

//import flash should be after session
app.use(flash());
app.use(customMware.setFlash);

//use express router-----below assets
app.use("/", require("./routes/index"));

app.listen(port, function (err) {
  if (err) {
    console.log(`error in running server : ${err}`);
  }
  console.log(`server is running on port : ${port}`);
});