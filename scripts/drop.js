const connectToDB = require("../db/connect");
const config = require("../config/config");

const dbClient = connectToDB(config);

(async () => {
  await dbClient.dropDatabase();
  dbClient.close();
})();
