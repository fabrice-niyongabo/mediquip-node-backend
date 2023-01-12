require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "50mb" }));

app.use(cors());

//home route
app.get("/", (req, res) => {
  res.send(`<h1>Medequip REST APIs</h1>`);
});

const usersRoute = require("./routes/users");
const devicesRoute = require("./routes/devices");
const troubleShootingCategoriesRoute = require("./routes/troubleShootingCategories");
const deviceIssuesRoute = require("./routes/deviceIssues");
const troubleshootingStepsRoute = require("./routes/troubleshootingSteps");
const transactionsRoute = require("./routes/transactions");
const transactionsRoute2 = require("./routes/transactions2");
const searchRoute = require("./routes/search");
const ticketsRoute = require("./routes/tickets");
const messagesRoute = require("./routes/messages");
const sparepartsRoute = require("./routes/spareparts");
const serialNumbersRoute = require("./routes/serialNumbers");
app.use("/api/users/", usersRoute);
app.use("/api/devices/", devicesRoute);
app.use("/api/troubleshootingCategories/", troubleShootingCategoriesRoute);
app.use("/api/deviceissues/", deviceIssuesRoute);
app.use("/api/troubleshootingSteps/", troubleshootingStepsRoute);
app.use("/api/transactions/", transactionsRoute);
app.use("/api/v2/transactions/", transactionsRoute2);
app.use("/api/search/", searchRoute);
app.use("/api/tickets/", ticketsRoute);
app.use("/api/messages/", messagesRoute);
app.use("/api/spareparts/", sparepartsRoute);
app.use("/api/serialnumbers/", serialNumbersRoute);

//404 route
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "The page does not exist on the server.",
    },
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
