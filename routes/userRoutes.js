import express from 'express';
import { user } from '../controllers';
import { verifyToken, userValidation } from '../middleware';

const { isUserAdmin, doesUsernameExist } = userValidation;

const {
  getAllUsers,
  deleteUser,
} = user;

const router = express.Router();

router.route('/')
  .get(verifyToken, isUserAdmin, getAllUsers);

router.route('/:id')
  .delete(verifyToken, isUserAdmin, doesUsernameExist, deleteUser);

export default router;
