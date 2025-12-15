const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  type: {
    type: String,
    required: true,
    enum: ['hotel', 'travel', 'airline', 'tour', 'event', 'other']
  },
  duration: {
    type: String,
    required: [true, 'Please specify duration'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please add location'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    minlength: [50, 'Description must be at least 50 characters']
  },
  skillsLearned: [{
    type: String,
    trim: true
  }],
  challenges: {
    type: String,
    trim: true
  },
  advice: {
    type: String,
    trim: true
  },
  user: {
    name: {
      type: String,
      required: [true, 'Please add your name'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Please add your role'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: String, // Store user IDs or emails
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  viewedBy: [{
    type: String, // Store user IDs or emails who have viewed
    trim: true
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better performance
experienceSchema.index({ type: 1, createdAt: -1 });
experienceSchema.index({ status: 1, createdAt: -1 });
experienceSchema.index({ likedBy: 1 });
experienceSchema.index({ viewedBy: 1 });

module.exports = mongoose.model('Experience', experienceSchema);