const mongoose = require('mongoose');

/**
 * Config Schema for storing application configuration
 * Used as a key-value store for settings like deployment timestamp
 */
const configSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster lookups
configSchema.index({ key: 1 });

// Pre-save middleware to update timestamps
configSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get config value by key
configSchema.statics.getValue = async function(key) {
  const config = await this.findOne({ key });
  return config ? config.value : null;
};

// Static method to set config value
configSchema.statics.setValue = async function(key, value, description = '') {
  const config = await this.findOneAndUpdate(
    { key },
    { value, description, updatedAt: new Date() },
    { upsert: true, new: true }
  );
  return config;
};

module.exports = mongoose.model('Config', configSchema);
