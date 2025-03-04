const router = require('express').Router();
const { BackendService } = require('../services');

// Get all tasks
router.route('/').get(async (req, res) => {
  try {
    const tasks = await BackendService.getTasks();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// Get a task by ID
router.route('/:taskId').get(async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await BackendService.getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get task' });
  }
});

// Add a new task
router.route('/add').post(async (req, res) => {
  try {
    const newTask = req.body;
    const addedTask = await BackendService.addTask(newTask);
    res.status(201).json(addedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Update a task
router.route('/update/:taskId').put(async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const updatedTask = req.body;
    const result = await BackendService.updateTask(taskId, updatedTask);
    if (!result) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.route('/delete/:taskId').delete(async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const result = await BackendService.deleteTask(taskId);
    if (!result) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;