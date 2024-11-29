const Course = require('../models/course.schema.js');
const User = require('../models/user.schema.js');
const mongoose = require('mongoose'); 


// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    
    const teacherId = req.user.id;

    // Create a new course with the teacher field
    const newCourse = new Course({
      title,
      description,
      teacher: teacherId, 
      students: []  
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updates = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updates, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course updated successfully", updatedCourse });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error: error.message });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "name email")
      .populate("students", "name email");

    if (!courses.length) {
      return res.status(404).json({ message: "No courses found" });
    }

    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
};

// Get courses enrolled by the current user (student)
const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const courses = await Course.find({ students: userId })
      .populate("teacher", "name email")
      .populate("students", "name email");

    if (!courses.length) {
      return res.status(404).json({ message: "You are not enrolled in any courses" });
    }

    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrolled courses", error: error.message });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate if the courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Attempt to delete the course using deleteOne instead of remove
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
};


// Enroll a student in a course
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: "You are already enrolled in this course" });
    }

    course.students.push(studentId);
    await course.save();

    res.status(200).json({ message: "Successfully enrolled in the course", course });
  } catch (error) {
    res.status(500).json({ message: "Error enrolling in course", error: error.message });
  }
};

// Unenroll a student from a course
const unenrollFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.students.includes(studentId)) {
      return res.status(400).json({ message: "You are not enrolled in this course" });
    }

    course.students.pull(studentId);
    await course.save();

    res.status(200).json({ message: "Successfully unenrolled from the course", course });
  } catch (error) {
    res.status(500).json({ message: "Error unenrolling from course", error: error.message });
  }
};

module.exports = {
  createCourse,
  updateCourse,
  getAllCourses,
  getEnrolledCourses,
  deleteCourse,
  enrollInCourse,
  unenrollFromCourse
};