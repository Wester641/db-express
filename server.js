const { MongoClient } = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
const dbConfig = require("./config/db");

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(dbConfig.url)
  .then((client) => {
    const db = client.db("test"); // замени на имя своей базы, если нужно
    require("./app/routes/note_routes")(app, db);
    app.listen(port, () => {
      console.log("We are live on " + port);
    });
  })
  .catch((err) => console.error("Connection error:", err));
