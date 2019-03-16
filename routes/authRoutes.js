import express from 'express';
import { user } from '../controllers';
import { userValidation } from '../middleware';

const {
  doesUsernameExist,
  passwordValidator,
  validateUserParams,
  validatePassword,
  isInputTypeValid
} = userValidation;

const { register, loginUser } = user;

const router = express.Router();

router.route('/signup')
  .post(
    isInputTypeValid,
    validateUserParams,
    doesUsernameExist,
    passwordValidator,
    register
  );

router.route('/login')
  .post(
    isInputTypeValid,
    validateUserParams,
    validatePassword,
    loginUser
  );

export default router;
