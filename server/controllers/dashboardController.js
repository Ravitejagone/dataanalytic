const { Dashboard, Widget, Dataset } = require('../models');

const createDashboard = async (req, res) => {
  try {
    const { name, description } = req.body;
    const dashboard = await Dashboard.create({
      name,
      description,
      userId: req.user._id
    });
    res.status(201).json(dashboard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllDashboards = async (req, res) => {
  try {
    const dashboards = await Dashboard.find({ userId: req.user._id });
    res.json(dashboards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDashboardById = async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({ _id: req.params.id, userId: req.user._id })
      .populate({
        path: 'widgets',
        populate: { path: 'datasetId', select: 'id name data columns' }
      });

    if (!dashboard) return res.status(404).json({ message: 'Dashboard not found' });
    
    // Map datasetId to dataset to match frontend expectation if needed
    const transformed = dashboard.toJSON();
    transformed.widgets = transformed.widgets.map(w => ({
      ...w,
      dataset: w.datasetId,
      datasetId: w.datasetId?._id
    }));

    res.json(transformed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDashboard = async (req, res) => {
  try {
    const { name, description } = req.body;
    const dashboard = await Dashboard.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, description },
      { new: true }
    );
    if (!dashboard) return res.status(404).json({ message: 'Dashboard not found' });
    res.json(dashboard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteDashboard = async (req, res) => {
  try {
    const dashboard = await Dashboard.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!dashboard) return res.status(404).json({ message: 'Dashboard not found' });
    
    // Also delete associated widgets
    await Widget.deleteMany({ dashboardId: req.params.id });
    
    res.json({ message: 'Dashboard deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createDashboard, getAllDashboards, getDashboardById, updateDashboard, deleteDashboard };
