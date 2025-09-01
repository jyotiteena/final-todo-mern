const Project = require('../models/project.model')
const Todo = require('../models/todo.model')
exports.store = async (req, res) => {
    try {
        const { name, description } = req.body;
        await Project.create({ name, description })
        res.status(201).json({
            success: true,
            message: 'Project created successfully'
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
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const {id} = req.params
        const project = await Project.findById();
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const todos = await Todo.find({ projectId: id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                project,
                todos
            }
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
        const { id } = req.params
        const project = await Project.findByIdAndUpdate(
            id,
            req.body);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Project updated successfully'
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
        const {id} = req.params
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Delete all todos associated with this project
        await Todo.deleteMany({ projectId: id });

        // Delete the project
        await Project.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Project and associated todos deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};