const { Dataset } = require('../models');
const fs = require('fs');
const csv = require('csv-parser');
const ExcelJS = require('exceljs');
const path = require('path');

const uploadDataset = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    const filePath = path.join(__dirname, '../', file.path);
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === '.csv') {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('error', (err) => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          return res.status(500).json({ message: 'Error parsing CSV' });
        })
        .on('end', async () => {
          try {
            const dataset = await saveDataset(req.user._id, file.originalname, 'csv', results);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            res.status(201).json(dataset);
          } catch (error) {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            res.status(500).json({ message: error.message });
          }
        });
    } else if (ext === '.xlsx' || ext === '.xls') {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1);
      
      const columns = [];
      worksheet.getRow(1).eachCell((cell) => {
        columns.push(cell.value);
      });

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 1) {
          const rowData = {};
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            rowData[columns[colNumber - 1]] = cell.value;
          });
          results.push(rowData);
        }
      });

      const dataset = await saveDataset(req.user._id, file.originalname, 'excel', results);
      fs.unlinkSync(filePath);
      res.status(201).json(dataset);
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Unsupported file format' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const saveDataset = async (userId, name, sourceType, data) => {
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  return await Dataset.create({
    name,
    sourceType,
    data,
    columns,
    rowCount: data.length,
    userId
  });
};

const getAllDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find({ userId: req.user._id }).select('-data');
    res.json(datasets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDatasetById = async (req, res) => {
  try {
    const dataset = await Dataset.findOne({ _id: req.params.id, userId: req.user._id });
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });
    res.json(dataset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });
    res.json({ message: 'Dataset deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadDataset, getAllDatasets, getDatasetById, deleteDataset };
