const { connection } = require("../connector");
const route = require("express").Router();

route.get("/totalRecovered", async (req, res) => {
  const data = await connection.aggregate([
    { $group: { _id: "total", recovered: { $sum: "$recovered" } } },
  ]);
  //   console.log(data);
  res.status(200).json(data);
});

route.get("/totalActive", async (req, res) => {
  const data = await connection.aggregate([
    {
      $group: {
        _id: "total",
        active: { $sum: { $subtract: ["$infected", "$recovered"] } },
      },
    },
  ]);
  //   console.log(data);
  res.status(200).json(data);
});

route.get("/totalDeath", async (req, res) => {
  const data = await connection.aggregate([
    { $group: { _id: "total", death: { $sum: "$death" } } },
  ]);
  //   console.log(data);
  res.status(200).json(data);
});

route.get("/hotspotStates", async (req, res) => {
  const data = await connection.aggregate([
    {
      $addFields: {
        rate: {
          $round: [
            {
              $divide: [
                {
                  $subtract: ["$infected", "$recovered"],
                },
                "$infected",
              ],
            },
            5,
          ],
        },
      },
    },
    {
      $match: {
        rate: { $gt: 0.1 },
      },
    },
    {
      $project: {
        _id: 0,
        state: 1,
        rate: 1,
      },
    },
  ]);
  res.status(200).json({
    data,
  });
});

route.get("/healthyStates", async (req, res) => {
  const data = await connection.aggregate([
    {
      $addFields: {
        mortality: { $round: [{ $divide: ["$death", "$infected"] }, 5] },
      },
    },
    {
      $match: {
        mortality: { $lt: 0.005 },
      },
    },
    {
      $project: {
        _id: 0,
        state: 1,
        mortality: 1,
      },
    },
  ]);
  res.status(200).json({
    data,
  });
});

module.exports = route;
