const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sourceType: {
    type: String,
    enum: ['csv', 'excel', 'api'],
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  rowCount: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Dataset', datasetSchema);
