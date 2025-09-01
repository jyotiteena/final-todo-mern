const { model, Schema }  = require('mongoose');
const { common }  = require('./common');

const projectSchema = new Schema({
  name: {
    ...common,
    unique:[true,"Project Already Exist"]
  },
  description: {
    ...common,
    required:false
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
},{timestamps:true});

const Project = model('Project', projectSchema);
module.exports = Project