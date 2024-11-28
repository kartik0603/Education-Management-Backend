const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
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
    assignment: { 
      type: String, 
      required: true,
      trim: true 
    },
    grade: { 
      type: Number, 
      min: 0, 
      max: 100 
    },
    status: { 
      type: String, 
      enum: ['Pending', 'Graded'], 
      default: 'Pending' 
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
