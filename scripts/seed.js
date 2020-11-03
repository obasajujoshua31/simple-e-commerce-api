const connectToDB = require("../db/connect");
const config = require("../config/config");
const userSeed = require("./data/data");
const User = require("../db/models/user");

connectToDB(config);

const createUser = () => {
  User.estimatedDocumentCount({}, async (err, count) => {
    if (!count && !err) {
      const userSeeds = userSeed.map((user) => {
        const newUser = new User(user);

        return newUser.save();
      });

      await Promise.all(userSeeds);
    }
  });
};

createUser();
