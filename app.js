const express = require("express");
const router = require("./server/routes");
const cluster = require("cluster");
const http = require("http");
const pool = require("./db/postgres");
const client = require("./client/client");
const cpuCount = require("os").cpus().length;
const pid = process.pid;
const promMid = require("express-prometheus-middleware");
const path = require("path");
require("dotenv").config();

if (cluster.isMaster) {
  client.start();

  console.log(`Master cluster: ${pid}`);
  // Create a worker for each CPU
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
  // Listen for dying workers
  cluster.on("exit", function (worker) {
    // Replace the dead worker, we're not sentimental
    console.log("Worker " + worker.id + " died :(");
    cluster.fork();
  });
} else {
  const app = express();

  app.set("view engine", "ejs");
  app.set("port", process.env.PORT || 3000);
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.json());
  app.use("/", router);
  app.get("/", (req, res) => {
    res.render("html/base");
  });

  app.use(
    promMid({
      metricsPath: "/metrics",
      collectDefaultMetrics: true,
      requestDurationBuckets: [0.1, 0.5, 1, 1.5],
      requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
      responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    })
  );

  app.all("*", (req, res, next) => {
    console.log(`Entered non-existing page ${req.originalUrl}`);
    res.status(404).json("Page Not Found");
  });

  const server = http.createServer(app).listen(app.get("port"), () => {
    console.log("Express server listening on port " + app.get("port"));
    console.log("Worker " + cluster.worker.id + " running!");
  });

  function exitHandler(options, exitCode) {
    pool.end();
    server.close();
  }

  //do something when app is closing
  process.on("exit", exitHandler.bind(null, { cleanup: true }));

  //catches ctrl+c event
  process.on("SIGINT", exitHandler.bind(null, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
  process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

  //catches uncaught exceptions
  process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
}
