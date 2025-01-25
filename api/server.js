const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const usersRouter = require("./users");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../client")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/api/users", usersRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
