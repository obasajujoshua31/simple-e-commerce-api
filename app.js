const express = require("express");
const { initAppMiddlewares, handleNotFound } = require("./app.middleware");
require("dotenv").config();
// const swaggerDoc = require("./swagger.json");
// Initialize application
const app = express();

const port = process.env.APP_PORT || 6000;

// Initialize application middlewares
initAppMiddlewares(app);

// app.use("/", router);

// set up swagger documentation
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Application to handle other requests that handler cannot be found
app.all("*", handleNotFound);

app.listen(port, console.log(`<== SERVER started at ${port} ==>`));

module.exports = app;
