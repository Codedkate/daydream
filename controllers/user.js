import dateFns from 'date-fns';
import jwt from 'jsonwebtoken';
import models from '../models';

const { User } = models;

const secret = process.env.SECRET_KEY;
const generateToken = payload => jwt.sign(payload, secret);

export default {
  async register(req, res) {
    const {username, password} = req.body;
    const user = await User
      .create({
        username: username.trim(),
        password: password.trim(),
      });
    const tokenPayload = {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    return res.status(201).json({
      message: 'Registration successful!',
      user,
      token: generateToken(tokenPayload),
    });
  },

  async getAllUsers(req, res) {
    let offset, limit, page = req.query;
    page = Number(page);
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const responseArray = users.map(item => ({
        id: item.id,
        username: item.title,
        password: item.body,
        createdOn: dateFns.format(new Date(item.createdAt), 'D MMMM YYYY, h:ssA'),
        modifiedOn: dateFns.format(new Date(item.updatedAt), 'D MMMM YYYY, h:ssA')
      })
    );

    return res.status(200).json({
      users: responseArray,
      count: users.length,
      page
    });
  },

  async deleteUser(req, res) {
    const { id } = req.params;
    const user = await User
      .findOne({ where: { id } });

    await user.destroy();
    return res.status(200).json({
      message: 'User deleted successfully',
      user: user
    });
  },

  async loginUser(req, res) {
    const { username, password } = req.body;
    const user = await User
      .findOne({ where: { username } });
    await user.validPassword(password);

    const tokenPayload = {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    return res.status(200).json({
      message: 'Login was successful',
      token: generateToken(tokenPayload),
      username: user.username,
    });
  }
};
