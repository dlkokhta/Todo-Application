import Joi, { CustomHelpers } from "joi";
import { newUserTypes } from "types/newUserTypes";
import { UserRegistrationTypes } from "types/userRegistrationTypes";
import pool from "config/sql";


const ifUserExist =
  (user: UserRegistrationTypes | null) =>
  (value: string, helpers: CustomHelpers) => {
    if (user) {
      return helpers.error("Email already exist!");
    }
    return value;
  };

const userRegistrationSchema = async (data: newUserTypes) => {
  const emailCheckQuery = "SELECT email FROM users WHERE email = $1";
  const result = await pool.query(emailCheckQuery, [data.email]);
  const user = result.rows[0] || null;

  return Joi.object<newUserTypes>({
    name: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().custom(ifUserExist(user)).required(),
    password: Joi.string().min(8).max(15).required(),
    repeatPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords must match",
      }),
    role: Joi.string(),
    userVerified: Joi.string(),
  });
};

export default userRegistrationSchema;
