import { isAlphanumeric } from 'validator';
import bcrypt from 'bcrypt';
import { isString } from 'util';
import models from '../models';
import inputTypeValidator from './inputTypeValidator';

const { User } = models;

export default {
  passwordValidator(req, res, next) {
    const { password } = req.body;
    if (!isAlphanumeric(password)) {
      const error = new Error(
        'password must contain only numbers and alphabets');
      error.status = 400;
      return next(error);
    }
    if (password.length < 6) {
      const error = new Error(
        'Your password must be at least 6 characters');
      error.status = 400;
      return next(error);
    }
    return next();
  },

  validateUserParams(req, res, next) {
    const { username, password } = req.body;
    if (username && username.length > 0
      && password && password.length > 0) {
      return next();
    }
    const error = new Error('Username and password must be provided!');
    error.status = 400;
    return next(error);
  },

  async validatePassword(req, res, next) {
    const { username, password } = req.body;
    const error = new Error('Invalid Credentials');
    error.status = 400;
    const user = await User
      .findOne({ where: { username } });

    if (user) {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res === false) {
          return next(error);
        }
      });
      return next();
    }
    return next(error);
  },

  async isUserAdmin(req, res, next) {
    const { id } = req.decoded;
    const user = await User
      .findOne({ where: { id, isAdmin: true } });

    if (!user) {
      const error = new Error('You are not authorized to access this route!');
      error.status = 400;
      return next(error);
    }
    return next();
  },

  async isInputTypeValid(req, res, next) {
    const {
      username, password
    } = req.body;
    const initialArray = [username, password];
    const inputArray = [];
    initialArray.forEach((param) => {
      if (param) inputArray.push(param);
    });
    const errorMessage = 'Input types have to be strings!';
    inputTypeValidator(isString, inputArray, errorMessage, next);
    return next();
  },

  async doesUsernameExist(req, res, next) {
    const { method } = req;
    const user = await User.findOne({
      where: { username: req.body.username }
    });

    if (!user && method === 'GET') {
      const error = new Error('This user does not exist!');
      error.status = 404;
      return next(error);
    }

    if (user && method === 'POST') {
      const error = new Error('Username already exists!');
      error.status = 401;
      return next(error);
    }

    return next();
  }
};
