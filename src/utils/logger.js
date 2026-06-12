function logAlert(deviceId) {
  console.log({
    ALERT: `Device ${deviceId} is down!`,
    time: new Date().toISOString(),
  });
}

function addHistory(monitor, type) {
  monitor.history.push({
    type,
    time: new Date().toISOString(),
  });
}

module.exports = {
  logAlert,
  addHistory,
};
