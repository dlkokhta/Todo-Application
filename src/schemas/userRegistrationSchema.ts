import Joi from "joi";
import { newUserTypes } from "types/newUserTypes";


const userRegistrationSchema = async () => {
 
  return Joi.object<newUserTypes>({
    name: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(15).required(),
    repeatPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords must match",
      }),
    role: Joi.string(),
    isVerified: Joi.string(),
  });
};

export default userRegistrationSchema;
