const { model, Schema } = require('mongoose');
const { common } = require('./common');

const todoSchema = new Schema({
  title: common,
  description: common,
  status: {
    type: String,
    enum: ['requested', 'todo', 'progress', 'done'],
    default: 'requested'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  dueDate: {
    type: Date
  }
},{timestamps:true});

const Todo = model('Todo', todoSchema);
module.exports = Todo