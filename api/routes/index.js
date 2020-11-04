const { Router } = require("express");
const { verifyUser, checkIsLoggedIn } = require("../middlewares/auth");
const authRouter = require("./auth");
const productRouter = require("./product");

const router = Router();

/**
 * @description This will setup the main app routes with the redis client instance
 * @param  {RedisClient} redisClient - redis client instance
 * @returns {Router} - express Router
 */
const setUpRoutes = (redisClient) => {
  router.use("/auth", authRouter(redisClient));
  router.use(
    "/products",
    verifyUser,
    checkIsLoggedIn(redisClient),
    productRouter
  );

  return router;
};

module.exports = setUpRoutes;
