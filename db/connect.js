const mongoose = require("mongoose");

const connectToDB = (config) => {
  mongoose.connect(config.dBUrl, {
    useNewUrlParser: true,
    dbName: config.dbName,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "MongoDB connection error"));

  db.once("open", () => {
    console.log("Database Connected!");
  });
};

module.exports = connectToDB;
