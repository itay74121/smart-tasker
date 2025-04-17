const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  assignee:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priority:    { type: String, enum: ['low','medium','high'], default: 'medium' },
  status:      { type: String, enum: ['pending','in progress','completed'], default: 'pending' },
  dueDate:     { type: Date },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const TaskModel = mongoose.model('Task', TaskSchema);
export default TaskModel;