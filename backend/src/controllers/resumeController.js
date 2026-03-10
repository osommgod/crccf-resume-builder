const Resume = require('../models/Resume');

/**
 * Create a new resume
 */
const createResume = async (req, res) => {
  try {
    // Check if email already exists
    const existingResume = await Resume.findOne({ 
      'personalInfo.email': req.body.personalInfo.email 
    });
    
    if (existingResume) {
      return res.status(400).json({
        success: false,
        error: 'A resume with this email already exists'
      });
    }

    // Create new resume
    const resume = new Resume(req.body);
    await resume.save();

    res.status(201).json({
      success: true,
      data: resume,
      message: 'Resume created successfully'
    });
  } catch (error) {
    console.error('Error creating resume:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create resume',
      message: error.message
    });
  }
};

/**
 * Get all resumes with pagination and search
 */
const getResumes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build search query
    const searchQuery = search ? {
      $or: [
        { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } },
        { 'personalInfo.phone': { $regex: search, $options: 'i' } }
      ]
    } : {};

    // Get resumes with pagination
    const resumes = await Resume.find(searchQuery)
      .sort({ [sortBy]: sortOrder })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('personalInfo.fullName personalInfo.email personalInfo.phone createdAt');

    // Get total count for pagination
    const total = await Resume.countDocuments(searchQuery);

    // Get statistics
    const stats = await getResumeStatsData();

    res.json({
      success: true,
      data: {
        resumes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        },
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resumes',
      message: error.message
    });
  }
};

/**
 * Get a single resume by ID
 */
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid resume ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch resume',
      message: error.message
    });
  }
};

/**
 * Update a resume by ID
 */
const updateResume = async (req, res) => {
  try {
    // Check if resume exists
    const existingResume = await Resume.findById(req.params.id);
    if (!existingResume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    // Check if email already exists (excluding current resume)
    const emailExists = await Resume.findOne({ 
      'personalInfo.email': req.body.personalInfo.email,
      _id: { $ne: req.params.id }
    });
    
    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: 'A resume with this email already exists'
      });
    }

    // Update resume
    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedResume,
      message: 'Resume updated successfully'
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid resume ID format'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update resume',
      message: error.message
    });
  }
};

/**
 * Delete a resume by ID
 */
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid resume ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to delete resume',
      message: error.message
    });
  }
};

/**
 * Get resume statistics
 */
const getResumeStats = async (req, res) => {
  try {
    const stats = await getResumeStatsData();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
};

/**
 * Helper function to get resume statistics
 */
const getResumeStatsData = async () => {
  const stats = await Resume.aggregate([
    {
      $group: {
        _id: null,
        totalResumes: { $sum: 1 },
        avgExperience: { $avg: { $size: '$workExperience' } },
        avgProjects: { $avg: { $size: '$projects' } },
        avgSkills: { $avg: { $size: '$skills' } }
      }
    }
  ]);
  
  return stats[0] || {
    totalResumes: 0,
    avgExperience: 0,
    avgProjects: 0,
    avgSkills: 0
  };
};

module.exports = {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  getResumeStats
};
