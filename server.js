const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/employee-management', { useNewUrlParser: true, useUnifiedTopology: true });

// Create employee schema
const employeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  department: String,
});

const Employee = mongoose.model('Employee', employeeSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
  const employees = await Employee.find();
  res.render('index', { employees });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', async (req, res) => {
  const { name, position, department } = req.body;
  const newEmployee = new Employee({ name, position, department });
  await newEmployee.save();
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  res.render('edit', { employee });
});

app.post('/edit/:id', async (req, res) => {
  const { name, position, department } = req.body;
  await Employee.findByIdAndUpdate(req.params.id, { name, position, department });
  res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
