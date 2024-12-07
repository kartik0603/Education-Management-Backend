const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const swaggerConfig = require("./swaggerConfig.js");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());


const assignmentSubmissionRouters = require("./routes/assignment__submission.route.js");
const gradeRouter = require("./routes/grade.route.js");
const userRoutes = require("./routes/user.route.js");
const courseRoutes = require("./routes/course.route.js");


app.use("/api/submissions", assignmentSubmissionRouters);
app.use("/api/grades", gradeRouter);
app.use("/api/users", userRoutes); 
app.use("/api/courses", courseRoutes); 
swaggerConfig(app);





app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Education Management API" });
});


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
