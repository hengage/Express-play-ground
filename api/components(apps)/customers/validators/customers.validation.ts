import Joi from "joi";
import { HandleException } from "../../../utils";
import { STATUS_CODES } from "../../../constants";

class ValidateCustomers {
  signup = async (payload: any) => {
    const signUpSchema = Joi.object({
      firstName: Joi.string().required().label("First Name"),
      lastName: Joi.string().required().label("Last Name"),
      email: Joi.string().required().label("Email"),
      phoneNumber: Joi.string().required().label("Phone number"),
      password: Joi.string().required().label("Password"),
      profilePhoto: Joi.string().required().label("Photo"),
    });

    const { error } = signUpSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
    }

    return;
  };

  login = async (payload: any) => {
    const signUpSchema = Joi.object({
      phoneNumber: Joi.string().required().label("Phone number"),
      password: Joi.string().required().label("Password"),
    });

    const { error } = signUpSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
    }

    return;
  };

  updateProile = async (payload: any) => {
    const signUpSchema = Joi.object({
      phoneNumber: Joi.string().label("Phone number"),
      firstName: Joi.string().label("First name"),
      lastName: Joi.string().label("Last name"),
      profilePhoto: Joi.string().label("Photo"),
      email: Joi.string.label("Email"),
      street: Joi.string.label("street"),
      city: Joi.string.label("City"),
      state: Joi.string.label("State"),
      country: Joi.string.label("Country"),
      dateOfBirth: Joi.string.label("Date of Birth"),
    });

    const { error } = signUpSchema.validate(payload, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      throw new HandleException(STATUS_CODES.BAD_REQUEST, error.message);
    }

    return;
  };
}

export const validateCustomers = new ValidateCustomers();
