const express = require("express");
const app = express();
const path = require("path");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const exphbs = require("express-handlebars");
const PORT = process.env.PORT | 8080;
const session = require("express-session");
const mdW = require("./middleware.js");
app.use(session({
  secret:"thisisasecret",
  resave:true,
  saveUninitialized:true
}));

// set defaultlayout is main.handlebars
app.engine('handlebars', exphbs({defaultLayout:'main'})); 
app.set('view engine', 'handlebars');

// use public resources such as css, js client side
app.use(express.static(path.join(__dirname,"public")));
// use socket module for client side 
app.use(express.static(path.join(__dirname,"node_modules","socket.io-client","dist")));
// 
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get("/",(req,res) => {
  if (!req.session.logged) res.render("login");
  else{
    res.redirect("app");
  }
});

app.post("/login",(req,res) => {
  if (req.body.username === "admin" && req.body.password === "admin"){
    req.session.username = req.body.username;
    req.session.logged = true;
    res.redirect("app");
  }
})

app.get("/logout",(req,res) => {
  if (req.session.logged){
    req.session.destroy(err => {
      if (err) throw err;
      else res.redirect("/");
    })
  }
  else res.redirect("/");
})

app.get("/app",mdW.redirectLogin,(req,res) => {
  res.render("app");
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