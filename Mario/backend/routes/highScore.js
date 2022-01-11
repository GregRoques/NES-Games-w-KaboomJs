const express = require("express");
const router = express.Router();

const highScore = [
  {
    initials: "GRR",
    points: 300,
  },
  {
    initials: "RGR",
    points: 200,
  },
  {
    initials: "MG",
    points: 100,
  },
]; // dummy data for now

router.post("/", (req, res, next) => {
  if (highScore) {
    if (highScore.length > 1) {
      highScore.sort(function (a, b) {
        return a.points - b.points;
      });
    }
    return res.json(highScore);
  }
  throw new Error("Can not retrieve high score.");
});

module.exports = router;
