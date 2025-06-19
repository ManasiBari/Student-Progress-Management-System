const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Import Routes
const studentRoutes = require("./routes/studentRoutes");
const codeforcesRoutes = require("./routes/codeforcesRoutes");
const testRoutes = require('./routes/testRoutes');
const exportRoutes = require('./routes/exportRoutes');

// Register Routes
app.use("/api/students", studentRoutes);
app.use("/api/codeforces", codeforcesRoutes);
app.use("/api/test", testRoutes);
app.use("/api", exportRoutes);


const contestRoutes = require('./routes/contestRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

app.use('/api/contests', contestRoutes);
app.use('/api/submissions', submissionRoutes);


// Optional: Background jobs
require("./cron");

// Connect DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => {
    console.log("Server running on Port", process.env.PORT);
  }))
  .catch(err => console.error("MongoDB connection error:", err));
