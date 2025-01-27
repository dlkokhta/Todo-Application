import Joi, { CustomHelpers } from "joi";
import { newUserTypes } from "types/newUserTypes";
import userRegistrationModel from "models/userRegistrationModel";
import { UserRegistrationTypes } from "types/userRegistrationTypes";

const ifUserExist =
  (user: UserRegistrationTypes | null) =>
  (value: string, helpers: CustomHelpers) => {
    if (user) {
      return helpers.error("Email already exist!");
    }
    return value;
  };

const userRegistrationSchema = async (data: newUserTypes) => {
  const user = await userRegistrationModel.findOne({ email: data.email });

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
