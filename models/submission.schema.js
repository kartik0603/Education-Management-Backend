const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ['Submitted', 'Graded', 'Pending'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);


const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;

