const express = require("express");

const router = express.Router();

const {
  registerMonitor,
  heartbeat,
  pause,
  getMonitors,
} = require("../controllers/monitorController");

router.post("/monitors", registerMonitor);

router.post("/monitors/:id/heartbeat", heartbeat);

router.post("/monitors/:id/pause", pause);

router.get("/monitors", getMonitors);

module.exports = router;
