import { isString } from 'util';
import models from '../models';
import inputTypeValidator from './inputTypeValidator';

const { Note  } = models;

export default {
  validateNoteParams(req, res, next) {
    const { title, body } = req.body;
    if ( title && title.length > 0 &&
      body && body.length > 0) {
      return next();
    }
    const error = new Error('Title and body must be provided!');
    error.status = 400;
    return next(error);
  },

  async isInputValid(req, res, next) {
    const { title, body } = req.body;
    const inputArray = [title, body];
    const errorMessage = 'Input types have to be string!';
    inputTypeValidator(isString, inputArray, errorMessage, next);
    return next();
  },

  async doesNoteExist(req, res, next) {
    const { id } = req.params;
    const note = await Note
      .findOne({ where: {
        id,
        userId: req.decoded.id
      } });

    if (!note) {
      const error = new Error('There\'s no note with that id');
      error.status = 400;
      return next(error);
    }
    return next();
  },
};
