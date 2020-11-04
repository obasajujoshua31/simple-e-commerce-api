const { Router } = require("express");
const { validateSignup, validateLogin } = require("../middlewares/validate");
const { verifyUser, checkIsLoggedIn } = require("../middlewares/auth");
const { signUpUser, loginUser, logOutUser } = require("../controllers/auth");
const { RedisClient } = require("redis");

const router = Router();

/**
 * @description This will setup auth routes with the redis client instance
 * @param  {RedisClient} redisClient - redis client instance
 * @returns {Router} - express Router
 */
const setUpAuthRoutes = (redisClient) => {
  router.post("/signup", validateSignup, signUpUser);
  router.post("/signin", validateLogin, loginUser);
  router.get(
    "/signout",
    verifyUser,
    checkIsLoggedIn(redisClient),
    logOutUser(redisClient)
  );

  return router;
};

module.exports = setUpAuthRoutes;
