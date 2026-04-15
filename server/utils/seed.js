const mongoose = require('mongoose');
const { User, Dataset, Dashboard, Widget } = require('../models');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Dataset.deleteMany({});
    await Dashboard.deleteMany({});
    await Widget.deleteMany({});

    // Create Admin User
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    // Sample Sales Data
    const salesData = [
      { Month: 'Jan', Revenue: 4000, Orders: 240, Profit: 1200 },
      { Month: 'Feb', Revenue: 3000, Orders: 198, Profit: 800 },
      { Month: 'Mar', Revenue: 2000, Orders: 980, Profit: 2200 },
      { Month: 'Apr', Revenue: 2780, Orders: 390, Profit: 1500 },
      { Month: 'May', Revenue: 1890, Orders: 480, Profit: 900 },
      { Month: 'Jun', Revenue: 2390, Orders: 380, Profit: 1100 },
    ];

    const dataset = await Dataset.create({
      name: 'Sample Sales Data 2024',
      sourceType: 'csv',
      data: salesData,
      columns: ['Month', 'Revenue', 'Orders', 'Profit'],
      rowCount: 6,
      userId: admin._id
    });

    const dashboard = await Dashboard.create({
      name: 'Executive Overview',
      description: 'Key performance indicators and sales trends.',
      userId: admin._id
    });

    // KPI Widget
    await Widget.create({
      type: 'kpi',
      title: 'Total Revenue',
      config: { valueKey: 'Revenue' },
      layout: { x: 0, y: 0, w: 3, h: 2 },
      dashboardId: dashboard._id,
      datasetId: dataset._id
    });

    // Line Chart Widget
    await Widget.create({
      type: 'line',
      title: 'Revenue Trend',
      config: { xAxis: 'Month', yAxis: 'Revenue' },
      layout: { x: 3, y: 0, w: 9, h: 4 },
      dashboardId: dashboard._id,
      datasetId: dataset._id
    });

    // Bar Chart Widget
    await Widget.create({
      type: 'bar',
      title: 'Monthly Orders',
      config: { xAxis: 'Month', yAxis: 'Orders' },
      layout: { x: 0, y: 2, w: 6, h: 4 },
      dashboardId: dashboard._id,
      datasetId: dataset._id
    });

    console.log('MongoDB seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
