const monitorService = require("../services/monitorService");

function registerMonitor(req, res) {
  const result = monitorService.createMonitor(req.body);

  if (result.error) {
    return res.status(400).json({
      error: result.error,
    });
  }

  res.status(201).json({
    message: "Monitor created successfully",
    monitor: result,
  });
}

function heartbeat(req, res) {
  const result = monitorService.heartbeatMonitor(req.params.id);

  if (!result) {
    return res.status(404).json({
      error: "Monitor not found",
    });
  }

  res.status(200).json({
    message: "Heartbeat received",
    monitor: result,
  });
}

function pause(req, res) {
  const result = monitorService.pauseMonitor(req.params.id);

  if (!result) {
    return res.status(404).json({
      error: "Monitor not found",
    });
  }

  res.status(200).json({
    message: "Monitor paused successfully",
    monitor: result,
  });
}

function getMonitors(req, res) {
  const monitors = monitorService.getAllMonitors();

  res.status(200).json(monitors);
}

module.exports = {
  registerMonitor,
  heartbeat,
  pause,
  getMonitors,
};
