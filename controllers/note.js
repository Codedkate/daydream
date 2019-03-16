import dateFns from 'date-fns';
import models from '../models';

const { Note } = models;

export default {
  async createNote(req, res) {
    const {title, body} = req.body;
    const userId = req.decoded.id;
    const note = await Note
      .create({
        title: title.trim(),
        body: body.trim(),
        userId,
      });

    return res.status(201).json({
      id: note.id,
      title: note.title,
      body: note.body,
    });
  },

  async getAllNotes(req, res) {
    const userId = req.decoded.id;
    let offset, limit, page = req.query;
    page = Number(page);

    const notes = await Note.findAll({
      order: [['createdAt', 'DESC']],
      where: { userId },
      limit,
      offset,
    });

    const responseArray = notes.map(item => ({
      id: item.id,
      title: item.title,
      body: item.body,
      createdOn: dateFns.format(new Date(item.createdAt), 'MMMM Do YYYY, h:mm:ss a'),
      modifiedOn: dateFns.format(new Date(item.updatedAt), 'MMMM Do YYYY, h:mm:ss a')
    })
    );
    return res.status(200).json({
      notes: responseArray,
      count: notes.length,
      page
    });
  },

  async getOneNote(req, res) {
    const { id } = req.params;
    const note = await Note.findOne({ where: { id } });
    return res.status(200).json(note);
  },

  async editNote(req, res) {
    const { id } = req.params;
    const {title, body} = req.body;
    const note = await Note.findOne({ where: { id } });

    const newNote = await note
      .update({
        title: title? title.trim() : title || note.title,
        body: body? body.trim() : body || note.body,
      });

    return res.status(201).json({
      message: 'Note updated successfully',
      note: newNote
    });
  },

  async deleteNote(req, res) {
    const { id } = req.params;
    const note = await Note
      .findOne({ where: { id } });
    await note.destroy();

    return res.status(200).json({
      message: 'Note deleted successfully',
      note: note
    });
  },
};
