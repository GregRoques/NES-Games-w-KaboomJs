var express = require("express");
var app = express();
const cors = require("cors");
const helmet = require("helmet");

const highScore = require("./routes/highScore");

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded());

app.use("/highScore", highScore);

const PORT = 2000;
app.listen(PORT, () => {
  console.log("Listening on ", PORT);
});
