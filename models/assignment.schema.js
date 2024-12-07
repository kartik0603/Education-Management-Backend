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
    ref: 'Course',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
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
