import Joi from "joi";

const subscribeSchema = Joi.object({
  username: Joi.string()
    .min(4)
    .required()
    .messages({ 
      "string.base": "username name must be a string.",
      "string.min": "username name must be at least 4 characters long.",
      "any.required": "username name is required."
    }),
    location: Joi.string()
    .min(4)
    .required()
    .messages({ 
      "string.base": "Username must be a string.",
      "string.min": "Username must be at least 4 characters long.",
      "any.required": "Username is required."
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": "Email must be a string.",
      "string.email": "Email must be a valid email.",
      "any.required": "Email is required."
    }),
});

export default subscribeSchema;
