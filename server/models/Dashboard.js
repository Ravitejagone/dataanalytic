const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Virtual for widgets
dashboardSchema.virtual('widgets', {
  ref: 'Widget',
  localField: '_id',
  foreignField: 'dashboardId'
});

dashboardSchema.set('toJSON', { virtuals: true });
dashboardSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Dashboard', dashboardSchema);
