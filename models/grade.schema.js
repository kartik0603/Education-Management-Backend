const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true 
    },
    grade: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 100 
    },
    assignment: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Submission', 
      required: true 
    },
  },
  { timestamps: true }
);

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
