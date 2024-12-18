const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { taskSchema } = require('../validators/task');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

router.get('/:id', auth, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).send('Task not found.');
  res.send(task);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = taskSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let task = new Task({
    title: req.body.title,
    dueDate: req.body.dueDate,
    completionStatus: req.body.completionStatus
  });
  task = await task.save();
  res.send(task);
});

router.put('/:id', [auth, admin], async (req, res) => {
  const { error } = taskSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      dueDate: req.body.dueDate,
      completionStatus: req.body.completionStatus
    },
    { new: true }
  );

  if (!task) return res.status(404).send('Task not found.');
  res.send(task);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).send('Task not found.');
  res.send(task);
});

module.exports = router;
