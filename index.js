const express = require("express");
const app = express();
const path = require("path");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const exphbs = require("express-handlebars");
const PORT = process.env.PORT | 8080;
const session = require("express-session");
const md = require("./middleware.js");
app.use(session({
  secret:"thisisasecret",
  resave:true,
  saveUninitialized:true
}));

app.engine('handlebars', exphbs({defaultLayout:'main'})); // set defaultlayout is main.handlebars
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname,"node_modules","socket.io-client","dist")));
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get("/",md,(req,res) => {
  // res.redirect("/login");
});

app.get("/login",(req,res) => {
  res.render("login");
})

app.post("/login",(req,res) => {
  if (req.body.username === "admin" && req.body.password === "admin"){
    req.session.username = req.body.username;
    req.session.logged = true;
    res.end(`${req.body.username} and ${req.body.password}`);
  }
})

io.on("connect",socket => {
  socket.on("CONNECT_TO_THE_SERVER",username => {
    console.log(`${username} is connected to the server !`);
  });
  socket.on("DISCONNECT_TO_THE_SERVER",username => {
    console.log(`${username} is disconnected to the server !`);
  });
});

app.listen(PORT,() => {
  console.log(`Server is running on PORT: ${PORT} !!!!`);
})