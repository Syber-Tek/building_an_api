const express = require("express");

const monitorRoutes = require("./routes/monitorRoutes");

const app = express();

const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Pulse-Check-API Running",
  });
});

app.use("/", monitorRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
