const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['line', 'bar', 'pie', 'kpi', 'table'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  layout: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  dashboardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dashboard',
    required: true
  },
  datasetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset',
    required: true
  }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Widget', widgetSchema);
