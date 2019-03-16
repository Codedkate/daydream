import express from 'express';
import { note } from '../controllers';
import { verifyToken, noteValidation } from '../middleware';

const router = express.Router();

const {
  createNote,
  getAllNotes,
  getOneNote,
  editNote,
  deleteNote,
} = note;

const {
  validateNoteParams,
  isInputValid,
  doesNoteExist,
} = noteValidation;

router.route('/')
  .get(verifyToken, getAllNotes)
  .post(
    verifyToken,
    validateNoteParams,
    isInputValid,
    createNote
  );

router.route('/:id')
  .get( verifyToken, doesNoteExist, getOneNote )
  .patch(verifyToken, doesNoteExist, editNote)
  .delete(verifyToken, doesNoteExist, deleteNote);

export default router;
