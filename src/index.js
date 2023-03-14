const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
const route = require("./routes/covid");

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require("./connector");

app.use(route);

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
