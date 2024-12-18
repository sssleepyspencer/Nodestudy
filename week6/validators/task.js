const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().required(),
  dueDate: Joi.date().required(),
  completionStatus: Joi.boolean().required()
});

module.exports = { taskSchema };
