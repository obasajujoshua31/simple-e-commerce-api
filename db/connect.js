const mongoose = require("mongoose");


/**
 * @description This will connect to mongo database instance with database url and database name
 * @param  {object} config - destructures database URl and database name to connect to
 */
const connectToDB = ({dBUrl, dbName}) => {
  mongoose.connect(dBUrl, {
    useNewUrlParser: true,
    dbName,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: false,
  });

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "MongoDB connection error"));

  db.once("open", () => {
    console.log("Database Connected!");
  });
};

module.exports = connectToDB;
