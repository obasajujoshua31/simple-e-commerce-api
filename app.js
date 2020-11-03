const express = require("express");
const mongoose = require("mongoose");
const { initAppMiddlewares, handleNotFound } = require("./app.middleware");
// const swaggerDoc = require("./swagger.json");
// Initialize application
const config = require("./config/config");
const routes = require("./api/routes");
const connectToDB = require("./db/connect");

const app = express();

const port = config.appPort || 6000;

// Initialize application middlewares
initAppMiddlewares(app);

connectToDB(config);
app.use("/", routes);

// set up swagger documentation
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Application to handle other requests that handler cannot be found
app.all("*", handleNotFound);

app.listen(port, console.log(`<== SERVER started at ${port} ==>`));

module.exports = app;
