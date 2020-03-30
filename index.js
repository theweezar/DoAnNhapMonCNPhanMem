const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const exphbs = require('express-handlebars');
const PORT = process.env.PORT | 8080;

app.engine('handlebars', exphbs({defaultLayout:'main'})); // set defaultlayout is main.handlebars
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname,"node_modules","socket.io-client","dist")));

app.get("/",(req,res) => {
  res.end("Welcome to Hell!");
});

io.on("connect",socket => {
  socket.on("CONNECT_TO_THE_SERVER",username => {
    console.log(`${username} is connected to the server !`);
  });
  socket.on("DISCONNECT_TO_THE_SERVER",username => {
    console.log(`${username} is disconnected to the server !`);
  });
});