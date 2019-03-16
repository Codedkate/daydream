
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import initPassport from './config';
import { errorHandler, notFoundRoute } from './middlewares';
import {
  authRoutes,
  userRoutes,
  diaryRoutes,
} from './routes';

dotenv.config();

const app = express();

initPassport();

app.enable('trust proxy');
app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: 'daydream',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/diary', diaryRoutes);
app.use(notFoundRoute);
app.use(errorHandler);

export default app;
