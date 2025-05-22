import Joi from "joi";

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const signupSchema = Joi.object({
  fullName: Joi.string()
    .min(4)
    .required()
    .messages({ 
      "string.base": "Full name must be a string.",
      "string.min": "Full name must be at least 4 characters long.",
      "any.required": "Full name is required."
    }),
    username: Joi.string()
    .min(4)
    .required()
    .messages({ 
      "string.base": "Username must be a string.",
      "string.min": "Username must be at least 4 characters long.",
      "any.required": "Username is required."
    }),
  phoneNumber: Joi.string()
    .min(10)
    .messages({
      "string.base": "Phone number must be a string.",
      "string.min": "Phone number must be at least 10 digits long."
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": "Email must be a string.",
      "string.email": "Email must be a valid email.",
      "any.required": "Email is required."
    }),
  password: Joi.string()
    .min(8)
    .pattern(passwordRegex)
    .required()
    .messages({
      "string.base": "Password must be a string.",
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.base": "Badly formatted password. It should contain minimum eight characters, at least one UpperCase letter and one number.",
      "any.required": "Password is required."
    }),
  role: Joi.string().max(8)
    .messages({
      "string.base": "Role must be a string.",
      "string.max": "Role cannot be longer than 8 characters."
    })
});

export default signupSchema;
