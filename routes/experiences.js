const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const rateLimit = require('express-rate-limit');

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many submissions. Please try again after 15 minutes.'
});

// GET all approved experiences
router.get('/', apiLimiter, async (req, res) => {
  try {
    const { type, page = 1, limit = 12, sort = '-createdAt' } = req.query;
    
    const query = { status: 'approved' };
    if (type && type !== 'all') {
      query.type = type;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const experiences = await Experience.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Experience.countDocuments(query);
    
    res.json({
      success: true,
      count: experiences.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: experiences
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET single experience
router.get('/:id', apiLimiter, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      return res.status(404).json({ success: false, error: 'Experience not found' });
    }
    
    // Increment views
    experience.views += 1;
    await experience.save();
    
    res.json({ success: true, data: experience });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST new experience
router.post('/', submitLimiter, async (req, res) => {
  try {
    // Process skillsLearned from comma-separated string to array
    if (req.body.skillsLearned && typeof req.body.skillsLearned === 'string') {
      req.body.skillsLearned = req.body.skillsLearned
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
    }
    
    const experience = await Experience.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Experience submitted successfully!',
      data: experience
    });
  } catch (error) {
    console.error('Error submitting experience:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT like an experience
router.put('/:id/like', apiLimiter, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      return res.status(404).json({ success: false, error: 'Experience not found' });
    }
    
    experience.likes += 1;
    await experience.save();
    
    res.json({ success: true, likes: experience.likes });
  } catch (error) {
    console.error('Error liking experience:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;