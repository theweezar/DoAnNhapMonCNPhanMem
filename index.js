const express = require("express");
const app = express();
const path = require("path");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const exphbs = require("express-handlebars");
const PORT = process.env.PORT | 8080;
const session = require("express-session");

const mysql = require("mysql");
const conn = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"test"
});
conn.connect(err => {
  if (err) throw err;
  else console.log("Connected to database successfully !");
})

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
    res.redirect("/app");
  }
});

app.post("/login",(req,res) => {
  if (req.body.email === "admin" && req.body.password === "admin"){
    req.session.email = req.body.email;
    req.session.logged = true;
    res.redirect("/app");
  }
})

app.get("/register",mdW.redirectApp,(req,res) => {
  res.render("register");
})

app.post("/register",(req,res) => {
  
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
  socket.on("CONNECT_TO_THE_SERVER",email => {
    console.log(`${email} is connected to the server !`);
  });
  socket.on("DISCONNECT_TO_THE_SERVER",email => {
    console.log(`${email} is disconnected to the server !`);
  });
});

app.listen(PORT,() => {
  console.log(`Server is running on PORT: ${PORT} !!!!`);
})