const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Ensure 'Course' is the correct model name
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  submissions: {
    type: Array,
    default: []
  }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
