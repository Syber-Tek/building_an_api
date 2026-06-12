function logAlert(deviceId) {
  console.log({
    ALERT: `Device ${deviceId} is down!`,
    time: new Date().toISOString(),
  });
}

module.exports = {
  logAlert,
};
