const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Import Routes
const assignmentSubmissionRouters = require("./routes/assignment__submission.route.js");
const gradeRouter = require("./routes/grade.route.js");
const userRoutes = require("./routes/user.route.js");
const courseRoutes = require("./routes/course.route.js");


app.use("/api/submissions", assignmentSubmissionRouters);
app.use("/api/grades", gradeRouter);
app.use("/api/users", userRoutes); 
app.use("/api/courses", courseRoutes); 

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
