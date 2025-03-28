import Joi from "joi";
import { UserRegistrationTypes } from "types/userRegistrationTypes";

const userRegistrationSchema = Joi.object<UserRegistrationTypes>({
  name: Joi.string().min(3).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(15).required(),
  repeatPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords must match",
    }),
  });
  
  export default userRegistrationSchema;
  