const  Project  = require('../models/project.model');
const Todo  = require('../models/todo.model');


exports.store = async (req, res) => {
  try {
    const {projectId,title,description,dueDate} = req.body
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await Todo.create({projectId,title,description,dueDate});
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.index = async (req, res) => {
  try {
    const { projectId, status } = req.query;
    let filter = {};
    
    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;
    
    const todos = await Todo.find(filter)
      .populate('projectId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getTodoById = async (req, res) => {
  try {

    const {id} = req.params;
    const todo = await Todo.findById(id).populate('projectId');
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const {id} = req.params
    const todo = await Todo.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('projectId');
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Todo updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.trash = async (req, res) => {
  try {
    const {id} = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateTodoStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      id,
      { status },
    ).populate('projectId');
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: todo,
      message: 'Todo status updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};