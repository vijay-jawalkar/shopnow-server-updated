require("dotenv").config();
const express = require("express");
const jsonServer = require("json-server");
const auth = require("json-server-auth");
// const Router = express.Router();

const router = jsonServer.router("./db.json");

const server = express();

// middlewares
server.use(express.json({ extended: false }));

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

server.db = router.db;

server.use(auth);

server.use("/api", router);

// route included
// import payment.js in server, so that this server enable create order feature and as user click on order, order should be created
server.use("/payment", require("./routes/payment"));

const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

server.listen(8000);
