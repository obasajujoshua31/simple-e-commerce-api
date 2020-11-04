const express = require("express");
const swaggerUi = require("swagger-ui-express");
const { initAppMiddlewares, handleNotFound } = require("./app.middleware");
const swaggerDoc = require("./swagger.json");
const config = require("./config/config");
const routes = require("./api/routes");
const connectToDB = require("./db/connect");
const getRedisClient = require("./redis/client");

const app = express();

const port = config.appPort || 6000;

// Initialize application middlewares
initAppMiddlewares(app);

connectToDB(config);

const redisClient = getRedisClient(config);
app.use("/", routes(redisClient));

// set up swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Application to handle other requests that handler cannot be found
app.all("*", handleNotFound);

app.listen(port, console.log(`<== SERVER started at ${port} ==>`));

module.exports = app;
