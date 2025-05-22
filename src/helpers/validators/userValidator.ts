import Joi from "joi";

/**
 * Validate user input for signup
 * @param user User data to validate
 * @returns Validation result
 */
export function validateUser(user: any) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid("user", "admin"),
    avatarUrl: Joi.string(),
    bio: Joi.string()
  });

  return schema.validate(user);
}

/**
 * Validate user input for login
 * @param user User credentials to validate
 * @returns Validation result
 */
export function validateLogin(user: any) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
}