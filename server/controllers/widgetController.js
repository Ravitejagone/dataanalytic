const { Widget, Dashboard } = require('../models');

const createWidget = async (req, res) => {
  try {
    const { type, title, config, layout, dashboardId, datasetId } = req.body;
    
    const dashboard = await Dashboard.findOne({ _id: dashboardId, userId: req.user._id });
    if (!dashboard) return res.status(403).json({ message: 'Unauthorized' });

    const widget = await Widget.create({
      type, title, config, layout, dashboardId, datasetId
    });
    res.status(201).json(widget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateWidget = async (req, res) => {
  try {
    const { title, config, layout } = req.body;
    const widget = await Widget.findById(req.params.id).populate('dashboardId');

    if (!widget || widget.dashboardId.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Widget not found or unauthorized' });
    }

    widget.title = title || widget.title;
    widget.config = config || widget.config;
    widget.layout = layout || widget.layout;

    await widget.save();
    res.json(widget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteWidget = async (req, res) => {
  try {
    const widget = await Widget.findById(req.params.id).populate('dashboardId');

    if (!widget || widget.dashboardId.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Widget not found or unauthorized' });
    }

    await widget.deleteOne();
    res.json({ message: 'Widget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createWidget, updateWidget, deleteWidget };
