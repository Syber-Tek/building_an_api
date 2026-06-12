
const monitors = require("../data/monitors");

const {
  logAlert,
  addHistory
} = require("../utils/logger");

function startTimer(monitor) {
  monitor.timer = setTimeout(() => {
    monitor.status = "down";

    addHistory(monitor, "ALERT");

    logAlert(monitor.id);
  }, monitor.timeout * 1000);
}

function cleanMonitorResponse(monitor) {
  return {
    id: monitor.id,
    timeout: monitor.timeout,
    alert_email: monitor.alert_email,
    status: monitor.status,
    paused: monitor.paused,
    lastHeartbeat: monitor.lastHeartbeat,
    history: monitor.history
  };
}

function createMonitor(data) {
  const { id, timeout, alert_email } = data;

  if (!id || !timeout || !alert_email) {
    return {
      error: "All fields are required"
    };
  }

  if (timeout <= 0) {
    return {
      error: "Timeout must be greater than 0"
    };
  }

  if (monitors.has(id)) {
    return {
      error: "Monitor already exists"
    };
  }

  const monitor = {
    id,
    timeout,
    alert_email,
    status: "up",
    paused: false,
    timer: null,
    lastHeartbeat: new Date().toISOString(),
    history: []
  };

  addHistory(monitor, "CREATED");

  startTimer(monitor);

  monitors.set(id, monitor);

  return cleanMonitorResponse(monitor);
}

function heartbeatMonitor(id) {
  const monitor = monitors.get(id);

  if (!monitor) {
    return null;
  }

  clearTimeout(monitor.timer);

  monitor.status = "up";

  monitor.paused = false;

  monitor.lastHeartbeat = new Date().toISOString();

  addHistory(monitor, "HEARTBEAT");

  startTimer(monitor);

  return cleanMonitorResponse(monitor);
}

function pauseMonitor(id) {
  const monitor = monitors.get(id);

  if (!monitor) {
    return null;
  }

  clearTimeout(monitor.timer);

  monitor.paused = true;

  monitor.status = "paused";

  addHistory(monitor, "PAUSED");

  return cleanMonitorResponse(monitor);
}

function getAllMonitors() {
  return Array.from(monitors.values()).map(cleanMonitorResponse);
}

module.exports = {
  createMonitor,
  heartbeatMonitor,
  pauseMonitor,
  getAllMonitors
};
