const mongoose = require('mongoose');

/**
 * Resume Schema for storing complete resume data
 */
const resumeSchema = new mongoose.Schema({
  // Personal Information
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Phone number must be exactly 10 digits']
    },
    whatsappNumber: {
      type: String,
      match: [/^[0-9]{10}$/, 'WhatsApp number must be exactly 10 digits']
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    linkedin: {
      type: String,
      trim: true,
      match: [/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/, 'Please enter a valid LinkedIn URL']
    },
    portfolioUrl: {
      type: String,
      trim: true,
      match: [/^(https?:\/\/)?(www\.)?.*\..*$/, 'Please enter a valid portfolio URL']
    },
    profilePhoto: {
      type: String,
      default: ''
    }
  },

  // Objective/Summary
  objective: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },

  // Dynamic Arrays
  education: [{
    degree: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    institution: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    yearFrom: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear()
    },
    yearTo: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear() + 10
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  }],

  workExperience: [{
    jobTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    duration: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    }
  }],

  skills: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    proficiency: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Expert']
    }
  }],

  projects: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    techStack: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    liveUrl: {
      type: String,
      trim: true,
      match: [/^(https?:\/\/)?(www\.)?.*\..*$/, 'Please enter a valid live URL']
    },
    githubUrl: {
      type: String,
      trim: true,
      match: [/^(https?:\/\/)?(www\.)?github\.com\/.*$/, 'Please enter a valid GitHub URL']
    }
  }],

  certifications: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    issuer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    year: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear()
    }
  }],

  languages: [{
    language: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    proficiency: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    }
  }],

  hobbies: {
    type: String,
    trim: true,
    maxlength: 300
  },

  references: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    designation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
resumeSchema.index({ 'personalInfo.email': 1 });
resumeSchema.index({ 'personalInfo.fullName': 1 });
resumeSchema.index({ createdAt: -1 });

// Pre-save middleware to update timestamps
resumeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);
