const Joi = require('joi');

/**
 * Joi/express-validator middleware for resume form fields
 */
const validateResume = (req, res, next) => {
  const resumeSchema = Joi.object({
    // Personal Information
    personalInfo: Joi.object({
      fullName: Joi.string().trim().min(2).max(100).required()
        .messages({
          'string.empty': 'Full name is required',
          'string.min': 'Full name must be at least 2 characters',
          'string.max': 'Full name cannot exceed 100 characters',
          'any.required': 'Full name is required'
        }),
      dateOfBirth: Joi.date().iso().required()
        .messages({
          'date.format': 'Date of birth must be a valid date',
          'any.required': 'Date of birth is required'
        }),
      email: Joi.string().email().trim().required()
        .messages({
          'string.email': 'Please enter a valid email address',
          'any.required': 'Email is required'
        }),
      phone: Joi.string().pattern(/^[0-9]{10}$/).required()
        .messages({
          'string.pattern.base': 'Phone number must be exactly 10 digits',
          'any.required': 'Phone number is required'
        }),
      whatsappNumber: Joi.string().pattern(/^[0-9]{10}$/).allow('').optional()
        .messages({
          'string.pattern.base': 'WhatsApp number must be exactly 10 digits'
        }),
      address: Joi.string().trim().min(5).max(200).required()
        .messages({
          'string.empty': 'Address is required',
          'string.min': 'Address must be at least 5 characters',
          'string.max': 'Address cannot exceed 200 characters',
          'any.required': 'Address is required'
        }),
      linkedin: Joi.string().uri().allow('').optional()
        .messages({
          'string.uri': 'Please enter a valid LinkedIn URL'
        }),
      portfolioUrl: Joi.string().uri().allow('').optional()
        .messages({
          'string.uri': 'Please enter a valid portfolio URL'
        }),
      profilePhoto: Joi.string().allow('').optional()
    }).required(),

    // Objective
    objective: Joi.string().trim().min(10).max(500).required()
      .messages({
        'string.empty': 'Objective is required',
        'string.min': 'Objective must be at least 10 characters',
        'string.max': 'Objective cannot exceed 500 characters',
        'any.required': 'Objective is required'
      }),

    // Dynamic Arrays
    education: Joi.array().items(
      Joi.object({
        degree: Joi.string().trim().min(2).max(100).required()
          .messages({
            'string.empty': 'Degree is required',
            'any.required': 'Degree is required'
          }),
        institution: Joi.string().trim().min(2).max(150).required()
          .messages({
            'string.empty': 'Institution is required',
            'any.required': 'Institution is required'
          }),
        yearFrom: Joi.number().integer().min(1950).max(new Date().getFullYear()).required()
          .messages({
            'any.required': 'Start year is required'
          }),
        yearTo: Joi.number().integer().min(1950).max(new Date().getFullYear() + 10).required()
          .messages({
            'any.required': 'End year is required'
          }),
        percentage: Joi.number().min(0).max(100).required()
          .messages({
            'any.required': 'Percentage is required'
          })
      })
    ).min(1).required()
      .messages({
        'array.min': 'At least one education entry is required',
        'any.required': 'Education information is required'
      }),

    workExperience: Joi.array().items(
      Joi.object({
        jobTitle: Joi.string().trim().min(2).max(100).required()
          .messages({
            'string.empty': 'Job title is required',
            'any.required': 'Job title is required'
          }),
        company: Joi.string().trim().min(2).max(100).required()
          .messages({
            'string.empty': 'Company is required',
            'any.required': 'Company is required'
          }),
        location: Joi.string().trim().min(2).max(100).required()
          .messages({
            'string.empty': 'Location is required',
            'any.required': 'Location is required'
          }),
        duration: Joi.string().trim().min(2).max(50).required()
          .messages({
            'string.empty': 'Duration is required',
            'any.required': 'Duration is required'
          }),
        description: Joi.string().trim().min(10).max(500).required()
          .messages({
            'string.empty': 'Description is required',
            'string.min': 'Description must be at least 10 characters',
            'any.required': 'Description is required'
          })
      })
    ).optional(),

    skills: Joi.array().items(
      Joi.object({
        name: Joi.string().trim().min(1).max(50).required()
          .messages({
            'string.empty': 'Skill name is required',
            'any.required': 'Skill name is required'
          }),
        proficiency: Joi.string().valid('Beginner', 'Intermediate', 'Expert').required()
          .messages({
            'any.only': 'Proficiency must be Beginner, Intermediate, or Expert',
            'any.required': 'Proficiency is required'
          })
      })
    ).min(1).required()
      .messages({
        'array.min': 'At least one skill is required',
        'any.required': 'Skills are required'
      }),

    projects: Joi.array().items(
      Joi.object({
        name: Joi.string().trim().min(2).max(100).required()
          .messages({
            'string.empty': 'Project name is required',
            'any.required': 'Project name is required'
          }),
        techStack: Joi.string().trim().min(2).max(200).required()
          .messages({
            'string.empty': 'Tech stack is required',
            'any.required': 'Tech stack is required'
          }),
        description: Joi.string().trim().min(10).max(500).required()
          .messages({
            'string.empty': 'Description is required',
            'string.min': 'Description must be at least 10 characters',
            'any.required': 'Description is required'
          }),
        liveUrl: Joi.string().uri().allow('').optional()
          .messages({
            'string.uri': 'Please enter a valid live URL'
          }),
        githubUrl: Joi.string().uri().allow('').optional()
          .messages({
            'string.uri': 'Please enter a valid GitHub URL'
          })
      })
    ).optional(),

    certifications: Joi.array().items(
      Joi.object({
        name: Joi.string().trim().min(2).max(100).required()
          .messages({
            'string.empty': 'Certification name is required',
            'any.required': 'Certification name is required'
          }),
        issuer: Joi.string().trim().min(2).max(100).required()
          .messages({
            'string.empty': 'Issuer is required',
            'any.required': 'Issuer is required'
          }),
        year: Joi.number().integer().min(1950).max(new Date().getFullYear()).required()
          .messages({
            'any.required': 'Year is required'
          })
      })
    ).optional(),

    languages: Joi.array().items(
      Joi.object({
        language: Joi.string().trim().min(1).max(50).required()
          .messages({
            'string.empty': 'Language is required',
            'any.required': 'Language is required'
          }),
        proficiency: Joi.string().trim().min(1).max(50).required()
          .messages({
            'string.empty': 'Proficiency is required',
            'any.required': 'Proficiency is required'
          })
      })
    ).optional(),

    hobbies: Joi.string().trim().max(300).allow('').optional(),

    references: Joi.array().items(
      Joi.object({
        name: Joi.string().trim().min(2).max(100).required()
          .messages({
            'string.empty': 'Reference name is required',
            'any.required': 'Reference name is required'
          }),
        designation: Joi.string().trim().min(2).max(100).required()
          .messages({
            'string.empty': 'Designation is required',
            'any.required': 'Designation is required'
          }),
        company: Joi.string().trim().min(2).max(100).required()
          .messages({
            'string.empty': 'Company is required',
            'any.required': 'Company is required'
          }),
        email: Joi.string().email().trim().required()
          .messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Reference email is required'
          })
      })
    ).optional()
  });

  // Validate request body
  const { error, value } = resumeSchema.validate(req.body, {
    abortEarly: false, // Return all validation errors
    stripUnknown: true // Remove unknown fields
  });

  if (error) {
    const validationErrors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: validationErrors,
      message: 'Please check your input and try again'
    });
  }

  // Replace request body with validated and cleaned data
  req.body = value;
  next();
};

module.exports = validateResume;
