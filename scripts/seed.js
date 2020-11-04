const connectToDB = require("../db/connect");
const config = require("../config/config");
const userSeed = require("./data/data");
const User = require("../db/models/user");

const dbClient = connectToDB(config);

const createUser = async () => {
  const userCount = await User.countDocuments({}).exec();

  if (!userCount) {
    const userSeeds = userSeed.map((user) => {
      const newUser = new User(user);

      return newUser.save();
    });

    await Promise.all(userSeeds);
  }
};

(async () => {
  await createUser();
  dbClient.close();
})();
